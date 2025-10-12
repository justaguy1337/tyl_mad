import React, { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

export default function App() {
  // const add = (a,b) => {return a+b}

  // function add(a,b) {
  // return a+b}

  const [input, setInput] = useState("");
  const [output, setOutput] = useState(0);

  const handlePress = (value) => {
    setInput(input + value);
  };

  const handleOutput = () => {
    try {
      const regex = /(\d+)([\+\-x\/])(\d+)/;
      const matches = input.match(regex);

      if (matches) {
        const num1 = parseInt(matches[1]);
        const operator = matches[2];
        const num2 = parseInt(matches[3]);
        calculation(num1, num2, operator);
      }
    } catch (error) {
      setOutput("Error");
    }
  };

  function calculation(a, b, op) {
    let result;
    switch (op) {
      case "+":
        result = a + b;
        break;
      case "-":
        result = a - b;
        break;
      case "x":
        result = a * b;
        break;
      case "/":
        result = b !== 0 ? a / b : "Infinity";
        break;
      default:
        result = "Error";
    }
    setOutput(result);
  }

  return (
    <View style={styles.container}>
      <View style={styles.display}>
        <Text style={styles.displayText}>{input || "0"}</Text>
        <Text style={styles.displayText}>{output}</Text>
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.button2}
          onPress={() => {
            setInput("");
            setOutput(0);
          }}
        >
          <Text style={styles.buttonText}>C</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button2}
          onPress={() => handlePress("/")}
        >
          <Text style={styles.buttonText}>÷</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button2}
          onPress={() => handlePress("x")}
        >
          <Text style={styles.buttonText}>×</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button2}
          onPress={() => handlePress("-")}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        {["7", "8", "9", "+"].map((item) => (
          <TouchableOpacity
            key={item}
            style={styles.button1}
            onPress={() => handlePress(item)}
          >
            <Text style={styles.buttonText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.row}>
        {["4", "5", "6", "="].map((item) => (
          <TouchableOpacity
            key={item}
            style={styles.button1}
            onPress={() => (item === "=" ? handleOutput() : handlePress(item))}
          >
            <Text style={styles.buttonText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.row}>
        {["1", "2", "3", "0"].map((item) => (
          <TouchableOpacity
            key={item}
            style={styles.button1}
            onPress={() => handlePress(item)}
          >
            <Text style={styles.buttonText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#202020",
    justifyContent: "flex-end",
    paddingBottom: 40,
  },
  display: {
    backgroundColor: "#333",
    padding: 20,
    alignItems: "flex-end",
  },
  displayText: {
    fontSize: 36,
    color: "white",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space",
    marginVertical: 2,
  },
  button1: {
    backgroundColor: "#d85959ff",
    flex: 1,
    margin: 5,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  button2: {
    backgroundColor: "#59d4d8ff",
    flex: 1,
    margin: 5,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 24,
    color: "white",
  },
});
