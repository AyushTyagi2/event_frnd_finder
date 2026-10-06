import React from "react";
import { useQuery } from "@apollo/client/react";
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

import { GET_MATCH } from "@/graphQL/matches";
import { GET_MEMES } from "@/graphQL/memes";
import { useUserStore } from "@/store/userStore";

type MatchedUser = {
  id: string;
  name: string;
  dateOfBirth: string;
  about?: string | null;
  profilePic?: string | null;
  interests: string[];
};

type Match = {
  id: string;
  matchScore: number;
  createdAt: string;
  matchedUser: MatchedUser;
};

type Meme = {
  id: string;
  imageUrl: string;
  caption: string;
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

export default function MatchScreen() {
  const { matchId, userId } = useLocalSearchParams<{
  matchId?: string;
  userId?: string;
}>();

  const {
    data,
    loading: matchLoading,
    error: matchError,
  } = useQuery<{ match: Match | null }>(GET_MATCH, {
    variables: {
      id: matchId ?? "",
      userId: userId ?? "",
    },
    skip: !matchId || !userId,
  });

  const {
    data: memeData,
    loading: memesLoading,
  } = useQuery<{ memes: Meme[] }>(GET_MEMES);

if (matchLoading || memesLoading) {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator
        size="large"
        color="#0879F9"
      />

      <Text className="mt-4 text-base text-slate-500">
        Loading profile...
      </Text>
    </View>
  );
}

if (matchError) {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-xl font-bold text-red-500">
        Match Query Error
      </Text>

      <Text className="mt-3 text-center text-sm text-slate-600">
        {matchError.message}
      </Text>

      <Text className="mt-4 text-center text-xs text-slate-400">
        Match ID: {matchId || "missing"}
      </Text>

      <Text className="mt-1 text-center text-xs text-slate-400">
        User ID: {userId || "missing"}
      </Text>

      <Pressable
        onPress={() => router.back()}
        className="mt-6 h-[52px] w-full items-center justify-center rounded-xl bg-[#0879F9]"
      >
        <Text className="font-bold text-white">
          Go Back
        </Text>
      </Pressable>
    </View>
  );
}

if (!data?.match) {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-xl font-bold text-[#111936]">
        Match not found
      </Text>

      <Text className="mt-3 text-center text-sm text-slate-500">
        No match was returned by the server.
      </Text>

      <Text className="mt-4 text-center text-xs text-slate-400">
        Match ID: {matchId || "missing"}
      </Text>

      <Text className="mt-1 text-center text-xs text-slate-400">
        User ID: {userId || "missing"}
      </Text>

      <Pressable
        onPress={() => router.back()}
        className="mt-6 h-[52px] w-full items-center justify-center rounded-xl bg-[#0879F9]"
      >
        <Text className="font-bold text-white">
          Go Back
        </Text>
      </Pressable>
    </View>
  );
}

  const match = data.match;
  const person = match.matchedUser;

  const age = calculateAge(person.dateOfBirth);
  const percentage = Math.round(
    Number(match.matchScore) * 100
  );

  const memes = memeData?.memes?.slice(0, 3) ?? [];

    return (
  <View className="flex-1 bg-[#F8FAFD]">
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 30,
      }}
    >
      {/* Header */}
      <View className="px-5 pt-12">
        <Pressable
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center rounded-full bg-white"
        >
          <Ionicons
            name="arrow-back"
            size={25}
            color="#111936"
          />
        </Pressable>
      </View>

      {/* Profile */}
      <View className="mt-5 items-center px-5">
        <View className="h-[250px] w-[250px] overflow-hidden rounded-full border-4 border-white bg-[#E9EEF5] ">
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
                size={52}
                color="#94A3B8"
              />
            </View>
          )}
        </View>

        <Text className="mt-4 text-[25px] font-bold text-[#111936]">
          {person.name}, {age}
        </Text>

        <View className="mt-1 rounded-full bg-green-50 px-4 py-1.5">
          <Text className="text-[16px] font-bold text-[#16A34A]">
            {percentage}% match
          </Text>
        </View>
      </View>

      {/* Interests */}
      <View className="mt-6 px-5">
        <View className="flex-row flex-wrap justify-center gap-2">
          {person.interests.map((interest) => (
            <View
              key={interest}
              className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2"
            >
              <Text className="text-[13px] font-semibold text-[#18345F]">
                {getInterestLabel(interest)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Content card */}
      <View className="mx-5 mt-7 rounded-2xl bg-white p-5 shadow-sm">

        {/* Similar meme opinions */}
        <View>
          <View className="flex-row items-center justify-between">
            <Text className="text-[17px] font-bold text-[#111936]">
              Similar meme opinions
            </Text>

            <Text className="text-[12px] font-medium text-slate-400">
              Based on your answers
            </Text>
          </View>

          <View className="mt-4 flex-row gap-3">
            {memes.map((meme) => (
              <View
                key={meme.id}
                className="h-[92px] flex-1 overflow-hidden rounded-xl bg-slate-100"
              >
                <Image
                  source={{
                    uri: meme.imageUrl,
                  }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              </View>
            ))}
          </View>
        </View>

        {/* Divider */}
        <View className="my-6 h-[1px] bg-slate-100" />

        {/* About */}
        <View>
          <Text className="text-[17px] font-bold text-[#111936]">
            About
          </Text>

          <Text className="mt-2 text-[15px] leading-[22px] text-[#60708F]">
            {person.about ||
              "This person hasn't added an introduction yet."}
          </Text>
        </View>
      </View>

      {/* CTA */}
      <View className="mx-5 mt-6">
        <Pressable
  onPress={() => {
    router.push({
      pathname: "/meeting",
      params: {
        matchId: match.id,
        userId: userId,
      },
    });
  }}
  className="h-[58px] items-center justify-center rounded-[14px] bg-[#0879F9]"
>
          <View className="flex-row items-center">
            <Ionicons
              name="people-outline"
              size={20}
              color="white"
            />

            <Text className="ml-2 text-[17px] font-bold text-white">
              Suggest a Meetup
            </Text>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  </View>
);
}