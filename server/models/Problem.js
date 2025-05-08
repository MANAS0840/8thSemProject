const mongoose = require("mongoose");

// Define the Courses schema
const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },
  tags: {
    type: [String],
  },
  problemStatement: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  examples: {
    type: [
      {
        inputText: String,
        input: String,
        outputText: String,
        explanation: String,
      },
    ],
  },
  constraints: {
    type: String,
    required: true,
    trim: true,
  },
  correctCode: {
    type: String,
    required: true,
    default: "",
  },
  starterCode: {
    python: {
      type: String,
      default: `print("Hello World!")`,
    },
    javascript: {
      type: String,
      default: `console.log("Hello World!");`,
    },
    java: {
      type: String,
      default: `public class Main {
      public static void main(String[] args) {
          System.out.println("Hello World!");
      }
}`,
    },
    cpp: {
      type: String,
      default: `#include <iostream>
using namespace std;

int main() {
	cout << "Hello World!";
	return 0;
}`,
    },
  },
  defaultCode: {
    python: {
      type: String,
      default: `print("Hello World!")`,
    },
    javascript: {
      type: String,
      default: `console.log("Hello World!");`,
    },
    java: {
      type: String,
      default: `public class Main {
      public static void main(String[] args) {
          System.out.println("Hello World!");
      }
}`,
    },
    cpp: {
      type: String,
      default: `#include <iostream>
using namespace std;

int main() {
	cout << "Hello World!";
	return 0;
}`,
    },
  },

  createdAt: { type: Date, default: Date.now },
});

// Export the Courses model
module.exports = mongoose.model("Problem", problemSchema);
