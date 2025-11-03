import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May"],
  datasets: [
    {
      data: [500, 700, 800, 600, 900],
    },
  ],
};

const chartConfig = {
  backgroundColor: "#fff",
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  barPercentage: 0.5,
  propsForBackgroundLines: {
    strokeWidth: 1,
    stroke: "#e3e3e3",
    strokeDasharray: "0",
  },
};

export default function Dashboard() {
  return (
    <ScrollView className="flex-1 px-5 pt-10 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-2xl font-bold text-green-600">
          Expense Manager
        </Text>
        <Ionicons name="person-circle-outline" size={34} color="#16a34a" />
      </View>

      {/* Ringkasan */}
      <View className="p-5 mb-6 bg-green-100 rounded-2xl">
        <Text className="text-gray-600">Total Balance</Text>
        <Text className="mt-1 text-3xl font-bold text-green-700">
          Rp 12.450.000
        </Text>
        <View className="flex-row justify-between mt-4">
          <View>
            <Text className="text-gray-600">Income</Text>
            <Text className="font-semibold text-green-700">Rp 8.500.000</Text>
          </View>
          <View>
            <Text className="text-gray-600">Expense</Text>
            <Text className="font-semibold text-red-500">Rp 3.950.000</Text>
          </View>
        </View>
      </View>

      {/* Grafik */}
      <View className="p-4 mb-6 bg-white shadow rounded-2xl">
        <Text className="mb-3 text-lg font-semibold text-green-700">
          Monthly Overview
        </Text>
        <BarChart
          data={data}
          width={screenWidth - 60}
          height={220}
          chartConfig={chartConfig}
          style={{
            borderRadius: 16,
          }}
          yAxisLabel="Rp "
          yAxisSuffix="k"
          fromZero
          showValuesOnTopOfBars
        />
      </View>

      {/* Tombol tambah */}
      <Link href="/add-expense" asChild>
        <TouchableOpacity className="py-4 mt-5 mb-5 bg-red-400 rounded-2xl">
          <Text className="text-lg font-semibold text-center text-white">
            + Tambah Pengeluaran
          </Text>
        </TouchableOpacity>
      </Link>
      <Link href="/add-income" asChild>
        <TouchableOpacity className="py-4 mb-5 bg-green-600 rounded-2xl">
          <Text className="text-lg font-semibold text-center text-white">
            + Tambah Pemasukan
          </Text>
        </TouchableOpacity>
      </Link>
      <Link href="/reports" asChild>
        <TouchableOpacity className="py-4 mb-10 bg-blue-500 rounded-2xl">
          <Text className="text-lg font-semibold text-center text-white">
            Lihat Laporan
          </Text>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
}
