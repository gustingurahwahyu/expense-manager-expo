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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
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
            <Ionicons name="wallet" size={40} color="white" />
          </View>
          <Text className="text-3xl font-bold text-gray-800">Welcome Back</Text>
          <Text className="mt-2 text-gray-500">Sign in to continue</Text>
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

        <View className="mb-6">
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

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className={`py-4 bg-blue-600 rounded-2xl mb-4 ${
            loading ? "opacity-50" : ""
          }`}
        >
          <Text className="font-semibold text-center text-white">
            {loading ? "Signing in..." : "Sign In"}
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="text-gray-600">Dont have an account? </Text>
          <Link href="/register" asChild>
            <TouchableOpacity>
              <Text className="font-semibold text-blue-600">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
