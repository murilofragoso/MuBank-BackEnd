const express = require('express');
const router = express.Router();
const controller = require('../controllers/transaction')

router.post('/', controller.new)
router.get('/', controller.list)
router.get('/:id', controller.getById)
router.get('/balance/:idUser', controller.getBalance)
router.put('/', controller.update)
router.delete('/', controller.delete)

module.exports = router; 