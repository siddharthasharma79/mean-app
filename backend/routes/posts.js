const express = require('express');
const Post = require('../models/post');

const router = express.Router();

// ADD POST
router.post('', (req, res, next) => {
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
router.put('/:id', (req, res, next) => {
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
router.get('', (req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: 'Posts fetched succesfully!',
      posts: documents
    });
  });
});

// GET SINGLE POST
router.get('/:id', (req, res, next) => {
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
router.delete('/:id', (req, res, next) => {
  console.log('Delete ID Recieved', req.params.id);
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log('Post deleted with id:', req.params.id);
    res
      .status(200)
      .json({ message: 'Post Deleted! with ID :  ' + req.params.id });
  });
});

module.exports = router;
