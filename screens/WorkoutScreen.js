import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function WorkoutScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Workout!</Text>
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
