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

// Sample recipe data
const recipesData = [
  {
    id: 1,
    name: "Spaghetti Carbonara",
    category: "Italian",
    cookTime: "20 mins",
    difficulty: "Medium",
    servings: 4,
    ingredients: [
      "400g spaghetti",
      "200g pancetta or bacon",
      "4 large eggs",
      "100g Parmesan cheese",
      "Black pepper",
      "Salt",
    ],
    instructions: [
      "Cook spaghetti according to package directions",
      "Fry pancetta until crispy",
      "Beat eggs with grated Parmesan",
      "Drain pasta and mix with pancetta",
      "Remove from heat and stir in egg mixture",
      "Season with black pepper and serve immediately",
    ],
  },
  {
    id: 2,
    name: "Chicken Tikka Masala",
    category: "Indian",
    cookTime: "45 mins",
    difficulty: "Medium",
    servings: 6,
    ingredients: [
      "800g chicken breast",
      "1 cup yogurt",
      "400g tomato puree",
      "1 cup heavy cream",
      "2 tbsp tikka masala spice",
      "Onions, garlic, ginger",
      "Rice for serving",
    ],
    instructions: [
      "Marinate chicken in yogurt and spices for 30 mins",
      "Grill or pan-fry chicken pieces",
      "Sauté onions, garlic, and ginger",
      "Add tomato puree and spices",
      "Add cream and cooked chicken",
      "Simmer for 15 minutes and serve with rice",
    ],
  },
  {
    id: 3,
    name: "Caesar Salad",
    category: "Salad",
    cookTime: "15 mins",
    difficulty: "Easy",
    servings: 4,
    ingredients: [
      "Romaine lettuce",
      "Croutons",
      "Parmesan cheese",
      "Caesar dressing",
      "Anchovies (optional)",
      "Lemon juice",
    ],
    instructions: [
      "Wash and chop romaine lettuce",
      "Toast bread cubes for croutons",
      "Mix lettuce with Caesar dressing",
      "Add croutons and shaved Parmesan",
      "Squeeze fresh lemon juice",
      "Toss and serve immediately",
    ],
  },
  {
    id: 4,
    name: "Beef Tacos",
    category: "Mexican",
    cookTime: "25 mins",
    difficulty: "Easy",
    servings: 6,
    ingredients: [
      "500g ground beef",
      "Taco shells or tortillas",
      "Lettuce, tomatoes, onions",
      "Shredded cheese",
      "Sour cream",
      "Taco seasoning",
      "Salsa",
    ],
    instructions: [
      "Brown ground beef in a pan",
      "Add taco seasoning and water",
      "Simmer until sauce thickens",
      "Warm taco shells",
      "Fill shells with beef and toppings",
      "Serve with salsa and sour cream",
    ],
  },
  {
    id: 5,
    name: "Chocolate Chip Cookies",
    category: "Dessert",
    cookTime: "30 mins",
    difficulty: "Easy",
    servings: 24,
    ingredients: [
      "2 cups all-purpose flour",
      "1 cup butter, softened",
      "3/4 cup sugar",
      "2 eggs",
      "2 cups chocolate chips",
      "1 tsp vanilla extract",
      "1 tsp baking soda",
    ],
    instructions: [
      "Preheat oven to 375°F (190°C)",
      "Cream butter and sugar together",
      "Beat in eggs and vanilla",
      "Mix in flour and baking soda",
      "Fold in chocolate chips",
      "Drop spoonfuls on baking sheet and bake 10-12 mins",
    ],
  },
  {
    id: 6,
    name: "Greek Salad",
    category: "Salad",
    cookTime: "10 mins",
    difficulty: "Easy",
    servings: 4,
    ingredients: [
      "Tomatoes",
      "Cucumbers",
      "Red onions",
      "Kalamata olives",
      "Feta cheese",
      "Olive oil",
      "Lemon juice",
      "Oregano",
    ],
    instructions: [
      "Chop tomatoes and cucumbers",
      "Slice red onions thinly",
      "Combine vegetables in a bowl",
      "Add olives and crumbled feta",
      "Drizzle with olive oil and lemon juice",
      "Sprinkle oregano and toss gently",
    ],
  },
  {
    id: 7,
    name: "Pad Thai",
    category: "Thai",
    cookTime: "30 mins",
    difficulty: "Medium",
    servings: 4,
    ingredients: [
      "200g rice noodles",
      "Shrimp or chicken",
      "Bean sprouts",
      "Peanuts",
      "Eggs",
      "Tamarind paste",
      "Fish sauce",
      "Green onions",
    ],
    instructions: [
      "Soak rice noodles in warm water",
      "Scramble eggs and set aside",
      "Stir-fry protein until cooked",
      "Add drained noodles and sauce",
      "Toss with bean sprouts and eggs",
      "Garnish with peanuts and green onions",
    ],
  },
  {
    id: 8,
    name: "Margherita Pizza",
    category: "Italian",
    cookTime: "25 mins",
    difficulty: "Medium",
    servings: 4,
    ingredients: [
      "Pizza dough",
      "Tomato sauce",
      "Fresh mozzarella",
      "Fresh basil",
      "Olive oil",
      "Garlic",
      "Salt",
    ],
    instructions: [
      "Preheat oven to 475°F (245°C)",
      "Roll out pizza dough",
      "Spread tomato sauce on dough",
      "Add sliced mozzarella",
      "Drizzle with olive oil",
      "Bake 12-15 mins, add fresh basil before serving",
    ],
  },
  {
    id: 9,
    name: "French Onion Soup",
    category: "French",
    cookTime: "60 mins",
    difficulty: "Medium",
    servings: 6,
    ingredients: [
      "6 large onions",
      "Beef broth",
      "White wine",
      "Butter",
      "Gruyere cheese",
      "French bread",
      "Thyme",
    ],
    instructions: [
      "Slice onions thinly",
      "Caramelize onions in butter (30 mins)",
      "Add wine and let it reduce",
      "Pour in beef broth and thyme",
      "Simmer for 20 minutes",
      "Top with bread and cheese, broil until melted",
    ],
  },
  {
    id: 10,
    name: "Banana Bread",
    category: "Dessert",
    cookTime: "65 mins",
    difficulty: "Easy",
    servings: 8,
    ingredients: [
      "3 ripe bananas",
      "2 cups flour",
      "1/2 cup butter",
      "3/4 cup sugar",
      "2 eggs",
      "1 tsp baking soda",
      "1 tsp vanilla",
    ],
    instructions: [
      "Preheat oven to 350°F (175°C)",
      "Mash bananas in a bowl",
      "Mix in melted butter",
      "Beat in eggs, sugar, and vanilla",
      "Fold in flour and baking soda",
      "Pour into loaf pan and bake 60 mins",
    ],
  },
];

