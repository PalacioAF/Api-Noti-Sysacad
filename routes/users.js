//Ruta para crear usuarios
const express=require('express');
const router=express.Router();
const userController=require('../controllers/userController')
const {check}=require('express-validator');

//Crear un usuario
// api/usuarios
router.post('/',[
                    check('name','El nombre es obligatorio').not().isEmpty(),
                    check('email','Agregar un mail válido').isEmail(),
                    check('password','El password debe ser minimo de 6 caracteres').isLength({min:6})
                ],
                userController.addUser);
module.exports=router;