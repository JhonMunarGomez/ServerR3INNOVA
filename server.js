var express=require('express');
var bodyparser=require('body-parser');
var conexion= require('./conexion');
var path = require('path');

var app=express();
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
var routes= require('./router');
var cors=require('./cors');

app.use(cors.permisos);
app.use(express.static(__dirname + '/public'));
conexion.inicia();
routes.configurar(app);



var multer = require('multer');
var upload = multer({
    dest: './uploads/'
});
var fs = require('fs');



app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

var server=app.listen(8000,function(){
    console.log('Escuchando ', server.address().port);
})



