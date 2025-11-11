import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
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
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signInWithGitHub } = useAuth(); // 👈 Ganti signInWithGoogle jadi signInWithGitHub
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
      let errorMessage = "Failed to sign in";

      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function handleGitHubSignIn() {
    setLoading(true);
    try {
      await signInWithGitHub();

      if (Platform.OS === "web") {
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      if (error.message !== "Sign-in cancelled") {
        Alert.alert(
          "GitHub Login Failed",
          error.message || "Failed to sign in with GitHub"
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 px-6"
      >
        <View className="justify-center flex-1">
          {/* Logo Section */}
          <View className="items-center mb-10">
            <View className="items-center justify-center w-24 h-24 mb-4 bg-white rounded-full shadow-lg">
              <Ionicons name="wallet" size={48} color="#667eea" />
            </View>
            <Text className="text-4xl font-bold text-white">Welcome Back</Text>
            <Text className="mt-2 text-lg text-white/80">
              Sign in to continue
            </Text>
          </View>

          {/* Form Section */}
          <View className="p-6 bg-white shadow-2xl rounded-3xl">
            {/* Email Input */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-semibold text-gray-700">
                Email Address
              </Text>
              <View className="flex-row items-center p-4 bg-gray-50 rounded-2xl">
                <Ionicons name="mail-outline" size={20} color="#9ca3af" />
                <TextInput
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="flex-1 ml-3 text-gray-800"
                />
              </View>
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="mb-2 text-sm font-semibold text-gray-700">
                Password
              </Text>
              <View className="flex-row items-center p-4 bg-gray-50 rounded-2xl">
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#9ca3af"
                />
                <TextInput
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  className="flex-1 mx-3 text-gray-800"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#9ca3af"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              className="py-4 mb-4 rounded-2xl"
              style={{
                backgroundColor: loading ? "#9ca3af" : "#667eea",
              }}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-lg font-bold text-center text-white">
                  Sign In
                </Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center my-4">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="mx-4 text-sm text-gray-500">OR</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            {/* GitHub Login Button */}
            <TouchableOpacity
              onPress={handleGitHubSignIn}
              disabled={loading}
              className="flex-row items-center justify-center py-4 bg-gray-800 rounded-2xl"
            >
              <Ionicons name="logo-github" size={24} color="white" />
              <Text className="ml-3 font-semibold text-white">
                Continue with GitHub
              </Text>
            </TouchableOpacity>

            {/* Info untuk User */}
            {Platform.OS !== "web" && (
              <View className="p-3 mt-4 bg-gray-100 rounded-2xl">
                <View className="flex-row items-start">
                  <Ionicons
                    name="information-circle"
                    size={18}
                    color="#6b7280"
                    style={{ marginTop: 2 }}
                  />
                  <Text className="flex-1 ml-2 text-xs text-gray-600">
                    GitHub Login will open in your browser. After signing in,
                    you will be redirected back to the app.
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Sign Up Link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-white">Dont have an account? </Text>
            <Link href="/register" asChild>
              <TouchableOpacity>
                <Text className="font-bold text-white underline">Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
