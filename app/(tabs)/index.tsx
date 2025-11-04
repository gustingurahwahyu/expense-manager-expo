import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import {
  getTotalExpense,
  getTotalIncome,
  getUserTransactions,
  Transaction,
} from "../../services/transactionService";

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Icon mapping berdasarkan kategori
  const getIconByCategory = (category: string, type: string) => {
    const icons: { [key: string]: any } = {
      Food: { icon: "fast-food", bg: "#fee2e2", color: "#ef4444" },
      Transport: { icon: "bicycle", bg: "#dbeafe", color: "#3b82f6" },
      Shopping: { icon: "bag-handle", bg: "#d1fae5", color: "#10b981" },
      Entertainment: {
        icon: "game-controller",
        bg: "#fce7f3",
        color: "#ec4899",
      },
      Bills: { icon: "receipt", bg: "#fef3c7", color: "#f59e0b" },
      Salary: { icon: "cash", bg: "#dcfce7", color: "#16a34a" },
      Bonus: { icon: "gift", bg: "#ddd6fe", color: "#8b5cf6" },
      Investment: { icon: "trending-up", bg: "#dbeafe", color: "#3b82f6" },
      Other: { icon: "ellipsis-horizontal", bg: "#f3f4f6", color: "#6b7280" },
    };

    return icons[category] || icons.Other;
  };

  async function loadData() {
    if (!user) return;

    try {
      setLoading(true);
      const [transactionsData, income, expense] = await Promise.all([
        getUserTransactions(user.uid),
        getTotalIncome(user.uid),
        getTotalExpense(user.uid),
      ]);

      setTransactions(transactionsData.slice(0, 5)); // Ambil 5 transaksi terbaru
      setTotalIncome(income);
      setTotalExpense(expense);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  useEffect(() => {
    loadData();
  }, [user]);

  const totalBalance = totalIncome - totalExpense;

  if (loading) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View className="px-5 pt-12 pb-6 bg-white">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-xl font-bold text-gray-800">My Wallet</Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/settings")}
            className="items-center justify-center w-12 h-12 bg-blue-600 rounded-full"
          >
            <Ionicons name="person" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Cards Summary - Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-5 mb-4 -mx-5"
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {/* Total Balance Card */}
          <View className="p-5 mr-4 bg-white border border-gray-200 w-44 rounded-3xl">
            <View className="items-center justify-center w-12 h-12 mb-3 bg-gray-100 rounded-2xl">
              <Ionicons name="wallet-outline" size={24} color="#374151" />
            </View>
            <Text className="mb-1 text-xs text-gray-500">Total Balance</Text>
            <Text className="text-xl font-bold text-gray-800">
              Rp {totalBalance.toLocaleString("id-ID")}
            </Text>
          </View>

          {/* Total Income Card */}
          <View className="p-5 mr-4 bg-green-600 w-44 rounded-3xl">
            <View className="items-center justify-center w-12 h-12 mb-3 bg-white/20 rounded-2xl">
              <Ionicons name="arrow-down-outline" size={24} color="white" />
            </View>
            <Text className="mb-1 text-xs text-white/80">Total Income</Text>
            <Text className="text-xl font-bold text-white">
              Rp {totalIncome.toLocaleString("id-ID")}
            </Text>
          </View>

          {/* Total Expense Card */}
          <View className="p-5 mr-4 bg-red-600 w-44 rounded-3xl">
            <View className="items-center justify-center w-12 h-12 mb-3 bg-white/20 rounded-2xl">
              <Ionicons name="arrow-up-outline" size={24} color="white" />
            </View>
            <Text className="mb-1 text-xs text-white/80">Total Expense</Text>
            <Text className="text-xl font-bold text-white">
              Rp {totalExpense.toLocaleString("id-ID")}
            </Text>
          </View>
        </ScrollView>
      </View>

      {/* Action Buttons */}
      <View className="flex-row px-5 py-6 bg-white">
        <TouchableOpacity className="flex-row items-center px-5 py-3 mr-3 bg-blue-600 rounded-2xl">
          <Ionicons name="download-outline" size={20} color="white" />
          <Text className="ml-2 text-sm font-semibold text-white">Savings</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center px-5 py-3 mr-3 bg-gray-100 rounded-2xl">
          <Ionicons name="notifications-outline" size={20} color="#374151" />
          <Text className="ml-2 text-sm font-semibold text-gray-700">
            Remind
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center px-5 py-3 bg-gray-100 rounded-2xl">
          <Ionicons name="pie-chart-outline" size={20} color="#374151" />
          <Text className="ml-2 text-sm font-semibold text-gray-700">
            Budget
          </Text>
        </TouchableOpacity>
      </View>

      {/* Latest Entries */}
      <View className="px-5 py-6 mt-2 mb-20 bg-white">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-gray-800">
            Latest Entries
          </Text>
          <Link href="/transactions" asChild>
            <TouchableOpacity className="p-2">
              <Ionicons name="ellipsis-horizontal" size={24} color="#6b7280" />
            </TouchableOpacity>
          </Link>
        </View>

        {transactions.length === 0 ? (
          <View className="items-center py-8">
            <Ionicons name="document-text-outline" size={48} color="#9ca3af" />
            <Text className="mt-2 text-gray-500">No transactions yet</Text>
            <Text className="text-sm text-gray-400">
              Add your first transaction
            </Text>
          </View>
        ) : (
          transactions.map((entry, index) => {
            const iconData = getIconByCategory(entry.category, entry.type);
            return (
              <View
                key={entry.id}
                className={`flex-row items-center justify-between py-4 ${
                  index !== transactions.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <View className="flex-row items-center flex-1">
                  <View
                    className="items-center justify-center w-12 h-12 mr-3 rounded-2xl"
                    style={{ backgroundColor: iconData.bg }}
                  >
                    <Ionicons
                      name={iconData.icon}
                      size={24}
                      color={iconData.color}
                    />
                  </View>
                  <View>
                    <Text className="font-semibold text-gray-800">
                      {entry.category}
                    </Text>
                    <Text className="text-xs text-gray-400">
                      {entry.date.toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </Text>
                  </View>
                </View>

                <View className="items-end">
                  <Text
                    className={`font-bold ${
                      entry.type === "expense"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {entry.type === "expense" ? "-" : "+"} Rp{" "}
                    {entry.amount.toLocaleString("id-ID")}
                  </Text>
                  {entry.payment && (
                    <Text className="text-xs text-gray-400">
                      {entry.payment}
                    </Text>
                  )}
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}
