import React from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  GET_MEETING_PLACES,
  CREATE_MEETING_REQUEST,
} from "@/graphQL/meeting";

import { useUserStore } from "@/store/userStore";

type MeetingPlace = {
  id: string;
  name: string;
  address: string;
  createdAt: string;
};

export default function MeetingScreen() {
  const user = useUserStore((state) => state.user);

  const { matchId } = useLocalSearchParams<{
    matchId?: string;
  }>();

  const [selectedPlace, setSelectedPlace] =
    React.useState<string | null>(null);

  const {
    data,
    loading: placesLoading,
    error: placesError,
  } = useQuery<{
    meetingPlaces: MeetingPlace[];
  }>(GET_MEETING_PLACES);

  const [
    createMeetingRequest,
    { loading: creatingRequest },
  ] = useMutation(CREATE_MEETING_REQUEST);

  const places = data?.meetingPlaces ?? [];

  const handleSendRequest = async () => {
    if (!user?.id || !matchId || !selectedPlace) {
      return;
    }

    try {
      await createMeetingRequest({
        variables: {
          matchId,
          requesterId: user.id,
          placeId: selectedPlace,
        },
      });

      router.replace("/meeting-sent");
    } catch (error) {
      console.error(
        "Create meeting request error:",
        error
      );
    }
  };

  if (placesLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator
          size="large"
          color="#0879F9"
        />

        <Text className="mt-4 text-base text-slate-500">
          Loading meeting places...
        </Text>
      </View>
    );
  }

  if (placesError) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Ionicons
          name="alert-circle-outline"
          size={48}
          color="#EF4444"
        />

        <Text className="mt-4 text-xl font-bold text-[#111936]">
          Could not load places
        </Text>

        <Text className="mt-2 text-center text-sm text-slate-500">
          {placesError.message}
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

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 30,
        }}
      >
        {/* Back button */}
        <View className="px-5 pt-12">
          <Pressable
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center"
          >
            <Ionicons
              name="arrow-back"
              size={28}
              color="#111936"
            />
          </Pressable>
        </View>

        {/* Heading */}
        <View className="mt-7 px-5">
          <Text className="text-[30px] font-bold text-[#111936]">
            Where do you want to meet?
          </Text>

          <Text className="mt-4 text-[18px] leading-7 text-[#60708F]">
            Choose a place from the event venue{"\n"}
            or nearby.
          </Text>
        </View>

        {/* Places */}
        <View className="mt-8 px-5">
          {places.map((place) => {
            const selected = selectedPlace === place.id;

            return (
              <Pressable
                key={place.id}
                onPress={() =>
                  setSelectedPlace(place.id)
                }
                className={`mb-4 min-h-[112px] flex-row items-center rounded-[16px] border px-5 ${
                  selected
                    ? "border-blue-500 bg-blue-50"
                    : "border-[#DCE5F2] bg-white"
                }`}
              >
                {/* Text */}
                <View className="flex-1 pr-4">
                  <Text className="text-[20px] font-bold text-[#111936]">
                    {place.name}
                  </Text>

                  <Text className="mt-2 text-[16px] text-[#60708F]">
                    {place.address}
                  </Text>
                </View>

                {/* Radio */}
                <View
                  className={`h-[50px] w-[50px] items-center justify-center rounded-full border-[3px] ${
                    selected
                      ? "border-[#0879F9]"
                      : "border-[#CBD5E1]"
                  }`}
                >
                  {selected && (
                    <View className="h-[30px] w-[30px] rounded-full bg-[#0879F9]" />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Empty state */}
        {places.length === 0 && (
          <View className="mx-5 mt-8 items-center rounded-2xl bg-slate-50 p-8">
            <Ionicons
              name="location-outline"
              size={42}
              color="#94A3B8"
            />

            <Text className="mt-3 text-center text-base text-slate-500">
              No meeting places are available yet.
            </Text>
          </View>
        )}

        {/* Send request */}
        <View className="mt-3 px-5">
          <Pressable
            disabled={
              !selectedPlace || creatingRequest
            }
            onPress={handleSendRequest}
            className={`h-[60px] items-center justify-center rounded-[14px] ${
              !selectedPlace || creatingRequest
                ? "bg-blue-300"
                : "bg-[#0879F9]"
            }`}
          >
            {creatingRequest ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-[19px] font-bold text-white">
                Send Meeting Request
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}