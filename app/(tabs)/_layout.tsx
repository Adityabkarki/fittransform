import { Tabs } from "expo-router";
import { C } from "../../constants/theme";
import { Text } from "react-native";

function TabIcon({ label, emoji, focused }: { label: string; emoji: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: C.panel,
          borderTopColor: C.line,
          borderTopWidth: 1,
          paddingBottom: 8,
          height: 60,
        },
        tabBarActiveTintColor: C.amber,
        tabBarInactiveTintColor: C.faint,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Today",
          tabBarIcon: ({ focused }) => <TabIcon label="Today" emoji="🏋️" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: "Plan",
          tabBarIcon: ({ focused }) => <TabIcon label="Plan" emoji="📋" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarIcon: ({ focused }) => <TabIcon label="Progress" emoji="📈" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="diet"
        options={{
          title: "Diet",
          tabBarIcon: ({ focused }) => <TabIcon label="Diet" emoji="🍛" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
