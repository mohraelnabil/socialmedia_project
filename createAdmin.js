const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/user");

dotenv.config();

async function createFirstAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // Check if admin exists
    const adminExists = await User.findOne({ role: "admin" });

    if (adminExists) {
      console.log("Admin already exists:", adminExists.email);
      process.exit();
    }

    // Create admin (password will be hashed automatically by pre('save'))
    const admin = await User.create({
      name: "Super Admin",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
      bio: "I am the first admin of the system.",
    });

    console.log("First Admin Created:", admin.email);
    process.exit();
  } catch (err) {
    console.error("Error creating admin:", err.message);
    process.exit(1);
  }
}

createFirstAdmin();
