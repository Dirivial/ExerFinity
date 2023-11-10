import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
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

  const db = SQLite.openDatabase("db.db");
  return db;
}

const db = openDatabase();

export default function SettingsScreen() {
  const [userid, setUserid] = useState("0");
  const [username, setUsername] = useState(""); // Replace with current user's data
  const [email, setEmail] = useState(""); // Replace with current user's data
  const [dateOfBirth, setDateOfBirth] = useState(""); // Replace with current user's data
  const [gender, setGender] = useState(""); // Replace with current user's data
  const [height, setHeight] = useState(""); // Replace with current user's data
  const [weight, setWeight] = useState(""); // Replace with current user's data

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS User (user_id INTEGER PRIMARY KEY,username TEXT,email TEXT,password TEXT,date_of_birth DATE,gender TEXT,height REAL,weight REAL);"
      );
      tx.executeSql("INSERT INTO User (user_id) VALUES (?)", [0]);
    });
  }, []);

  const getAll = () => {
    console.log("Getting all");
    db.transaction(
      (tx) => {
        tx.executeSql("SELECT * FROM User", [], (_, { rows }) =>
          console.log(JSON.stringify(rows))
        );
      },
      () => console.log("Error"),
      () => console.log("Success")
    );
  };

  const getInformation = () => {
    console.log("Getting info");
    db.transaction((tx) => {
      // Get the user's information from the database
      tx.executeSql(
        "SELECT * FROM User WHERE user_id = (?)",
        [0],
        (_, { rows }) => {
          console.log(JSON.stringify(rows));
        }
      );
    });
  };

  const handleNameChange = (name) => {
    if (name === null) {
      return false;
    }

    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE User SET username = (?) WHERE user_id = (?)",
        [name, 0],
        (_, { rows }) => {
          console.log(JSON.stringify(rows));
        }
      );
    }, null);
    setUsername(name);
  };

  const handleEmailChange = () => {
    // Implement logic to save changes to the user table in the database
    // You might want to use an API call to update the user data on the server
    // and handle success or error accordingly
  };

  return (
    <View style={styles.settingsList}>
      <Text style={styles.heading} variant="headlineMedium">
        Information
      </Text>
      <TextInput
        label="uid"
        placeholder="uid"
        mode="outlined"
        value={userid}
        onChangeText={(text) => setUserid(text)}
      />
      <TextInput
        label="Name"
        placeholder="Name"
        mode="outlined"
        value={username}
        onChangeText={(text) => handleNameChange(text)}
      />
      <TextInput
        outlineStyle={styles.input}
        label="Email"
        mode="outlined"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />

      <TextInput
        placeholder="Date of Birth"
        value={dateOfBirth}
        mode="outlined"
        onChangeText={(text) => setDateOfBirth(text)}
      />

      <TextInput
        placeholder="Gender"
        value={gender}
        mode="outlined"
        onChangeText={(text) => setGender(text)}
      />

      <TextInput
        placeholder="Height"
        value={height}
        mode="outlined"
        onChangeText={(text) => setHeight(text)}
      />

      <TextInput
        placeholder="Weight"
        value={weight}
        mode="outlined"
        onChangeText={(text) => setWeight(text)}
      />

      <Button onPress={() => getInformation()}>Get Info</Button>
      <Button onPress={() => getAll()}>Get All Info</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  settingsList: {
    flex: 1,
    rowGap: 5,
    paddingTop: Constants.statusBarHeight,
    paddingHorizontal: 10,
  },
  heading: {
    fontWeight: "bold",
    textAlign: "center",
  },
});
