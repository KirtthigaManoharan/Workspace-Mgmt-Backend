var express = require('express');
var app = express.Router();

var routePath = require('../controller/controller');
    
    app.post('/email', routePath.register);

    app.post('/code', routePath.code);

    app.post('/setup', routePath.setup);

    app.post('/password', routePath.password);

    app.post('/login', routePath.login);

    app.post('/category', routePath.category);

    app.post('/layout', routePath.layout);

module.exports = app; 