const jwt = require("jsonwebtoken");
const User = require("../models/user");
const AppError = require("../utilts/AppError");

// Generate JWT Token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// Send response with token
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Hide password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: { user },
  });
};

// Signup
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, bio } = req.body;

    const newUser = await User.create({
      name,
      email,
      password,
      bio,
    });

    createSendToken(newUser, 201, res);
  } catch (err) {
    next(err);
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email & password exist
    if (!email || !password) {
      return next(new AppError("Please provide email and password!", 400));
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    // 3) If ok, send token
    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// Protect Middleware
exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new AppError("You are not logged in!", 401));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError("The user belonging to this token no longer exists.", 401));
    }

    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

// RestrictTo Middleware
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action", 403));
    }
    next();
  };
};
