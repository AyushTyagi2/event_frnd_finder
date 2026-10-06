import { prisma } from "../../lib/prisma";

export const meetingResolvers = {
  Query: {
    meeting: async (
      _: unknown,
      {
        id,
        userId,
      }: {
        id: string;
        userId: string;
      }
    ) => {
      const meeting = await prisma.meeting.findUnique({
        where: { id },
        include: {
          place: true,
        },
      });

      if (!meeting) {
        return null;
      }

      if (
        meeting.requesterId !== userId &&
        meeting.recipientId !== userId
      ) {
        throw new Error("You are not part of this meeting");
      }

      return meeting;
    },

    myMeetingRequests: async (
      _: unknown,
      { userId }: { userId: string }
    ) => {
      return prisma.meeting.findMany({
        where: {
          OR: [
            { requesterId: userId },
            { recipientId: userId },
          ],
        },
        include: {
          place: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    },
  },

  Mutation: {
    createMeetingRequest: async (
      _: unknown,
      {
        matchId,
        requesterId,
        placeId,
      }: {
        matchId: string;
        requesterId: string;
        placeId: string;
      }
    ) => {
      const match = await prisma.match.findUnique({
        where: { id: matchId },
      });

      if (!match) {
        throw new Error("Match not found");
      }

      if (
        match.user1Id !== requesterId &&
        match.user2Id !== requesterId
      ) {
        throw new Error("User is not part of this match");
      }

      const recipientId =
        match.user1Id === requesterId
          ? match.user2Id
          : match.user1Id;

      const place = await prisma.meetingPlace.findUnique({
        where: { id: placeId },
      });

      if (!place) {
        throw new Error("Meeting place not found");
      }

      const existingMeeting = await prisma.meeting.findUnique({
        where: { matchId },
      });

      if (existingMeeting) {
        throw new Error("A meeting request already exists for this match");
      }

      return prisma.meeting.create({
        data: {
          matchId,
          placeId,
          requesterId,
          recipientId,
          requesterAccepted: true,
          recipientAccepted: false,
          status: "PENDING",
        },
        include: {
          place: true,
        },
      });
    },

    acceptMeetingRequest: async (
      _: unknown,
      {
        meetingId,
        userId,
      }: {
        meetingId: string;
        userId: string;
      }
    ) => {
      const meeting = await prisma.meeting.findUnique({
        where: { id: meetingId },
      });

      if (!meeting) {
        throw new Error("Meeting request not found");
      }

      if (meeting.recipientId !== userId) {
        throw new Error("Only the recipient can accept this request");
      }

      if (meeting.status !== "PENDING") {
        throw new Error("Meeting request is no longer pending");
      }

      return prisma.meeting.update({
        where: { id: meetingId },
        data: {
          recipientAccepted: true,
          status: "CONFIRMED",
        },
        include: {
          place: true,
        },
      });
    },

    cancelMeetingRequest: async (
      _: unknown,
      {
        meetingId,
        userId,
      }: {
        meetingId: string;
        userId: string;
      }
    ) => {
      const meeting = await prisma.meeting.findUnique({
        where: { id: meetingId },
      });

      if (!meeting) {
        throw new Error("Meeting request not found");
      }

      if (
        meeting.requesterId !== userId &&
        meeting.recipientId !== userId
      ) {
        throw new Error("You are not part of this meeting");
      }

      return prisma.meeting.update({
        where: { id: meetingId },
        data: {
          status: "CANCELLED",
        },
        include: {
          place: true,
        },
      });
    },
  },
};