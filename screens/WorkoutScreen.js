import {
  Text,
  TextInput,
  FAB,
  Surface,
  Portal,
  Modal,
  Button,
} from "react-native-paper";
import * as SQLite from "expo-sqlite";
import { useState, useEffect } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import Constants from "expo-constants";
import { createStackNavigator } from "@react-navigation/stack";
import EditWorkoutScreen from "./EditWorkoutScreen";
import ViewWorkoutScreen from "./ViewWorkoutScreen";
import AddExerciseScreen from "./AddExerciseScreen";

const Stack = createStackNavigator();

function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }

  const db = SQLite.openDatabase("db.db", "1.0");
  return db;
}

const db = openDatabase();

function Workouts({ onPressItem, navigate: navigate }) {
  const [workouts, setWorkouts] = useState(null);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(`select * from Workout`, [], (_, { rows: { _array } }) => {
        setWorkouts(_array);
      });
    });
  }, []);

  if (workouts === null || workouts.length === 0) {
    return (
      <Text style={styles.noWorkoutsText}>Add a workout to get started!</Text>
    );
  }

  return (
    <View style={styles.sectionContainer}>
      {workouts.map(({ name, workout_id }) => (
        <Button
          key={workout_id}
          mode="elevated"
          onPress={() => navigate(workout_id)}
          style={{
            backgroundColor: "#f5f5f5",
            borderWidth: 1,
            borderRadius: 5,
            marginHorizontal: 32,
            marginVertical: 8,
          }}
        >
          <Text
            style={{
              height: 100,
              textAlignVertical: "center",
              fontSize: 24,
            }}
          >
            {name}
          </Text>
        </Button>
      ))}
    </View>
  );
}

export default function WorkoutScreen({ navigation }) {
  const [text, setText] = useState(null);
  const [visible, setVisible] = useState(false);
  const [forceUpdate, forceUpdateId] = useForceUpdate();

  const add = (text) => {
    // is text empty?
    if (text === null || text === "") {
      return false;
    }

    db.transaction(
      (tx) => {
        tx.executeSql(
          `INSERT INTO Workout (name) VALUES (?)`,
          [text],
          () => {
            console.log("Workout added!");
          },
          (error) => {
            console.log("Error on insering new workout: " + error);
          }
        );
      },
      (error) => {
        console.log(error);
      },
      forceUpdate
    );
  };

  return (
    <View style={styles.container}>
      <Surface elevation={0} style={styles.headerContainer}>
        <Text style={styles.heading}>Select A Workout</Text>
      </Surface>

      {Platform.OS === "web" ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={styles.heading}>
            Expo SQlite is not supported on web!
          </Text>
        </View>
      ) : (
        <>
          <FAB
            icon="plus"
            style={styles.fab}
            size="large"
            mode="elevated"
            onPress={() => setVisible(true)}
          />
          <Portal>
            <Modal
              visible={visible}
              onDismiss={() => setVisible(false)}
              contentContainerStyle={styles.modalStyle}
            >
              <TextInput
                onChangeText={(text) => setText(text)}
                onSubmitEditing={() => {
                  add(text);
                  setText(null);
                  setVisible(false);
                }}
                placeholder="Name"
                label="Workout name"
                value={text}
              />
              <View style={styles.modalButtonsContainer}>
                <Button
                  onPress={() => setVisible(false)}
                  mode="contained-tonal"
                >
                  Cancel
                </Button>
                <Button
                  onPress={() => {
                    setVisible(false);
                    add(text);
                    setText(null);
                  }}
                  mode="contained"
                >
                  Add
                </Button>
              </View>
            </Modal>
          </Portal>
          <View style={styles.flexRow}></View>
          <ScrollView style={styles.listArea}>
            <Workouts
              key={`forceupdate-done-${forceUpdateId}`}
              navigate={(workout_id) => {
                navigation.navigate("ViewWorkout", {
                  workout_id: workout_id,
                });
              }}
            />
          </ScrollView>
        </>
      )}
    </View>
  );
}

function WorkoutCringeScreen() {
  return (
    <Stack.Navigator>
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
  );
}

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return [() => setValue(value + 1), value];
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  flexRow: {
    flexDirection: "row",
  },
  input: {
    borderColor: "#4630eb",
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    height: 48,
    margin: 16,
    padding: 8,
  },
  listArea: {
    backgroundColor: "#f0f0f0",
    flex: 1,
    paddingTop: 16,
  },
  sectionContainer: {
    paddingBottom: 64,
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 18,
    marginBottom: 8,
  },
  noWorkoutsText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 10,
  },
  fab: {
    position: "absolute",
    margin: 10,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  modalStyle: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 10,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  headerContainer: {
    zIndex: 1,
    paddingVertical: 8,
  },
});
