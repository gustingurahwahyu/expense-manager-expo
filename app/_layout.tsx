import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#16a34a" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "600" },
      }}
    />
  );
}
