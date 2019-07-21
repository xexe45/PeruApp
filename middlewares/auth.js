let jwt = require('jsonwebtoken');

let SEED = require('../config/config').SEED;

// Verify Token

exports.verifyToken = function( req, resp, next ){

    let token = req.query.token;

    jwt.verify( token, SEED, ( err, decoded ) => {

        if ( err ) {

            return resp.status(401).json({
                ok : false,
                message: "Invalid Token",
                errors: err
            });

        }

        req.user = decoded.user;

        next();
    
    } );

}
