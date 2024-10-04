const express = require('express');
const cors = require('cors');
const app = express();  // Moved above app.use(cors());

app.use(cors());  // Enable CORS

app.use(express.json());

// Continue with your database connection and routes
const {connectToDb,getDb}=require('./db');

let db;

connectToDb((err)=>{
    if(!err){
        app.listen(3001,()=>{
            console.log("connected to database");
        })
        db=getDb();
    }
})



// //app.get request
app.get('/users',(req,res)=>{
    const page = req.query.p ||0;
    const usersPerPage=10;
    let users=[];

    db.collection('login')
    .find()
    .sort({id:1})
    .skip(page*usersPerPage)
    .limit(usersPerPage)
    .forEach((user)=>users.push(user))
    .then(()=>{
        res.status(200).json(users);
    })
    .catch(()=>{
        res.status(500).json({msg:'error'});
    })
})


app.get('/users/:id',(req,res)=>{
    const userID = parseInt(req.params.id);
    if(!isNaN(userID))
    {
        db.collection('login')
        .findOne({id:userID})
        .then((user)=>{
            if(user){
                res.status(200).json(user);
            }
            else{
                res.status(404).json({msg:'error student not found'});
            }
        })
        .catch(()=>{
            res.status(500).json({msg:'error in server'});
        })
    }
    else{
        res.status(400).json({msg:'id is not a number'});
    }
})


//post method
app.post('/users',(req,res)=>{
    const user = req.body;
    db.collection('login')
    .insertOne(user)
    .then((result)=>{
        res.status(200).json({result});
    })
    .catch(()=>{
        res.status(500).json({msg:'error in something'});
    })
})


//update method
app.patch('/users',(req,res)=>{
    let update = req.body;
    const userID = parseInt(req.params.id);
    if(!isNaN(userID)){
        db.collection('login')
        .updateOne({id:userID},{$set:update})
        .then((result)=>{
            res.status(200).json({result});
        })
        .catch(()=>{
            res.status(500).json({msg:'error'});
        })
    }
    else{
        res.status(400).json({msg:'not a number'});
    }
})


app.delete('/users/:id',(req,res)=>{
    const userID = parseInt(req.params.id);
    if(!isNaN(userID)){
        db.collection('login')
        .deleteOne({id:userID})
        .then((result)=>{
            res.status(200).json({result});
        })
        .catch(()=>{
            res.status(500).json({msg:'error in the code'});
        })
    }
    else{
        res.status(500).json({msg:'not a number'});
    }
})