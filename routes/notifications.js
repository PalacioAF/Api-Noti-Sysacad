const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/NotificationController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

router.post('/', 
    auth,
    [
        check('title', 'El título es obligatorio').not().isEmpty(),
    ],
    NotificationController.addNotification,
);

router.get('/',
    auth,
    NotificationController.getNotification
);

module.exports = router;