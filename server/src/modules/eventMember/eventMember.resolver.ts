import { prisma } from "../../lib/prisma";

export const eventMemberResolvers = {
  Query: {
    eventMembers: async (
      _: unknown,
      { eventId }: { eventId: string }
    ) => {
      return prisma.eventMember.findMany({
        where: {
          eventId,
        },
        orderBy: {
          joinedAt: "asc",
        },
      });
    },

    isUserInEvent: async (
      _: unknown,
      {
        userId,
        eventId,
      }: {
        userId: string;
        eventId: string;
      }
    ) => {
      const membership = await prisma.eventMember.findUnique({
        where: {
          eventId_userId: {
            eventId,
            userId,
          },
        },
      });

      return membership !== null;
    },
  },

  Mutation: {
    joinEvent: async (
      _: unknown,
      {
        userId,
        eventCode,
      }: {
        userId: string;
        eventCode: string;
      }
    ) => {
      // 1. Find the event
      const event = await prisma.event.findUnique({
        where: {
          code: eventCode,
        },
      });

      if (!event) {
        throw new Error("Event not found");
      }

      // 2. Check if user already joined
      const existingMembership =
        await prisma.eventMember.findUnique({
          where: {
            eventId_userId: {
              eventId: event.id,
              userId,
            },
          },
        });

      if (existingMembership) {
        return existingMembership;
      }

      // 3. Create membership
      return prisma.eventMember.create({
        data: {
          eventId: event.id,
          userId,
        },
      });
    },
  },
};