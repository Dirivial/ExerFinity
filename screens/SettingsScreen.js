import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text, TextInput, Button, RadioButton } from "react-native-paper";
import * as SQLite from "expo-sqlite";
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

function SyncToDB(field, value) {
  // Sync a piece of information to the local database
  if (value === null) return;
  db.transaction(
    (tx) => {
      tx.executeSql(
        "UPDATE User SET " + field + " = ? WHERE user_id = 0",
        [value],
        (_, { rows }) => {
          console.log(JSON.stringify(rows));
        }
      );
    },
    () => console.log("Error"),
    () => console.log("Success")
  );
}

export default function SettingsScreen() {
  const [username, setUsername] = useState(""); // Replace with current user's data
  const [email, setEmail] = useState(""); // Replace with current user's data
  const [dateOfBirth, setDateOfBirth] = useState(""); // Replace with current user's data
  const [gender, setGender] = useState(""); // Replace with current user's data
  const [height, setHeight] = useState(""); // Replace with current user's data
  const [metricHeight, setMetricHeight] = useState(true); // Replace with current user's data
  const [weight, setWeight] = useState(""); // Replace with current user's data
  const [metricWeight, setMetricWeight] = useState(true); // Replace with current user's data

  const runSetup = () => {
    console.log("Running setup");
    db.transaction(
      (tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS User (user_id INTEGER PRIMARY KEY,username TEXT,email TEXT,password TEXT,date_of_birth DATE,gender TEXT,height REAL, metric_height BOOL,weight REAL, metric_weight BOOL);"
        );
        tx.executeSql("INSERT OR IGNORE INTO User (user_id) VALUES (?)", [0]);
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS Workout (workout_id INTEGER PRIMARY KEY,date DATE,duration INTEGER,calories_burned INTEGER);"
        );
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS Exercise (exercise_id INTEGER PRIMARY KEY,name TEXT,description TEXT,category TEXT,equipment_required TEXT);"
        );
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS ExerciseInstance (instance_id INTEGER PRIMARY KEY,workout_id INTEGER REFERENCES Workout(workout_id),exercise_id INTEGER REFERENCES Exercise(exercise_id),sets INTEGER,reps INTEGER,duration INTEGER,order_in_workout INTEGER);"
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
      (error) => console.log(error),
      () => console.log("Success")
    );
  };

  const getAll = () => {
    console.log("Getting all");
    db.transaction(
      (tx) => {
        tx.executeSql("SELECT * FROM User", [], (_, { rows }) =>
          console.log(JSON.stringify(rows))
        );
      },
      (error) => console.log(error),
      () => console.log("Success")
    );
  };

  const wipeData = () => {
    console.log("Wiping data");
    db.transaction(
      (tx) => {
        tx.executeSql("DROP TABLE IF EXISTS User");
        tx.executeSql("DROP TABLE IF EXISTS Workout");
        tx.executeSql("DROP TABLE IF EXISTS Exercise");
        tx.executeSql("DROP TABLE IF EXISTS ExerciseInstance");
        tx.executeSql("DROP TABLE IF EXISTS SuperSet");
        tx.executeSql("DROP TABLE IF EXISTS SuperSetExercise");
        tx.executeSql("DROP TABLE IF EXISTS Progress");
      },
      (error) => console.log(error),
      () => console.log("Success")
    );
  };

  useEffect(() => {
    runSetup();
    db.transaction((tx) => {
      // Get the user's information from the database
      tx.executeSql(
        "SELECT * FROM User WHERE user_id = (?)",
        [0],
        (_, { rows }) => {
          console.log(JSON.stringify(rows));
          setUsername(rows._array[0].username);
          setEmail(rows._array[0].email);
          setDateOfBirth(rows._array[0].date_of_birth);
          setHeight(
            rows._array[0].height != null
              ? rows._array[0].height.toString()
              : ""
          );
          setMetricHeight(rows._array[0].metric_height);
          setWeight(
            rows._array[0].weight != null
              ? rows._array[0].weight.toString()
              : ""
          );
          setMetricWeight(rows._array[0].metric_weight);
          setGender(rows._array[0].gender);
        }
      );
    });
  }, []);

  return (
    <ScrollView style={styles.settingsList}>
      <Text style={styles.heading} variant="headlineMedium">
        Information
      </Text>
      <TextInput
        label="Name"
        placeholder="Name"
        mode="outlined"
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          SyncToDB("username", text);
        }}
      />
      <TextInput
        label="Email"
        mode="outlined"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          SyncToDB("email", text);
        }}
      />

      <TextInput
        placeholder="Date of Birth"
        value={dateOfBirth}
        mode="outlined"
        onChangeText={(text) => {
          setDateOfBirth(text);
          SyncToDB("date_of_birth", text);
        }}
      />

      <TextInput
        placeholder="Gender"
        value={gender}
        mode="outlined"
        onChangeText={(text) => {
          setGender(text);
          SyncToDB("gender", text);
        }}
      />

      <View>
        <View style={styles.unitInput}>
          <TextInput
            style={styles.inputField}
            placeholder="Height"
            value={height}
            mode="outlined"
            onChangeText={(text) => {
              setHeight(text);
              SyncToDB("height", text);
            }}
          />
          <Text style={styles.unit}>{metricHeight ? "cm" : "in"}</Text>
        </View>

        <MetricImperialInput
          metric={metricHeight}
          setMetric={(value) => {
            setMetricHeight(value);
            SyncToDB("metric_height", value);
          }}
        />
      </View>
      <View>
        <View style={styles.unitInput}>
          <TextInput
            style={styles.inputField}
            placeholder="Weight"
            value={weight}
            mode="outlined"
            onChangeText={(text) => {
              setWeight(text);
              SyncToDB("weight", text);
            }}
          />
          <Text style={styles.unit}>{metricWeight ? "kg" : "lbs"}</Text>
        </View>

        <MetricImperialInput
          metric={metricWeight}
          setMetric={(value) => {
            setMetricWeight(value);
            SyncToDB("metric_weight", value);
          }}
        />
      </View>

      <Button onPress={() => wipeData()}>Wipe Data</Button>
      <Button onPress={() => runSetup()}>Run Setup</Button>
    </ScrollView>
  );
}

function MetricImperialInput({ metric, setMetric }) {
  const [checked, setChecked] = React.useState(metric ? "first" : "second");

  return (
    <View style={styles.unitSelection}>
      <View>
        <Text>Metric</Text>
        <RadioButton
          value="first"
          status={checked === "first" ? "checked" : "unchecked"}
          onPress={() => {
            setChecked("first");
            setMetric(true);
          }}
        />
      </View>

      <View>
        <Text>Imperial</Text>
        <RadioButton
          value="second"
          status={checked === "second" ? "checked" : "unchecked"}
          onPress={() => {
            setChecked("second");
            setMetric(false);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  settingsList: {
    flex: 1,
    flexDirection: "column",
    rowGap: 0,
    paddingTop: Constants.statusBarHeight,
    paddingHorizontal: 10,
  },
  listItem: {
    marginVertical: 0,
  },
  unit: {
    alignSelf: "center",
    paddingLeft: 5,
    width: 30,
  },
  inputField: {
    flex: 1,
  },
  unitInput: {
    flexDirection: "row",
    alignItems: "end",
  },
  unitSelection: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  heading: {
    fontWeight: "bold",
    textAlign: "center",
  },
});
