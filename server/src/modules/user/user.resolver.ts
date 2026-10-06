import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";

export const userResolvers = {
  Query: {
    user: async (
      _: unknown,
      { id }: { id: string }
    ) => {
      return prisma.user.findUnique({
        where: { id },
      });
    },

    users: async () => {
      return prisma.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
    },
  },

  Mutation: {
    createUser: async (
      _: unknown,
      {
        input,
      }: {
        input: {
          name: string;
          email: string;
          password: string;
          gender: string;
          dateOfBirth: string;
          about?: string;
          interests: string[];
          profilePic?: string;
        };
      }
    ) => {
      const dateOfBirth = new Date(input.dateOfBirth);

      if (Number.isNaN(dateOfBirth.getTime())) {
        throw new Error("Invalid date of birth");
      }

      const email = input.email.toLowerCase().trim();

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error(
          "An account with this email already exists."
        );
      }

      const hashedPassword = await bcrypt.hash(
        input.password,
        10
      );

      return prisma.user.create({
        data: {
          name: input.name,
          email,
          password: hashedPassword,
          gender: input.gender,
          dateOfBirth,
          about: input.about,
          interests: input.interests as any,
          profilePic: input.profilePic,
        },
      });
    },

    loginUser: async (
      _: unknown,
      {
        email,
        password,
      }: {
        email: string;
        password: string;
      }
    ) => {
      const normalizedEmail = email.toLowerCase().trim();

      const user = await prisma.user.findUnique({
        where: {
          email: normalizedEmail,
        },
      });

      if (!user) {
        throw new Error("Invalid email or password.");
      }

      const validPassword = await bcrypt.compare(
        password,
        user.password
      );

      if (!validPassword) {
        throw new Error("Invalid email or password.");
      }

      return {
        user,
      };
    },
  },
};