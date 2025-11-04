import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Add() {
  return (
    <View className="items-center justify-center flex-1 px-5 bg-white">
      <Text className="mb-8 text-2xl font-bold text-gray-800">
        Add Transaction
      </Text>

      <Link href="/add-expense" asChild>
        <TouchableOpacity className="flex-row items-center justify-center w-full px-6 py-4 mb-4 bg-red-500 rounded-2xl">
          <Ionicons name="remove-circle" size={24} color="white" />
          <Text className="ml-2 text-lg font-semibold text-white">
            Add Expense
          </Text>
        </TouchableOpacity>
      </Link>

      <Link href="/add-income" asChild>
        <TouchableOpacity className="flex-row items-center justify-center w-full px-6 py-4 bg-blue-600 rounded-2xl">
          <Ionicons name="add-circle" size={24} color="white" />
          <Text className="ml-2 text-lg font-semibold text-white">
            Add Income
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
