//Ruta para autenticar usuarios
const express=require('express');
const router=express.Router();
const authController=require('../controllers/authController')
const auth= require('../middleware/auth')

//iniciar sesion
// api/auth
router.post('/',
            authController.authenticateUser);

router.get('/',
            auth,
            authController.authenticatedUser);
                            
module.exports=router;