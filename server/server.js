require('./config/config');


const express = require('express')
const mongoose = require('mongoose');

const app = express()
const bodyParser = require('body-parser')


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


//configuracion rutas
app.use(require('./routes/index'));


mongoose.connect(process.env.urlDB, (err, resp) => {
    if (err) throw err;

    console.log(`BASE DE DATOS ONLINE`);
});

app.listen(process.env.PORT, () => console.log(`Escuchando puerto ${process.env.PORT }`));