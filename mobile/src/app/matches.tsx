import React from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEventStore } from "@/store/eventStore";

import {
  GENERATE_MATCHES,
  GET_MY_MATCHES,
} from "@/graphQL/matches";

import { useUserStore } from "@/store/userStore";

type MatchedUser = {
  id: string;
  name: string;
  dateOfBirth: string;
  profilePic?: string | null;
  interests: string[];
};

type Match = {
  id: string;
  matchScore: number;
  createdAt: string;
  matchedUser: MatchedUser;
};

const INTEREST_LABELS: Record<string, string> = {
  MEMES: "Memes",
  TECH: "Tech",
  MUSIC: "Music",
  MOVIES: "Movies",
  GAMING: "Gaming",
  TRAVEL: "Travel",
  FOOD: "Food",
  SPORTS: "Sports",
  ANIME: "Anime",
  READING: "Reading",
  PHOTOGRAPHY: "Photography",
  FITNESS: "Fitness",
  ART: "Art",
  DANCE: "Dance",
  COOKING: "Cooking",
  CODING: "Coding",
  FOOTBALL: "Football",
  CRICKET: "Cricket",
  FASHION: "Fashion",
};

function calculateAge(dateOfBirth: string) {
  const timestamp = Number(dateOfBirth);

  const birthDate = Number.isNaN(timestamp)
    ? new Date(dateOfBirth)
    : new Date(timestamp);

  if (Number.isNaN(birthDate.getTime())) {
    return 0;
  }

  const today = new Date();

  let age =
    today.getFullYear() - birthDate.getFullYear();

  const monthDifference =
    today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 &&
      today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

function getInterestLabel(interest: string) {
  return INTEREST_LABELS[interest] || interest;
}

export default function MatchesScreen() {
  const user = useUserStore((state) => state.user);
  const { event } = useEventStore((state) => state);
  const eventId = event?.id;

  const {
    data,
    loading: loadingMatches,
    error,
    refetch,
  } = useQuery<{ myMatches: Match[] }>(GET_MY_MATCHES, {
    variables: {
      userId: user?.id ?? "",
      eventId: eventId ?? "",
    },
    skip: !user?.id || !eventId,
    fetchPolicy: "network-only",
  });

  const [generateMatches, { loading: generating }] =
    useMutation(GENERATE_MATCHES);

  const handleFindNewMatches = async () => {
  if (!user?.id || !eventId) {
    return;
  }

  try {
    await generateMatches({
      variables: {
        userId: user.id,
        eventId,
      },
    });

    await refetch();
  } catch (error) {
    console.error("Generate matches error:", error);
  }
};

  const matches = data?.myMatches ?? [];

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-xl font-bold text-slate-900">
          Profile not found
        </Text>

        <Text className="mt-2 text-center text-base text-slate-500">
          Please create or log into your account first.
        </Text>
      </View>
    );
  }

  if (!eventId) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-xl font-bold text-slate-900">
          Event not found
        </Text>

        <Text className="mt-2 text-center text-base text-slate-500">
          Please join an event first.
        </Text>

        <Pressable
          onPress={() => router.replace("/event")}
          className="mt-6 h-[52px] w-full items-center justify-center rounded-xl bg-[#0879F9]"
        >
          <Text className="font-bold text-white">
            Join Event
          </Text>
        </Pressable>
      </View>
    );
  }

  const loading = loadingMatches || generating;

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 60,
          paddingBottom: 110,
        }}
      >
        {/* Header */}
        <View className="px-5">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-[30px] font-bold leading-9 text-[#111936]">
                People at this event
              </Text>

              <Text className="mt-2 text-[17px] leading-[23px] text-[#60708F]">
                Potential matches based on your{"\n"}
                memes and interests.
              </Text>
            </View>
          </View>
        </View>

        {/* Loading */}
        {loadingMatches && (
  <View className="mt-10 items-center">
    <ActivityIndicator
      size="large"
      color="#0879F9"
    />

    <Text className="mt-3 text-[15px] text-slate-400">
      Loading your matches...
    </Text>
  </View>
)}

        {/* Error */}
        {error && !loading && (
          <View className="mx-5 mt-8 rounded-2xl bg-red-50 p-5">
            <Text className="font-semibold text-red-600">
              Could not load matches
            </Text>

            <Text className="mt-2 text-sm text-red-500">
              {error.message}
            </Text>
          </View>
        )}

        {/* Matches */}
        {!loading && !error && (
          <View className="mt-8">
            {matches.length === 0 ? (
              <View className="items-center px-8 pt-12">
                <View className="h-20 w-20 items-center justify-center rounded-full bg-blue-50">
                  <Text className="text-3xl">👥</Text>
                </View>

                <Text className="mt-5 text-xl font-bold text-[#111936]">
                  No matches yet
                </Text>

                <Text className="mt-2 text-center text-base leading-6 text-[#60708F]">
                  We couldn't find anyone to match with
                  you yet.
                </Text>
              </View>
            ) : (
              matches.map((match, index) => {
                const person = match.matchedUser;

                const percentage = Math.round(
                  Number(match.matchScore) * 100
                );

                const age = calculateAge(
                  person.dateOfBirth
                );

                return (
                  <Pressable
                    key={match.id}
                    onPress={() =>
                      router.push({
                        pathname: "/match",
                        params: {
                          matchId: match.id,
                          userId: user.id,
                        },
                      })
                    }
                    className="mx-5"
                  >
                    <View
                      className={`flex-row py-5 ${
                        index !== 0
                          ? "border-t border-slate-200"
                          : ""
                      }`}
                    >
                      {/* Profile image */}
                      <View className="h-[88px] w-[88px] overflow-hidden rounded-full bg-[#EEF2F6]">
                        {person.profilePic ? (
                          <Image
                            source={{
                              uri: person.profilePic,
                            }}
                            className="h-full w-full"
                            resizeMode="cover"
                          />
                        ) : (
                          <View className="h-full w-full items-center justify-center">
                            <Ionicons
                              name="person"
                              size={42}
                              color="#94A3B8"
                            />
                          </View>
                        )}
                      </View>

                      {/* Information */}
                      <View className="ml-4 flex-1">
                        <View className="flex-row items-center justify-between">
                          <View className="flex-1">
                            <Text className="text-[21px] font-bold text-[#111936]">
                              {person.name},{" "}
                              {age}
                            </Text>

                            <Text className="mt-1 text-[17px] font-semibold text-[#16A34A]">
                              {percentage}% match
                            </Text>
                          </View>

                          <Ionicons
                            name="chevron-forward"
                            size={23}
                            color="#111936"
                          />
                        </View>

                        {/* Interests */}
                        <View className="mt-3 flex-row flex-wrap gap-2">
                          {person.interests
                            .slice(0, 3)
                            .map((interest) => (
                              <View
                                key={interest}
                                className="rounded-[10px] bg-[#EEF5FD] px-4 py-2"
                              >
                                <Text className="text-[13px] font-medium text-[#18345F]">
                                  {getInterestLabel(
                                    interest
                                  )}
                                </Text>
                              </View>
                            ))}
                        </View>
                      </View>
                    </View>
                  </Pressable>
                );
              })
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0 h-[82px] border-t border-[#E5E7EB] bg-white">
  <View className="flex-1 flex-row items-center justify-around">

    <Pressable
      onPress={() => router.replace("/matches")}
      className="items-center justify-center"
    >
      <Ionicons
        name="people-outline"
        size={27}
        color="#64748B"
      />
      <Text className="mt-1 text-[13px] font-medium text-[#64748B]">
        Matches
      </Text>
    </Pressable>

    <Pressable
      onPress={() => router.replace("/meetings")}
      className="items-center justify-center"
    >
      <Ionicons
        name="calendar"
        size={27}
        color="#0879F9"
      />
      <Text className="mt-1 text-[13px] font-semibold text-[#0879F9]">
        Meetings
      </Text>
    </Pressable>

    

  </View>
</View>
    </View>
  );
}