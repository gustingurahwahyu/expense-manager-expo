import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import {
  deleteTransaction,
  getUserTransactions,
  Transaction,
} from "../../services/transactionService";

export default function Transactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Icon mapping berdasarkan kategori
  const getIconByCategory = (category: string, type: string) => {
    const icons: { [key: string]: any } = {
      Food: { icon: "fast-food", bg: "#fee2e2", color: "#ef4444" },
      Transport: { icon: "car", bg: "#dbeafe", color: "#3b82f6" },
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
      const data = await getUserTransactions(user.uid);
      setTransactions(data);
    } catch (error) {
      console.error("Error loading transactions:", error);
      Alert.alert("Error", "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  async function handleDelete(transactionId: string) {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTransaction(transactionId);
              await loadData();
              Alert.alert("Success", "Transaction deleted successfully");
            } catch (error) {
              console.error("Error deleting transaction:", error);
              Alert.alert("Error", "Failed to delete transaction");
            }
          },
        },
      ]
    );
  }

  useEffect(() => {
    loadData();
  }, [user]);

  // Filter dan search transactions
  const filteredTransactions = transactions.filter((t) => {
    // Filter berdasarkan type
    const typeMatch = filter === "all" || t.type === filter;

    // Filter berdasarkan search query
    const searchMatch =
      searchQuery === "" ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.amount.toString().includes(searchQuery) ||
      (t.payment &&
        t.payment.toLowerCase().includes(searchQuery.toLowerCase()));

    return typeMatch && searchMatch;
  });

  // Group transactions by date
  const groupedTransactions = filteredTransactions.reduce(
    (acc, transaction) => {
      const dateKey = transaction.date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(transaction);
      return acc;
    },
    {} as { [key: string]: Transaction[] }
  );

  if (loading) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-5 pt-12 pb-4 bg-white">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold text-gray-800">Transactions</Text>
          <TouchableOpacity
            onPress={() => {
              setShowSearch(!showSearch);
              if (showSearch) {
                setSearchQuery("");
              }
            }}
            className="items-center justify-center w-10 h-10 bg-gray-100 rounded-full"
          >
            <Ionicons
              name={showSearch ? "close" : "search"}
              size={20}
              color="#374151"
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        {showSearch && (
          <View className="flex-row items-center p-3 mb-4 bg-gray-100 rounded-2xl">
            <Ionicons name="search" size={20} color="#9ca3af" />
            <TextInput
              placeholder="Search by category, notes, or amount..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-2 text-gray-800"
              autoFocus
            />
            {searchQuery !== "" && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Filter Tabs */}
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => setFilter("all")}
            className={`flex-1 py-3 mr-2 rounded-2xl ${
              filter === "all" ? "bg-blue-600" : "bg-gray-100"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                filter === "all" ? "text-white" : "text-gray-700"
              }`}
            >
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilter("income")}
            className={`flex-1 py-3 mx-1 rounded-2xl ${
              filter === "income" ? "bg-green-600" : "bg-gray-100"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                filter === "income" ? "text-white" : "text-gray-700"
              }`}
            >
              Income
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilter("expense")}
            className={`flex-1 py-3 ml-2 rounded-2xl ${
              filter === "expense" ? "bg-red-600" : "bg-gray-100"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                filter === "expense" ? "text-white" : "text-gray-700"
              }`}
            >
              Expense
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Results Info */}
        {searchQuery !== "" && (
          <View className="flex-row items-center mt-3">
            <Ionicons name="information-circle" size={16} color="#6b7280" />
            <Text className="ml-2 text-sm text-gray-600">
              Found {filteredTransactions.length} result
              {filteredTransactions.length !== 1 ? "s" : ""} for "{searchQuery}"
            </Text>
          </View>
        )}
      </View>

      {/* Transaction List */}
      <ScrollView
        className="flex-1 px-5 mb-20"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredTransactions.length === 0 ? (
          <View className="items-center py-12">
            <Ionicons name="document-text-outline" size={64} color="#9ca3af" />
            <Text className="mt-4 text-lg text-gray-500">
              {searchQuery ? "No transactions found" : "No transactions yet"}
            </Text>
            <Text className="mt-1 text-sm text-gray-400">
              {searchQuery
                ? `No results for "${searchQuery}"`
                : filter === "all"
                  ? "Start by adding a transaction"
                  : `No ${filter} transactions found`}
            </Text>
          </View>
        ) : (
          Object.entries(groupedTransactions).map(([date, items]) => (
            <View key={date} className="mb-6">
              {/* Date Header */}
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-sm font-semibold text-gray-500">
                  {date}
                </Text>
                <Text className="text-xs text-gray-400">
                  {items.length} transaction{items.length > 1 ? "s" : ""}
                </Text>
              </View>

              {/* Transaction Items */}
              {items.map((transaction) => {
                const iconData = getIconByCategory(
                  transaction.category,
                  transaction.type
                );

                return (
                  <TouchableOpacity
                    key={transaction.id}
                    onLongPress={() => handleDelete(transaction.id!)}
                    className="flex-row items-center justify-between py-4 border-b border-gray-100"
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

                      <View className="flex-1">
                        <Text className="font-semibold text-gray-800">
                          {transaction.category}
                        </Text>
                        <Text className="text-xs text-gray-400">
                          {transaction.notes || "No notes"}
                        </Text>
                        {transaction.payment && (
                          <Text className="text-xs text-gray-400">
                            {transaction.payment}
                          </Text>
                        )}
                      </View>
                    </View>

                    <View className="items-end">
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
                      <Text className="text-xs text-gray-400">
                        {transaction.date.toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))
        )}
      </ScrollView>

      {/* Summary Footer */}
      {filteredTransactions.length > 0 && (
        <View className="px-5 py-4 bg-white border-t border-gray-100">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-gray-500">
              {filteredTransactions.length} transaction
              {filteredTransactions.length > 1 ? "s" : ""}
            </Text>
            <Text className="text-sm font-semibold text-gray-700">
              Total:{" "}
              {filter === "all"
                ? "Rp " +
                  filteredTransactions
                    .reduce(
                      (sum, t) =>
                        sum + (t.type === "income" ? t.amount : -t.amount),
                      0
                    )
                    .toLocaleString("id-ID")
                : "Rp " +
                  filteredTransactions
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toLocaleString("id-ID")}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
