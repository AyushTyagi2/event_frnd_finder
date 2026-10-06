import { userResolvers } from "./modules/user/user.resolver";
import { memeResolvers } from "./modules/meme/meme.resolver";
import { eventMemberResolvers } from "./modules/eventMember/eventMember.resolver";
import { eventResolvers } from "./modules/event/event.resolver";
import { matchResolvers } from "./modules/match/match.resolver";
import { meetingPlaceResolvers } from "./modules/meetingPlace/meetingPlace.resolver";
import { meetingResolvers } from "./modules/meeting/meeting.resolver";
export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...memeResolvers.Query,
    ...eventMemberResolvers.Query,
    ...eventResolvers.Query,
    ...matchResolvers.Query,
    ...meetingPlaceResolvers.Query,
    ...meetingResolvers.Query,
  },

  Mutation: {
    ...userResolvers.Mutation,
    ...memeResolvers.Mutation,
    ...eventMemberResolvers.Mutation,
    ...matchResolvers.Mutation,
    ...meetingResolvers.Mutation,
  },
};