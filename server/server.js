require('./config/config');


const express = require('express')
const mongoose = require('mongoose');

const app = express()
const bodyParser = require('body-parser')
const path = require('path')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//  habilitar public
app.use(express.static(path.resolve(__dirname, '../public')))

//configuracion rutas
app.use(require('./routes/index'));


mongoose.connect(process.env.urlDB, (err, resp) => {
    if (err) throw err;

    console.log(`BASE DE DATOS ONLINE`);
});

app.listen(process.env.PORT, () => console.log(`Escuchando puerto ${process.env.PORT }`));