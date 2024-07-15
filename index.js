const express=require('express');
const conectarDB=require('./config/db');
const cors=require('cors');

const app=express();

conectarDB();

app.use(cors());

app.use(express.json({extended:true}));

const port=process.env.PORT ||5000;

app.use('/api/users',require('./routes/users'));
app.use('/api/auth',require('./routes/auth'));
app.use("/api/notifications", require("./routes/notifications"));

app.listen(port,'0.0.0.0',()=>{
    console.log('Bienvenido AFPalacio');
});