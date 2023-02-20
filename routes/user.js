const express   = require('express');

const router    = express.Router();

const client    = require('../database');

const jwt       = require('jsonwebtoken');

router.get('/', (req, res)=>{
    client.query(`Select * from users`, (err, result)=>{
        if(!err){
            // console.log(result.rows);
           return res.status(200).send(result.rows);
        }
    });
    client.end;
})

router.post('/signup', (req, res)=> {
    const user = req.body;
    console.log('req.body: ', req.body);
    let insertQuery = `insert into users(id, username, password) 
                       values(${user.id}, '${user.username}', '${user.password}')`

    client.query(insertQuery, (err, result)=>{
        if(!err){
           return resres.status(201).send('Insertion was successful')
        }
        else{ console.log(err.message) 
            return res.send({
                message: 'Insertion failed',
                error: err
            })
        }
    })
    client.end;
})

router.post('/login', (req, res)=>{

    const user = req.body;

    let selectQuery = `select * from users where username = '${user.username}' and password = '${user.password}'`

    client.query(selectQuery, (err, result)=>{
        console.log('result.rows.length: ', result.rows.length);
        if(!err){
            if(result.rows.length > 0){

              const token = jwt.sign(
                    {username: result.rows[0].username},
                    process.env.JWT_SECRET,
                    {expiresIn: '7days'}
              )  
              return  res.status(200).send({message:'Login successful'
              ,
                token: token,
            username : result.rows[0].username
            })
            }
            else{
                return  res.status(400).send({message:'Login failed please check your credentials'})
            }
        }
        else{ console.log(err.message)
            return res.send({
                message: 'Login failed',
                error: err
            })
        }
    })

    client.end;
})

module.exports = router;

