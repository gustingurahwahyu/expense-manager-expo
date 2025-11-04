import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function Settings() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const settingsItems = [
    { id: 1, title: "Profile", icon: "person-outline", color: "#3b82f6" },
    { id: 2, title: "Currency", icon: "cash-outline", color: "#10b981" },
    { id: 3, title: "Language", icon: "language-outline", color: "#f59e0b" },
    {
      id: 4,
      title: "Notifications",
      icon: "notifications-outline",
      color: "#8b5cf6",
    },
    { id: 5, title: "Security", icon: "shield-outline", color: "#ef4444" },
    {
      id: 6,
      title: "About",
      icon: "information-circle-outline",
      color: "#6b7280",
    },
  ];

  async function handleLogout() {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);
  }

  return (
    <ScrollView className="flex-1 px-5 pt-10 bg-white">
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-2xl font-bold text-gray-800">Settings</Text>
      </View>

      {/* Profile Card */}
      <View className="flex-row items-center p-5 mb-6 bg-blue-100 rounded-2xl">
        <View className="items-center justify-center w-16 h-16 mr-4 bg-blue-600 rounded-full">
          <Ionicons name="person" size={32} color="white" />
        </View>
        <View>
          <Text className="text-lg font-bold text-gray-800">
            {user?.email?.split("@")[0] || "User"}
          </Text>
          <Text className="text-sm text-gray-600">{user?.email}</Text>
        </View>
      </View>

      {/* Settings List */}
      {settingsItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          className="flex-row items-center justify-between py-4 border-b border-gray-100"
        >
          <View className="flex-row items-center">
            <View
              className="items-center justify-center w-10 h-10 mr-3 rounded-full"
              style={{ backgroundColor: `${item.color}20` }}
            >
              <Ionicons name={item.icon as any} size={20} color={item.color} />
            </View>
            <Text className="font-semibold text-gray-800">{item.title}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>
      ))}

      {/* Logout Button */}
      <TouchableOpacity
        onPress={handleLogout}
        className="flex-row items-center justify-center py-4 mt-6 mb-10 bg-red-100 rounded-2xl"
      >
        <Ionicons name="log-out-outline" size={24} color="#ef4444" />
        <Text className="ml-2 font-semibold text-red-500">Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
