import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";

// Quiz questions data
const quizData = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 1,
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: 2,
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswer: 3,
  },
  {
    question: "Which programming language is React Native based on?",
    options: ["Python", "Java", "JavaScript", "C++"],
    correctAnswer: 2,
  },
  {
    question: "What year did World War II end?",
    options: ["1943", "1944", "1945", "1946"],
    correctAnswer: 2,
  },
  {
    question: "What is the smallest prime number?",
    options: ["0", "1", "2", "3"],
    correctAnswer: 2,
  },
  {
    question: "Which country is home to the kangaroo?",
    options: ["New Zealand", "Australia", "South Africa", "Brazil"],
    correctAnswer: 1,
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: 2,
  },
];

export default function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [answers, setAnswers] = useState([]);

  const handleAnswerPress = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    // Check if answer is correct
    const isCorrect = selectedAnswer === quizData[currentQuestion].correctAnswer;
    
    // Store the answer
    setAnswers([
      ...answers,
      {
        question: quizData[currentQuestion].question,
        selectedAnswer: selectedAnswer,
        correctAnswer: quizData[currentQuestion].correctAnswer,
        isCorrect: isCorrect,
      },
    ]);

    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizData.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedAnswer(null);
    } else {
      setShowScore(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowScore(false);
    setAnswers([]);
  };

  const getScoreColor = () => {
    const percentage = (score / quizData.length) * 100;
    if (percentage >= 80) return "#4CAF50";
    if (percentage >= 60) return "#FF9800";
    return "#F44336";
  };

  if (showScore) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreTitle}>Quiz Completed! 🎉</Text>
            <View style={[styles.scoreCircle, { borderColor: getScoreColor() }]}>
              <Text style={[styles.scoreText, { color: getScoreColor() }]}>
                {score}/{quizData.length}
              </Text>
              <Text style={styles.scorePercentage}>
                {Math.round((score / quizData.length) * 100)}%
              </Text>
            </View>
            
            <Text style={styles.reviewTitle}>Review Your Answers:</Text>
            
            {answers.map((item, index) => (
              <View key={index} style={styles.reviewCard}>
                <Text style={styles.reviewQuestion}>
                  Q{index + 1}: {item.question}
                </Text>
                <Text
                  style={[
                    styles.reviewAnswer,
                    item.isCorrect ? styles.correctAnswer : styles.wrongAnswer,
                  ]}
                >
                  Your answer: {quizData[index].options[item.selectedAnswer]}
                  {item.isCorrect ? " ✓" : " ✗"}
                </Text>
                {!item.isCorrect && (
                  <Text style={styles.correctAnswerText}>
                    Correct answer: {quizData[index].options[item.correctAnswer]}
                  </Text>
                )}
              </View>
            ))}

            <TouchableOpacity style={styles.restartButton} onPress={restartQuiz}>
              <Text style={styles.restartButtonText}>Restart Quiz</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.quizContainer}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Question {currentQuestion + 1}/{quizData.length}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((currentQuestion + 1) / quizData.length) * 100}%`,
                },
              ]}
            />
          </View>
        </View>

        <Text style={styles.questionText}>
          {quizData[currentQuestion].question}
        </Text>

        <View style={styles.optionsContainer}>
          {quizData[currentQuestion].options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswer === index && styles.selectedOption,
              ]}
              onPress={() => handleAnswerPress(index)}
            >
              <View style={styles.optionContent}>
                <View
                  style={[
                    styles.optionCircle,
                    selectedAnswer === index && styles.selectedCircle,
                  ]}
                >
                  {selectedAnswer === index && (
                    <View style={styles.innerCircle} />
                  )}
                </View>
                <Text
                  style={[
                    styles.optionText,
                    selectedAnswer === index && styles.selectedOptionText,
                  ]}
                >
                  {option}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.nextButton,
            selectedAnswer === null && styles.nextButtonDisabled,
          ]}
          onPress={handleNextQuestion}
          disabled={selectedAnswer === null}
        >
          <Text style={styles.nextButtonText}>
            {currentQuestion === quizData.length - 1 ? "Finish Quiz" : "Next Question"}
          </Text>
        </TouchableOpacity>

        <View style={styles.scoreTracker}>
          <Text style={styles.scoreTrackerText}>Current Score: {score}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  quizContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  progressContainer: {
    marginBottom: 30,
    marginTop: 20,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6200ee",
    borderRadius: 4,
  },
  questionText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
    lineHeight: 32,
  },
  optionsContainer: {
    flex: 1,
  },
  optionButton: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedOption: {
    borderColor: "#6200ee",
    backgroundColor: "#f3e5f5",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#999",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedCircle: {
    borderColor: "#6200ee",
  },
  innerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#6200ee",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  selectedOptionText: {
    color: "#6200ee",
    fontWeight: "600",
  },
  nextButton: {
    backgroundColor: "#6200ee",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  nextButtonDisabled: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
    elevation: 0,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  scoreTracker: {
    alignItems: "center",
    marginTop: 15,
    paddingVertical: 10,
  },
  scoreTrackerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6200ee",
  },
  scoreContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  scoreTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
  },
  scoreCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    backgroundColor: "#fff",
  },
  scoreText: {
    fontSize: 48,
    fontWeight: "bold",
  },
  scorePercentage: {
    fontSize: 20,
    color: "#666",
    marginTop: 5,
  },
  reviewTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  reviewCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    width: "100%",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  reviewQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  reviewAnswer: {
    fontSize: 14,
    marginBottom: 4,
  },
  correctAnswer: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  wrongAnswer: {
    color: "#F44336",
    fontWeight: "600",
  },
  correctAnswerText: {
    fontSize: 14,
    color: "#4CAF50",
    fontStyle: "italic",
  },
  restartButton: {
    backgroundColor: "#6200ee",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  restartButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
