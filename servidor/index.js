const { WebSocket, WebSocketServer } = require('ws');
const http = require('http');
const uuidv4 = require('uuid').v4;



// Spinning the http server and the WebSocket server.
const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const port = 8000;
server.listen(port, () => {
    console.log(`WebSocket server is running on port ${port}`);
});


//-----------------------------------------------------------

// Todos los clientes activos
const clients = {};

function broadcastMessage(json, roomId, userId) {
    // enviar el info a todos los clientes
    const data = JSON.stringify(json);
    console.log("");
    console.log("=================================================")
    console.log(Date());
    console.log("====================", roomId, "=================");
    console.log("userId para verificar", userId);
    console.log("key of room", Object.keys(infosRoom[roomId]))
    console.log("");
    for (const [userid, connection] of Object.entries(infosRoom[roomId])) {
        if (userid !== userId){
            if (connection.readyState === WebSocket.OPEN) {
                connection.send(JSON.stringify({
                    canvasData: infosCanvas[roomId]
                }));
            }
        }
    };    
}

const infosCanvas = {};
const infosRoom = {};
// infosRoom = {
//  room1: {
//      user1: connection
//  }
// }
const publicRoom = 99999999;

wsServer.on('connection', function (connection) {

    const userId = uuidv4();
    let roomId;

    clients[userId] = connection;

    if (!infosRoom[publicRoom]) {
        infosRoom[publicRoom] = {};
    };

    console.log('Se ha conectado un cliente, Su id es: ');
    console.log(userId);


    connection.on('message', (message) => {
        const dataFromClient = JSON.parse(message.toString());

        switch (dataFromClient.type) {
            case "actualizar":
                // actualizar las informaciones de canvas
                infosCanvas[dataFromClient.roomId] = dataFromClient.canvasData;
                roomId = dataFromClient.roomId;

                if (roomId == ""){
                    infosRoom[publicRoom][userId] = connection;
                } else {
                    if (!infosRoom[roomId]) { infosRoom[roomId] = {};};
                    infosRoom[roomId][userId] = connection;
                }
                broadcastMessage(dataFromClient, dataFromClient.roomId, dataFromClient.userId);
                break
            case "crear":
                roomId = uuidv4().substring(0, 8);
                // eliminar el usuario de la sala pública
                Reflect.deleteProperty(infosRoom[publicRoom], dataFromClient.id);
                // añadir usuarios a una sala privada
                if (!infosRoom[roomId]) { infosRoom[roomId] = {};};
                infosRoom[roomId][dataFromClient.userId] = connection;

                currentId = dataFromClient.roomId;
                // anuncia el roomId al cliente
                connection.send(JSON.stringify({
                    type: "crear",
                    userId: userId,
                    roomId: roomId
                }));
                break
            case "unir":
                if (infosRoom.hasOwnProperty(dataFromClient.roomId)) {
                    roomId = dataFromClient.roomId;
                    infosRoom[dataFromClient.roomId][dataFromClient.userId] = connection;
                } else {
                    connection.send(JSON.stringify({
                        type: "unir",
                        userId: userId,
                        roomId: "No existe ese codigo de invitacion"
                    }));
                };
                break;
            case "consultar":

                // if (roomId != dataFromClient.roomId) {
                //     Reflect.deleteProperty(infosRoom[publicRoom], dataFromClient.userId);
                //     roomId = dataFromClient.roomId;
                //     if (!infosRoom[roomId]) { infosRoom[roomId] = {}; };
                //     infosRoom[dataFromClient.roomId][userId] = connection;
                // }
                console.log("consultar", dataFromClient.roomId);
                if (infosRoom[dataFromClient.roomId]){
                    infosRoom[dataFromClient.roomId][userId] = connection;
                    connection.send(JSON.stringify({
                        type: "consultar",
                        userId: userId,
                        canvasData: infosCanvas[dataFromClient.roomId]
                    }));
                }


            case "entra consulta":
                connection.send(JSON.stringify({
                    type: "entra consultar",
                    userId: userId
                }));
            default:
                console.log("Type of message", dataFromClient.type);
                break
        };

        // console.log("---------------InfosRoom-----------------")
        // console.log(infosRoom);
    });
});