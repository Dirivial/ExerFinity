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

// Takes a workout_id and a function to add a new exercise to the workout
export default function AddExerciseScreen({ navigation, route }) {
  const [exercises, setExercises] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(`select * from Exercise`, [], (_, { rows: { _array } }) => {
        setExercises(_array[0]);
      });
    });
  }, []);

  return (
    <View style={styles.container}>
      {/*
          <Button onPress={() => navigation.goBack()}>
        back
      </Button>
    */}

      <Searchbar
        style={styles.searchBar}
        onChangeText={(query) => setSearchQuery(query)}
      />
      <ScrollView>
        {exercises
          ? exercises.map((exercise) => {
              <Text>exercise.name</Text>;
            })
          : null}
      </ScrollView>
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
});
