// src/routes/formRoutes.js
const express = require('express');
const router = express.Router();
const { createForm, generatePDF } = require('../controllers/formController');

router.post('/create', createForm);
router.get('/pdf/:id', generatePDF);

module.exports = router;
