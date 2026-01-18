import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const GOV_BLUE = "#1E40AF";
const BG = "#F9FAFB";
const CARD = "#FFFFFF";
const MUTED = "#64748B";

const Profile = () => {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.topHeader}>
          <TouchableOpacity
            onPress={() => {
              if (router.canGoBack()) router.back();
              else router.replace("/");
            }}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={GOV_BLUE} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Profile Row */}
        <View style={styles.profileRow}>
          {/* Avatar */}
          <Image
            source={{
              uri: "https://ui-avatars.com/api/?name=Rahil+Shaikh&background=1E40AF&color=fff",
            }}
            style={styles.avatar}
          />

          {/* Right Side */}
          <View style={styles.profileInfo}>
            <Text style={styles.name}>Rahil Shaikh</Text>
            <Text style={styles.role}>Owner</Text>

            <View style={styles.locationRow}>
              <Ionicons
                name="location-outline"
                size={16}
                color={MUTED}
              />
              <Text style={styles.location}>Mumbai, India</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <StatItem label="Reports" value="12" />
          <StatItem label="Resolved" value="8" />
          <StatItem label="In Progress" value="4" />
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <ActionItem icon="document-text-outline" label="My Reports" />
          <ActionItem icon="settings-outline" label="Settings" />
          <ActionItem icon="help-circle-outline" label="Help & Support" />
        </View>
      </View>
    </SafeAreaView>
  );
};

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ActionItem({
  icon,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
      <View style={styles.actionLeft}>
        <Ionicons name={icon} size={20} color={GOV_BLUE} />
        <Text style={styles.actionText}>{label}</Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color={MUTED} />
    </TouchableOpacity>
  );
}

export default Profile;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },

  container: {
    flex: 1,
    padding: 20,
     paddingHorizontal: 20,
  paddingBottom: 20,
  paddingTop: 36,
  },

  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  backButton: {
    width: 40,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginRight: 16,
  },

  profileInfo: {
    flex: 1,
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },

  role: {
    marginTop: 4,
    fontSize: 14,
    color: MUTED,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  location: {
    marginLeft: 6,
    fontSize: 14,
    color: MUTED,
  },

  statsCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: CARD,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 24,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
  },

  statItem: {
    flex: 1,
    alignItems: "center",
  },

  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: GOV_BLUE,
  },

  statLabel: {
    marginTop: 4,
    fontSize: 12,
    color: MUTED,
  },

  actions: {
    backgroundColor: CARD,
    borderRadius: 14,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
  },

  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  actionText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#0F172A",
  },
});
