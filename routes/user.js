let express = require('express');

let app = express();
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
let middAuth = require('../middlewares/auth');

let User = require('../models/user');


/**
 *  GET ALL USERS
 */
app.get('/', middAuth.verifyToken ,(req, resp, next) => {

    let offset = req.query.offset || 0;
    let search = req.query.q || '';
    let regex = new RegExp(search, 'i');

    offset = Number(offset);

    User.find({name: regex }, 'name email img')
        .skip(offset)
        .limit(15)
        .exec(
            (err, users) => {

            if ( err ) {

                return resp.status(500).json({
                    ok : false,
                    message: "Error in database",
                    errors: err
                });

            }

            User.count({}, (err, total) => {

                resp.status(200).json({
                    ok: true,
                    data: users,
                    total:users.length,
                    in: total
                });

            })

            

        });

});

/**
 *  Store new User
 */

app.post('/', (req, resp) => {

    let body = req.body;

    let user = new User({
        
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: null

    });

    user.save( ( err, userStored ) => {

        if ( err ) {

            return resp.status(400).json({
                ok : false,
                message: "Error in user store",
                errors: err
            });

        }

        resp.status(201).json({
            ok: true,
            data: userStored,
        });

    })

});


/**
 * SHOW USER
 */

 app.get('/:id', middAuth.verifyToken , (req, resp) => {

    let id = req.params.id;
    
    User.findById( id, (err, user) => {

        if ( err ) {

            return resp.status(500).json({
                ok : false,
                message: "Error searching user",
                errors: err
            });

        }

        if( !user ){

            return resp.status(400).json({
                ok : false,
                message: "User not found",
                errors: { message: 'User not found with that id' }
            });

        }

        user.password = ':)';

        resp.status(200).json({
            ok: true,
            data: user
        });


    })

 })

/**
 * Update User
 */
app.put('/:id', middAuth.verifyToken ,(req, resp) => {

    let id = req.params.id;
    let body = req.body;

    User.findById( id, (err, user) => {

        if ( err ) {

            return resp.status(500).json({
                ok : false,
                message: "Error searching user",
                errors: err
            });

        }

        if( !user ){

            return resp.status(400).json({
                ok : false,
                message: "User not found",
                errors: { message: 'User not found with that id' }
            });

        }

        user.name = body.name;
        user.email = body.email;

        user.save( (err, userUpdated) => {

            if ( err ) {

                return resp.status(400).json({
                    ok : false,
                    message: "Error in user update",
                    errors: err
                });
    
            }
    
            resp.status(200).json({
                ok: true,
                data: userUpdated
            });

        });

    });

});

/**
 * DELETE USER
 */
app.delete('/:id', middAuth.verifyToken ,(req, resp) => {

    let id = req.params.id;

    User.findByIdAndRemove( id, (err, userDeleted) => {

        if ( err ) {

            return resp.status(500).json({
                ok : false,
                message: "Error deleting user",
                errors: err
            });

        }

        if ( !userDeleted ) {

            return resp.status(400).json({
                ok : false,
                message: "User not found with that id",
                errors: err
            });

        }

        resp.status(200).json({
            ok: true,
            data: userDeleted
        });

    })

});

module.exports = app;

