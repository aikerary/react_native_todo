import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TodoContext } from "../context/TodoProvider";
import { useContext } from "react";
import {
  ActivityIndicator,
  FAB,
  Portal,
  Modal,
  TextInput,
  Button,
  Appbar,
  Checkbox
} from "react-native-paper";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

export default function TodoList() {
  const [visible, setVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const { updateTodo, createTodo, todos, refreshTodos, deleteTodo, toggleTodoComplete, loading } =
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
        <View style={[styles.item, item.completed && styles.completedItem]}>
          <View style={styles.itemLeftSection}>
            <Checkbox
              status={item.completed ? 'checked' : 'unchecked'}
              onPress={() => toggleComplete(item.id)}
              color="#6200ee"
            />
            <Text style={[styles.itemText, item.completed && styles.completedText]}>
              {item.name}
            </Text>
          </View>
          <View style={styles.buttonGroup}>
            <Text style={styles.statusText}>
              {item.completed ? "Completed" : "Pending"}
            </Text>
            <Button
              mode="contained"
              onPress={() => editItem(item)}
              style={styles.optionButton}
              buttonColor={item.completed ? "#4CAF50" : "#5D8AA8"}
            >
              Edit
            </Button>
          </View>
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
    if (inputValue.trim() === "") {
      return;
    }
    
    if (currentItem) {
      await updateTodo({
        id: currentItem.id,
        name: inputValue,
        completed: currentItem.completed
      });
    } else {
      const newItem = {
        name: inputValue,
        completed: false
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

  const toggleComplete = async (id) => {
    await toggleTodoComplete(id);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading todos...</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Todo Checklist" titleStyle={styles.headerTitle} />
        <Appbar.Action 
          icon="refresh" 
          onPress={refreshTodos} 
          color="white"
          disabled={loading}
        />
      </Appbar.Header>
      <View style={styles.content}>
        {todos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No todos yet. Add your first one!</Text>
          </View>
        ) : (
          <FlatList
            data={todos}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
          />
        )}
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
          {currentItem && (
            <View style={styles.modalCheckboxContainer}>
              <Text>Mark as completed: </Text>
              <Checkbox
                status={currentItem.completed ? 'checked' : 'unchecked'}
                onPress={() => {
                  setCurrentItem({
                    ...currentItem,
                    completed: !currentItem.completed
                  });
                }}
                color="#6200ee"
              />
            </View>
          )}
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={saveItem}
              style={styles.saveButton}
              buttonColor="#6200ee"
              disabled={inputValue.trim() === ""}
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
  completedItem: {
    backgroundColor: "#F0F8FF",
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50"
  },
  itemLeftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1
  },
  itemText: {
    fontSize: 16,
    marginLeft: 8
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#888"
  },
  buttonGroup: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  statusText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    fontStyle: "italic"
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
    marginBottom: 20,
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
  modalCheckboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5"
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6200ee"
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  emptyText: {
    fontSize: 16,
    color: "#888"
  }
});
