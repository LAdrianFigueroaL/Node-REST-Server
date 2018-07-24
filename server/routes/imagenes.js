const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificaTokenImg } = require('../middlewares/autenticacion');

let app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);
    let noImgpath = path.resolve(__dirname, '../assets/no_image.jpg');

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen)
    } else {
        res.sendFile(noImgpath);
    }

})


module.exports = app;