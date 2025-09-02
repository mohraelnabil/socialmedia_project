const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const AppError = require("./utilts/AppError");

dotenv.config();

const app = express();
app.use(express.json());

const apiLimiter = require("./middlewares/rateLimit");
app.use("/api", apiLimiter); 

// Routers
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const authRouter = require("./routes/authRoutes");

app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/auth", authRouter);


// 404 handler
app.use((req, res, next) => {
  next(new AppError("Page not found", 404));
});

// Global Error Handler
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ status: "error", statusCode: status, message });
});

// Connect to MongoDB & Start Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
