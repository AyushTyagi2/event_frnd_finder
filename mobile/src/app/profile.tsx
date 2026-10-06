import React from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {useMutation} from "@apollo/client/react";
import {CREATE_USER} from "@/graphQL/user";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useUserStore } from "@/store/userStore";

const interests = [
  "MEMES",
  "TECH",
  "MUSIC",
  "MOVIES",
  "GAMING",
  "TRAVEL",
  "FOOD",
  "SPORTS",
  "ANIME",
];

const interestLabels: Record<string, string> = {
  MEMES: "Memes",
  TECH: "Tech",
  MUSIC: "Music",
  MOVIES: "Movies",
  GAMING: "Gaming",
  TRAVEL: "Travel",
  FOOD: "Food",
  SPORTS: "Sports",
  ANIME: "Anime",
};

const genders = ["Male", "Female", "Other", "Prefer not to say"];

export default function ProfileScreen() {
  

  const [name, setName] = React.useState("");
  const [dateOfBirth, setDateOfBirth] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [about, setAbout] = React.useState("");
  const [selectedInterests, setSelectedInterests] = React.useState<string[]>(
    []
  );
  const [photos, setPhotos] = React.useState<string[]>([]);
  const [genderModalVisible, setGenderModalVisible] = React.useState(false);
  const setUser = useUserStore((state) => state.setUser);

const [createUser, { loading }] = useMutation(CREATE_USER);

const [email, setEmail] = React.useState("");
const [password, setPassword] = React.useState("");

  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [birthDate, setBirthDate] = React.useState<Date | null>(null);
  const toggleInterest = (interest: string) => {
    setSelectedInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    );
  };

  const addPhotos = async () => {
    if (photos.length >= 5) {
      Alert.alert("Maximum photos", "You can add up to 5 photos.");
      return;
    }

    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Please allow photo access to add photos."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: 5 - photos.length,
      quality: 0.8,
    });

    if (!result.canceled) {
      const selected = result.assets.map((asset) => asset.uri);

      setPhotos((current) => [...current, ...selected].slice(0, 5));
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((current) => current.filter((_, i) => i !== index));
  };
  const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};
  const handleContinue = async () => {
  if (!name.trim()) {
    return;
  }

  if (!email.trim()) {
    return;
  }

  if (!password.trim()) {
    return;
  }

  if (!dateOfBirth) {
    return;
  }

  if (!gender) {
    return;
  }

  try {
    const { data } = await createUser({
      variables: {
        input: {
          name: name.trim(),
          email: email.trim(),
          password,
          gender,
          dateOfBirth,
          about: about.trim() || null,
          interests,
          profilePic: photos[0] || null,
        },
      },
    });

    if (!data?.createUser) {
      throw new Error("Could not create your account.");
    }

    setUser(data.createUser);

    router.replace("/memes");
  } catch (error) {
    console.error("Create account error:", error);
  }
};

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 55,
          paddingBottom: 30,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <Pressable
          className="mb-7 h-10 w-10 items-center justify-center"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={34} color="#111936" />
        </Pressable>

        {/* Heading */}
        <Text className="text-[38px] font-bold leading-[45px] text-[#111936]">
          Create your profile
        </Text>

        <Text className="mt-3 text-[21px] leading-[29px] text-[#6B7C9F]">
          This helps us find better matches{"\n"}for you at the event.
        </Text>

        {/* Full Name */}
        <View className="mt-9">
          <Text className="mb-2 text-[19px] font-bold text-[#111936]">
            Full Name
          </Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#7183A5"
            className="h-[72px] rounded-[14px] border border-[#C9DBF7] px-6 text-[21px] text-[#111936]"
          />
        </View>
        <View className="mt-6">
  <Text className="mb-2 text-[19px] font-bold text-[#111936]">
    Email
  </Text>

  <TextInput
    value={email}
    onChangeText={setEmail}
    placeholder="you@example.com"
    placeholderTextColor="#7183A5"
    autoCapitalize="none"
    autoCorrect={false}
    keyboardType="email-address"
    className="h-[72px] rounded-[14px] border border-[#C9DBF7] px-6 text-[18px] text-[#111936]"
  />
</View>

<View className="mt-6">
  <Text className="mb-2 text-[19px] font-bold text-[#111936]">
    Password
  </Text>

  <TextInput
    value={password}
    onChangeText={setPassword}
    placeholder="Create a password"
    placeholderTextColor="#7183A5"
    secureTextEntry
    autoCapitalize="none"
    autoCorrect={false}
    className="h-[72px] rounded-[14px] border border-[#C9DBF7] px-6 text-[18px] text-[#111936]"
  />
