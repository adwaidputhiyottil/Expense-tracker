const express = require( 'express' );
const router = express.Router();
const { analyzeExpenses } = require('../controllers/analysisController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, analyzeExpenses);

module.exports = router;
