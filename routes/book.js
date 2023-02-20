const express   = require('express');

const router    = express.Router();

const client    = require('../database');

router.get('/', (req, res)=>{
    const {bookname} = req.query;
    console.log('bookname: ', bookname);
    
        //partial search 
        client.query(`Select * from books where bookname like '%${bookname}%'`, (err, result)=>{
            if(!err){
                // console.log(result.rows);
                return  res.status(200).send(result.rows);
            }else{

                console.log(err.message);
                return res.send({
                    message: 'Error in fetching books',
                    error: err
                })
            }
        });
    
    client.end;

})

router.post('/', (req, res)=> {
    const book = req.body;
    console.log('req.body: ', req.body);
    let insertQuery = `insert into books(id, bookname,image, price) 
                       values(${book.id}, '${book.bookname}','${book.image}', '${book.price}')`

    client.query(insertQuery, (err, result)=>{
        if(!err){
          return res.status(201).send({message:'Book added successfully'})
        }
        else{ console.log(err.message)
            return res.status(400).send({
                message: 'Book addition failed',
                error: err
            })
        
        }
    })
    client.end;
})


module.exports = router;