</View>

        {/* Date of Birth */}
        <View className="mt-6">
  <Text className="mb-2 text-[19px] font-bold text-[#111936]">
    Date of Birth
  </Text>

  <View className="h-[72px] flex-row items-center rounded-[14px] border border-[#C9DBF7] px-6">
    <Pressable
      className="flex-1 justify-center"
      onPress={() => setShowDatePicker(true)}
    >
      <Text
        className={`text-[21px] ${
          dateOfBirth ? "text-[#111936]" : "text-[#7183A5]"
        }`}
      >
        {dateOfBirth || "DD/MM/YYYY"}
      </Text>
    </Pressable>

    <Pressable
      className="h-12 w-12 items-center justify-center"
      onPress={() => setShowDatePicker(true)}
      hitSlop={10}
    >
      <Ionicons
        name="calendar-outline"
        size={29}
        color="#111936"
      />
    </Pressable>
  </View>

  {showDatePicker && (
    <DateTimePicker
      value={birthDate || new Date(2004, 0, 1)}
      mode="date"
      display="default"
      maximumDate={new Date()}
      onChange={(event, selectedDate) => {
        setShowDatePicker(false);

        if (selectedDate) {
          setBirthDate(selectedDate);
          setDateOfBirth(formatDate(selectedDate));
        }
      }}
    />
  )}
</View>

        {/* Gender */}
        <View className="mt-6">
          <Text className="mb-2 text-[19px] font-bold text-[#111936]">
            Gender
          </Text>

          <Pressable
            className="h-[72px] flex-row items-center rounded-[14px] border border-[#C9DBF7] px-6"
            onPress={() => setGenderModalVisible(true)}
          >
            <Text
              className={`flex-1 text-[21px] ${
                gender ? "text-[#111936]" : "text-[#7183A5]"
              }`}
            >
              {gender || "Select gender"}
            </Text>

            <Ionicons
              name="chevron-down"
              size={27}
              color="#111936"
            />
          </Pressable>
        </View>

        {/* About */}
        <View className="mt-6">
          <Text className="mb-2 text-[19px] font-bold text-[#111936]">
            About
          </Text>

          <TextInput
            value={about}
            onChangeText={setAbout}
            placeholder="Tell people a little about yourself"
            placeholderTextColor="#7183A5"
            multiline
            textAlignVertical="top"
            className="h-[145px] rounded-[14px] border border-[#C9DBF7] px-6 py-5 text-[21px] text-[#111936]"
          />
        </View>

        {/* Interests */}
        <View className="mt-7">
          <Text className="mb-3 text-[19px] font-bold text-[#111936]">
            Interests
          </Text>

          <View className="flex-row flex-wrap justify-between">
            {interests.map((interest) => {
              const selected = selectedInterests.includes(interest);

              return (
                <Pressable
                  key={interest}
                  onPress={() => toggleInterest(interest)}
                  className={`mb-2.5 h-[61px] w-[31.5%] items-center justify-center rounded-[14px] ${
                    selected ? "bg-[#0879F9]" : "bg-[#EAF1FC]"
                  }`}
                >
                  <Text
                    className={`text-[18px] font-medium ${
                      selected ? "text-white" : "text-[#111936]"
                    }`}
                  >
                    {interestLabels[interest]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Photos */}
        <View className="mt-7">
          <Text className="text-[19px] font-bold text-[#111936]">
            Photos
          </Text>

          <Text className="mt-1 text-[17px] text-[#7183A5]">
            Upload photos to showcase yourself (min 1, max 5)
          </Text>

          <View className="mt-4 flex-row gap-3">
            {/* Add photos */}
            <Pressable
              onPress={addPhotos}
              className="h-[112px] w-[112px] items-center justify-center rounded-[14px] border-2 border-dashed border-[#0879F9]"
            >
              <Text className="text-[38px] leading-[40px] text-[#0879F9]">
                +
              </Text>

              <Text className="mt-1 text-[15px] font-semibold text-[#0879F9]">
                Add Photos
              </Text>
            </Pressable>

            {/* Photo slots */}
            {Array.from({ length: 4 }).map((_, index) => {
              const photo = photos[index];

              return (
                <Pressable
                  key={index}
                  onPress={() => photo && removePhoto(index)}
                  className="h-[112px] w-[112px] items-center justify-center overflow-hidden rounded-[14px] border border-[#D9E5F7] bg-[#F1F6FE]"
                >
                  {photo ? (
                    <Image
                      source={{ uri: photo }}
                      className="h-full w-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <Ionicons
                      name="image-outline"
                      size={31}
                      color="#7183A5"
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Continue */}
        <Pressable
  disabled={loading}
  onPress={handleContinue}
  className={`h-[58px] items-center justify-center rounded-[14px] ${
    loading ? "bg-blue-300" : "bg-[#0879F9]"
  }`}
>
  {loading ? (
    <ActivityIndicator color="white" />
  ) : (
    <Text className="text-[18px] font-bold text-white">
      Continue
    </Text>
  )}
</Pressable>
      </ScrollView>

      {/* Gender modal */}
      <Modal
        visible={genderModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setGenderModalVisible(false)}
      >
        <Pressable
          className="flex-1 justify-end bg-black/30"
          onPress={() => setGenderModalVisible(false)}
        >
          <Pressable
            className="rounded-t-[28px] bg-white px-6 pb-10 pt-6"
            onPress={(event) => event.stopPropagation()}
          >
            <Text className="mb-5 text-[24px] font-bold text-[#111936]">
              Select gender
            </Text>

            {genders.map((item) => (
              <Pressable
                key={item}
                onPress={() => {
                  setGender(item);
                  setGenderModalVisible(false);
                }}
                className="h-[58px] justify-center border-b border-[#E5EAF2]"
              >
                <Text className="text-[18px] text-[#111936]">
                  {item}
                </Text>
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}