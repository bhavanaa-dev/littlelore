// backend/src/routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Curated books (embedded, always available)
router.get('/curated', bookController.getCuratedBooks);

// Search Open Library (proxy)
router.get('/search', bookController.searchBooks);

// Get details for a specific Open Library work id or curated id
router.get('/detail/:id', bookController.getBookDetail);

// Free full-text (Project Gutenberg) for public-domain curated books
router.get('/read/:id', bookController.getBookText);

// Saved books CRUD (requires Prisma)
router.get('/saved', bookController.getSavedBooks);
router.post('/saved', bookController.saveBook);
router.delete('/saved/:id', bookController.deleteSavedBook);

module.exports = router;
