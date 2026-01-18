import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const OPTIONS = ["All", "Reported", "In Progress", "Resolved"];

export default function StatusFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setOpen(!open)}
      >
        <Text style={styles.value}>{value}</Text>
        <Ionicons name="chevron-down" size={18} color="#374151" />
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdown}>
          {OPTIONS.map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.option}
              onPress={() => {
                onChange(item);
                setOpen(false);
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  value === item && styles.activeText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  value: {
    marginRight: 6,
    fontSize: 14,
    color: "#111827",
  },
  dropdown: {
    position: "absolute",
    top: 42,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    width: 150,
    zIndex: 100,
    elevation: 4,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  optionText: {
    fontSize: 14,
    color: "#374151",
  },
  activeText: {
    fontWeight: "600",
    color: "#2563EB",
  },
});
