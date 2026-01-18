import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

export default function IssueCard({ issue }: any) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/issues/${issue.id}`)}
    >
      <Image source={{ uri: issue.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{issue.title}</Text>

        <Text style={styles.category}>{issue.category}</Text>

        <View style={styles.row}>
          <Text style={styles.meta}>{issue.distance}</Text>
          <Text style={styles.meta}>{issue.daysAgo}</Text>
        </View>
      </View>

      <View style={styles.statusContainer}>
        <Text
          style={[
            styles.status,
            issue.status === "In Progress" && styles.inProgress,
            issue.status === "Reported" && styles.reported,
            issue.status === "Resolved" && styles.resolved,
          ]}
        >
          {issue.status}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  category: {
    fontSize: 14,
    color: "#2563EB",
    marginVertical: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  meta: {
    fontSize: 12,
    color: "#6B7280",
  },
  statusContainer: {
    justifyContent: "center",
  },
  status: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    fontSize: 12,
    overflow: "hidden",
  },
  inProgress: {
    backgroundColor: "#DBEAFE",
    color: "#1D4ED8",
  },
  reported: {
    backgroundColor: "#FEF3C7",
    color: "#92400E",
  },
  resolved: {
    backgroundColor: "#DCFCE7",
    color: "#166534",
  },
});
