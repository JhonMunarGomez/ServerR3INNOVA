var connection = require('../conexion');
const url = "104.131.33.226:8000";

function Api() {

    this.RetirarContenedor=function(id,resultado){
        connection.obtener(function(er,cn){
            cn.query('update detalle_contenedor set detalle_contenedor.estado=\'retirado\' where detalle_contenedor.codigo_categoria=?',id,function(error,respuesta){
                if(error){
                     resultado.send({estado:'No se Pudo Retirar el contenedor'});
                }else{
                    console.log(respuesta);
                    resultado.send(respuesta);
                }
            })
        })
    }
   this.ConsultarDetalleContenedor=function(id,resultado){
       connection.obtener(function(er,cn){
           cn.query('select *from detalle_contenedor as dt  inner join dispositivo as d on (dt.codigo_dispositivo=d.codigo_dispositivo) where dt.codigo_categoria=? and dt.estado=\'depositado\'',id,function(error,respuesta){
               cn.release();
               if(error){
                   resultado.send({estado:'error'});
               }else{
                   resultado.send(respuesta);
               }
           })
       })
   }

   //
   this.ConsultarContenedor=function(resultado){
       connection.obtener(function(er,cn){
           cn.query('select c.codigo_contenedor,cate.codigo_categoria,ct.estado,cate.nombre_categoria,ct.total_dispositivos,c.total_dispositivos_contenedor from contenedor as c inner join contenido_categoria as ct  on(ct.codigo_contenedor=c.codigo_contenedor) inner join categoria as cate on(cate.codigo_categoria=ct.codigo_categoria)',function(error,respuesta){
               cn.release();
               if(error){
                  resultado.send({estado:'error'});
               }else{
                   resultado.send(respuesta);
               }
           })
       })
   }

   ///
   this.RegistrarCategoria = function (datos, resultado, fs, files) {
        connection.obtener(function (er, cn) {
            cn.beginTransaction(function (err) {
                if (err) {
                    throw err;
                }

               console.log(datos);
                cn.query('INSERT INTO categoria values(DEFAULT,?,?,null,?,?)', [datos.nombre_categoria, datos.descripcion,datos.estado, datos.codigo_container], function (err, result) {
                    if (err) {
                        cn.rollback(function () {
                            throw err;
                        });
                    }
                   var log = result.insertId;
                    var ext;
                    var nombre;
                    for (var x = 0; x < files.length; x++) {
                        //copiamos el archivo a la carpeta definitiva de fotos
                        console.log(files[x]);
                        ext = files[x].originalname.split(".").pop();

                        fs.createReadStream('./uploads/' + files[x].filename).pipe(fs.createWriteStream('./public/categorias/' + files[x].originalname));
                        //borramos el archivo temporal creado
                        fs.unlink('./uploads/' + files[x].filename);
                        fs.rename('./public/categorias/' + files[x].originalname, './public/categorias/' + log + "." + ext);
                        nombre = log + "." + ext;
                    }

                    cn.query('update categoria set imagen=CONCAT(\'http://' + url + '/categorias/\',?) where codigo_categoria=?', [nombre, log], function (err, result) {
                        if (err) {
                            cn.rollback(function () {
                                throw err;
                            });
                        }
                        cn.commit(function (err) {
                            if (err) {
                                cn.rollback(function () {

                                    throw err;
                                })
                            } else {

                                resultado.send({
                                    estado: 'completado'
                                });
                            }


                        })
                    })
                })
            })
        })
    }


    ////
    this.consultarmarcas=function (resultado) {
        connection.obtener(function (er, cn) {
            cn.query('select *from marca', function (error, respuesta) {
                cn.release();
                if (error) {
                    resultado.send({
                        estado: 'error'
                    })
                } else {
                    resultado.send(respuesta);
                }
            })
        })
    }
    this.VerDispositivo=function (datos, resultado) {
        connection.obtener(function (er, cn) {
            cn.query('select *from dispositivo where codigo_dispositivo=?', datos, function (error, respuesta) {
                cn.release();
                if (error) {
                    resultado.send({
                        estado: 'error'
                    })
                } else {
                    resultado.send(respuesta);
                }
            })
        })
    }
    ///
    this.RegistrarDispositivos = function (datos, resultado, fs, files) {
        connection.obtener(function (er, cn) {
            cn.beginTransaction(function (err) {
                if (err) {
                    throw err;
                }


                cn.query('INSERT INTO dispositivo values(?,?,?,?,DEFAULT)', [datos.codigo_dispositivo, datos.codigo_categoria, datos.nombre_dispositivo, datos.descripcion], function (err, result) {
                    if (err) {
                        cn.rollback(function () {
                            throw err;
                        });
                    }
                   
                    var ext;
                    var nombre;
                    for (var x = 0; x < files.length; x++) {
                        //copiamos el archivo a la carpeta definitiva de fotos
                        console.log(files[x]);
                        ext = files[x].originalname.split(".").pop();

                        fs.createReadStream('./uploads/' + files[x].filename).pipe(fs.createWriteStream('./public/dispositivo/' + files[x].originalname));
                        //borramos el archivo temporal creado
                        fs.unlink('./uploads/' + files[x].filename);
                        fs.rename('./public/dispositivo/' + files[x].originalname, './public/dispositivo/' + datos.codigo_dispositivo + "." + ext);
                        nombre = datos.codigo_dispositivo + "." + ext;
                    }

                    cn.query('update dispositivo set imagen=CONCAT(\'http://' + url + '/dispositivo/\',?) where codigo_dispositivo=?', [nombre, datos.codigo_dispositivo], function (err, result) {
                        if (err) {
                            cn.rollback(function () {
                                throw err;
                            });
                        }
                        cn.commit(function (err) {
                            if (err) {
                                cn.rollback(function () {

                                    throw err;
                                })
                            } else {

                                resultado.send({
                                    estado: 'completado'
                                });
                            }


                        })
                    })
                })
            })
        })
    }

    ///
    this.ValidarCredencial = function (datos, resultado) {
        connection.obtener(function (er, cn) {
            cn.query('select  nombre_credencial,codigo_rol from  credenciales as cr where cr.nombre_credencial=?', datos, function (error, respuesta) {
                cn.release();
                if (error) {
                    resultado.send({
                        estado: 'error'
                    })
                } else {
                    resultado.send(respuesta);
                }
            })
        })
    }

    this.RegistrarCredenciales = function (datos, resultado) {
        connection.obtener(function (er, cn) {
            cn.query('insert into credenciales values(DEFAULT,?,?,?,md5(?))', [datos.codigo_usuario, datos.codigo_rol, datos.nombre_credencial, datos.contrasena], function (error, respuesta) {
                cn.release();
                if (error) {
                    resultado.send({
                        estado: 'error'
                    })
                } else {
                    resultado.send(respuesta);
                }
            })
        })
    }
    this.ActualizarPeso = function (datos, resultado) {
        connection.obtener(function (er, cn) {
            cn.query('update detalle_entrega  set descripcion=? , peso=? where codigo_detalle=? and codigo_dispositivo=?', [datos.descripcion, datos.peso, datos.codigo_detalle, datos.codigo_dispositivo], function (error, respuesta) {
                cn.release();
                if (error) {
                    resultado.send({
                        estado: 'error'
                    });
                } else {
                    resultado.send(respuesta);
                }
            })
        })
    }
    this.IngresarEvento = function (datos, resultado, fs, files) {
        connection.obtener(function (er, cn) {
            cn.beginTransaction(function (err) {
                if (err) {
                    throw err;
                }


                cn.query('INSERT INTO evento values (DEFAULT,?,?,?,?,?,null,\'activo\')', [datos.nombre_evento, datos.descripcion, datos.fecha, datos.hora, datos.horafin], function (err, result) {
                    if (err) {
                        cn.rollback(function () {
                            throw err;
                        });
                    }
                    var log = result.insertId;

                    var ext;
                    var nombre;
                    for (var x = 0; x < files.length; x++) {
                        //copiamos el archivo a la carpeta definitiva de fotos
                        console.log(files[x]);
                        ext = files[x].originalname.split(".").pop();

                        fs.createReadStream('./uploads/' + files[x].filename).pipe(fs.createWriteStream('./public/eventos/' + files[x].originalname));
                        //borramos el archivo temporal creado
                        fs.unlink('./uploads/' + files[x].filename);
                        fs.rename('./public/eventos/' + files[x].originalname, './public/eventos/' + log + "." + ext);
                        nombre = log + "." + ext;
                    }

                    cn.query('update evento set imagen_url=CONCAT(\'http://' + url + '/eventos/\',?) where codigo_evento=?', [nombre, log], function (err, result) {
                        if (err) {
                            cn.rollback(function () {
                                throw err;
                            });
                        }
                        cn.commit(function (err) {
                            if (err) {
                                cn.rollback(function () {

                                    throw err;
                                })
                            } else {

                                resultado.send({
                                    estado: 'completado'
                                });
                            }


                        })
                    })
                })
            })
        })
    }
    this.HacerEntregar = function (datos, resultado) {

        connection.obtener(function (er, cn) {
            cn.beginTransaction(function (err) {
                if (err) {
                    throw err;
                }
                cn.query('INSERT INTO entrega values (DEFAULT,CURDATE(),curTime(),0,(select u.codigo_usuario from usuario as u where u.cedula=?),?)', [datos.identificacion,datos.codigo_evento], function (err, result) {
                    if (err) {
                        connection.rollback(function () {
                            throw err;
                        });
                    }

                    var log = result.insertId;

                    for (var i = 0; i < datos.dispositivo.length; i++) {

                        cn.query('INSERT INTO detalle_entrega values(?,?,?,1,?,?,?,?)', [datos.dispositivo[i].codigo, datos.dispositivo[i].codigo_dispositivo, log, datos.dispositivo[i].descripcion, datos.dispositivo[i].peso,datos.dispositivo[i].codigo_marca,datos.dispositivo[i].codigo_tipo], function (err, result) {
                            if (err) {
                                cn.rollback(function () {

                                    throw err;
                                });
                            }

                        });

                    }
                    cn.commit(function (err) {
                        if (err) {
                            cn.rollback(function () {

                                throw err;
                            })
                        } else {
                            resultado.send({
                                estado: 'completado'
                            });
                        }


                    })


                });
            });
        })
    }
    this.Dispositivos = function (resultado) {
        connection.obtener(function (er, cn) {
            cn.query('select *from detalle_entrega as dt inner join entrega as e on(dt.codigo_entrega=e.codigo_entrega) where e.codigo_evento=2 and dt.peso is null or dt.peso=0  order by dt.codigo_dispositivo', function (error, respuesta) {
                cn.release();
                if (error) {
                    resultado.send({
                        estado: error
                    });
                } else {
                    resultado.send(respuesta);
                }
            })
        })
    }

    this.IngresarDetalle = function (datos, resultado) {
        connection.obtener(function (er, cn) {
            cn.query('insert into dt_entrega_contenedor values(DEFAULT,?,(select MAX(codigo_entrega) as codigo from entrega_contenedor where codigo_usuario=(select u.codigo_usuario from usuario as u where u.cedula=?)),?,null,null)', [datos.codigo_dispositivo,datos.id, datos.cantidad], function (error, respuesta) {
                cn.release();
                if (error) {
                    console.log(error);
                    resultado.send({
                        estado: 'error'
                    })
                } else {

                    resultado.send("Ingresado")
                }
            })
        })
    }
    this.IngresarUsuario = function (datos, resultado) {
        connection.obtener(function (er, cn) {
            cn.query('insert into usuario values(DEFAULT,?,?,?,?,?)', [datos.identificacion, datos.nombre, datos.apellido, datos.telefono, datos.correo], function (error, respuesta) {
                cn.release();
                if (error) {
                    resultado.send({
                        estado: 'error'
                    })
                } else {
                    resultado.send(respuesta)
                }
            })
        })
    }
    this.IngresarEntrega = function (datos, resultado) {
        connection.obtener(function (er, cn) {
            cn.query('insert into entrega_contenedor values(DEFAULT,CURDATE(),curTime(),0,(select u.codigo_usuario from usuario as u where u.cedula=?),1)', datos, function (error, respuesta) {
                cn.release();
                if (error) {
                    resultado.send({
                        estado: 'error'
                    });
                } else {
                    resultado.send("Ingresado");
                }
            })
        })
    }
    this.IngresarEntregaEvento = function (datos, resultado) {
        connection.obtener(function (er, cn) {
            cn.query('insert into entrega  values(DEFAULT,CURDATE(),curTime(),0,(select u.codigo_usuario from usuario as u where u.cedula=?),1,?)', [datos.identificacion, datos.codigo_evento], function (error, respuesta) {

                cn.release();

                if (error) {
                    resultado.send({
                        error
                    });
                } else {
                    resultado.send("Ingresado");
                }
            })
        })
    }


    this.ConsultarCodigoEntrega = function (datos, resultado) {
        connection.obtener(function (er, cn) {
            cn.query('select  Max(e.codigo_entrega) as codigo_entrega from entrega_contenedor e where e.codigo_usuario=?', datos, function (error, respuesta) {
                cn.release();
                if (error) {
                    resultado.send({
                        estado: 'error'
                    });
                } else {
                    resultado.send(respuesta);
                }
            })
        })
    }

  this.ConsultarTipos= function (datos, resultados) {
        connection.obtener(function (er, cn) {
            cn.query('select *from tipo_dispositivo as t where t.codigo_dispositivo=?', datos, function (error, respuesta) {
                cn.release();
                if (error) {
                    resultados.send({
                        estado: 'error'
                    });
                } else {
                    resultados.send(respuesta);
                }
            })
        })
    }
    this.ConsultarCredenciales = function (datos, resultados) {
        connection.obtener(function (er, cn) {
            cn.query('select *from credenciales as c inner join rol as r on (r.codigo_rol=c.codigo_rol) where c.nombre_credencial=? and c.contrasena=md5(?) ', [datos.nombre_credencial, datos.contrasena], function (error, respuesta) {
                cn.release();
                if (error) {
                    resultados.send({
                        estado: 'error'
                    });
                } else {
                    resultados.send(respuesta);
                }
            })
        })
    }
    this.ConsultarCodigo = function (datos, resultado) {
        connection.obtener(function (er, cn) {
            cn.query('SELECT MAX(codigo_detalle) as maximo FROM detalle_entrega as dt where dt.codigo_dispositivo=?', datos, function (error, respuesta) {
                cn.release();
                if (error) {
                    resultado.send({
                        estado: error
                    });
                } else {
                    resultado.send(respuesta);
                }
            })
        })
    }

    this.IngresarDetalleWeb = function (datos, resultado) {
        connection.obtener(function (er, cn) {
            cn.query('insert into detalle_entrega values(?,?,?,1,?)', [datos.codigo, datos.codigo_entrega, datos.codigo_dispositivo, datos.peso], function (error, respuesta) {
                cn.release();
                if (error) {
                    resultado.send({
                        estado: 'error'
                    });
                } else {
                    resultado.send(respuesta);
                }
            })
        })

    }


    this.ValidarUsuario = function (datos, resultado) {
        connection.obtener(function (er, cn) {
            cn.query('select *from usuario where cedula=?', datos, function (error, respuesta) {
                cn.release();
                if (error) {
                    resultado.send({
                        estado: 'error'
                    })
                } else {
                    resultado.send(respuesta);
                }
            })
        })
    }

    this.ConsultarCategoriaWeb= function (resultado) {
        connection.obtener(function (er, cn) {
            cn.query('select *from categoria', function (error, respuesta) {
                cn.release();
                if (error) {
                    resultado.send({
                        estado: error
                    });
                } else {
                    resultado.send(respuesta);
                }
            })
        })
    }
    this.ConsultarCategorias = function (resultado) {
        connection.obtener(function (er, cn) {
            cn.query('select *from categoria as c where c.estado LIKE \'%contenedor%\'', function (error, respuesta) {
                cn.release();
                if (error) {
                    resultado.send({
                        estado: error
                    });
                } else {
                    resultado.send(respuesta);
                }
            })
        })
    }
    this.ConsultarEventos = function (resultado) {
        connection.obtener(function (er, cn) {
            cn.query('select *from evento where codigo_evento!=1 and estado=\'activo\'', function (error, respuesta) {
                cn.release();
                if (error) {
                    resultado.send({
                        estado: error
                    });
                } else {
                    resultado.send(respuesta);
                }
            })
        })
    }
  this.ConsultarEvento = function (datos,resultado) {
        connection.obtener(function (er, cn) {
            cn.query('select *from evento where codigo_evento=? ',datos, function (error, respuesta) {
                cn.release();
                if (error) {
                    resultado.send({
                        estado: error
                    });
                } else {
                    resultado.send(respuesta);
                }
            })
        })
    }
    this.ConsultarCategoriasParams = function (datos, resultado) {
        connection.obtener(function (er, cn) {
            cn.query('select *from categoria where codigo_categoria=?', datos, function (error, respuesta) {
                cn.release();
                if (error) {
                    resultado.send({
                        estado: error
                    });
                } else {
                    resultado.send(respuesta);
                }
            })
        })
    }


    this.ConsultarDispositivos = function (datos, resultado) {
        connection.obtener(function (er, cn) {
            cn.query('select *from dispositivo where codigo_categoria=?', datos, function (error, respuesta) {
                cn.release();
                if (error) {
                    resultado.send({
                        estado: error
                    });
                } else {
                    resultado.send(respuesta);
                }
            })
        })
    }
    this.ConsultarTodosDispositivos = function (resultado) {
        connection.obtener(function (er, cn) {
            cn.query('select *from dispositivo', function (error, respuesta) {
                cn.release();
                if (error) {
                    resultado.send({
                        estado: error
                    });
                } else {
                    resultado.send(respuesta);
                }
            })
        })
    }

    this.CrearCategoria = function (datos, resultado) {
        connection.obtener(function (er, cn) {
            cn.query('insert into categoria values(DEFAULT,?,?,?,?)', [datos.nombre_categoria, datos.nombre_categoria, datos.descripcion, datos.imagen, datos.estado], function (error, respuesta) {
                if (error) {
                    resultado.send({
                        estado: error
                    });
                } else {
                    resultado.send(respuesta);
                }
            })
        })
    }

this.IngresarTipos= function (datos, resultado) {
        connection.obtener(function (er, cn) {
            cn.query('insert into tipo_dispositivo values(DEFAULT,?,?)', [datos.codigo_dispositivo, datos.nombre_tipo], function (error, respuesta) {
                if (error) {
                    resultado.send({
                        estado: error
                    });
                } else {
                    resultado.send(respuesta);
                }
            })
        })
    }



}
module.exports = new Api();