import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-3xl font-bold text-slate-900">
        Event Friend Finder
      </Text>

      <Text className="mt-3 text-center text-base text-slate-500">
        Temporary homepage
      </Text>

      <Pressable
        onPress={() => router.replace("/event")}
        className="mt-8 h-[56px] w-full items-center justify-center rounded-[14px] bg-[#0879F9]"
      >
        <Text className="text-[18px] font-bold text-white">
          Go to Event
        </Text>
      </Pressable>
    </View>
  );
}