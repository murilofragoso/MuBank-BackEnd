const express = require('express');
const router = express.Router();
const controller = require('../controllers/user')

router.post('/', controller.new)
router.post('/login', controller.login)
router.get('/', controller.list)
router.get('/:id', controller.getById)
router.put('/', controller.update)
router.delete('/', controller.delete)

module.exports = router; 