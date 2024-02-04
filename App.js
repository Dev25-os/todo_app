// App.js
import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [todoText, setTodoText] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);

  const addTodo = () => {
    if (todoText) {
      if (editingTodo) {
        const updatedTodos = todos.map((item) =>
          item.id === editingTodo.id
            ? { ...item, text: todoText, isComplete: false }
            : item
        );
        setTodos(updatedTodos);
        setEditingTodo(null);
      } else {
        setTodos([
          ...todos,
          { id: Date.now(), text: todoText, isComplete: false },
        ]);
      }
      setTodoText("");
    }
  };

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter((item) => item.id !== id);
    setTodos(updatedTodos);
  };

  const editTodo = (id, text) => {
    setEditingTodo({ id, text });
    setTodoText(text);
  };

  const handleComplete = (item) => {
    const updatedTodos = todos.map((ele) => {
      if (item.id === ele.id) {
        return { ...ele, isComplete: true };
      } else {
        return ele;
      }
    });

    setTodos(updatedTodos);
    console.log("todos", todos);
  };

  function doubleTap(item) {
    return Gesture.Tap()
      .numberOfTaps(2)
      .onEnd((_event, success) => {
        if (success) {
          handleComplete(item);
        }
      });
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Add a new todo"
          value={todoText}
          onChangeText={(text) => setTodoText(text)}
          onSubmitEditing={addTodo}
        />
        <Button
          title={editingTodo ? "Update" : "Add"}
          onPress={addTodo}
          style={{ borderRadius: 5 }}
        />

        {todos.length > 0 && (
          <View style={styles.listContainer}>
            <FlatList
              data={todos}
              keyExtractor={(item, index) => index}
              renderItem={({ item }) => (
                <View>
                  <GestureDetector gesture={doubleTap(item)}>
                    <View style={styles.todoItem}>
                      <Text
                        style={
                          item.isComplete && {
                            color: "green",
                            textDecorationLine: "line-through",
                          }
                        }
                      >
                        {item.text}
                      </Text>

                      <View style={styles.actionButtons}>
                        {!item.isComplete && (
                          <TouchableOpacity
                            onPress={() => editTodo(item.id, item.text)}
                            style={styles.iconContainer}
                          >
                            <Icon
                              name="create-outline"
                              size={20}
                              color="#4CAF50"
                            />
                          </TouchableOpacity>
                        )}

                        <TouchableOpacity
                          onPress={() => deleteTodo(item.id)}
                          style={styles.iconContainer}
                        >
                          <Icon
                            name="trash-outline"
                            size={20}
                            color="#FF0000"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </GestureDetector>
                </View>
              )}
            />
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    marginTop: 30,
    backgroundColor: "#f0f0f0",
  },
  listContainer: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    maxHeight: 500,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 2,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  todoItem: {
    backgroundColor: "#ffffff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginLeft: 10,
  },
  actionButtons: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    marginLeft: "auto",
    justifyContent: "flex-end",
  },
});
