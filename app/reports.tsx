import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function Reports() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showMonthModal, setShowMonthModal] = useState(false);

  // Format bulan untuk display
  const formatMonth = (date: Date) => {
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Generate list bulan untuk modal (12 bulan terakhir)
  const generateMonthsList = () => {
    const months = [];
    const currentDate = new Date();

    for (let i = 0; i < 12; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      months.push({
        date: date,
        label: formatMonth(date),
      });
    }
    return months;
  };

  const monthsList = generateMonthsList();

  // Data dummy untuk laporan
  const monthlyData = {
    totalIncome: 8500000,
    totalExpense: 3950000,
    balance: 4550000,
    savings: 53.5, // persentase
  };

  // Data kategori pengeluaran
  const expenseByCategory = [
    {
      name: "Food",
      amount: 1500000,
      color: "#ef4444",
      legendFontColor: "#333",
    },
    {
      name: "Transport",
      amount: 800000,
      color: "#f59e0b",
      legendFontColor: "#333",
    },
    {
      name: "Shopping",
      amount: 600000,
      color: "#8b5cf6",
      legendFontColor: "#333",
    },
    {
      name: "Bills",
      amount: 750000,
      color: "#3b82f6",
      legendFontColor: "#333",
    },
    {
      name: "Other",
      amount: 300000,
      color: "#6b7280",
      legendFontColor: "#333",
    },
  ];

  // Data transaksi terakhir
  const recentTransactions = [
    {
      id: "1",
      type: "expense",
      category: "Food",
      amount: 150000,
      date: "Nov 2",
    },
    {
      id: "2",
      type: "income",
      category: "Salary",
      amount: 5000000,
      date: "Nov 1",
    },
    {
      id: "3",
      type: "expense",
      category: "Transport",
      amount: 50000,
      date: "Oct 31",
    },
    {
      id: "4",
      type: "expense",
      category: "Shopping",
      amount: 300000,
      date: "Oct 30",
    },
    {
      id: "5",
      type: "income",
      category: "Bonus",
      amount: 1000000,
      date: "Oct 28",
    },
  ];

  const chartConfig = {
    color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
  };

  function onChangeDate(_: any, selected?: Date) {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (selected) {
      setSelectedDate(selected);
    }
  }

  const renderTransaction = ({ item }: any) => (
    <View className="flex-row items-center justify-between p-4 mb-3 bg-gray-50 rounded-xl">
      <View className="flex-row items-center flex-1">
        <View
          className={`w-10 h-10 rounded-full items-center justify-center ${
            item.type === "income" ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <Ionicons
            name={item.type === "income" ? "arrow-down" : "arrow-up"}
            size={20}
            color={item.type === "income" ? "#16a34a" : "#ef4444"}
          />
        </View>
        <View className="ml-3">
          <Text className="font-semibold text-gray-800">{item.category}</Text>
          <Text className="text-sm text-gray-500">{item.date}</Text>
        </View>
      </View>
      <Text
        className={`font-semibold ${
          item.type === "income" ? "text-green-600" : "text-red-500"
        }`}
      >
        {item.type === "income" ? "+" : "-"}Rp {item.amount.toLocaleString()}
      </Text>
    </View>
  );

  return (
    <ScrollView className="flex-1 px-5 pt-10 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <Link href=".." asChild>
          <TouchableOpacity className="p-2">
            <Ionicons name="arrow-back" size={28} color="#16a34a" />
          </TouchableOpacity>
        </Link>

        <Text className="text-2xl font-bold text-green-600">
          Laporan Bulanan
        </Text>

        <TouchableOpacity
          className="p-2"
          onPress={() => setShowMonthModal(true)}
        >
          <Ionicons name="calendar-outline" size={28} color="#16a34a" />
        </TouchableOpacity>
      </View>

      {/* Periode */}
      <TouchableOpacity
        onPress={() => setShowMonthModal(true)}
        className="p-4 mb-6 bg-green-100 rounded-2xl"
      >
        <Text className="text-sm text-center text-gray-600">Periode</Text>
        <Text className="text-xl font-bold text-center text-green-700">
          {formatMonth(selectedDate)}
        </Text>
      </TouchableOpacity>

      {/* Summary Cards */}
      <View className="flex-row justify-between mb-6">
        <View className="flex-1 p-4 mr-2 bg-white shadow rounded-2xl">
          <Text className="text-gray-600">Income</Text>
          <Text className="mt-1 text-lg font-bold text-green-600">
            Rp {monthlyData.totalIncome.toLocaleString()}
          </Text>
        </View>
        <View className="flex-1 p-4 ml-2 bg-white shadow rounded-2xl">
          <Text className="text-gray-600">Expense</Text>
          <Text className="mt-1 text-lg font-bold text-red-500">
            Rp {monthlyData.totalExpense.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Balance & Savings */}
      <View className="p-5 mb-6 bg-white shadow rounded-2xl">
        <View className="flex-row items-center justify-between pb-4 mb-4 border-b border-gray-200">
          <Text className="text-gray-600">Net Balance</Text>
          <Text className="text-2xl font-bold text-green-700">
            Rp {monthlyData.balance.toLocaleString()}
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-gray-600">Savings Rate</Text>
          <View className="flex-row items-center">
            <View className="w-24 h-2 mr-3 overflow-hidden bg-gray-200 rounded-full">
              <View
                className="h-full bg-green-600"
                style={{ width: `${monthlyData.savings}%` }}
              />
            </View>
            <Text className="font-semibold text-green-700">
              {monthlyData.savings}%
            </Text>
          </View>
        </View>
      </View>

      {/* Expense by Category - Pie Chart */}
      <View className="p-4 mb-6 bg-white shadow rounded-2xl">
        <Text className="mb-3 text-lg font-semibold text-green-700">
          Pengeluaran per Kategori
        </Text>
        <PieChart
          data={expenseByCategory}
          width={screenWidth - 60}
          height={200}
          chartConfig={chartConfig}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      {/* Recent Transactions */}
      <View className="mb-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-semibold text-green-700">
            Transaksi Terakhir
          </Text>
          <TouchableOpacity>
            <Text className="text-green-600">Lihat Semua</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={recentTransactions}
          keyExtractor={(item) => item.id}
          renderItem={renderTransaction}
          scrollEnabled={false}
        />
      </View>

      {/* Export Button */}
      <TouchableOpacity className="py-4 mb-10 border-2 border-green-600 rounded-2xl">
        <View className="flex-row items-center justify-center">
          <Ionicons name="download-outline" size={20} color="#16a34a" />
          <Text className="ml-2 text-lg font-semibold text-green-600">
            Export Laporan
          </Text>
        </View>
      </TouchableOpacity>

      {/* Month Selection Modal */}
      <Modal
        visible={showMonthModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowMonthModal(false)}
      >
        <View className="justify-end flex-1 bg-black/50">
          <View
            className="p-5 bg-white rounded-t-2xl"
            style={{ maxHeight: "70%" }}
          >
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-gray-800">
                Pilih Periode
              </Text>
              <TouchableOpacity onPress={() => setShowMonthModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {monthsList.map((month, index) => (
                <Pressable
                  key={index}
                  onPress={() => {
                    setSelectedDate(month.date);
                    setShowMonthModal(false);
                  }}
                  className={`py-4 px-4 mb-2 rounded-xl ${
                    formatMonth(selectedDate) === month.label
                      ? "bg-green-100"
                      : "bg-gray-50"
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <Text
                      className={`text-base ${
                        formatMonth(selectedDate) === month.label
                          ? "text-green-700 font-semibold"
                          : "text-gray-700"
                      }`}
                    >
                      {month.label}
                    </Text>
                    {formatMonth(selectedDate) === month.label && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="#16a34a"
                      />
                    )}
                  </View>
                </Pressable>
              ))}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="py-4 mt-4 border-2 border-green-600 rounded-2xl"
            >
              <Text className="font-semibold text-center text-green-600">
                Pilih Bulan Lainnya
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChangeDate}
        />
      )}
    </ScrollView>
  );
}
