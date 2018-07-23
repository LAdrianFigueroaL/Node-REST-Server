const express = require('express')

const { verificaToken } = require('../middlewares/autenticacion')

let app = express();

let Producto = require('../models/producto')

//===============================================================================================================================================
//                                                                                                                                               
//   #####   #####   ######  #####  ##     ##  #####  #####          #####   #####     #####   ####    ##   ##   ####  ######   #####    ####  
//  ##   ##  ##  ##    ##    ##     ####   ##  ##     ##  ##         ##  ##  ##  ##   ##   ##  ##  ##  ##   ##  ##       ##    ##   ##  ##     
//  ##   ##  #####     ##    #####  ##  ## ##  #####  #####          #####   #####    ##   ##  ##  ##  ##   ##  ##       ##    ##   ##   ###   
//  ##   ##  ##  ##    ##    ##     ##    ###  ##     ##  ##         ##      ##  ##   ##   ##  ##  ##  ##   ##  ##       ##    ##   ##     ##  
//   #####   #####     ##    #####  ##     ##  #####  ##   ##        ##      ##   ##   #####   ####     #####    ####    ##     #####   ####   
//                                                                                                                                               
//===============================================================================================================================================

app.get('/productos', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);


    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'categoria')
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.count({ disponible: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    productos,
                    conteo
                })
            })

        })
})

//====================================================================================================================================================================================================================
//                                                                                                                                                                                                                    
//   #####   #####   ######  #####  ##     ##  #####  #####          ##   ##  ##     ##        #####   #####     #####   ####    ##   ##   ####  ######   #####         #####    #####   #####          ##  ####    
//  ##   ##  ##  ##    ##    ##     ####   ##  ##     ##  ##         ##   ##  ####   ##        ##  ##  ##  ##   ##   ##  ##  ##  ##   ##  ##       ##    ##   ##        ##  ##  ##   ##  ##  ##         ##  ##  ##  
//  ##   ##  #####     ##    #####  ##  ## ##  #####  #####          ##   ##  ##  ## ##        #####   #####    ##   ##  ##  ##  ##   ##  ##       ##    ##   ##        #####   ##   ##  #####          ##  ##  ##  
//  ##   ##  ##  ##    ##    ##     ##    ###  ##     ##  ##         ##   ##  ##    ###        ##      ##  ##   ##   ##  ##  ##  ##   ##  ##       ##    ##   ##        ##      ##   ##  ##  ##         ##  ##  ##  
//   #####   #####     ##    #####  ##     ##  #####  ##   ##         #####   ##     ##        ##      ##   ##   #####   ####     #####    ####    ##     #####         ##       #####   ##   ##        ##  ####    
//                                                                                                                                                                                                                    
//====================================================================================================================================================================================================================


app.get('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'categoria')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no existe'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            })
        })

})

//=====================================================================================================================================
//                                                                                                                                     
//  #####   ##   ##   ####   ####    ###    #####          #####   #####     #####   ####    ##   ##   ####  ######   #####    ####  
//  ##  ##  ##   ##  ##     ##      ## ##   ##  ##         ##  ##  ##  ##   ##   ##  ##  ##  ##   ##  ##       ##    ##   ##  ##     
//  #####   ##   ##   ###   ##     ##   ##  #####          #####   #####    ##   ##  ##  ##  ##   ##  ##       ##    ##   ##   ###   
//  ##  ##  ##   ##     ##  ##     #######  ##  ##         ##      ##  ##   ##   ##  ##  ##  ##   ##  ##       ##    ##   ##     ##  
//  #####    #####   ####    ####  ##   ##  ##   ##        ##      ##   ##   #####   ####     #####    ####    ##     #####   ####   
//                                                                                                                                     
//=====================================================================================================================================

app.get('/productos/buscar/:termino', (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i')

    Producto.find({ nombre: regex })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'categoria')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })

        })

})

//======================================================================================================================
//                                                                                                                      
//   ####  #####    #####    ###    #####          #####   #####     #####   ####    ##   ##   ####  ######   #####   
//  ##     ##  ##   ##      ## ##   ##  ##         ##  ##  ##  ##   ##   ##  ##  ##  ##   ##  ##       ##    ##   ##  
//  ##     #####    #####  ##   ##  #####          #####   #####    ##   ##  ##  ##  ##   ##  ##       ##    ##   ##  
//  ##     ##  ##   ##     #######  ##  ##         ##      ##  ##   ##   ##  ##  ##  ##   ##  ##       ##    ##   ##  
//   ####  ##   ##  #####  ##   ##  ##   ##        ##      ##   ##   #####   ####     #####    ####    ##     #####   
//                                                                                                                      
//======================================================================================================================

app.post('/productos', verificaToken, (req, res) => {

    let body = req.body

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    })

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        })
    })



})

//=======================================================================================================================================================================================
//                                                                                                                                                                                       
//    ###     ####  ######  ##   ##    ###    ##      ##  ######    ###    #####          ##   ##  ##     ##        #####   #####     #####   ####    ##   ##   ####  ######   #####   
//   ## ##   ##       ##    ##   ##   ## ##   ##      ##     ##    ## ##   ##  ##         ##   ##  ####   ##        ##  ##  ##  ##   ##   ##  ##  ##  ##   ##  ##       ##    ##   ##  
//  ##   ##  ##       ##    ##   ##  ##   ##  ##      ##    ##    ##   ##  #####          ##   ##  ##  ## ##        #####   #####    ##   ##  ##  ##  ##   ##  ##       ##    ##   ##  
//  #######  ##       ##    ##   ##  #######  ##      ##   ##     #######  ##  ##         ##   ##  ##    ###        ##      ##  ##   ##   ##  ##  ##  ##   ##  ##       ##    ##   ##  
//  ##   ##   ####    ##     #####   ##   ##  ######  ##  ######  ##   ##  ##   ##         #####   ##     ##        ##      ##   ##   #####   ####     #####    ####    ##     #####   
//                                                                                                                                                                                       
//=======================================================================================================================================================================================


app.put('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id
    let body = req.body

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            })
        })
    })


})

//========================================================================================================================================================================================
//                                                                                                                                                                                        
//  ####    #####   ####  ##   ##    ###    #####   ##  ##      ##  ######    ###          ##   ##  ##     ##        #####   #####     #####   ####    ##   ##   ####  ######   #####   
//  ##  ##  ##     ##     ##   ##   ## ##   ##  ##  ##  ##      ##    ##     ## ##         ##   ##  ####   ##        ##  ##  ##  ##   ##   ##  ##  ##  ##   ##  ##       ##    ##   ##  
//  ##  ##  #####   ###   #######  ##   ##  #####   ##  ##      ##    ##    ##   ##        ##   ##  ##  ## ##        #####   #####    ##   ##  ##  ##  ##   ##  ##       ##    ##   ##  
//  ##  ##  ##        ##  ##   ##  #######  ##  ##  ##  ##      ##    ##    #######        ##   ##  ##    ###        ##      ##  ##   ##   ##  ##  ##  ##   ##  ##       ##    ##   ##  
//  ####    #####  ####   ##   ##  ##   ##  #####   ##  ######  ##    ##    ##   ##         #####   ##     ##        ##      ##   ##   #####   ####     #####    ####    ##     #####   
//                                                                                                                                                                                        
//========================================================================================================================================================================================


app.delete('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        productoDB.disponible = false

        productoDB.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto Borrado'
            })
        })
    })

})


module.exports = app;