let express = require('express');

let app = express();

app.get('/', (req, resp, next) => {

    resp.status(200).json({
        "ok": true,
        "message": "connected"
    });

});

module.exports = app;

