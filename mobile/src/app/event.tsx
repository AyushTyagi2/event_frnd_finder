import React from "react";
import { useMutation, useLazyQuery } from "@apollo/client/react";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { GET_EVENT_BY_CODE, JOIN_EVENT } from "@/graphQL/event";
import { useUserStore } from "@/store/userStore";
import { useEventStore } from "@/store/eventStore";


type Event = {
  id: string;
  name: string;
  code: string;
  profilePic?: string | null;
  venue: string;
  startDate: string;
  endDate: string;
};

export default function EventScreen() {
  const user = useUserStore((state) => state.user);

  const [eventCode, setEventCode] = React.useState("");
  const [event, setEvent] = React.useState<Event | null>(null);
  const [errorMessage, setErrorMessage] = React.useState("");
  const storeEvent = useEventStore((state) => state.setEvent);

  const [findEvent, { loading: findingEvent }] =
    useLazyQuery<{ eventByCode: Event }>(GET_EVENT_BY_CODE);

  const [joinEvent, { loading: joiningEvent }] =
    useMutation(JOIN_EVENT);

const handleJoinEvent = async () => {
  const code = eventCode.trim().toUpperCase();

  if (!code) {
    setErrorMessage("Please enter an event code.");
    return;
  }

  if (!user) {
    setErrorMessage("Your profile could not be found.");
    return;
  }

  setErrorMessage("");

  try {
    // 1. Find the event
    const { data } = await findEvent({
      variables: {
        code,
      },
    });

    if (!data?.eventByCode) {
      setErrorMessage("No event found with this code.");
      return;
    }

    const foundEvent = data.eventByCode;

    // 2. Join the event
    await joinEvent({
      variables: {
        userId: user.id,
        eventCode: foundEvent.code,
      },
    });

    // 3. Save current event globally
    storeEvent(foundEvent);

    // 4. Go to matches
    router.replace("/matches");

  } catch (error) {
    console.error("Join event error:", error);

    setErrorMessage(
      error instanceof Error
        ? error.message
        : "Could not join the event."
    );
  }
};

  const loading = findingEvent || joiningEvent;

  return (
    <View className="flex-1 bg-white px-5 pt-16">
      {/* Header */}
      <Pressable
        className="h-10 w-10 items-center justify-center"
        onPress={() => router.back()}
      >
        <Text className="text-[32px] text-slate-900">‹</Text>
      </Pressable>

      {/* Icon */}
      <View className="mt-8 items-center">
        <View className="h-24 w-24 items-center justify-center rounded-full bg-blue-100">
          <Text className="text-4xl">🎟️</Text>
        </View>
      </View>

      {/* Heading */}
      <View className="mt-7 items-center">
        <Text className="text-center text-[30px] font-bold text-slate-900">
          Join an event
        </Text>

        <Text className="mt-3 text-center text-[17px] leading-6 text-slate-500">
          Enter the event code shared by the{"\n"}
          event organizer.
        </Text>
      </View>

      {/* Event code */}
      <View className="mt-10">
        <Text className="mb-2 text-[18px] font-bold text-slate-900">
          Event Code
        </Text>

        <TextInput
          value={eventCode}
          onChangeText={(value) => {
            setEventCode(value.toUpperCase());
            setErrorMessage("");
            setEvent(null);
          }}
          placeholder="e.g. TECH26"
          placeholderTextColor="#7183A5"
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={12}
          className="h-[68px] rounded-[14px] border border-[#C9DBF7] px-6 text-center text-[24px] font-bold tracking-[3px] text-[#111936]"
        />

        {errorMessage ? (
          <Text className="mt-3 text-center text-[15px] text-red-500">
            {errorMessage}
          </Text>
        ) : null}
      </View>

      {/* Find button */}
      {!event && (
        <Pressable
          disabled={loading}
          onPress={handleJoinEvent}
          className={`mt-5 h-[60px] items-center justify-center rounded-[14px] ${
            loading ? "bg-blue-300" : "bg-[#0879F9]"
          }`}
        >
          {joiningEvent ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-[19px] font-bold text-white">
              JOIN EVENT
            </Text>
          )}
        </Pressable>
      )}

      

      
    </View>
  );
}