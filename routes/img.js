let express = require('express');

let app = express();
let middAuth = require('../middlewares/auth');

const path = require('path');
const fs = require('fs');

app.get('/users/:img',  middAuth.verifyToken ,(req, resp, next) => {

    let img = req.params.img;

    let path_image = path.resolve( __dirname, `../uploads/users/${img}` );

    

    if ( fs.existsSync( path_image ) ){

        resp.sendFile(path_image);

    } else {

        let path_no_image = path.resolve( __dirname, `../assets/noimage.png` );
        resp.sendFile(path_no_image);

    }

    

});

module.exports = app;

