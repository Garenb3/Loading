const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");


// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/media", require("./routes/mediaRoutes"));
app.use("/api/user", require("./routes/userRoutes"));

app.get("/", (req, res) => {
  res.send("API running");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));