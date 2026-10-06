import React from "react";
import { useMutation } from "@apollo/client/react";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { LOGIN_USER } from "@/graphQL/user";
import { useUserStore } from "@/store/userStore";

export default function LoginScreen() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const setUser = useUserStore((state) => state.setUser);

  const [loginUser, { loading }] = useMutation(LOGIN_USER);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert(
        "Missing information",
        "Please enter your email and password."
      );
      return;
    }

    try {
      const { data } = await loginUser({
        variables: {
          email: email.trim(),
          password,
        },
      });

      if (!data?.loginUser?.user) {
        throw new Error("Login failed.");
      }

      setUser(data.loginUser.user);

      router.replace("/event");
    } catch (error) {
      Alert.alert(
        "Login failed",
        error instanceof Error
          ? error.message
          : "Invalid email or password."
      );
    }
  };

  return (
    <View className="flex-1 bg-white px-5 pt-16">
      <Pressable
        className="h-10 w-10 items-center justify-center"
        onPress={() => router.back()}
      >
        <Text className="text-[32px] text-slate-900">‹</Text>
      </Pressable>

      <View className="mt-10">
        <Text className="text-[36px] font-bold text-slate-900">
          Welcome back
        </Text>

        <Text className="mt-3 text-[18px] leading-6 text-slate-500">
          Log in to continue finding your event matches.
        </Text>
      </View>

      <View className="mt-10">
        <Text className="mb-2 text-[18px] font-bold text-slate-900">
          Email
        </Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor="#7183A5"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          className="h-[68px] rounded-[14px] border border-[#C9DBF7] px-5 text-[18px] text-slate-900"
        />
      </View>

      <View className="mt-6">
        <Text className="mb-2 text-[18px] font-bold text-slate-900">
          Password
        </Text>

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          placeholderTextColor="#7183A5"
          secureTextEntry
          className="h-[68px] rounded-[14px] border border-[#C9DBF7] px-5 text-[18px] text-slate-900"
        />
      </View>

      <Pressable
        disabled={loading}
        onPress={handleLogin}
        className={`mt-8 h-[62px] items-center justify-center rounded-[14px] ${
          loading ? "bg-blue-300" : "bg-[#0879F9]"
        }`}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-[19px] font-bold text-white">
            Log In
          </Text>
        )}
      </Pressable>

      <View className="mt-6 items-center">
        <Text className="text-[15px] text-slate-500">
          New here?
        </Text>

        <Pressable
          onPress={() => router.replace("/profile")}
        >
          <Text className="mt-1 text-[16px] font-semibold text-blue-500">
            Create an account
          </Text>
        </Pressable>
      </View>
    </View>
  );
}