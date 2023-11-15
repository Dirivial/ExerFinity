export default function initDB(db) {
  db.transaction(
    (tx) => {
      // User
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS User (user_id INTEGER PRIMARY KEY,username TEXT,email TEXT,password TEXT,date_of_birth DATE,gender TEXT,height REAL, metric_height BOOL,weight REAL, metric_weight BOOL);"
      );
      tx.executeSql("INSERT OR IGNORE INTO User (user_id) VALUES (?)", [0]);
      // Workout
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS Workout (workout_id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT, date DATE,duration INTEGER,calories_burned INTEGER);"
      );
      tx.executeSql(
        "INSERT OR IGNORE INTO Workout (workout_id, name) VALUES (?, ?)",
        [0, "Default"]
      );
      // Exercise
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS Exercise (exercise_id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,description TEXT,category TEXT,equipment_required TEXT);"
      );
      tx.executeSql(
        "INSERT OR IGNORE INTO Exercise (name, description, category) VALUES (?, ?, ?)",
        ["Push up", "Regular Push up.", "Chest;Triceps"]
      );
      tx.executeSql(
        "INSERT OR IGNORE INTO Exercise (name, description, category) VALUES (?, ?, ?)",
        ["Pull up", "Normal Pull up.", "Back;Biceps"]
      );
      tx.executeSql(
        "INSERT OR IGNORE INTO Exercise (name, description, category) VALUES (?, ?, ?)",
        ["Squat", "A Squat.", "Legs;Compound"]
      );
      // ExerciseInstance
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS ExerciseInstance (instance_id INTEGER PRIMARY KEY AUTOINCREMENT,workout_id INTEGER REFERENCES Workout(workout_id),exercise_id INTEGER REFERENCES Exercise(exercise_id),set_count INTEGER, reps TEXT,rest INTEGER,order_in_workout INTEGER);"
      );
      tx.executeSql(
        "INSERT OR IGNORE INTO ExerciseInstance (workout_id, exercise_id, set_count, reps, rest, order_in_workout) VALUES (?, ?, ?, ?, ?, ?)",
        [0, 1, 3, JSON.stringify({ 0: 10, 1: 9, 2: 8 }), 120, 0]
      );
      // Progress
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS Progress (progress_id INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER REFERENCES User(user_id),exercise_id INTEGER REFERENCES Exercise(exercise_id),date DATE,weight REAL,reps_completed INTEGER,time_taken INTEGER);"
      );
    },
    (error) => console.log(error),
    () => console.log("Successful setup")
  );
}
