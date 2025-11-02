import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import "../global.css";

export default function Dashboard() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Text className="text-2xl font-bold text-green-700 mb-6">Dashboard</Text>

      <Pressable
        onPress={() => router.push("/add-transaction")}
        className="bg-green-600 px-5 py-3 rounded-xl mb-3"
      >
        <Text className="text-white font-semibold">Tambah Transaksi</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/reports")}
        className="bg-green-500 px-5 py-3 rounded-xl"
      >
        <Text className="text-white font-semibold">Lihat Laporan</Text>
      </Pressable>
    </View>
  );
}
