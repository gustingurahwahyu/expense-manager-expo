import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
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

export default function Addexpense() {
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date());
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const categories = [
    "Food",
    "Transport",
    "Shopping",
    "Entertainment",
    "Bills",
    "Salary",
    "Other",
  ];

  function handleSave() {
    // Simple save action - replace with real persistence
    const payload = {
      amount: parseFloat(amount) || 0,
      category,
      notes,
      date: date.toISOString(),
    };
    console.log("Saving transaction:", payload);
    router.back();
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

          <Text className="text-2xl font-bold text-green-600">
            Tambah Pengeluaran
          </Text>

          {/* placeholder agar header rata */}
          <View style={{ width: 28 }} />
        </View>

        {/* Form */}
        <View className="p-5 mb-6 bg-white shadow rounded-2xl">
          <Text className="mb-2 text-gray-600">Amount</Text>
          <TextInput
            keyboardType="numeric"
            placeholder="Rp 0"
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
              {category ?? "Pilih kategori"}
            </Text>
          </TouchableOpacity>

          <Text className="mb-2 text-gray-600">Date</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="p-3 mb-4 border border-gray-200 rounded-lg"
          >
            <Text className="text-gray-700">{date.toLocaleDateString()}</Text>
          </TouchableOpacity>

          <Text className="mb-2 text-gray-600">Notes</Text>
          <TextInput
            placeholder="Catatan..."
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            className="p-3 mb-4 text-gray-700 border border-gray-200 rounded-lg"
          />

          <TouchableOpacity
            onPress={handleSave}
            className="py-4 mb-3 bg-green-600 rounded-2xl"
          >
            <Text className="font-semibold text-center text-white">Save</Text>
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
            <Text className="mb-3 text-lg font-semibold">Pilih Kategori</Text>
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
