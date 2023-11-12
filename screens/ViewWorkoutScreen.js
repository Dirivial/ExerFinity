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
import { useState, useEffect } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import Constants from "expo-constants";
import Ionicons from "@expo/vector-icons/Ionicons";

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

function ExerciseItem() {
  return <View></View>;
}

function ExerciseList({ onPressItem, exercises }) {
  return (
    <View>
      {exercises.map((exercise) => {
        return <ExerciseItem exercise={exercise} />;
      })}
      <IconButton
        icon="plus"
        iconColor={MD3Colors.error50}
        size={20}
        onPress={() => console.log("Pressed")}
      />
    </View>
  );
}

export default function ViewWorkoutScreen({ navigation, route }) {
  const [workoutData, setWorkoutData] = useState(null);
  const [exercises, setExercises] = useState(null);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from Workout where workout_id = ?`,
        [route.params.workout_id],
        (_, { rows: { _array } }) => {
          console.log(_array[0]);
          setWorkoutData(_array[0]);
        }
      );
    });
  }, []);

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
          {exercises && <ExerciseList exercises={exercises} />}
          <IconButton
            icon="plus"
            iconColor={MD3Colors.error50}
            size={40}
            mode="contained"
            style={styles.addExerciseButton}
            onPress={() =>
              navigation.navigate("AddExercise", {
                workout_id: route.params.workout_id,
              })
            }
          />
        </ScrollView>
      )}
    </View>
  );
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
});
