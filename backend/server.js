const express = require('express')
const app = express();
const db = require('./db');
const {connectDB} = require('./db');
require('dotenv').config();
const userRoutes = require('./routes/user.route.js');
const groupRoutes = require('./routes/group.route.js');



connectDB();


const bodyParser = require('body-parser'); 
app.use(bodyParser.json()); // req.body
const PORT =  5001;


app.use('/user', userRoutes);
app.use('/group', groupRoutes);



app.get('/', (req,res)=>{
    res.send("hello lets work on the project");
});

app.listen(PORT, ()=>{
    console.log('listening on port', PORT);
})