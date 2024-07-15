const User=require('../models/User');
const bcryptjs=require('bcryptjs');
const {validationResult}=require('express-validator');
const jwt=require('jsonwebtoken');

exports.addUser=async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errores: errors.array()})
    }

    const{email,password}=req.body;

    try {
        let user=await User.findOne({email});

        if(user){
            return res.status(400).json({msg:'El usuario ya existe'});
        }

        user=new User(req.body);

        const salt=await bcryptjs.genSalt(10);
        user.password=await bcryptjs.hash(password,salt);

        await user.save();

        const payload={
            user:{
                id:user.id
            }
        }

        jwt.sign(payload,process.env.SECRET,{
            expiresIn:3600
        },(error,token)=>{
            if(error) throw error;
            res.json({msg:'Usuario creado correctamente',token});
        }
        )
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Hubo un error" });
    }
}