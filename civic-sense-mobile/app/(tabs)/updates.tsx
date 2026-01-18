import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const GOV_BLUE = "#1E40AF";
const CARD_BG = "#F8FAFC";
const BORDER_COLOR = "#CBD5E1";
const TEXT_MUTED = "#64748B";

type UpdateItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "resolved" | "progress" | "received";
};

const updates: UpdateItem[] = [
  {
    id: "1",
    title: "Issue Resolved",
    description:
      'Your report "Garbage overflow at Park Corner" has been resolved.',
    time: "2 hours ago",
    type: "resolved",
  },
  {
    id: "2",
    title: "Status Update",
    description:
      '"Large pothole on Main Street" is now in progress.',
    time: "5 hours ago",
    type: "progress",
  },
  {
    id: "3",
    title: "Report Received",
    description:
      'Thank you for reporting "Water leak on Elm Street".',
    time: "1 day ago",
    type: "received",
  },
];

function StatusIcon({ type }: { type: UpdateItem["type"] }) {
  if (type === "resolved") {
    return (
      <View style={[styles.iconCircle, { backgroundColor: "#DCFCE7" }]}>
        <Ionicons name="checkmark" size={18} color="#16A34A" />
      </View>
    );
  }

  if (type === "progress") {
    return (
      <View style={[styles.iconCircle, { backgroundColor: "#E0F2FE" }]}>
        <Ionicons name="refresh" size={18} color="#0284C7" />
      </View>
    );
  }

  return (
    <View style={[styles.iconCircle, { backgroundColor: "#FEF3C7" }]}>
      <Ionicons name="alert" size={18} color="#D97706" />
    </View>
  );
}

function UpdateCard({ item }: { item: UpdateItem }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <StatusIcon type={item.type} />

        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDesc}>{item.description}</Text>

          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={14} color={TEXT_MUTED} />
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
        </View>
      </View>

      <View style={styles.dot} />
    </View>
  );
}

export default function UpdatesScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        {/* App Name */}
        <Text style={styles.appName}>UrbanCity</Text>

        {/* Location */}
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={16} color={TEXT_MUTED} />
          <Text style={styles.locationText}>Mumbai, India</Text>
        </View>

        {/* Section Label */}
        <Text style={styles.sectionTitle}>Updates</Text>
      </View>

      {/* List */}
      <FlatList
        data={updates}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <UpdateCard item={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 18, // 👈 space before list
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  appName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  locationText: {
    marginLeft: 6,
    fontSize: 14,
    color: TEXT_MUTED,
  },

  sectionTitle: {
    marginTop: 14,
    fontSize: 26,
    fontWeight: "600",
    color: GOV_BLUE, // blue for now
  },

  list: {
    padding: 16,
    paddingTop: 12,
  },

  card: {
    backgroundColor: CARD_BG,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    padding: 14,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cardLeft: {
    flexDirection: "row",
    flex: 1,
  },

  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  cardText: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },

  cardDesc: {
    marginTop: 4,
    fontSize: 14,
    color: TEXT_MUTED,
    lineHeight: 20,
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  timeText: {
    marginLeft: 6,
    fontSize: 13,
    color: TEXT_MUTED,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: GOV_BLUE,
    marginTop: 6,
    marginLeft: 10,
  },
});
