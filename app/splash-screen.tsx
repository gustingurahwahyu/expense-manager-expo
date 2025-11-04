import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Animated, Image, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function SplashScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.3);

  useEffect(() => {
    // Animasi fade in dan scale
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 2,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigasi setelah loading auth selesai
    if (!loading) {
      const timer = setTimeout(() => {
        if (user) {
          // Jika user sudah login, langsung ke tabs
          router.replace("/(tabs)");
        } else {
          // Jika belum login, ke halaman login
          router.replace("/login");
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [loading, user]);

  return (
    <View className="items-center justify-center flex-1 bg-white">
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
        className="items-center"
      >
        {/* Logo Image */}
        <View className="items-center justify-center mb-6">
          <Image
            source={require("../assets/images/logo.png")}
            style={{ width: 150, height: 150 }}
            resizeMode="contain"
          />
        </View>

        {/* App Name */}
        <Text className="mb-2 text-4xl font-bold text-gray-800">My Wallet</Text>
        <Text className="text-lg text-gray-500">Manage Your Money Wisely</Text>

        {/* Loading Indicator */}
        <View className="flex-row mt-8 space-x-2">
          <Animated.View
            className="w-3 h-3 bg-blue-600 rounded-full"
            style={{
              opacity: fadeAnim,
            }}
          />
          <Animated.View
            className="w-3 h-3 bg-blue-600 rounded-full"
            style={{
              opacity: fadeAnim,
            }}
          />
          <Animated.View
            className="w-3 h-3 bg-blue-600 rounded-full"
            style={{
              opacity: fadeAnim,
            }}
          />
        </View>
      </Animated.View>

      {/* Footer */}
      <Animated.View
        style={{ opacity: fadeAnim }}
        className="absolute bottom-10"
      >
        <Text className="text-sm text-gray-400">Version 1.0.0</Text>
      </Animated.View>
    </View>
  );
}
