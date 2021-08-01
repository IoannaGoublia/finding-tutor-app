const express = require("express");
const mysql = require("mysql");
const path = require("path");
var session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');



const app = express();


const db = mysql.createConnection({
    user:'localhost',
    user: "root",
    password : '7112001##',
    database: 'apasxolisi'

});



const publicDirectory = path.join(__dirname , './public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.set('view engine' ,'hbs');



// ---------------SESSIONS----------------------------------


app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));

// ---------------END SESSION----------------------------------


app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));
const viewsDirectory = path.join(__dirname,'./views');
app.use(express.static(viewsDirectory));


// ---------------END SESSION----------------------------------

db.connect((error) => {
    if(error) {
        console.log(error)
    }
    else {
        console.log('MysQl Connected'); 
    }
})

//-------------DEFINE ROUTES-------------

app.use('/' , require('./routes/pages'))

app.use('/auth' , require('./routes/auth'));

app.listen(5000, ()=> {
    console.log("Server started to Port 5000")

});