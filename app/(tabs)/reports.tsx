import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useAuth } from "../../context/AuthContext";
import {
  getTotalExpense,
  getTotalIncome,
  getUserTransactions,
  Transaction,
} from "../../services/transactionService";

export default function Reports() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<
    "week" | "month" | "year"
  >("month");

  const screenWidth = Dimensions.get("window").width;

  async function loadData() {
    if (!user) return;

    try {
      setLoading(true);
      const [transactionsData, income, expense] = await Promise.all([
        getUserTransactions(user.uid),
        getTotalIncome(user.uid),
        getTotalExpense(user.uid),
      ]);

      setTransactions(transactionsData);
      setTotalIncome(income);
      setTotalExpense(expense);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [user]);

  // Hitung expense berdasarkan kategori
  const expenseByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, transaction) => {
        const category = transaction.category;
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += transaction.amount;
        return acc;
      },
      {} as { [key: string]: number }
    );

  const categoryData = Object.entries(expenseByCategory)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const categoryColors: { [key: string]: string } = {
    Food: "#ef4444",
    Transport: "#3b82f6",
    Shopping: "#10b981",
    Entertainment: "#ec4899",
    Bills: "#f59e0b",
    Other: "#6b7280",
  };

  // Format data untuk PieChart
  const pieChartData = categoryData.map((item) => ({
    name: item.category,
    population: item.amount,
    color: categoryColors[item.category] || "#6b7280",
    legendFontColor: "#374151",
    legendFontSize: 12,
  }));

  if (loading) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-5 pt-12 pb-6 bg-white">
        <Text className="text-2xl font-bold text-gray-800">
          Financial Reports
        </Text>
        <Text className="mt-1 text-sm text-gray-500">
          Track your spending habits
        </Text>
      </View>

      {/* Period Selector */}
      <View className="flex-row px-5 py-4 bg-white">
        {(["week", "month", "year"] as const).map((period) => (
          <TouchableOpacity
            key={period}
            onPress={() => setSelectedPeriod(period)}
            className={`flex-1 py-3 mx-1 rounded-2xl ${
              selectedPeriod === period ? "bg-blue-600" : "bg-gray-100"
            }`}
          >
            <Text
              className={`text-center font-semibold capitalize ${
                selectedPeriod === period ? "text-white" : "text-gray-700"
              }`}
            >
              {period}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Summary Cards */}
      <View className="px-5 py-6 mt-2 bg-white">
        <Text className="mb-4 text-lg font-bold text-gray-800">Summary</Text>

        <View className="flex-row mb-4">
          <View className="flex-1 p-4 mr-2 bg-green-100 rounded-2xl">
            <Text className="mb-1 text-xs text-green-700">Income</Text>
            <Text className="text-lg font-bold text-green-700">
              Rp {totalIncome.toLocaleString("id-ID")}
            </Text>
          </View>
          <View className="flex-1 p-4 ml-2 bg-red-100 rounded-2xl">
            <Text className="mb-1 text-xs text-red-700">Expense</Text>
            <Text className="text-lg font-bold text-red-700">
              Rp {totalExpense.toLocaleString("id-ID")}
            </Text>
          </View>
        </View>

        <View className="p-4 bg-blue-100 rounded-2xl">
          <Text className="mb-1 text-xs text-blue-700">Total Balance</Text>
          <Text className="text-xl font-bold text-blue-700">
            Rp {(totalIncome - totalExpense).toLocaleString("id-ID")}
          </Text>
        </View>
      </View>

      {/* Expense by Category - Pie Chart */}
      <View className="px-5 py-6 mt-2 bg-white">
        <Text className="mb-4 text-lg font-bold text-gray-800">
          Expense by Category
        </Text>

        {categoryData.length === 0 ? (
          <View className="items-center py-8">
            <Ionicons name="pie-chart-outline" size={48} color="#9ca3af" />
            <Text className="mt-2 text-gray-500">No expense data yet</Text>
          </View>
        ) : (
          <>
            <PieChart
              data={pieChartData}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              center={[10, 0]}
              absolute
            />

            {/* Category List with Progress Bars */}
            <View className="mt-6">
              {categoryData.map((item, index) => (
                <View key={index} className="mb-4">
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center">
                      <View
                        className="w-3 h-3 mr-2 rounded-full"
                        style={{
                          backgroundColor:
                            categoryColors[item.category] || "#6b7280",
                        }}
                      />
                      <Text className="font-semibold text-gray-800">
                        {item.category}
                      </Text>
                    </View>
                    <Text className="text-sm text-gray-600">
                      {item.percentage.toFixed(1)}%
                    </Text>
                  </View>
                  <View className="h-2 overflow-hidden bg-gray-200 rounded-full">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor:
                          categoryColors[item.category] || "#6b7280",
                      }}
                    />
                  </View>
                  <Text className="mt-1 text-xs text-gray-500">
                    Rp {item.amount.toLocaleString("id-ID")}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>

      {/* Recent Transactions */}
      <View className="px-5 py-6 mt-2 mb-20 bg-white">
        <Text className="mb-4 text-lg font-bold text-gray-800">
          Recent Transactions
        </Text>

        {transactions.slice(0, 10).map((transaction, index) => (
          <View
            key={transaction.id}
            className={`flex-row items-center justify-between py-3 ${
              index !== Math.min(9, transactions.length - 1)
                ? "border-b border-gray-100"
                : ""
            }`}
          >
            <View>
              <Text className="font-semibold text-gray-800">
                {transaction.category}
              </Text>
              <Text className="text-xs text-gray-400">
                {transaction.date.toLocaleDateString("id-ID")}
              </Text>
            </View>
            <Text
              className={`font-bold ${
                transaction.type === "expense"
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {transaction.type === "expense" ? "-" : "+"} Rp{" "}
              {transaction.amount.toLocaleString("id-ID")}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
