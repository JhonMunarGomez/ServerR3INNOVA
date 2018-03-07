var mysql=require('mysql');


function conexion(){
    this.pool=null;

    this.inicia= function(){
        this.pool=mysql.createPool({
         connectionLimit:100,
         host:'localhost',
         user:'root',
         password:'root',
         database: 'scraeyet'
        })
    }
    this.obtener= function(callback){
        this.pool.getConnection(function(error,connection){
         callback(error,connection);
        })
    }   
}

module.exports=new conexion();