import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

function PeopleIcon() {
  return (
    <View className="h-24 w-24 items-center justify-center rounded-full bg-blue-100">
      <Text className="text-4xl">👥</Text>
    </View>
  );
}

export default function Index() {
  return (
    <View className="flex-1 items-center bg-white px-5 pt-16">

      <PeopleIcon />

      <Text className="mt-8 text-[22px] font-bold text-slate-900">
        Event Friend Finder
      </Text>

      <Text className="mt-3 text-center text-base leading-[22px] text-slate-500">
        Meet people at events who{"\n"}
        share your humour and{"\n"}
        interests.
      </Text>

      <View className="mt-auto mb-6 w-full">

        <Pressable
          className="h-[52px] items-center justify-center rounded-lg bg-blue-500"
          onPress={() => router.push("/profile")}
        >
          <Text className="text-base font-semibold text-white">
            Get Started
          </Text>
        </Pressable>

        <Pressable
          className="mt-2 h-[52px] items-center justify-center rounded-lg border border-slate-300"
          onPress={() => router.push("/login")}
        >
          <Text className="text-[15px] font-semibold text-slate-900">
            I already have an account
          </Text>
        </Pressable>

      </View>
    </View>
  );
}