const express = require('express')
const app = express();
const db = require('./db');
const {connectDB} = require('./db');
require('dotenv').config();
// const userRoutes = require('./routes/user.route.js');
// const candidateRoutes = require('./routes/candidate.route.js');
// const cors = require('cors'); 

connectDB();

// app.use(cors({
//   origin: 'http://localhost:3000', // or 5173 if you're using Vite
//   credentials: true
// }));

const bodyParser = require('body-parser'); 
app.use(bodyParser.json()); // req.body
const PORT =  5001;


// app.use('/user', userRoutes);
// app.use('/candidate', candidateRoutes);


//just for example


// Import the router files


app.get('/', (req,res)=>{
    // console.log("welcome to voting machine");
    res.send("hello let sstart the project");
});

// Use the routers



app.listen(PORT, ()=>{
    console.log('listening on port', PORT);
})