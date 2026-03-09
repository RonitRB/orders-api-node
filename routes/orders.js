const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/ordersController');

router.post('/', ctrl.createOrder);
router.get('/', ctrl.listOrders);
router.get('/:id', ctrl.getOrder);
router.put('/:id', ctrl.updateOrder);
router.delete('/:id', ctrl.deleteOrder);

module.exports = router;