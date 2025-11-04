import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { addTransaction } from "../services/transactionService";

export default function AddIncome() {
  const router = useRouter();
  const { user } = useAuth();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date());
  const [payment, setPayment] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = ["Salary", "Bonus", "Investment", "Gift", "Other"];

  async function handleSave() {
    if (!user) {
      Alert.alert("Error", "Please login first");
      return;
    }

    if (!amount || !category) {
      Alert.alert("Error", "Please fill in amount and category");
      return;
    }

    const payload = {
      userId: user.uid,
      type: "income" as const,
      amount: parseFloat(amount),
      category,
      notes,
      date,
      payment: payment || "Bank Transfer",
    };

    setLoading(true);
    try {
      await addTransaction(payload);
      Alert.alert("Success", "Income added successfully");
      router.back();
    } catch (error) {
      console.error("Error saving income:", error);
      Alert.alert("Error", "Failed to save income");
    } finally {
      setLoading(false);
    }
  }

  function onChangeDate(_: any, selectedDate?: Date) {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20 }}
        className="pt-10"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Link href=".." asChild>
            <TouchableOpacity className="p-2">
              <Ionicons name="arrow-back" size={28} color="#16a34a" />
            </TouchableOpacity>
          </Link>

          <Text className="text-2xl font-bold text-green-600">Add Income</Text>

          <View style={{ width: 28 }} />
        </View>

        {/* Form */}
        <View className="p-5 mb-6 bg-white shadow rounded-2xl">
          <Text className="mb-2 text-gray-600">Amount</Text>
          <TextInput
            keyboardType="numeric"
            placeholder="0"
            value={amount}
            onChangeText={setAmount}
            className="p-3 mb-4 text-gray-700 border border-gray-200 rounded-lg"
          />

          <Text className="mb-2 text-gray-600">Category</Text>
          <TouchableOpacity
            onPress={() => setShowCategoryModal(true)}
            className="p-3 mb-4 border border-gray-200 rounded-lg"
          >
            <Text className="text-gray-700">
              {category ?? "Select category"}
            </Text>
          </TouchableOpacity>

          <Text className="mb-2 text-gray-600">Payment Method</Text>
          <TextInput
            placeholder="Bank Transfer, Cash, etc."
            value={payment}
            onChangeText={setPayment}
            className="p-3 mb-4 text-gray-700 border border-gray-200 rounded-lg"
          />

          <Text className="mb-2 text-gray-600">Date</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="p-3 mb-4 border border-gray-200 rounded-lg"
          >
            <Text className="text-gray-700">
              {date.toLocaleDateString("id-ID")}
            </Text>
          </TouchableOpacity>

          <Text className="mb-2 text-gray-600">Notes</Text>
          <TextInput
            placeholder="Add notes..."
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            className="p-3 mb-4 text-gray-700 border border-gray-200 rounded-lg"
          />

          <TouchableOpacity
            onPress={handleSave}
            disabled={loading}
            className={`py-4 mb-3 bg-green-600 rounded-2xl ${
              loading ? "opacity-50" : ""
            }`}
          >
            <Text className="font-semibold text-center text-white">
              {loading ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>

          <Link href=".." asChild>
            <TouchableOpacity className="py-3 border border-green-600 rounded-2xl">
              <Text className="font-semibold text-center text-green-600">
                Cancel
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>

      {/* Category modal */}
      <Modal
        visible={showCategoryModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View className="justify-end flex-1">
          <View className="p-4 bg-white shadow rounded-t-2xl">
            <Text className="mb-3 text-lg font-semibold">Select Category</Text>
            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setCategory(item);
                    setShowCategoryModal(false);
                  }}
                  className="py-3"
                >
                  <Text className="text-gray-700">{item}</Text>
                </Pressable>
              )}
              ItemSeparatorComponent={() => <View className="h-2" />}
            />
            <TouchableOpacity
              onPress={() => setShowCategoryModal(false)}
              className="py-3 mt-4 border border-gray-200 rounded-2xl"
            >
              <Text className="text-center text-gray-700">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Date picker */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChangeDate}
        />
      )}
    </KeyboardAvoidingView>
  );
}
