const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();

// CONNECTING TO MONGO DB USING MONGOOSE
mongoose
  .connect(
    'mongodb+srv://sidd:LLw4rDPSOXbnl1th@cluster0-fbkfg.mongodb.net/node-angular'
  )
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.error('Connection failed!!!!');
  });

// MIDDLEWARE START #############################
// 1. BODY PARSER MIDDLEWARES
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 2. ALLOW PATH TO /IMAGES FOLDER
app.use('/images', express.static(path.join('backend/images')));

// 3. HEADER MIDDLEWARE
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  next();
});
// MIDDLEWARE END #############################

// POST ROUTES
app.use('/api/posts', postsRoutes);

// USER ROUTES
app.use('/api/user', userRoutes);

module.exports = app;
