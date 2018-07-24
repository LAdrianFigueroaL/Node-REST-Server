const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');

const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

app.use(fileUpload());


app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }

    //===============================================================================================
    //                                                                                               
    //  ##   ##    ###    ##      ##  ####      ###    #####          ######  ##  #####    #####   
    //  ##   ##   ## ##   ##      ##  ##  ##   ## ##   ##  ##           ##    ##  ##  ##  ##   ##  
    //  ##   ##  ##   ##  ##      ##  ##  ##  ##   ##  #####            ##    ##  #####   ##   ##  
    //   ## ##   #######  ##      ##  ##  ##  #######  ##  ##           ##    ##  ##      ##   ##  
    //    ###    ##   ##  ######  ##  ####    ##   ##  ##   ##          ##    ##  ##       #####   
    //                                                                                               
    //===============================================================================================
    let tiposValidos = ['productos', 'usuarios']

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos validos son ' + tiposValidos.join(', '),
                tipo: tipo
            }
        })
    }


    //==============================================================================================================================================================================
    //                                                                                                                                                                              
    //  #####  ##    ##  ######  #####  ##     ##   ####  ##   #####   ##     ##  #####   ####        #####   #####  #####    ###    ###  ##  ######  ##  ####      ###     ####  
    //  ##      ##  ##     ##    ##     ####   ##  ##     ##  ##   ##  ####   ##  ##     ##           ##  ##  ##     ##  ##   ## #  # ##  ##    ##    ##  ##  ##   ## ##   ##     
    //  #####    ####      ##    #####  ##  ## ##   ###   ##  ##   ##  ##  ## ##  #####   ###         #####   #####  #####    ##  ##  ##  ##    ##    ##  ##  ##  ##   ##   ###   
    //  ##      ##  ##     ##    ##     ##    ###     ##  ##  ##   ##  ##    ###  ##        ##        ##      ##     ##  ##   ##      ##  ##    ##    ##  ##  ##  #######     ##  
    //  #####  ##    ##    ##    #####  ##     ##  ####   ##   #####   ##     ##  #####  ####         ##      #####  ##   ##  ##      ##  ##    ##    ##  ####    ##   ##  ####   
    //                                                                                                                                                                              
    //==============================================================================================================================================================================
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    let extensionesValidas = ['png', 'jpg', 'gif']

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }

    //==========================================================================================================================================================================================
    //                                                                                                                                                                                          
    //   ####    ###    ###    ###  #####   ##    ###    #####          ##     ##   #####   ###    ###  #####   #####    #####          ###    #####     ####  ##   ##  ##  ##   ##   #####   
    //  ##      ## ##   ## #  # ##  ##  ##  ##   ## ##   ##  ##         ####   ##  ##   ##  ## #  # ##  ##  ##  ##  ##   ##            ## ##   ##  ##   ##     ##   ##  ##  ##   ##  ##   ##  
    //  ##     ##   ##  ##  ##  ##  #####   ##  ##   ##  #####          ##  ## ##  ##   ##  ##  ##  ##  #####   #####    #####        ##   ##  #####    ##     #######  ##  ##   ##  ##   ##  
    //  ##     #######  ##      ##  ##  ##  ##  #######  ##  ##         ##    ###  ##   ##  ##      ##  ##  ##  ##  ##   ##           #######  ##  ##   ##     ##   ##  ##   ## ##   ##   ##  
    //   ####  ##   ##  ##      ##  #####   ##  ##   ##  ##   ##        ##     ##   #####   ##      ##  #####   ##   ##  #####        ##   ##  ##   ##   ####  ##   ##  ##    ###     #####   
    //                                                                                                                                                                                          
    //==========================================================================================================================================================================================

    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`

    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        if (tipo === 'usuarios') {

            imagenUsuario(id, res, nombreArchivo);

        } else if (tipo === 'productos') {

            imagenProducto(id, res, nombreArchivo);

        }

    });


});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {

            borrarArhivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {

            borrarArhivo(nombreArchivo, 'usuarios');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no Existe'
                }
            })
        }

        borrarArhivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioSave) => {
            res.json({
                ok: true,
                usuarioSave,
                img: nombreArchivo
            })
        })

    })

}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {
        if (err) {

            borrarArhivo(nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {

            borrarArhivo(nombreArchivo, 'productos');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no Existe'
                }
            })
        }

        borrarArhivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoSave) => {
            res.json({
                ok: true,
                productoSave,
                img: nombreArchivo
            })
        })

    })
}

function borrarArhivo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`)

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

}


module.exports = app;