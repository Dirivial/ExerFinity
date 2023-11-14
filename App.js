import "react-native-gesture-handler";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider, BottomNavigation } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import HomeScreen from "./screens/HomeScreen";
import WorkoutScreen from "./screens/WorkoutScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { createStackNavigator } from "@react-navigation/stack";
import EditWorkoutScreen from "./screens/EditWorkoutScreen";
import ViewWorkoutScreen from "./screens/ViewWorkoutScreen";
import AddExerciseScreen from "./screens/AddExerciseScreen";
import WorkoutListScreen from "./screens/WorkoutScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="HomeNav"
            options={{
              headerShown: false,
            }}
            component={HomeNavigation}
          />
          <Stack.Screen
            options={{
              headerShown: false,
            }}
            name="WorkoutList"
            component={WorkoutListScreen}
          />
          <Stack.Screen
            name="ViewWorkout"
            options={{ title: "Workout" }}
            component={ViewWorkoutScreen}
          />
          <Stack.Screen
            name="CreateWorkout"
            options={{ title: "Workout" }}
            component={EditWorkoutScreen}
          />
          <Stack.Screen
            name="AddExercise"
            options={{ title: "Add Exercise" }}
            component={AddExerciseScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

function HomeNavigation() {
  return (
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
  );
}
