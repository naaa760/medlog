const User = require("../models/User");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  if (!firstName || !username || !email || !password) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  // Check if user exists
  const userExists = await User.findOne({ $or: [{ email }, { username }] });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    username,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      bio: user.bio,
      imageUrl: user.imageUrl,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Authenticate user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      bio: user.bio,
      imageUrl: user.imageUrl,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.bio = req.body.bio || user.bio;
    user.imageUrl = req.body.imageUrl || user.imageUrl;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      username: updatedUser.username,
      email: updatedUser.email,
      bio: updatedUser.bio,
      imageUrl: updatedUser.imageUrl,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Follow user
// @route   PUT /api/users/:id/follow
// @access  Private
const followUser = asyncHandler(async (req, res) => {
  // Get the user to follow
  const userToFollow = await User.findById(req.params.id);
  // Get the current user
  const user = await User.findById(req.user._id);

  if (!userToFollow) {
    res.status(404);
    throw new Error("User not found");
  }

  if (userToFollow._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot follow yourself");
  }

  // Check if already following
  const alreadyFollowing = user.following.includes(userToFollow._id);

  if (alreadyFollowing) {
    res.status(400);
    throw new Error("Already following this user");
  }

  // Add to following list
  await User.findByIdAndUpdate(req.user._id, {
    $push: { following: userToFollow._id },
  });

  // Add to followers list
  await User.findByIdAndUpdate(req.params.id, {
    $push: { followers: req.user._id },
  });

  res.status(200).json({ message: "User followed successfully" });
});

// @desc    Unfollow user
// @route   PUT /api/users/:id/unfollow
// @access  Private
const unfollowUser = asyncHandler(async (req, res) => {
  // Get the user to unfollow
  const userToUnfollow = await User.findById(req.params.id);
  // Get the current user
  const user = await User.findById(req.user._id);

  if (!userToUnfollow) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if already following
  const alreadyFollowing = user.following.includes(userToUnfollow._id);

  if (!alreadyFollowing) {
    res.status(400);
    throw new Error("Not following this user");
  }

  // Remove from following list
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { following: userToUnfollow._id },
  });

  // Remove from followers list
  await User.findByIdAndUpdate(req.params.id, {
    $pull: { followers: req.user._id },
  });

  res.status(200).json({ message: "User unfollowed successfully" });
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUserById,
  followUser,
  unfollowUser,
};
