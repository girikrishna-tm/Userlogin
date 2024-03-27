const express = require('express');
const sequelize = require('./config/database'); 
const userRoutes = require('./routes/userRoutes');
const passport = require('passport');


const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());


app.use('/api/users', userRoutes);

app.use(passport.initialize());


sequelize.sync()
  .then(() => {
    console.log('Database synced successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error syncing database:', err);
});