import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";

const GOV_BLUE = "#3B82F6";
const INACTIVE_ICON = "#9CA3AF";
const TAB_BG = "#FFFFFF";

function TabIcon({
  icon,
  label,
  focused,
  type = "ion",
}: {
  icon: string;
  label: string;
  focused: boolean;
  type?: "ion" | "fa";
}) {
  return (
    <View style={styles.tabItem}>
      {type === "ion" ? (
        <Ionicons
          name={icon as any}
          size={24}
          color={focused ? GOV_BLUE : INACTIVE_ICON}
        />
      ) : (
        <FontAwesome
          name={icon as any}
          size={22}
          color={focused ? GOV_BLUE : INACTIVE_ICON}
        />
      )}

      <Text
        style={[
          styles.tabLabel,
          { color: focused ? GOV_BLUE : INACTIVE_ICON },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: "absolute",
          bottom: 18,
          left: 16,
          right: 16,
          height: 68,
          backgroundColor: TAB_BG,
          borderRadius: 30,

          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowOffset: { width: 0, height: 10 },
          shadowRadius: 20,
          elevation: 14,
        },
        tabBarItemStyle: {
          marginTop: 10,
        },
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={focused ? "home" : "home-outline"}
              label="Home"
              focused={focused}
            />
          ),
        }}
      />

      {/* Map */}
      <Tabs.Screen
        name="map"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={focused ? "map" : "map-outline"}
              label="Map"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
  name="addreport"
  options={{
    tabBarButton: ({ onPress, accessibilityState }) => (
      <Pressable
        onPress={onPress}
        accessibilityState={accessibilityState}
        style={styles.fabWrapper}
      >
        <View style={styles.fab}>
          <MaterialIcons name="add-a-photo" size={30} color="#fff" />
        </View>
      </Pressable>
    ),
  }}
/>


      {/* Updates */}
      <Tabs.Screen
        name="updates"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={focused ? "bell" : "bell-o"}
              label="Updates"
              focused={focused}
              type="fa"
            />
          ),
        }}
      />

      {/* Profile (hide tab bar) */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={focused ? "person" : "person-outline"}
              label="Profile"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    width: 76,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 6,
  },

  tabLabel: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "600",
  },

  fabWrapper: {
    top: -34, // wavy pop-out effect
    alignItems: "center",
  },

  fab: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: GOV_BLUE,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.28,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 20,
    elevation: 16,
  },
});
