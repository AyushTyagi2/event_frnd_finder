import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  Pressable,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MeetingSentScreen() {
  const { personName, placeName } = useLocalSearchParams<{
    personName?: string;
    placeName?: string;
  }>();

  const name = personName || "them";
  const place = placeName || "the selected place";

  return (
    <View className="flex-1 bg-white px-5">
      {/* Back */}
      <View className="pt-8">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center"
        >
          <Ionicons
            name="arrow-back"
            size={25}
            color="#111936"
          />
        </Pressable>
      </View>

      {/* Main content */}
      <View className="flex-1 items-center justify-center pb-20">
        {/* Send icon */}
        <View className="h-[72px] w-[72px] items-center justify-center rounded-full bg-[#E5F0FF]">
          <Ionicons
            name="paper-plane-outline"
            size={38}
            color="#111936"
          />
        </View>

        {/* Title */}
        <Text className="mt-5 text-center text-[19px] font-bold text-[#111936]">
          Meeting Request Sent!
        </Text>

        {/* Description */}
        <Text className="mt-2 text-center text-[14px] leading-[21px] text-[#60708F]">
          We've sent a meeting request to{"\n"}
          {name} for {place}.
        </Text>

        {/* Notification */}
        <Text className="mt-5 text-center text-[14px] leading-[21px] text-[#60708F]">
          You'll be notified once they{"\n"}
          accept it.
        </Text>
      </View>

      {/* Bottom button */}
      <View className="pb-6">
        <Pressable
          onPress={() => router.replace("/matches")}
          className="h-[54px] items-center justify-center rounded-[9px] border border-[#C7D1DF] bg-white"
        >
          <Text className="text-[14px] font-bold text-[#111936]">
            Back to Matches
          </Text>
        </Pressable>
      </View>
    </View>
  );
}