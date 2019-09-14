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
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
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
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      postId: createdPost._id
    });
  });
});

// EDIT POST
app.put('/api/posts/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });

  Post.updateOne({ _id: req.params.id }, post).then(result => {
    console.log('Edit Result: ', result);
    res.status(200).json({ message: 'Post updated successfully' });
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

// GET SINGLE POST
app.get('/api/posts/:id', (req, res, next) => {
  console.log('getting single post');
  Post.findById(req.params.id).then(post => {
    if (post) {
      console.log('post: ', post);
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found!' });
    }
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
