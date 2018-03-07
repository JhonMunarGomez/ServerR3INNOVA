var db = require('./Module/api')
var multer = require('multer');
var upload = multer({
    dest: './uploads/'
});
var fs = require('fs');


function http() {
    this.configurar = function (app) {
        app.post('/Tipos/',function(solicitud,respuesta){
            db.IngresarTipos(solicitud.body,respuesta);
        })
        app.get('/ConsultarTipos/:codigo_dispositivo',function(solicitud,respuesta){   
            db.ConsultarTipos(solicitud.params.codigo_dispositivo,respuesta);
        })
        app.get('/ConsultarCategoriaWeb/',function(solicitud,respuesta){
            db.ConsultarCategoriaWeb(respuesta);
        })
        app.post("/RegistrarCategoria", multer({
            dest: "./uploads/"
        }).array("imagen[]", 1), function (req, res) {
            db.RegistrarCategoria(req.body, res, fs, req.files);
        });

        app.post("/RegistrarEvento", multer({
            dest: "./uploads/"
        }).array("imagen[]", 1), function (req, res) {
            db.IngresarEvento(req.body, res, fs, req.files);
        });
     app.post("/RegistrarDispositivo", multer({
            dest: "./uploads/"
        }).array("imagen[]", 1), function (req, res) {
            console.log(req.body);
            db.RegistrarDispositivos(req.body, res, fs, req.files);
        });
        app.post('/usuario/', function (solicitud, respuesta) {
            db.IngresarUsuario(solicitud.body, respuesta);
        })
        app.get('/credencial/:nombre_credencial', function (solicitud, respuesta) {
            db.ValidarCredencial(solicitud.params.nombre_credencial, respuesta);
        })
          app.get('/VerDispositivo/:codigo_dispositivo', function (solicitud, respuesta) {
            db.VerDispositivo(solicitud.params.codigo_dispositivo, respuesta);
        })
        app.get('/usuario/:cedula', function (solicitud, respuesta) {
            db.ValidarUsuario(solicitud.params.cedula, respuesta);
        })
        app.get('/categoria/', function (solicitud, respuesta) {
            db.ConsultarCategorias(respuesta);
        })
        app.get('/dispositivo/:codigo_categoria', function (solicitud, respuesta) {
            db.ConsultarDispositivos(solicitud.params.codigo_categoria, respuesta);
        })

        app.post('/detalleentrega/', function (solicitud, respuesta) {
          
            db.IngresarDetalle(solicitud.body, respuesta);
        })
        app.post('/entrega/', function (solicitud, respuesta) {
            
            db.IngresarEntrega(solicitud.body.codigo_usuario, respuesta);
        })

        app.get('/categoria/:codigo_categoria', function (solicitud, respuesta) {
            db.ConsultarCategoriasParams(solicitud.params.codigo_categoria, respuesta);
        })

        app.get('/Consultar/Dispositivos', function (solicitud, respuesta) {
            db.ConsultarTodosDispositivos(respuesta);
        })
        app.post('/IngresarDispositivo/', function (solicitud, respuesta) {
            db.IngresarDispositivos(solicitud.body, respuesta);
        })
        app.post('/IngresarCategoria/', function (solicitud, respuesta) {
            db.CrearCategoria(solicitud.body, respuesta);
        })
        app.get('/ConsultarCredenciales/:nombre_credencial&:contrasena', function (solicitud, respuesta) {
            db.ConsultarCredenciales(solicitud.params, respuesta);
        })
        app.get('/ConsultarEventos/', function (solicitud, respuesta) {
            db.ConsultarEventos(respuesta);
        })
        app.get('/ConsultarCodigo/:codigo_dispositivo', function (solicitud, respuesta) {
            db.ConsultarCodigo(solicitud.params.codigo_dispositivo, respuesta);
        })
        app.post('/IngresarEntrega/', function (solicitud, respuesta) {
            db.HacerEntregar(solicitud.body, respuesta);
        })
        app.get('/DispositivosPeso/', function (solicitud, respuesta) {
            db.Dispositivos(respuesta);
        })
        app.post('/ActualizarPeso/', function (solicitud, respuesta) {
            db.ActualizarPeso(solicitud.body, respuesta);
        })
        app.post('/RegistrarCredenciales/', function (solicitud, respuesta) {
            db.RegistrarCredenciales(solicitud.body, respuesta);
        })
        app.get('/ConsultarEvento/:codigo_evento',function(solicitud,respuesta){
            db.ConsultarEvento(solicitud.params.codigo_evento,respuesta);
        })
        app.get('/consultarmarcas/',function(solicitud,respuesta){
            db.consultarmarcas(respuesta);
        })
        app.get('/ConsultarContenedor/',function(solicitud,respuesta){
           db.ConsultarContenedor(respuesta);
        })
        app.get('/RetirarContenedor/:codigo_categoria',function(solicitud,respuesta){
            db.RetirarContenedor(solicitud.params.codigo_categoria,respuesta);
        })

        app.get('/ConsultarDetalleContenedor/:codigo_categoria',function(solicitud,respuesta){
            db.ConsultarDetalleContenedor(solicitud.params.codigo_categoria,respuesta);
        })
    
    }

}

module.exports = new http();