import { prisma } from "../../lib/prisma";

export const meetingPlaceResolvers = {
  Query: {
    meetingPlaces: async () => {
      return prisma.meetingPlace.findMany({
        orderBy: {
          name: "asc",
        },
      });
    },

    meetingPlace: async (
      _: unknown,
      { id }: { id: string }
    ) => {
      return prisma.meetingPlace.findUnique({
        where: {
          id,
        },
      });
    },
  },
};