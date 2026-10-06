import React from "react";
import { router } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useUserStore } from "@/store/userStore";

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
  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

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

export default function UserProfileScreen() {
  const user = useUserStore((state) => state.user);

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Ionicons
          name="person-circle-outline"
          size={80}
          color="#CBD5E1"
        />

        <Text className="mt-5 text-xl font-bold text-[#111936]">
          Profile not found
        </Text>

        <Text className="mt-2 text-center text-base text-slate-500">
          Please create your profile first.
        </Text>

        <Pressable
          onPress={() => router.replace("/profile")}
          className="mt-6 h-[52px] w-full items-center justify-center rounded-xl bg-[#0879F9]"
        >
          <Text className="font-bold text-white">
            Create Profile
          </Text>
        </Pressable>
      </View>
    );
  }

  const age = calculateAge(user.dateOfBirth);

  return (
    <View className="flex-1 bg-white">

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 58,
          paddingBottom: 110,
        }}
      >
        {/* Header */}
        <View className="px-6">
          <Text className="text-[32px] font-bold text-[#111936]">
            My Profile
          </Text>

          <Text className="mt-2 text-[16px] leading-6 text-[#60708F]">
            Your profile as other people see it.
          </Text>
        </View>

        {/* Profile card */}
        <View className="mx-5 mt-8 overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white">

          {/* Top blue section */}
          <View className="h-[105px] bg-[#EEF5FD]" />

          {/* Profile photo */}
          <View className="-mt-[58px] items-center">
            <View className="h-[116px] w-[116px] overflow-hidden rounded-full border-[5px] border-white bg-[#E9EEF5]">
              {user.profilePic ? (
                <Image
                  source={{ uri: user.profilePic }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="h-full w-full items-center justify-center">
                  <Ionicons
                    name="person"
                    size={58}
                    color="#94A3B8"
                  />
                </View>
              )}
            </View>
          </View>

          {/* Name */}
          <View className="items-center px-5 pt-4">
            <Text className="text-[25px] font-bold text-[#111936]">
              {user.name}, {age}
            </Text>

            <Text className="mt-1 text-[15px] text-[#60708F]">
              {user.email}
            </Text>
          </View>

          {/* Interests */}
          <View className="mt-6 flex-row flex-wrap justify-center gap-2 px-5">
            {user.interests.map((interest) => (
              <View
                key={interest}
                className="rounded-[10px] bg-[#EEF5FD] px-4 py-2"
              >
                <Text className="text-[14px] font-medium text-[#18345F]">
                  {INTEREST_LABELS[interest] || interest}
                </Text>
              </View>
            ))}
          </View>

          {/* About */}
          <View className="mt-7 px-5 pb-6">
            <Text className="text-[17px] font-bold text-[#111936]">
              About
            </Text>

            <Text className="mt-2 text-[15px] leading-[22px] text-[#60708F]">
              {user.about ||
                "You haven't added an introduction yet."}
            </Text>
          </View>
        </View>

        {/* Edit profile */}
        <View className="mx-5 mt-5">
          <Pressable
            onPress={() => router.push("/profile")}
            className="h-[54px] flex-row items-center justify-center rounded-[12px] border border-[#C9DBF7] bg-white"
          >
            <Ionicons
              name="create-outline"
              size={20}
              color="#0879F9"
            />

            <Text className="ml-2 text-[16px] font-bold text-[#0879F9]">
              Edit Profile
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Bottom navigation */}
      <View className="absolute bottom-0 left-0 right-0 h-[82px] border-t border-[#E5E7EB] bg-white">

        <View className="flex-1 flex-row items-center justify-around">

          {/* Matches */}
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

          {/* Meetings */}
          <Pressable
            onPress={() => router.replace("/meetings")}
            className="items-center justify-center"
          >
            <Ionicons
              name="calendar-outline"
              size={27}
              color="#64748B"
            />

            <Text className="mt-1 text-[13px] font-medium text-[#64748B]">
              Meetings
            </Text>
          </Pressable>

          {/* Profile */}
          <Pressable
            onPress={() => router.replace("/user-profile")}
            className="items-center justify-center"
          >
            <Ionicons
              name="person"
              size={27}
              color="#0879F9"
            />

            <Text className="mt-1 text-[13px] font-semibold text-[#0879F9]">
              Profile
            </Text>
          </Pressable>

        </View>
      </View>
    </View>
  );
}