
const express = require("express");
const app = express();
// const http = require("http");
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const historyRoutes = require("./routes/History");
const problemRoutes = require("./routes/Problem");
// const { Server } = require("socket.io");
// const ACTIONS = require("../src/Actions");


const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();


const PORT = process.env.PORT;

database.connect();


app.use(express.json());
app.use(cookieParser());

// const path = require("path");

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/auth", userRoutes);
app.use("/profile", profileRoutes);
app.use("/history", historyRoutes);
app.use("/problem", problemRoutes);



app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running ...",
  });
});


app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});


