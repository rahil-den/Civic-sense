import { View, Text, FlatList, StyleSheet } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import IssueCard from "../../components/IssueCard";
import StatusFilter from "../../components/StatusFilter";
import { Ionicons } from "@expo/vector-icons";

const GOV_BLUE = "#2563EB";

const ISSUES = [
  {
    id: "1",
    title: "Large pothole on Main Street",
    category: "Road",
    distance: "0.3 km",
    status: "In Progress",
    daysAgo: "9 days ago",
    image:
      "https://images.unsplash.com/photo-1586864387789-628af9feed72",
  },
  {
    id: "2",
    title: "Broken streetlight on Oak Avenue",
    category: "Lighting",
    distance: "0.8 km",
    status: "Reported",
    daysAgo: "8 days ago",
    image:
      "https://images.unsplash.com/photo-1597764699513-5e48b3c9d673",
  },
  {
    id: "3",
    title: "Garbage overflow at Park Corner",
    category: "Sanitation",
    distance: "1.2 km",
    status: "Resolved",
    daysAgo: "11 days ago",
    image:
      "https://images.unsplash.com/photo-1581579185169-5f4f5a61b4dc",
  },
];

export default function HomeScreen() {
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredIssues =
    statusFilter === "All"
      ? ISSUES
      : ISSUES.filter((item) => item.status === statusFilter);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        {/* TOP HEADER */}
        <View style={styles.topRow}>
          <View>
            <Text style={styles.appName}>UrbanCity</Text>
            <View style={styles.locationRow}>
              <Ionicons
                name="location-outline"
                size={14}
                color="#6B7280"
              />
              <Text style={styles.locationText}>
                Mumbai, India
              </Text>
            </View>
          </View>

          <StatusFilter
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </View>

        {/* SPACER */}
        <View style={{ height: 16 }} />

        {/* SECTION TITLE */}
        <Text style={styles.sectionTitle}>
          Community Issues
        </Text>

        {/* LIST */}
        <FlatList
          data={filteredIssues}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <IssueCard issue={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },

  appName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  locationText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 4,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: GOV_BLUE,
    marginBottom: 12,
  },
});
