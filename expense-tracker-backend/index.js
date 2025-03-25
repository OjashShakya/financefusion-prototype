require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const mainRouter = require("./route/index.route");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");

const app = express();

// CORS setup
app.use(cors({
  origin: "http://localhost:3000",
  origin: "http://localhost:3001",
  credentials: true,
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
connectDB();

app.use("/api", mainRouter);

app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
