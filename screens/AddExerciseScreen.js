import {
  Text,
  TextInput,
  Surface,
  Portal,
  Modal,
  Button,
  Searchbar,
} from "react-native-paper";
import * as SQLite from "expo-sqlite";
import { useState, useEffect } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import Constants from "expo-constants";

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

function ExerciseItem({ exercise }) {
  return (
    <View style={styles.exerciseItem}>
      <Text variant="bodyMedium">{exercise.name}</Text>
    </View>
  );
}

// Takes a workout_id and a function to add a new exercise to the workout
export default function AddExerciseScreen({ navigation, route }) {
  const [exercises, setExercises] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(2);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(`select * from Exercise`, [], (_, { rows: { _array } }) => {
        setExercises(_array);
      });
    });
  }, []);

  useEffect(() => {
    console.log(exercises);
  }, [exercises]);

  return (
    <View style={styles.container}>
      <Searchbar
        style={styles.searchBar}
        onChangeText={(query) => setSearchQuery(query)}
      />
      <ScrollView>
        {exercises &&
          exercises.map((exercise) => {
            return <ExerciseItem exercise={exercise} />;
          })}
      </ScrollView>
      <Button
        onPress={() =>
          navigation.navigate("ViewWorkout", {
            workout_id: route.params.workout_id,
            selectedExercise: selectedExercise,
          })
        }
      >
        Back
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  searchBar: {
    margin: 10,
  },
  exerciseItem: {
    margin: 10,
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 10,
  },
});
