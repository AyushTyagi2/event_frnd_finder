import { prisma } from "../../lib/prisma";

export const memeResolvers = {
  Query: {
    memes: async () => {
      return prisma.meme.findMany({
        orderBy: {
          createdAt: "asc",
        },
      });
    },
  },

  Mutation: {
    respondToMeme: async (
      _: unknown,
      {
        userId,
        memeId,
        response,
      }: {
        userId: string;
        memeId: string;
        response: "LOVE" | "MEH" | "NOPE";
      }
    ) => {
      return prisma.memeResponse.upsert({
        where: {
          userId_memeId: {
            userId,
            memeId,
          },
        },
        update: {
          response,
        },
        create: {
          userId,
          memeId,
          response,
        },
      });
    },
  },
};