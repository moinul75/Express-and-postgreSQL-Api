const express = require('express');
const app = express()
const dotenv = require('dotenv');
const bodyParser = require('body-parser')
dotenv.config()
const PORT = process.env.port || 4000

const {v4 : uuid4} = require("uuid");


const { Pool } = require('pg');



//Connect to our database which is called PostgreSQL



 
const pool = new Pool({
    host: process.env.DB_HOST,
    user:process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE
})





//get data from a form 
app.use(bodyParser.urlencoded({ extended: false }));

// Parse JSON data
app.use(bodyParser.json());



//GET -> /book -> return all the books 
app.get("/book",async(req,res)=>{
    try {
        const allData = await pool.query("SELECT * FROM bookinfo")
        res.status(202).json({"message":`books are return successfully`,data:allData.rows});


        
    } catch (error) {
        res.status(500).json({"message":error});
        
    }
})
//GET -> /:id -> return a specific books 
app.get("/book/:id",async(req,res)=>{
    try {
        const {id} = req.params;
        //get a data from an id 
        const single_data = await pool.query("SELECT * FROM bookinfo WHERE id=$1",[id]);
        res.status(200).json({"message":`return the book`,data:single_data.rows})
    } catch (error) {
        res.status(501).json({"message":error})
        
    }
})
//POST -> /book -> crete a book 
app.post("/book",async(req,res)=>{
    try {
      const id = uuid4();
      const {name, description} = req.body;
      //INSERT DATA TO postgreSQL
      const myData = await pool.query("INSERT INTO bookinfo (id,name,description) VALUES ($1,$2,$3) RETURNING *",[id,name,description])
      res.status(201).json({"message":`created the book successfully!!`,data:myData.rows});
        
        
    } catch (error) {
        res.status(501).json({"message":error.message});
        
    }
    

})
//PUT /book/:id -> update a book 
app.put("/update/:id",async(req,res)=>{
    try {
        const {id} = req.params
        const {name, description} = req.body
        const updated_data = await pool.query("UPDATE bookinfo SET name=$1, description=$2 WHERE id=$3",[name,description,id]);
        res.status(202).json({"message":`book  is updated  successfully`,data:updated_data});
        
    } catch (error) {
        
    }
})





//DELTE /:id -> delete a book 
app.delete("/delete/:id", async(req,res)=>{
    const {id} = req.params
    await pool.query("DELETE FROM bookinfo WHERE id=$1",[id]);
    res.status(202).json({"message":`Successfully Delete the book`})
})



app.listen(PORT,(req,res)=>{
    console.log(`server is running on http://localhost:${PORT}`)
});



