const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const {generateToken, verifyToken} = require('./auth');
const { Op } = require('sequelize');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');



passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback"
},
function(accessToken, refreshToken, profile, done) {
  const googleUserEmail = profile.emails[0].value;
  
 
  User.findOne({ where: { email: googleUserEmail } })
    .then(user => {
      if (user) {
        const token = generateToken(user);
        return done(null, token);
      } else {
        return User.create({
          username: profile.displayName,
          email: googleUserEmail,
        })
        .then(newUser => {
          const token = generateToken(newUser);
          return done(null, token);
        });
      }
    })
    .catch(err => {
      return done(err);
    });
}
));


router.get('/auth/google/register',
  passport.authenticate('google', { scope: ['profile', 'email'] }));


router.get('/auth/google/callback/register',
  passport.authenticate('google', { failureRedirect: '/register' }),
  function(req, res) {
    res.redirect('/'); 
  });





router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("encrypted password",hashedPassword); 
        const role = 'user';
        const isPublic = true;
        const newUser = await User.create({ username, password: hashedPassword, email, role});
        const token = generateToken(newUser.id);
        res.status(201).json({ message: 'User registered successfully', token });
      } catch (error) {
        if (error.name === 'SequelizeValidationError') {
      const errorMessages = error.errors.map((error) => error.message);
      return res.status(400).json({ message: 'Validation error', errors: errorMessages });
    }
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
      }
});

// Route to log in a user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email:email } });
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = generateToken(user);
        res.status(200).json({ message: 'Login successful' , token: token});
      } catch (error) {
        console.error('Error logging in:::', error);
        res.status(500).send('Internal Server Error');
      }
});

router.put('/profile', verifyToken, async (req, res) => {
  try {
      const userId = req.user.userId;

      const { bio, username, isPublic, profilephoto } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      if (bio !== undefined) {
          user.bio = bio;
      }
      if (username !== undefined) {
          user.username = username;
      }
      if (isPublic !== undefined) {
          user.isPublic = isPublic;
      }
      if (profilephoto !== undefined) {
          user.profilephoto = profilephoto;
      }

      await user.save();

      res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).send('Internal Server Error');
  }
});


router.get('/getusers', verifyToken, async (req, res) => {
  try {
      const authenticatedUserId = req.userId; 
      const userRole = req.user.role;

      if (userRole === 'admin') {
          const allUsers = await User.findAll({ where: {
          id: {
            [Op.not]: authenticatedUserId 
          }
        } });
          return res.status(200).json(allUsers);
      } else {
          const publicUsers = await User.findAll({ 
            where: { isPublic: true }, 
            attributes: ['bio', 'username', 'profilephoto', 'email'],
          });
          return res.status(200).json(publicUsers);
      }
  } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/usergetbyid', verifyToken, async (req, res) => {
  try {
    console.log('tokeeeenee',req.user);
    const userId = req.user.userId;

    const user = await User.findByPk(userId, { attributes: ['bio', 'username', 'profilephoto', 'email'] });


    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user data by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;