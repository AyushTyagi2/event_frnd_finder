import { randomUUID } from "crypto";
import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const USER_SELECT = {
  id: true,
  name: true,
  dateOfBirth: true,
  about: true,
  interests: true,
  profilePic: true,
} as const;

// Max rows per bulk INSERT. Postgres allows ~32k bind params per statement;
// 5 params per row -> keep well under that.
const UPSERT_CHUNK_SIZE = 1000;

type MatchRow = {
  id: string;
  eventId: string;
  user1Id: string;
  user2Id: string;
  matchScore: number;
};

export const matchResolvers = {
  Query: {
    // ============================================================
    // GET ALL MATCHES FOR A USER
    // ============================================================
    myMatches: async (
      _: unknown,
      { userId, eventId }: { userId: string; eventId: string }
    ) => {
      // One query: matches + both users joined together.
      const matches = await prisma.match.findMany({
        where: {
          eventId,
          OR: [{ user1Id: userId }, { user2Id: userId }],
        },
        orderBy: { matchScore: "desc" },
        include: {
          user1: { select: USER_SELECT },
          user2: { select: USER_SELECT },
        },
      });

      return matches.map((match) => ({
        id: match.id,
        matchScore: Number(match.matchScore),
        createdAt: match.createdAt,
        matchedUser: match.user1Id === userId ? match.user2 : match.user1,
      }));
    },

    // ============================================================
    // GET ONE MATCH
    // ============================================================
    match: async (
      _: unknown,
      { id, userId }: { id: string; userId: string }
    ) => {
      const match = await prisma.match.findUnique({
        where: { id },
        include: {
          user1: { select: USER_SELECT },
          user2: { select: USER_SELECT },
        },
      });

      if (!match) return null;

      if (match.user1Id !== userId && match.user2Id !== userId) {
        throw new Error("You are not part of this match.");
      }

      return {
        id: match.id,
        matchScore: Number(match.matchScore),
        createdAt: match.createdAt,
        matchedUser: match.user1Id === userId ? match.user2 : match.user1,
      };
    },
  },

  // ==============================================================
  // MUTATIONS
  // ==============================================================
  Mutation: {
    generateMatches: async (
  _: unknown,
  {
    userId,
    eventId,
  }: {
    userId: string;
    eventId: string;
  }
) => {
  // ----------------------------------------------------------
  // 1. Verify event membership
  // ----------------------------------------------------------

  const membership = await prisma.eventMember.findUnique({
    where: {
      eventId_userId: {
        eventId,
        userId,
      },
    },
  });

  if (!membership) {
    throw new Error("User is not a member of this event.");
  }

  // ----------------------------------------------------------
  // 2. Fetch current user
  // ----------------------------------------------------------

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      interests: true,
      memeResponses: {
        select: {
          memeId: true,
          response: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  // ----------------------------------------------------------
  // 3. Prepare user's data once
  // ----------------------------------------------------------

  const userResponses = new Map(
    user.memeResponses.map((response) => [
      response.memeId,
      response.response,
    ])
  );

  const userInterests = new Set(user.interests);

  // ----------------------------------------------------------
  // 4. Get all event members
  // ----------------------------------------------------------

  const members = await prisma.eventMember.findMany({
    where: {
      eventId,
      userId: {
        not: userId,
      },
    },
    select: {
      userId: true,
    },
  });

  if (members.length === 0) {
    return [];
  }

  const memberIds = members.map(
    (member) => member.userId
  );

  // ----------------------------------------------------------
  // 5. Find pairs that already have matches
  // ----------------------------------------------------------

  const existingMatches = await prisma.match.findMany({
    where: {
      eventId,
      OR: [
        {
          user1Id: userId,
          user2Id: {
            in: memberIds,
          },
        },
        {
          user2Id: userId,
          user1Id: {
            in: memberIds,
          },
        },
      ],
    },
    select: {
      user1Id: true,
      user2Id: true,
    },
  });

  const existingUserIds = new Set(
    existingMatches.map((match) =>
      match.user1Id === userId
        ? match.user2Id
        : match.user1Id
    )
  );

  // ----------------------------------------------------------
  // 6. Only calculate NEW matches
  // ----------------------------------------------------------

  const newMemberIds = memberIds.filter(
    (id) => !existingUserIds.has(id)
  );

  if (newMemberIds.length === 0) {
    return [];
  }

  // ----------------------------------------------------------
  // 7. Fetch only users requiring calculation
  // ----------------------------------------------------------

  const newMembers = await prisma.user.findMany({
    where: {
      id: {
        in: newMemberIds,
      },
    },
    select: {
      id: true,
      interests: true,
      memeResponses: {
        where: {
          memeId: {
            in: [...userResponses.keys()],
          },
        },
        select: {
          memeId: true,
          response: true,
        },
      },
    },
  });

  // ----------------------------------------------------------
  // 8. Calculate compatibility
  // ----------------------------------------------------------

  const matchData = newMembers.map((otherUser) => {
    // -------------------------
    // Meme compatibility
    // -------------------------

    let matchingMemes = 0;
    let commonMemes = 0;

    for (const response of otherUser.memeResponses) {
      const userResponse = userResponses.get(
        response.memeId
      );

      if (!userResponse) {
        continue;
      }

      commonMemes++;

      if (userResponse === response.response) {
        matchingMemes++;
      }
    }

    const memeScore =
      commonMemes > 0
        ? matchingMemes / commonMemes
        : 0;

    // -------------------------
    // Interest compatibility
    // -------------------------

    const otherInterests = new Set(
      otherUser.interests
    );

    let commonInterests = 0;

    for (const interest of otherInterests) {
      if (userInterests.has(interest)) {
        commonInterests++;
      }
    }

    const unionSize =
      userInterests.size +
      otherInterests.size -
      commonInterests;

    const interestScore =
      unionSize > 0
        ? commonInterests / unionSize
        : 0;

    // -------------------------
    // Final score
    // -------------------------

    const matchScore =
      0.6 * memeScore +
      0.4 * interestScore;

    const roundedScore =
      Math.round(matchScore * 100) / 100;

    // -------------------------
    // Canonical pair
    // -------------------------

    const [user1Id, user2Id] =
      userId < otherUser.id
        ? [userId, otherUser.id]
        : [otherUser.id, userId];

    return {
      eventId,
      user1Id,
      user2Id,
      matchScore: roundedScore,
    };
  });

  // ----------------------------------------------------------
  // 9. Store ONLY new matches
  // ----------------------------------------------------------

  await Promise.all(
    matchData.map((data) =>
      prisma.match.create({
        data: {
          eventId: data.eventId,
          user1Id: data.user1Id,
          user2Id: data.user2Id,
          matchScore: data.matchScore,
        },
      })
    )
  );

  // ----------------------------------------------------------
  // 10. Return newly generated matches
  // ----------------------------------------------------------

  return prisma.match.findMany({
    where: {
      eventId,
      OR: [
        {
          user1Id: userId,
          user2Id: {
            in: newMemberIds,
          },
        },
        {
          user2Id: userId,
          user1Id: {
            in: newMemberIds,
          },
        },
      ],
    },
    orderBy: {
      matchScore: "desc",
    },
  });
},
  },
};