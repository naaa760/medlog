const User = require("../models/User");

// Sync user from Clerk
exports.syncUser = async (req, res) => {
  try {
    const { id, firstName, lastName, imageUrl, email } = req.body;

    let user = await User.findOne({ clerkId: id });

    if (user) {
      // Update existing user
      user.firstName = firstName;
      user.lastName = lastName;
      user.imageUrl = imageUrl;
      user.email = email;
    } else {
      // Create new user
      user = new User({
        clerkId: id,
        firstName,
        lastName,
        imageUrl,
        email,
      });
    }

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.params.id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
