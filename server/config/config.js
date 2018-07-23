//==============================
// Puerto
//==============================

process.env.PORT = process.env.PORT || 3000;


//=======================
//Entorno
//=======================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//=======================
//Vencimiento token
//=======================

process.env.CADUCIDAD_TOKEN = '48h';


//=======================
//seed
//=======================

process.env.SEED = process.env.SEED || 'Este-seed-desarrollo';


//========================
//Base  de  Datos
//========================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.urlDB = urlDB;

//=======================
//Google Client ID
//=======================

process.env.CLIENTID = process.env.CLIENTID || '613941184337-s66d73jk35p7pif8ok37edtu8ot3nsv9.apps.googleusercontent.com'