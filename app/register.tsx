import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  async function handleRegister() {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
      Alert.alert("Success", "Account created successfully");
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 px-5 bg-white"
    >
      <View className="justify-center flex-1">
        <View className="items-center mb-8">
          <View className="items-center justify-center w-20 h-20 mb-4 bg-blue-600 rounded-full">
            <Ionicons name="person-add" size={40} color="white" />
          </View>
          <Text className="text-3xl font-bold text-gray-800">
            Create Account
          </Text>
          <Text className="mt-2 text-gray-500">Sign up to get started</Text>
        </View>

        <View className="mb-4">
          <Text className="mb-2 text-sm font-semibold text-gray-700">
            Email
          </Text>
          <TextInput
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            className="p-4 border border-gray-200 rounded-2xl"
          />
        </View>

        <View className="mb-4">
          <Text className="mb-2 text-sm font-semibold text-gray-700">
            Password
          </Text>
          <TextInput
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="p-4 border border-gray-200 rounded-2xl"
          />
        </View>

        <View className="mb-6">
          <Text className="mb-2 text-sm font-semibold text-gray-700">
            Confirm Password
          </Text>
          <TextInput
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            className="p-4 border border-gray-200 rounded-2xl"
          />
        </View>

        <TouchableOpacity
          onPress={handleRegister}
          disabled={loading}
          className={`py-4 bg-blue-600 rounded-2xl mb-4 ${
            loading ? "opacity-50" : ""
          }`}
        >
          <Text className="font-semibold text-center text-white">
            {loading ? "Creating account..." : "Sign Up"}
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="text-gray-600">Already have an account? </Text>
          <Link href="/login" asChild>
            <TouchableOpacity>
              <Text className="font-semibold text-blue-600">Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
