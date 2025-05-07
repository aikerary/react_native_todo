import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TodoContext } from "../context/TodoProvider";
import { useContext } from "react";
import { ActivityIndicator } from "react-native-paper";

import {
  FAB,
  Portal,
  Modal,
  TextInput,
  Button,
  Appbar
} from "react-native-paper";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

export default function TodoList() {
  const [visible, setVisible] = React.useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const { updateTodo, createTodo, todos, refreshTodos, deleteTodo, loading } =
    useContext(TodoContext);

  useEffect(() => {
    refreshTodos();
  }, []);

  const renderItem = ({ item }) => {
    const renderRightActions = () => (
      <View style={styles.rightAction}>
        <Text style={styles.deleteText}>Eliminar</Text>
      </View>
    );

    return (
      <Swipeable
        friction={2}
        overshootRight={false}
        renderRightActions={renderRightActions}
        rightThreshold={80}
        onSwipeableOpen={(direction) => {
          if (direction === "right") {
            deleteItem(item.id);
          }
        }}
      >
        <View style={styles.item}>
          <Text style={styles.itemText}>{item.name}</Text>
          <Button
            mode="contained"
            onPress={() => editItem(item)}
            style={styles.optionButton}
            buttonColor="#5D8AA8"
          >
            Edit
          </Button>
        </View>
      </Swipeable>
    );
  };
  const addItem = () => {
    setCurrentItem(null);
    setInputValue("");
    setVisible(true);
  };

  const saveItem = async () => {
    if (currentItem) {
      await updateTodo({ id: currentItem.id, name: inputValue });
    } else {
      const newItem = {
        name: inputValue
      };
      await createTodo(newItem);
    }
    setVisible(false);
  };

  const editItem = (item) => {
    setCurrentItem(item);
    setInputValue(item.name);
    setVisible(true);
  };

  const deleteItem = async (id) => {
    await deleteTodo(id);
  };

  if (loading === true) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading todos...</Text>
      </SafeAreaView>
    );
  }
  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Todo List" titleStyle={styles.headerTitle} />
      </Appbar.Header>
      <View style={styles.content}>
        <FlatList
          data={todos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
        <FAB style={styles.fab} icon="plus" onPress={addItem} />
      </View>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.bottomSheetStyle}
          onRequestClose={() => setVisible(false)}
        >
          <Text style={styles.modalTitle}>
            {currentItem ? "Edit Task" : "Add New Task"}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter TODO item"
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={saveItem}
            mode="outlined"
            activeOutlineColor="#6200ee"
          />
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={saveItem}
              style={styles.saveButton}
              buttonColor="#6200ee"
            >
              Save
            </Button>

            <Button
              mode="outlined"
              onPress={() => setVisible(false)}
              style={styles.cancelButton}
              textColor="#6200ee"
            >
              Cancel
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5"
  },
  header: {
    backgroundColor: "#6200ee",
    elevation: 4
  },
  headerTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20
  },
  content: {
    flex: 1
  },
  listContainer: {
    padding: 12
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22
  },
  itemText: {
    fontSize: 16,
    flex: 1
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#6200ee",
    borderRadius: 28,
    elevation: 6
  },
  optionButton: {
    borderRadius: 4,
    padding: 0,
    marginLeft: 8
  },
  bottomSheetStyle: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 15,
    elevation: 5
  },
  input: {
    backgroundColor: "white",
    marginBottom: 20
  },
  rightAction: {
    width: 80,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 8
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  saveButton: {
    flex: 1,
    marginRight: 8,
    borderRadius: 4
  },
  cancelButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 4,
    borderColor: "#6200ee"
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#6200ee"
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6200ee"
  }
});