export default function App() {
  const [recipes, setRecipes] = useState(recipesData);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showSaved, setShowSaved] = useState(false);

  const categories = [
    "All",
    "Italian",
    "Indian",
    "Mexican",
    "Thai",
    "French",
    "Salad",
    "Dessert",
  ];

  // Filter recipes based on search and category
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get displayed recipes (either filtered or saved)
  const displayedRecipes = showSaved
    ? recipes.filter((r) => savedRecipes.includes(r.id))
    : filteredRecipes;

  // Toggle save recipe
  const toggleSaveRecipe = (recipeId) => {
    if (savedRecipes.includes(recipeId)) {
      setSavedRecipes(savedRecipes.filter((id) => id !== recipeId));
    } else {
      setSavedRecipes([...savedRecipes, recipeId]);
    }
  };

  // Check if recipe is saved
  const isRecipeSaved = (recipeId) => {
    return savedRecipes.includes(recipeId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🍳 Recipe App</Text>
        <TouchableOpacity
          style={styles.savedButton}
          onPress={() => setShowSaved(!showSaved)}
        >
          <Text style={styles.savedButtonText}>
            {showSaved ? "📚 Browse" : `❤️ Saved (${savedRecipes.length})`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      {!showSaved && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search recipes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      )}

      {/* Category Filter */}
      {!showSaved && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Recipe List */}
      <ScrollView style={styles.recipeList}>
        {displayedRecipes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {showSaved
                ? "No saved recipes yet!\nBrowse and save your favorites."
                : "No recipes found."}
            </Text>
          </View>
        ) : (
          displayedRecipes.map((recipe) => (
            <TouchableOpacity
              key={recipe.id}
              style={styles.recipeCard}
              onPress={() => setSelectedRecipe(recipe)}
            >
              <View style={styles.recipeHeader}>
                <View style={styles.recipeInfo}>
                  <Text style={styles.recipeName}>{recipe.name}</Text>
                  <Text style={styles.recipeCategory}>{recipe.category}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => toggleSaveRecipe(recipe.id)}
                  style={styles.saveIcon}
                >
                  <Text style={styles.saveIconText}>
                    {isRecipeSaved(recipe.id) ? "❤️" : "🤍"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.recipeDetails}>
                <Text style={styles.recipeDetail}>⏱️ {recipe.cookTime}</Text>
                <Text style={styles.recipeDetail}>
                  📊 {recipe.difficulty}
                </Text>
                <Text style={styles.recipeDetail}>
                  🍽️ {recipe.servings} servings
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Recipe Detail Modal */}
      <Modal
        visible={selectedRecipe !== null}
        animationType="slide"
        onRequestClose={() => setSelectedRecipe(null)}
      >
        {selectedRecipe && (
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedRecipe(null)}>
                <Text style={styles.closeButton}>✕ Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => toggleSaveRecipe(selectedRecipe.id)}
              >
                <Text style={styles.modalSaveButton}>
                  {isRecipeSaved(selectedRecipe.id) ? "❤️ Saved" : "🤍 Save"}
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedRecipe.name}</Text>
              <View style={styles.modalMetadata}>
                <Text style={styles.modalCategory}>
                  {selectedRecipe.category}
                </Text>
                <Text style={styles.modalDetail}>⏱️ {selectedRecipe.cookTime}</Text>
                <Text style={styles.modalDetail}>
                  📊 {selectedRecipe.difficulty}
                </Text>
                <Text style={styles.modalDetail}>
                  🍽️ {selectedRecipe.servings} servings
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ingredients</Text>
                {selectedRecipe.ingredients.map((ingredient, index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.listText}>{ingredient}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Instructions</Text>
                {selectedRecipe.instructions.map((instruction, index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.stepNumber}>{index + 1}.</Text>
                    <Text style={styles.listText}>{instruction}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
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
    backgroundColor: "#ff6b6b",
    padding: 20,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  savedButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  savedButtonText: {
    color: "#ff6b6b",
    fontWeight: "600",
    fontSize: 14,
  },
  searchContainer: {
    padding: 15,
    backgroundColor: "#fff",
  },
  searchInput: {
    backgroundColor: "#f1f3f5",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  categoryContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#f1f3f5",
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: "#ff6b6b",
  },
  categoryText: {
    color: "#495057",
    fontWeight: "600",
    fontSize: 14,
  },
  categoryTextActive: {
    color: "#fff",
  },
  recipeList: {
    flex: 1,
    padding: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: "#868e96",
    textAlign: "center",
    lineHeight: 28,
  },
  recipeCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recipeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: 5,
  },
  recipeCategory: {
    fontSize: 14,
    color: "#ff6b6b",
    fontWeight: "600",
  },
  saveIcon: {
    padding: 5,
  },
  saveIconText: {
    fontSize: 24,
  },
  recipeDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  recipeDetail: {
    fontSize: 13,
    color: "#6c757d",
    marginRight: 15,
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  closeButton: {
    fontSize: 18,
    color: "#ff6b6b",
    fontWeight: "600",
  },
  modalSaveButton: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: 15,
  },
  modalMetadata: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 25,
  },
  modalCategory: {
    backgroundColor: "#ff6b6b",
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    fontWeight: "600",
    marginRight: 10,
    marginBottom: 10,
  },
  modalDetail: {
    backgroundColor: "#f1f3f5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 10,
    color: "#495057",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: 15,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  bullet: {
    fontSize: 18,
    color: "#ff6b6b",
    marginRight: 10,
    fontWeight: "bold",
  },
  stepNumber: {
    fontSize: 16,
    color: "#ff6b6b",
    fontWeight: "bold",
    marginRight: 10,
    minWidth: 25,
  },
  listText: {
    fontSize: 16,
    color: "#495057",
    flex: 1,
    lineHeight: 24,
  },
});
