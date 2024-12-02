const express = require('express')
const cors = require('cors')
const bodyParser = require("body-parser")
const router = require("./routes/router");
const mongoose = require("mongoose");
const path = require('path');
require("dotenv/config")

const app = express();

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({extended:false}))

const corsOptions = {
    origin:["https://insta-weather.onrender.com"],
    credentials:true,
    optionsSuccessStatus:200
}

app.use(cors(corsOptions));
app.use('/', router);

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

mongoose
.connect(process.env.DB_URI, {})
.then(() => console.log("MONGODB Connected!"))
.catch((err)=> console.log(err));

const port = process.env.PORT || 4000;

const server = app.listen(port, ()=>{
    console.log(`Server is running: PORT ${port}`)
})


