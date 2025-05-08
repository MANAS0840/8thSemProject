const mongoose = require("mongoose");

const userCodeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    code: {
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
    submissions: [
      {
        language: {
          type: String,
          required: true,
        },
        code: {
          type: String,
          required: true,
        },

        submittedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserCode", userCodeSchema);
