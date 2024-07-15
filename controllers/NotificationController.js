const Notification = require('../models/Notification');
const { validationResult } = require('express-validator');
const messagingController = require('../controllers/messagingController');

exports.addNotification = async (req, res) => {
    const errors = validationResult(req);
    if( !errors.isEmpty() ) {
        return res.status(400).json({errores: errors.array() })
    }
    
    try {
        const notification = new Notification(req.body);
        notification.user=req.user.id;
        await notification.save();
        const resFirebase = await messagingController.send(req);
        if (resFirebase){
            const {successCount}=resFirebase
            notification.state = successCount > 0;
            await notification.save();
        }
        const populatedNotification = await Notification.findById(
          notification._id
        ).populate({
          path: "user",
          select: "name email -_id",
        });
        res.json({ notification : populatedNotification });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}

exports.getNotification = async (req, res) => {
    const errors = validationResult(req);
    if( !errors.isEmpty() ) {
        return res.status(400).json({errores: errors.array() })
    }
    try {
        const notifications = await Notification.find().populate({
          path: "user",
          select: "name email -_id",
        });
        res.json({ notifications });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}