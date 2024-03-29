const express = require('express');
const checkAuth = require('../middleware/check-auth');
const multer = require('multer');

const Post = require('../models/post');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

// CONFIGURE STORAGE FOR UPLOAD IMAGES
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isVaild = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isVaild) {
      error = null;
    }
    cb(error, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLocaleLowerCase()
      .split(' ')
      .join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

// ADD POST
router.post(
  '',
  checkAuth,
  multer({ storage: storage }).single('image'),
  (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + '/images/' + req.file.filename
    });
    console.log('Recieved Post Data:', post);
    post.save().then(createdPost => {
      res.status(201).json({
        message: 'Post added successfully',
        post: {
          ...createdPost,
          id: createdPost._id
        }
      });
    });
  }
);

// EDIT POST
router.put(
  '/:id',
  checkAuth,
  multer({ storage: storage }).single('image'),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + '://' + req.get('host');
      imagePath = url + '/images/' + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath
    });
    console.log(post);
    Post.updateOne({ _id: req.params.id }, post).then(result => {
      console.log('Edit Result: ', result);
      res.status(200).json({ message: 'Post updated successfully' });
    });
  }
);

// GET ALL POSTS
router.get('', (req, res, next) => {
  // geting query parameters
  const pageSize = +req.query.pagesize;
  const currenPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currenPage) {
    postQuery.skip(pageSize * (currenPage - 1)).limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: 'Posts fetched succesfully!',
        posts: fetchedPosts,
        maxPosts: count
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
router.delete('/:id', checkAuth, (req, res, next) => {
  console.log('Delete ID Recieved', req.params.id);
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log('Post deleted with id:', req.params.id);
    res
      .status(200)
      .json({ message: 'Post Deleted! with ID :  ' + req.params.id });
  });
});

module.exports = router;
