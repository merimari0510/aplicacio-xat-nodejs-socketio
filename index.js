var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require("socket.io").listen(server),
    nicknames = {};

//S'escoltarà pel port 8000
server.listen(8000);

//Al carregar l'arrel ('/'), redirecciona l'enllaç del directori + l'index.html
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

//Sempre que s'utilitzi l'arrel ('/'), carrega el contingut del directori actual
app.use('/',express.static(__dirname));

//S'activa la funció cada vegada que un usuari s'ha connectat.
//La funció rep per parametre el socket de la connexió
io.sockets.on('connection', function(socket) {
	//Quan rep un missatge "send message", envia a tots els sockets el missatge i el nickname del socket
    socket.on('send message', function(data) {
        io.sockets.emit('new message', {msg: data, nick: socket.nickname});
    });
    
	//Quan hi ha un nou client, li assigna un nickname al socket i incrementa el nombre de nicknames que hi ha. 
    socket.on('new user', function(data, callback) {
        if (data in nicknames) {
            callback(false);
        } else {
            callback(true);
            socket.nickname = data;
            nicknames[socket.nickname] = 1;
            updateNickNames();
        }
    });
    
	//Quan un usuari es desconnecta, s'elimina el nickname dels usuaris
    socket.on('disconnect', function(data) {
        if(!socket.nickname) return;
        delete nicknames[socket.nickname];
		nicknameDisconnect(socket.nickname);
        updateNickNames();
    });
    
	//Envia a tots els usuaris que el nickname "nicknameDisconnect" s'ha desconnectat
	function nicknameDisconnect(nicknameDisconnect) {
		io.sockets.emit('usernameDisconnect', {nick: nicknameDisconnect});
	}
	
	//Actualitza els nicknames dels usuaris
    function updateNickNames() {
        io.sockets.emit('usernames', nicknames);
    }
});