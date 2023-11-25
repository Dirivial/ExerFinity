import { View, StyleSheet } from "react-native";
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

export default function ExerciseComponent({
  exerciseIndex,
  exercise,
  sets,
  addSetAction,
}) {
  return (
    <Surface
      key={exerciseIndex}
      elevation={1}
      style={styles.exerciseItemContainer}
    >
      <Text variant="bodyLarge" style={styles.itemHeader}>
        {exercise.name}
      </Text>
      <Text variant="bodySmall" style={styles.itemHeader}>
        {exercise.description}
      </Text>

      <View style={styles.restRow}>
        <Button icon="timer-outline">
          Rest Time {exercise.rest ? exercise.rest : "0"}s
        </Button>
      </View>

      <View>
        {sets.map((set, index) => {
          return (
            <View key={exerciseIndex + "row" + index} style={styles.setRow}>
              <Text variant="bodySmall" style={styles.setNumber}>
                Set {index + 1}
              </Text>
              <Text variant="bodySmall" style={styles.setReps}>
                {set} reps
              </Text>
            </View>
          );
        })}
      </View>
      <Button onPress={addSetAction}>Add Set</Button>
    </Surface>
  );
}

const styles = StyleSheet.create({
  restRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 0,
  },
  setRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 0,
  },
  setNumber: {
    marginHorizontal: 8,
    fontWeight: "bold",
  },
  setReps: {
    marginHorizontal: 8,
    fontWeight: "thin",
  },
  exerciseItemContainer: {
    display: "flex",
    flexDirection: "column",
    //justifyContent: "space-between",
    alignItems: "left",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    padding: 8,
  },
  itemHeader: {
    marginHorizontal: 8,
    fontWeight: "bold",
  },
});
