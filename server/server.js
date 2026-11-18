
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

// Import route handlers for different resources
const blogRoutes = require("./routes/blog");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const tagRoutes = require("./routes/tag");

// Initialize the Express application
const app = express();

// Connect to MongoDB using the connection string stored in environment variables
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Configure middleware to process incoming requests
app.use(bodyParser.json()); // Parse incoming JSON request bodies
app.use(cookieParser()); // Parse cookies attached to incoming requests
app.use(morgan("dev")); // Log HTTP requests and responses in the console

// Configure CORS to allow requests from the frontend applications
// Credentials are enabled to support cookie-based authentication
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);

// Register API routes for blogs, authentication, users, categories and tags
app.use("/api", blogRoutes);
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", tagRoutes);

// Start the Express server and listen for incoming requests
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
