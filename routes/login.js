let express = require('express');

let app = express();
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');

let SEED = require('../config/config').SEED;

let User = require('../models/user');

app.post('/', (req, resp) => {

    let body = req.body;

    User.findOne({email: body.email}, (err, userDB) => {

        if ( err ) {

            return resp.status(500).json({
                ok : false,
                message: "Error searching user",
                errors: err
            });

        }

        if ( !userDB ) {

            return resp.status(400).json({
                ok : false,
                message: "Incorrect Credentials",
                errors: err
            });

        }

        if ( !bcrypt.compareSync( body.password, userDB.password ) ){

            return resp.status(400).json({
                ok : false,
                message: "Incorrect Credentials",
                errors: err
            });

        }

        userDB.password = ':)';

        // Create Token
        let token = jwt.sign({ user: userDB }, SEED , { expiresIn: 14400 }); // 4h.

        resp.status(200).json({
            ok: true,
            data: userDB,
            token: token
        });

    })

    

})

module.exports = app;