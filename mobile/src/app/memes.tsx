import React from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";

import { GET_MEMES, RESPOND_TO_MEME } from "@/graphQL/memes";
import { useUserStore } from "../store/userStore";

type Meme = {
  id: string;
  imageUrl: string;
  caption: string;
};

export default function MemesScreen() {
  const router = useRouter();
  const { data, loading, error } = useQuery<{ memes: Meme[] }>(GET_MEMES);

  const [respondToMeme, { loading: responding }] =
    useMutation(RESPOND_TO_MEME);

  const user = useUserStore((state) => state.user);

  const memes = data?.memes ?? [];

  const [currentIndex, setCurrentIndex] = React.useState(0);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <ActivityIndicator size="large" />

        <Text className="mt-4 text-base text-slate-500">
          Loading memes...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-xl font-bold text-slate-900">
          Could not load memes
        </Text>

        <Text className="mt-3 text-center text-sm text-red-500">
          {error.message}
        </Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-xl font-bold text-slate-900">
          Profile not found
        </Text>

        <Text className="mt-2 text-center text-base text-slate-500">
          Please create your profile before taking the meme survey.
        </Text>
      </View>
    );
  }

  if (currentIndex >= memes.length) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <View className="h-24 w-24 items-center justify-center rounded-full bg-blue-100">
          <Text className="text-4xl">🎉</Text>
        </View>

        <Text className="mt-6 text-2xl font-bold text-slate-900">
          Meme survey complete!
        </Text>

        <Text className="mt-2 text-center text-base text-slate-500">
          Great! We'll use your answers to find better matches.
        </Text>
        <Pressable
  onPress={() => router.push("/event")}
  className="mt-8 h-[58px] w-full items-center justify-center rounded-[14px] bg-[#0879F9]"
>
  <Text className="text-[18px] font-bold text-white">
    Continue to Event
  </Text>
</Pressable>
      </View>
    );
  }

  const meme = memes[currentIndex];

  const answer = async (response: "LOVE" | "MEH" | "NOPE") => {
    if (responding) {
      return;
    }

    try {
      await respondToMeme({
        variables: {
          userId: user.id,
          memeId: meme.id,
          response,
        },
      });

      setCurrentIndex((index) => index + 1);
    } catch (error) {
      console.error("Failed to save meme response:", error);
    }
  };

  return (
    <View className="flex-1 bg-white px-5 pt-14">
      {/* Header */}
      <View className="items-center">
        <Text className="text-[30px] font-bold text-slate-900">
          Meme Match
        </Text>

        <Text className="mt-2 text-base text-slate-500">
          Tell us what makes you laugh
        </Text>
      </View>

      {/* Progress */}
      <View className="mt-7 flex-row items-center justify-between">
        <Text className="text-[15px] font-semibold text-slate-500">
          Meme {currentIndex + 1} of {memes.length}
        </Text>

        <Text className="text-[15px] font-semibold text-blue-500">
          {Math.round(((currentIndex + 1) / memes.length) * 100)}%
        </Text>
      </View>

      {/* Progress bar */}
      <View className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <View
          className="h-full rounded-full bg-blue-500"
          style={{
            width: `${((currentIndex + 1) / memes.length) * 100}%`,
          }}
        />
      </View>

      {/* Meme card */}
      <View className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <Image
          source={{ uri: meme.imageUrl }}
          className="h-[320px] w-full"
          resizeMode="contain"
        />

        <View className="px-5 pb-6 pt-4">
          <Text className="text-center text-lg font-semibold leading-6 text-slate-900">
            {meme.caption}
          </Text>
        </View>
      </View>

      {/* Question */}
      <Text className="mt-7 text-center text-base font-medium text-slate-500">
        How do you feel about this meme?
      </Text>

      {/* Buttons */}
      <View className="mt-5 flex-row items-center justify-center gap-5">
        <Pressable
          disabled={responding}
          onPress={() => answer("NOPE")}
          className={`h-[68px] w-[68px] items-center justify-center rounded-full ${
            responding ? "bg-slate-100" : "bg-red-50"
          }`}
        >
          <Text className="text-[29px]">❌</Text>
        </Pressable>

        <Pressable
          disabled={responding}
          onPress={() => answer("MEH")}
          className={`h-[68px] w-[68px] items-center justify-center rounded-full ${
            responding ? "bg-slate-100" : "bg-amber-50"
          }`}
        >
          <Text className="text-[29px]">😐</Text>
        </Pressable>

        <Pressable
          disabled={responding}
          onPress={() => answer("LOVE")}
          className={`h-[68px] w-[68px] items-center justify-center rounded-full ${
            responding ? "bg-slate-100" : "bg-pink-50"
          }`}
        >
          <Text className="text-[29px]">❤️</Text>
        </Pressable>
      </View>

      {responding && (
        <Text className="mt-4 text-center text-sm text-slate-400">
          Saving your answer...
        </Text>
      )}
    </View>
  );
}