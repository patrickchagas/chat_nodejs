const express = require("express");
const path = require("path");

const app = express();
//Informar que ele vai ter uma porta que vai acessado por websocket
const server = require('http').createServer(app);
const io = require("socket.io")(server);

//Definir uma pasta de arquivos públicos
app.use(express.static(path.join(__dirname, "public")));

//definir onde vai ficar as views
app.set("views", path.join(__dirname, "public"));
//Definir que HTML vai ser usado nas views
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

//Endereço Padrão
app.use("/", (req, res) =>{
	res.render("index.html");
});

//armazenar todas as mensagens / sem banco de dados por enquanto
let messages = [];

//Toda vez que um cliente conectar ao socket, vamos fazer...
io.on("connection", socket => {
	console.log(`Socket conectado: ${socket.id}`);

	socket.emit('previousMessages', messages);

	socket.on("sendMessage", data => {
		messages.push(data);
		socket.broadcast.emit('receivedMessage', data);
	});
});


server.listen(3000);