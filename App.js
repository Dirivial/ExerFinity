import * as React from "react";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { PaperProvider, BottomNavigation, Text } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";

function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Home!</Text>
    </View>
  );
}

function WorkoutScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Workout!</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Settings!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
          }}
          tabBar={({ navigation, state, descriptors, insets }) => (
            <BottomNavigation.Bar
              navigationState={state}
              safeAreaInsets={insets}
              onTabPress={({ route, preventDefault }) => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });
                if (event.defaultPrevented) {
                  preventDefault();
                } else {
                  navigation.navigate(route.name);
                  /*
                  navigation.dispatch({
                    ...CommonActions.navigate(route.name, route.params),
                    target: state.key,
                  });*/
                }
              }}
              renderIcon={({ route, focused, color }) => {
                const { options } = descriptors[route.key];
                if (options.tabBarIcon) {
                  return options.tabBarIcon({ focused, color, size: 24 });
                }

                return null;
              }}
              getLabelText={({ route }) => {
                const { options } = descriptors[route.key];
                const label =
                  options.tabBarLabel !== undefined
                    ? options.tabBarLabel
                    : options.title !== undefined
                    ? options.title
                    : route.title;

                return label;
              }}
            />
          )}
        >
          <Tab.Screen
            name="Workout"
            component={WorkoutScreen}
            options={{
              tabBarLabel: "Workout",
              tabBarIcon: ({ color, size }) => {
                return (
                  <Ionicons name="barbell-outline" size={size} color={color} />
                );
              },
            }}
          />
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarLabel: "Home",
              tabBarIcon: ({ color, size }) => {
                return <Ionicons name="home" size={size} color={color} />;
              },
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              tabBarLabel: "Settings",
              tabBarIcon: ({ color, size }) => {
                return <Ionicons name="cog" size={size} color={color} />;
              },
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
