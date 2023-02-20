const express   = require('express');

const router    = express.Router();

const client    = require('../database');
const jwt      = require('jsonwebtoken');

const middleware = (req, res, next) => {
    const {token} = req.headers;

    if(!token){
        return res.status(401).send({message: 'Token not provided'})
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
        // console.log('decoded: ', decoded);
        if(err){
            return res.status(401).send({message: 'Invalid token'})
        }
        req.username = decoded.username;
        next();
    })
}

router.use(middleware);

router.get('/', (req, res)=>{
    const {username} = req;
    
    client.query(`Select * from orders where username = '${username}'`, (err, result)=>{
    
    if(!err){
            // console.log(result.rows);
            let bookname = []
            if(result.rows.length !== 0){
                for(let i=0; i<result.rows[0].bookname.length; i++){
                    bookname.push({
                        bookname: result.rows[0].bookname[i],
                        bookdate: result.rows[0].bookdate[i]
                    })
                }
        };
              return res.status(200).send(bookname);
        }else{
            console.log(err.message);
            return res.send({
                message: 'Error in fetching orders',
                error: err
            })
        }
    });
    
    client.end;

})


// console.log('new Date(): ', new Date(new Date()).toDateString());
router.post('/', (req, res)=> {
    
    const {username} = req;
    
    const {bookname} = req.body;

    client.query(`Select * from orders where username = '${username}'`, (err, result)=>{

        if(!err){

           if(result.rows.length === 0){
            // insert into orders table bookname in array
            let insertQuery = `insert into orders(username, bookname,bookdate)
            values('${username}', ARRAY['${bookname}'], ARRAY['${new Date()}'])`

            client.query(insertQuery, (err, result)=>{
                if(!err){
                    return res.status(201).send({
                        message:'Book added to orders successfully',
                    })
                }
                else{ 
                    console.log(err.message) 
                    return res.send({
                        message: 'Insertion failed',
                        error: err
                    })
                }
            })
        }
        else{
            // updating orders table bookname in array and bookdate in array
            let updateQuery = `update orders set bookname = array_append(bookname, '${bookname}'), bookdate = array_append(bookdate, '${new Date()}') where username = '${username}'`

            client.query(updateQuery, (err, result)=>{
                if(!err){
                    return res.status(201).send({
                        message:'Book added to orders successfully',
                    })
                }
                else{ console.log(err.message) 
                    return res.send({
                        message: 'Insertion failed',
                        error: err
                    })
                }
            })
         }

        }
})
    client.end;
})


router.delete('/', (req, res)=> {

    const {username} = req;

    const {bookname,bookdate} = req.headers;
    console.log('bookdateindex: ', bookdate);
    // console.log('bookname: ', bookname);
//    delete bookname from orders table and bookdate from orders table at bookdateindex
    let deleteQuery = `update orders set bookname = array_remove(bookname, '${bookname}'), bookdate = array_remove(bookdate, '${bookdate}') where username = '${username}'`
  client.query(deleteQuery, (err, result)=>{
        if(!err){
            return res.status(201).send({
                message:'Book removed from orders successfully',
            })
        }
        else{ 
            console.log(err.message) 
            return res.send({
                message: 'Deletion failed',
                error: err
            })
        }
    })
    client.end;
})



module.exports = router;

