var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(cors());
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-control-Allow-Headers','*');
    if(req.method === 'OPTIONS'){
        req.header('Access-Control-Allow-Origin','*');
        return res.status(200).json({message:'got'});
    }else{
        return next();
    } 
});

var index = require('./app/routes/routes');

app.use('/',index ); 

 app.listen(8082, function () {
  console.log("Server started....")
 
 })

