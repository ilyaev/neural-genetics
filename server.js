var path = require('path');
var express = require('express');
var app = express();
var PORT = process.env.PORT || 8080;
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

if (process.env.NODE_ENV !== 'production') {
    var webpackDevMiddleware = require('webpack-dev-middleware');
    var webpackHotMiddleware = require('webpack-hot-middleware');
    var webpack = require('webpack');
    var config = require('./webpack.config');
    var compiler = webpack(config);

    app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath}));
    app.use(webpackHotMiddleware(compiler));
}

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/service', function(request, response) {
    console.log("Index File22!")
    response.json({
        a: 444
    })
})

//app.list
server.listen(PORT, function(error) {
    if (error) {
        console.error(error);
    } else {
        console.info("==> \t Listening on port %s. Visit http://localhost:%s in your browser", PORT, PORT);
    }
});

io.sockets.on('connection', function(socket) {
    socket.on('send_message', function(data) {
        io.sockets.emit('new_message_UPD!!', data);
    })
})