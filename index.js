require('dotenv').config();
const client = require('./database');
const express = require('express');
const app = express();
const userRouter = require('./routes/user');
const bookRouter = require('./routes/book');
const orderRouter = require('./routes/order');
const PORT=process.env.PORT 
const cors = require('cors');
// json format data handling
app.use(cors());
app.use(express.json());
app.use('/users', userRouter);
app.use('/books', bookRouter);
app.use('/orders', orderRouter);






app.listen(PORT, ()=>{
    console.log(`http://localhost:${PORT}`);
})

client.connect((err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("Connected to database");
    }
})
