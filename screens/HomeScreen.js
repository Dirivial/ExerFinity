import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import * as SQLite from "expo-sqlite";

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

export default function HomeScreen() {
  const [name, setName] = React.useState("");

  React.useEffect(() => {
    db.transaction((tx) => {
      // Get name
      tx.executeSql(
        "select username from User where user_id = ?",
        [0],
        (_, { rows }) => {
          setName(rows._array[0].username);
        }
      );
    });
  }, []);
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Welcome, {name}!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
