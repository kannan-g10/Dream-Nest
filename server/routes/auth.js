const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const User = require('../models/User');

//Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, 'public/uploads'); //store uploaded files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); //Use the original filename
  },
});

const upload = multer({ storage });

/*USER REGISTER */
router.post('/register', upload.single('profileImage'), async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const profileImage = req.file;

    if (!profileImage) {
      res.status(401).send('No file Uploaded');
    }

    const profileImagePath = profileImage.path;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: 'User Already Exists',
      });
    }

    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create a new User
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profileImagePath,
    });

    await newUser.save();

    //Send Successful message
    res.status(201).json({
      message: 'User Registered successfully!',
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Registration Failed!',
      error: error.message,
    });
  }
});

/*USER LOGIN */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User doesn't exist!",
      });
    }

    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid Credentials!',
      });
    }

    //Generate Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
    delete user.password;

    res.status(200).json({ token, user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
