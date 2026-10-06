import { prisma } from "../../lib/prisma";

export const eventResolvers = {
  Query: {
    events: async () => {
      return prisma.event.findMany({
        orderBy: {
          startDate: "asc",
        },
      });
    },

    event: async (
      _: unknown,
      { id }: { id: string }
    ) => {
      return prisma.event.findUnique({
        where: {
          id,
        },
      });
    },

    eventByCode: async (
      _: unknown,
      { code }: { code: string }
    ) => {
      return prisma.event.findUnique({
        where: {
          code: code.trim().toUpperCase(),
        },
      });
    },
  },
};