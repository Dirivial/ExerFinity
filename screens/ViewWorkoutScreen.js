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
import ExerciseComponent from "../components/ExerciseComponent";

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

function ExerciseList({
  onPressItem,
  exercises,
  exerciseInstances,
  updateSetsOfExercise,
  changeRestTime,
}) {
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
            <ExerciseComponent
              key={index}
              exerciseIndex={index}
              exercise={e}
              sets={sets}
              addSetAction={() => {
                updateSetsOfExercise(index, [
                  ...sets,
                  sets.length > 0 ? sets.at(-1) : 0,
                ]);
              }}
              updateSets={(sets) => {
                updateSetsOfExercise(index, sets);
              }}
              updateRestTime={() => {
                changeRestTime(index);
              }}
            />
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
            changeRestTime={(index) => {
              console.log(
                "I want to update the rest time of exercise nr: " + index
              );
            }}
            updateSetsOfExercise={(index, sets) => {
              console.log(
                "I want to update the sets of exercise nr: " + index + " to: "
              );
              console.log(sets);
            }}
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
});
