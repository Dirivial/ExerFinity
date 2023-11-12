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

export default function EditWorkoutScreen({ navigation, route }) {
  const [workoutData, setWorkoutData] = useState(null);

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

  return (
    <View style={styles.container}>
      <Button onPress={() => navigation.goBack()}>
        Workout: {route.params.workout_id}
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
});
