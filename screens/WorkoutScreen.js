import { Text, TextInput } from "react-native-paper";
import * as SQLite from "expo-sqlite";
import { useState, useEffect } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
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

function Workouts({ done: doneHeading, onPressItem }) {
  const [workouts, setWorkouts] = useState(null);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from items where done = ?;`,
        [doneHeading ? 1 : 0],
        (_, { rows: { _array } }) => setWorkouts(_array)
      );
    });
  }, []);

  const heading = doneHeading ? "Completed" : "Todo";

  if (workouts === null || workouts.length === 0) {
    return null;
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeading}>{heading}</Text>
      {workouts.map(({ id, done, value }) => (
        <TouchableOpacity
          key={id}
          onPress={() => onPressItem && onPressItem(id)}
          style={{
            backgroundColor: done ? "#1c9963" : "#fff",
            borderColor: "#000",
            borderWidth: 1,
            padding: 8,
          }}
        >
          <Text style={{ color: done ? "#fff" : "#000" }}>{value}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function WorkoutScreen() {
  const [text, setText] = useState(null);
  const [forceUpdate, forceUpdateId] = useForceUpdate();

  const add = (text) => {
    // is text empty?
    if (text === null || text === "") {
      return false;
    }

    db.transaction(
      (tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS Workout (workout_id INTEGER PRIMARY KEY,date DATE,duration INTEGER,calories_burned INTEGER);"
        );
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS Exercise (exercise_id INTEGER PRIMARY KEY,name TEXT,description TEXT,category TEXT,equipment_required TEXT);"
        );
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS ExerciseInstance (instance_id INTEGER PRIMARY KEY,workout_id INTEGER REFERENCES Workout(workout_id),exercise_id INTEGER REFERENCES Exercise(exercise_id),sets INTEGER,reps INTEGER,duration INTEGER,order_in_workout INTEGER"
        );
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS SuperSet (superset_id INTEGER PRIMARY KEY,workout_id INTEGER REFERENCES Workout(workout_id),name TEXT,order_in_workout INTEGER);"
        );
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS SuperSetExercise (superset_id INTEGER REFERENCES SuperSet(superset_id),exercise_id INTEGER REFERENCES Exercise(exercise_id),order_in_superset INTEGER,PRIMARY KEY (superset_id, exercise_id));"
        );
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS Progress (progress_id INTEGER PRIMARY KEY,user_id INTEGER REFERENCES User(user_id),exercise_id INTEGER REFERENCES Exercise(exercise_id),date DATE,weight REAL,reps_completed INTEGER,time_taken INTEGER);"
        );
      },
      null,
      forceUpdate
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>SQLite Example</Text>

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
          <View style={styles.flexRow}>
            <TextInput
              onChangeText={(text) => setText(text)}
              onSubmitEditing={() => {
                add(text);
                setText(null);
              }}
              placeholder="what do you need to do?"
              style={styles.input}
              value={text}
            />
          </View>
          <ScrollView style={styles.listArea}></ScrollView>
        </>
      )}
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
    marginBottom: 16,
    marginHorizontal: 16,
  },
  sectionHeading: {
    fontSize: 18,
    marginBottom: 8,
  },
});
