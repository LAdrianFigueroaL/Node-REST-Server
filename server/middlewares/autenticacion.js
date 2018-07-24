const jwt = require('jsonwebtoken')

//==========================
//Verificar token
//==========================

let verificaToken = (req, resp, next) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return resp.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }

        req.usuario = decoded.usuario;
        next();

    })

}

//==========================
//Verificar Admin Role token
//==========================

let verificaAdminRole = (req, resp, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return resp.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    }

}

//==========================
//Verificar token img
//==========================

let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }

        req.usuario = decoded.usuario;
        next();

    })

}

module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenImg
}