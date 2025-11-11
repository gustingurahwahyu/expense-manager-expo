import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signUp, signInWithGitHub } = useAuth();
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
      Alert.alert("Success", "Account created successfully!");
      router.replace("/(tabs)");
    } catch (error: any) {
      let errorMessage = "Failed to create account";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak";
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Registration Failed", errorMessage);
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
          "GitHub Sign-In Failed",
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
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="px-6"
          showsVerticalScrollIndicator={false}
        >
          <View className="justify-center flex-1 py-10">
            {/* Logo Section */}
            <View className="items-center mb-8">
              <View className="items-center justify-center w-24 h-24 mb-4 bg-white rounded-full shadow-lg">
                <Ionicons name="person-add" size={48} color="#667eea" />
              </View>
              <Text className="text-4xl font-bold text-white">
                Create Account
              </Text>
              <Text className="mt-2 text-lg text-white/80">
                Sign up to get started
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
              <View className="mb-4">
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
                    placeholder="Create a password"
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

              {/* Confirm Password Input */}
              <View className="mb-6">
                <Text className="mb-2 text-sm font-semibold text-gray-700">
                  Confirm Password
                </Text>
                <View className="flex-row items-center p-4 bg-gray-50 rounded-2xl">
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#9ca3af"
                  />
                  <TextInput
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    className="flex-1 mx-3 text-gray-800"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Ionicons
                      name={
                        showConfirmPassword ? "eye-outline" : "eye-off-outline"
                      }
                      size={20}
                      color="#9ca3af"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity
                onPress={handleRegister}
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
                    Sign Up
                  </Text>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center my-4">
                <View className="flex-1 h-px bg-gray-300" />
                <Text className="mx-4 text-sm text-gray-500">OR</Text>
                <View className="flex-1 h-px bg-gray-300" />
              </View>

              {/* GitHub Sign-In Button */}
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
                      GitHub Sign-In will open in your browser. After signing
                      in, you will be redirected back to the app.
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Sign In Link */}
            <View className="flex-row justify-center mt-6 mb-4">
              <Text className="text-white">Already have an account? </Text>
              <Link href="/login" asChild>
                <TouchableOpacity>
                  <Text className="font-bold text-white underline">
                    Sign In
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
