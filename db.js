const { MongoClient} =require('mongodb');
let dbConnection;

const uri='mongodb+srv://ayushgunjal2025:ayushgunjal@cluster0.tyxfs.mongodb.net/Farmer?retryWrites=true&w=majority';

module.exports={
    connectToDb:(callback)=>{
        MongoClient.connect(uri)
        .then((client)=>{
            dbConnection=client.db();
            callback();
        })
        .catch((err)=>{
            console.log(err);
            callback();
        })
    },
    getDb:()=>dbConnection
}