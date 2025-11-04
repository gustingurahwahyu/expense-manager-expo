import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import "../global.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="splash-screen" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add-expense" />
        <Stack.Screen name="add-income" />
        <Stack.Screen name="reports" />
      </Stack>
    </AuthProvider>
  );
}
