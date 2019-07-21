let express = require('express');
let fileUpload = require('express-fileupload');
let fs = require('fs');
let app = express();
let middAuth = require('../middlewares/auth');
let User = require('../models/user');

// default options
app.use(fileUpload());

app.put('/:id', middAuth.verifyToken, (req, resp, next) => {

    let id = req.params.id;

    if ( !req.files ){

        return resp.status(400).json({
            ok : false,
            message: "Nothing to upload",
            errors: { message: 'Nothing to upload' }
        });

    }

    // Get file name
    let file = req.files.image;
    let file_esplited = file.name.split('.');
    let file_extension = file_esplited[file_esplited.length - 1];

    // ValidExtensions
    let validExtensions = ['png','jpg','jpeg','gif'];

    if( validExtensions.indexOf(file_extension) < 0){

        return resp.status(400).json({
            ok : false,
            message: "Invalid Extension",
            errors: { message: 'Valid extensions: ' + validExtensions.join(', ') }
        });

    }

    // New Filename
    // id - rnd - extension
    let file_name = `${id}-${ new Date().getMilliseconds() }.${file_extension}`;

    // Move file from temp. to path
    let path = `./uploads/users/${file_name}`;

    file.mv( path, err => {

        if ( err ){

            return resp.status(500).json({
                ok : false,
                message: "Error moving file",
                errors: err
            });

        }

        User.findById(id, (err, userDB) => {

            let old_path = './uploads/users/' + userDB.img;

            if ( fs.existsSync(old_path) ){

                fs.unlink(old_path, err => {
                    if ( err ){

                        return resp.status(400).json({
                            ok : false,
                            message: "Problem removing old file",
                            errors: err
                        });
            
                    }
                });

            }

            userDB.img = file_name;
            
            userDB.save( (err, userUpdated) => {

                if ( err ){

                    return resp.status(400).json({
                        ok : false,
                        message: "User not found",
                        errors: err
                    });
        
                }

                return resp.status(200).json({
                    ok: true,
                    message: "File Uploaded",
                    data: userUpdated
                });

            })

        })
        
    });


});

module.exports = app;

