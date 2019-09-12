const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Post = require('./models/post');

const app = express();
mongoose
  .connect(
    'mongodb+srv://sidd:LLw4rDPSOXbnl1th@cluster0-fbkfg.mongodb.net/node-angular?retryWrites=true&w=majority'
  )
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.error('Connection failed!!!!');
  });
// MIDDLEWARE START #############################

// BODY PARSER MIDDLEWARES
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// HEADER MIDDLEWARE
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});
// MIDDLEWARE END #############################

// ADD POST
app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  console.log('Recieved Post Data:', post);
  post.save();
  res.status(201).json({
    message: 'Post added successfully'
  });
});

// GET POSTS
app.get('/api/posts', (req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: 'Posts fetched succesfully!',
      posts: documents
    });
  });
});

// DELETE POST
app.delete('/api/posts/:id', (req, res, next) => {
  console.log('Delete ID Recieved', req.params.id);
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log('Post deleted with id:', req.params.id);
    res
      .status(200)
      .json({ message: 'Post Deleted! with ID :  ' + req.params.id });
  });
});

module.exports = app;
