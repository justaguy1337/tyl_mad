import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Modal,
} from "react-native";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  
  // Form states
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const categories = [
    { name: "Food", icon: "🍔", color: "#ff6b6b" },
    { name: "Transport", icon: "🚗", color: "#4ecdc4" },
    { name: "Shopping", icon: "🛍️", color: "#95e1d3" },
    { name: "Bills", icon: "💡", color: "#f38181" },
    { name: "Entertainment", icon: "🎮", color: "#aa96da" },
    { name: "Health", icon: "🏥", color: "#fcbad3" },
    { name: "Education", icon: "📚", color: "#a8e6cf" },
    { name: "Other", icon: "📌", color: "#ffd3b6" },
  ];

  // Calculate total expenses
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + parseFloat(expense.amount),
    0
  );

  // Calculate expenses by category
  const expensesByCategory = categories.map((cat) => {
    const total = expenses
      .filter((exp) => exp.category === cat.name)
      .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    return { ...cat, total };
  });

  // Get recent expenses (sorted by date)
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const openModal = (expense = null) => {
    if (expense) {
      setEditingExpense(expense);
      setAmount(expense.amount.toString());
      setDescription(expense.description);
      setCategory(expense.category);
      setDate(expense.date);
    } else {
      resetForm();
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingExpense(null);
    setAmount("");
    setDescription("");
    setCategory("Food");
    setDate(new Date().toISOString().split("T")[0]);
  };

  const handleSaveExpense = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    if (!description.trim()) {
      alert("Please enter a description");
      return;
    }

    const expenseData = {
      id: editingExpense ? editingExpense.id : Date.now().toString(),
      amount: parseFloat(amount).toFixed(2),
      description: description.trim(),
      category,
      date,
    };

    if (editingExpense) {
      setExpenses(
        expenses.map((exp) => (exp.id === editingExpense.id ? expenseData : exp))
      );
    } else {
      setExpenses([...expenses, expenseData]);
    }

    closeModal();
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  const getCategoryIcon = (categoryName) => {
    return categories.find((cat) => cat.name === categoryName)?.icon || "📌";
  };

  const getCategoryColor = (categoryName) => {
    return categories.find((cat) => cat.name === categoryName)?.color || "#ffd3b6";
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💰 Expense Tracker</Text>
        <Text style={styles.headerSubtitle}>Track your daily expenses</Text>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total Expenses</Text>
        <Text style={styles.summaryAmount}>${totalExpenses.toFixed(2)}</Text>
        <Text style={styles.summaryCount}>
          {expenses.length} {expenses.length === 1 ? "transaction" : "transactions"}
        </Text>
      </View>

      {/* Category Overview */}
      <View style={styles.categorySection}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {expensesByCategory.map((cat) => (
            <View
              key={cat.name}
              style={[styles.categoryCard, { backgroundColor: cat.color }]}
            >
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text style={styles.categoryName}>{cat.name}</Text>
              <Text style={styles.categoryAmount}>${cat.total.toFixed(2)}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Recent Expenses */}
      <View style={styles.expensesSection}>
        <Text style={styles.sectionTitle}>Recent Expenses</Text>
        <ScrollView style={styles.expensesList}>
          {sortedExpenses.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>No expenses yet</Text>
              <Text style={styles.emptySubtext}>
                Tap the + button to add your first expense
              </Text>
            </View>
          ) : (
            sortedExpenses.map((expense) => (
              <View
                key={expense.id}
                style={[
                  styles.expenseCard,
                  { borderLeftColor: getCategoryColor(expense.category) },
                ]}
              >
                <View style={styles.expenseLeft}>
                  <Text style={styles.expenseIcon}>
                    {getCategoryIcon(expense.category)}
                  </Text>
                  <View style={styles.expenseInfo}>
                    <Text style={styles.expenseDescription}>
                      {expense.description}
                    </Text>
                    <Text style={styles.expenseCategory}>{expense.category}</Text>
                    <Text style={styles.expenseDate}>{expense.date}</Text>
                  </View>
                </View>
                <View style={styles.expenseRight}>
                  <Text style={styles.expenseAmount}>
                    ${parseFloat(expense.amount).toFixed(2)}
                  </Text>
                  <View style={styles.expenseActions}>
                    <TouchableOpacity
                      onPress={() => openModal(expense)}
                      style={styles.actionButton}
                    >
                      <Text style={styles.actionText}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteExpense(expense.id)}
                      style={styles.actionButton}
                    >
                      <Text style={styles.actionText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      {/* Add Expense Button */}
      <TouchableOpacity style={styles.fab} onPress={() => openModal()}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Add/Edit Expense Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingExpense ? "Edit Expense" : "Add Expense"}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              {/* Amount */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Amount ($)</Text>
                <TextInput
                  style={styles.formInput}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                />
              </View>

              {/* Description */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Description</Text>
                <TextInput
                  style={styles.formInput}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="What did you spend on?"
                />
              </View>

              {/* Category */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Category</Text>
                <View style={styles.categoryGrid}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.name}
                      style={[
                        styles.categoryOption,
                        category === cat.name && {
                          backgroundColor: cat.color,
                        },
                      ]}
                      onPress={() => setCategory(cat.name)}
                    >
                      <Text style={styles.categoryOptionIcon}>{cat.icon}</Text>
                      <Text
                        style={[
                          styles.categoryOptionText,
                          category === cat.name && styles.categoryOptionTextActive,
                        ]}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Date */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Date</Text>
                <TextInput
                  style={styles.formInput}
                  value={date}
                  onChangeText={setDate}
                  placeholder="YYYY-MM-DD"
                />
              </View>

              {/* Save Button */}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveExpense}
              >
                <Text style={styles.saveButtonText}>
                  {editingExpense ? "Update Expense" : "Add Expense"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#4a90e2",
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#e3f2fd",
    marginTop: 5,
  },
  summaryCard: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 25,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#4a90e2",
    marginBottom: 5,
  },
  summaryCount: {
    fontSize: 12,
    color: "#adb5bd",
  },
  categorySection: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212529",
    marginHorizontal: 15,
    marginBottom: 10,
  },
  categoryScroll: {
    paddingHorizontal: 15,
  },
  categoryCard: {
    width: 100,
    padding: 15,
    borderRadius: 12,
    marginRight: 10,
    alignItems: "center",
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 5,
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  expensesSection: {
    flex: 1,
    marginTop: 5,
  },
  expensesList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#495057",
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#adb5bd",
    textAlign: "center",
  },
  expenseCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  expenseLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  expenseIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 3,
  },
  expenseCategory: {
    fontSize: 12,
    color: "#6c757d",
    marginBottom: 2,
  },
  expenseDate: {
    fontSize: 11,
    color: "#adb5bd",
  },
  expenseRight: {
    alignItems: "flex-end",
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4a90e2",
    marginBottom: 5,
  },
  expenseActions: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 5,
    marginLeft: 8,
  },
  actionText: {
    fontSize: 18,
  },
  fab: {
    position: "absolute",
    bottom: 25,
    right: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4a90e2",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "300",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#212529",
  },
  modalClose: {
    fontSize: 28,
    color: "#6c757d",
    fontWeight: "300",
  },
  modalForm: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#495057",
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -5,
  },
  categoryOption: {
    width: "23%",
    margin: "1%",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  categoryOptionIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  categoryOptionText: {
    fontSize: 11,
    color: "#495057",
    textAlign: "center",
  },
  categoryOptionTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#4a90e2",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
