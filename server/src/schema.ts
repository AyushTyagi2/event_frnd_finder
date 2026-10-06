import { commonTypeDefs } from "./modules/common/common.schema";
import { userTypeDefs } from "./modules/user/user.schema";
import { memeTypeDefs } from "./modules/meme/meme.schema";
import { eventMemberTypeDefs } from "./modules/eventMember/eventMember.schema";
import {eventTypeDefs} from "./modules/event/event.schema";
import { matchTypeDefs } from "./modules/match/match.schema";
import {meetingPlaceTypeDefs} from "./modules/meetingPlace/meetingPlace.schema";
import { meetingTypeDefs } from "./modules/meeting/meeting.schema";
export const typeDefs = `#graphql

  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }



  ${commonTypeDefs}

  ${userTypeDefs}

  ${memeTypeDefs}

  ${eventMemberTypeDefs}

  ${eventTypeDefs}

  ${matchTypeDefs}

  ${meetingPlaceTypeDefs}
  
  ${meetingTypeDefs}
`;