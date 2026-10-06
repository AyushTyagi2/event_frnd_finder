import React from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  GET_MY_MEETING_REQUESTS,
  ACCEPT_MEETING_REQUEST,
  CANCEL_MEETING_REQUEST,
} from "@/graphQL/meetings";

import { useUserStore } from "@/store/userStore";

type Meeting = {
  id: string;
  matchId: string;
  placeId: string;
  requesterId: string;
  recipientId: string;
  requesterAccepted: boolean;
  recipientAccepted: boolean;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  createdAt: string;

  place: {
    id: string;
    name: string;
    address: string;
  };
};

export default function MeetingsScreen() {
  const user = useUserStore((state) => state.user);

  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery<{
    myMeetingRequests: Meeting[];
  }>(GET_MY_MEETING_REQUESTS, {
    variables: {
      userId: user?.id ?? "",
    },
    skip: !user?.id,
  });

  const [acceptMeeting, { loading: accepting }] =
    useMutation(ACCEPT_MEETING_REQUEST);

  const [cancelMeeting, { loading: cancelling }] =
    useMutation(CANCEL_MEETING_REQUEST);

  const meetings = data?.myMeetingRequests ?? [];

  const handleAccept = async (meetingId: string) => {
    if (!user) return;

    try {
      await acceptMeeting({
        variables: {
          meetingId,
          userId: user.id,
        },
      });

      await refetch();
    } catch (err) {
      console.error("Accept meeting error:", err);
    }
  };

  const handleCancel = async (meetingId: string) => {
    if (!user) return;

    try {
      await cancelMeeting({
        variables: {
          meetingId,
          userId: user.id,
        },
      });

      await refetch();
    } catch (err) {
      console.error("Cancel meeting error:", err);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator
          size="large"
          color="#0879F9"
        />

        <Text className="mt-4 text-base text-slate-500">
          Loading meetings...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Ionicons
          name="alert-circle-outline"
          size={48}
          color="#EF4444"
        />

        <Text className="mt-4 text-xl font-bold text-[#111936]">
          Couldn't load meetings
        </Text>

        <Text className="mt-2 text-center text-sm text-slate-500">
          {error.message}
        </Text>

        <Pressable
          onPress={() => refetch()}
          className="mt-6 h-[52px] w-full items-center justify-center rounded-xl bg-[#0879F9]"
        >
          <Text className="font-bold text-white">
            Try Again
          </Text>
        </Pressable>
      </View>
    );
  }

  const pendingMeetings = meetings.filter(
    (meeting) => meeting.status === "PENDING"
  );

  const confirmedMeetings = meetings.filter(
    (meeting) => meeting.status === "CONFIRMED"
  );

  const cancelledMeetings = meetings.filter(
    (meeting) => meeting.status === "CANCELLED"
  );

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 55,
          paddingBottom: 100,
        }}
      >

                {/* Header */}
                {/* Back button */}
          <View className="flex-1 bg-white px-6 pt-12">

    {/* Back Button */}
    <Pressable
      onPress={() => router.push("/matches")}
      className="mb-5 h-11 w-11 items-center justify-center rounded-full"
      hitSlop={10}
    >
      <Ionicons
        name="arrow-back"
        size={28}
        color="#111936"
      />
    </Pressable>

    {/* Header */}
    <Text className="text-[32px] font-bold text-[#111936]">
      Meetings
    </Text>

    <Text className="mt-3 text-[18px] leading-7 text-[#60708F]">
      Manage your meeting requests and confirmed{"\n"}
      meetups.
    </Text>
        </View>
        {/* Empty state */}
        {meetings.length === 0 && (
          <View className="mt-20 items-center px-8">
            <View className="h-24 w-24 items-center justify-center rounded-full bg-[#EEF5FD]">
              <Ionicons
                name="calendar-outline"
                size={44}
                color="#0879F9"
              />
            </View>

            <Text className="mt-6 text-[22px] font-bold text-[#111936]">
              No meetings yet
            </Text>

            <Text className="mt-2 text-center text-[15px] leading-6 text-[#60708F]">
              Find someone you connect with and suggest a meetup.
            </Text>

            <Pressable
              onPress={() => router.replace("/matches")}
              className="mt-6 h-[52px] w-full items-center justify-center rounded-xl bg-[#0879F9]"
            >
              <Text className="font-bold text-white">
                Find Matches
              </Text>
            </Pressable>
          </View>
        )}

        {/* Pending */}
        {pendingMeetings.length > 0 && (
          <View className="mt-8">
            <Text className="px-5 text-[19px] font-bold text-[#111936]">
              Pending Requests
            </Text>

            {pendingMeetings.map((meeting) => {
              const isRequester =
                meeting.requesterId === user?.id;

              const isRecipient =
                meeting.recipientId === user?.id;

              return (
                <View
                  key={meeting.id}
                  className="mx-5 mt-4 rounded-2xl border border-[#DDE8F5] bg-white p-5"
                >
                  <View className="flex-row items-start">
                    <View className="h-12 w-12 items-center justify-center rounded-full bg-[#EEF5FD]">
                      <Ionicons
                        name="time-outline"
                        size={25}
                        color="#0879F9"
                      />
                    </View>

                    <View className="ml-4 flex-1">
                      <Text className="text-[18px] font-bold text-[#111936]">
                        Meeting Request
                      </Text>

                      <Text className="mt-1 text-[14px] text-[#60708F]">
                        {isRequester
                          ? "Waiting for them to accept"
                          : "Someone wants to meet you"}
                      </Text>
                    </View>
                  </View>

                  <View className="mt-5 rounded-xl bg-[#F7FAFD] p-4">
                    <View className="flex-row items-center">
                      <Ionicons
                        name="location-outline"
                        size={20}
                        color="#0879F9"
                      />

                      <View className="ml-3 flex-1">
                        <Text className="text-[16px] font-bold text-[#111936]">
                          {meeting.place.name}
                        </Text>

                        <Text className="mt-1 text-[13px] text-[#60708F]">
                          {meeting.place.address}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {isRecipient && (
                    <View className="mt-4 flex-row gap-3">
                      <Pressable
                        disabled={accepting || cancelling}
                        onPress={() =>
                          handleAccept(meeting.id)
                        }
                        className="h-[50px] flex-1 items-center justify-center rounded-xl bg-[#0879F9]"
                      >
                        {accepting ? (
                          <ActivityIndicator color="white" />
                        ) : (
                          <Text className="font-bold text-white">
                            Accept
                          </Text>
                        )}
                      </Pressable>

                      <Pressable
                        disabled={accepting || cancelling}
                        onPress={() =>
                          handleCancel(meeting.id)
                        }
                        className="h-[50px] flex-1 items-center justify-center rounded-xl border border-[#D6DFEB]"
                      >
                        <Text className="font-bold text-[#60708F]">
                          Decline
                        </Text>
                      </Pressable>
                    </View>
                  )}

                  {isRequester && (
                    <Pressable
                      disabled={cancelling}
                      onPress={() =>
                        handleCancel(meeting.id)
                      }
                      className="mt-4 h-[48px] items-center justify-center rounded-xl border border-[#D6DFEB]"
                    >
                      {cancelling ? (
                        <ActivityIndicator />
                      ) : (
                        <Text className="font-semibold text-[#60708F]">
                          Cancel Request
                        </Text>
                      )}
                    </Pressable>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* Confirmed */}
        {confirmedMeetings.length > 0 && (
          <View className="mt-8">
            <Text className="px-5 text-[19px] font-bold text-[#111936]">
              Confirmed Meetings
            </Text>

            {confirmedMeetings.map((meeting) => (
              <View
                key={meeting.id}
                className="mx-5 mt-4 rounded-2xl border border-[#BDE8CA] bg-[#F1FCF4] p-5"
              >
                <View className="flex-row items-center">
                  <View className="h-12 w-12 items-center justify-center rounded-full bg-[#D9F7E1]">
                    <Ionicons
                      name="checkmark"
                      size={27}
                      color="#16A34A"
                    />
                  </View>

                  <View className="ml-4 flex-1">
                    <Text className="text-[18px] font-bold text-[#111936]">
                      Meeting Confirmed!
                    </Text>

                    <Text className="mt-1 text-[14px] text-[#60708F]">
                      You both agreed to meet.
                    </Text>
                  </View>
                </View>

                <View className="mt-5 rounded-xl bg-white p-4">
                  <View className="flex-row items-center">
                    <Ionicons
                      name="location-outline"
                      size={21}
                      color="#16A34A"
                    />

                    <View className="ml-3 flex-1">
                      <Text className="text-[16px] font-bold text-[#111936]">
                        {meeting.place.name}
                      </Text>

                      <Text className="mt-1 text-[13px] text-[#60708F]">
                        {meeting.place.address}
                      </Text>
                    </View>
                  </View>
                </View>

                <Pressable
                  onPress={() =>
                    handleCancel(meeting.id)
                  }
                  className="mt-4 h-[46px] items-center justify-center rounded-xl border border-[#D6DFEB]"
                >
                  <Text className="font-semibold text-[#60708F]">
                    Cancel Meeting
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {/* Cancelled */}
        {cancelledMeetings.length > 0 && (
          <View className="mt-8">
            <Text className="px-5 text-[19px] font-bold text-[#111936]">
              Past Requests
            </Text>

            {cancelledMeetings.map((meeting) => (
              <View
                key={meeting.id}
                className="mx-5 mt-4 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-5"
              >
                <View className="flex-row items-center">
                  <Ionicons
                    name="close-circle-outline"
                    size={25}
                    color="#94A3B8"
                  />

                  <View className="ml-3 flex-1">
                    <Text className="font-semibold text-[#475569]">
                      Meeting Cancelled
                    </Text>

                    <Text className="mt-1 text-[13px] text-[#94A3B8]">
                      {meeting.place.name}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}