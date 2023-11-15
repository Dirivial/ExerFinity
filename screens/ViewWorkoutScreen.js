import {
  Text,
  TextInput,
  FAB,
  Surface,
  Portal,
  Modal,
  Button,
  Icon,
  IconButton,
  MD3Colors,
} from "react-native-paper";
import * as SQLite from "expo-sqlite";
import { useState, useEffect, useCallback } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import Constants from "expo-constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TimePickerModal } from "react-native-paper-dates";

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

function ExerciseList({ onPressItem, exercises, exerciseInstances }) {
  return (
    <View>
      {exerciseInstances.map((exercise, index) => {
        let e = exercises.find((e) => e.exercise_id === exercise.exercise_id);
        const reps = JSON.parse(exercise.reps);
        const sets = [];
        for (let i = 0; i < exercise.set_count; i++) {
          sets.push(reps[i]);
        }
        return (
          e && (
            <Surface
              key={index}
              elevation={1}
              style={styles.exerciseItemContainer}
            >
              <Text variant="bodyLarge" style={styles.itemHeader}>
                {e.name}
              </Text>
              <Text variant="bodySmall" style={styles.itemHeader}>
                {e.description}
              </Text>

              <View style={styles.restRow}>
                <Button icon="timer-outline">
                  Rest Time {exercise.rest ? exercise.rest : "0"}s
                </Button>
              </View>

              <View>
                {sets.map((set, index) => {
                  return (
                    <View key={index} style={styles.setRow}>
                      <Text variant="bodySmall" style={styles.setNumber}>
                        Set {index + 1}
                      </Text>
                      <Text variant="bodySmall" style={styles.setReps}>
                        {set} reps
                      </Text>
                    </View>
                  );
                })}
              </View>
            </Surface>
          )
        );
      })}
    </View>
  );
}

export default function ViewWorkoutScreen({ navigation, route }) {
  const [workoutData, setWorkoutData] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [exerciseInstances, setExerciseInstances] = useState([]);

  const [visible, setVisible] = useState(false);
  const onDismiss = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onConfirm = useCallback(
    ({ hours, minutes }) => {
      setVisible(false);
      console.log({ hours, minutes });
    },
    [setVisible]
  );

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from Workout where workout_id = ?`,
        [route.params.workout_id],
        (_, { rows: { _array } }) => {
          setWorkoutData(_array[0]);
        }
      );
    });
  }, []);

  useEffect(() => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "SELECT * FROM ExerciseInstance WHERE workout_id = ?",
          [route.params.workout_id],
          (_, { rows: { _array } }) => {
            if (_array.length != exerciseInstances.length) {
              // Reduce number of re-renders
              const sorted = _array.sort(
                (a, b) => a.order_in_workout - b.order_in_workout
              );
              console.log(sorted);
              setExerciseInstances(sorted);
            }
          }
        );
        tx.executeSql(
          "SELECT E.* FROM Exercise E JOIN ExerciseInstance EI ON E.exercise_id = EI.exercise_id WHERE EI.workout_id = ?",
          [route.params.workout_id],
          (_, { rows: { _array } }) => {
            // Reduce number of re-renders
            if (_array.length != exercises.length) {
              setExercises(_array);
            }
          }
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }, [route.params]);

  return (
    <View style={styles.container}>
      {workoutData && (
        <ScrollView>
          <Text variant="headlineMedium" style={styles.headline}>
            {workoutData.name}
          </Text>
          <Button mode="contained" style={styles.startWorkoutButton}>
            Start Workout
          </Button>
          <Text variant="headlineSmall" style={styles.headlineSmall}>
            Exercises
          </Text>
          <ExerciseList
            exercises={exercises}
            exerciseInstances={exerciseInstances}
          />
          <IconButton
            icon="plus"
            iconColor={MD3Colors.tertiary50}
            size={40}
            mode="contained"
            style={styles.addExerciseButton}
            onPress={() =>
              navigation.navigate("AddExercise", {
                workout_id: route.params.workout_id,
                num_exercises: exercises.length,
              })
            }
          />
        </ScrollView>
      )}
      <TimePickerModal
        visible={visible}
        onDismiss={onDismiss}
        onConfirm={onConfirm}
        hours={12}
        minutes={14}
      />
    </View>
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
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    paddingTop: Constants.statusBarHeight,
  },
  headline: {
    textAlign: "center",
    marginBottom: 16,
  },
  headlineSmall: {
    textAlign: "center",
    marginVertical: 16,
  },
  startWorkoutButton: {
    marginHorizontal: 32,
  },
  addExerciseButton: {
    alignSelf: "center",
    marginHorizontal: 32,
  },
  itemHeader: {
    marginHorizontal: 8,
    fontWeight: "bold",
  },
  itemDescription: {
    marginHorizontal: 8,
    fontWeight: "thin",
  },
  restRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 0,
  },
  setRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 0,
  },
  setNumber: {
    marginHorizontal: 8,
    fontWeight: "bold",
  },
  setReps: {
    marginHorizontal: 8,
    fontWeight: "thin",
  },
  exerciseItemContainer: {
    display: "flex",
    flexDirection: "column",
    //justifyContent: "space-between",
    alignItems: "left",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    padding: 8,
  },
});
