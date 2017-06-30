(function() {
    "use strict";
    // Optional. You will see this name in eg. 'ps' or 'top' command
    process.title = 'node-chat';
    // Port where we'll run the websocket server
    var webSocketsServerPort = 1337;
    // websocket and http servers
    var webSocketServer = require('websocket').server;
    var http = require('http');
    /**
     * Global variables
     */
    // list of currently connected clients' connections
    var clients = [ ];
    // List of currently connected usernames
    var userNames = [ ];
    /**
     * Helper function for escaping input strings
     */
    function htmlEntities(str) {
      return String(str)
          .replace(/&/g, '&amp;').replace(/</g, '&lt;')
          .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function broadcast(type,data) {
        var json = JSON.stringify({ type:type, data: data });
        for (var i=0; i < clients.length; i++) {
          clients[i].sendUTF(json);
        }
    }


    /**
     * HTTP server
     */
    var server = http.createServer(function(request, response) {
      // Not important for us. We're writing WebSocket server,
      // not HTTP server
    });
    server.listen(webSocketsServerPort, function() {
      console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
    });
    /**
     * WebSocket server
     */
    var wsServer = new webSocketServer({
      // WebSocket server is tied to a HTTP server. WebSocket
      // request is just an enhanced HTTP request. For more info
      // http://tools.ietf.org/html/rfc6455#page-6
      httpServer: server
    });
    // This callback function is called every time someone
    // tries to connect to the WebSocket server
    wsServer.on('request', function(request) {
        console.log((new Date()) + ' Connection from origin ' + request.origin + '.');
        // accept connection - you should check 'request.origin' to
        // make sure that client is connecting from your website
        // (http://en.wikipedia.org/wiki/Same_origin_policy)
        var connection = request.accept(null, request.origin);
        // we need to know client index to remove them on 'close' event
        var index = clients.push(connection) - 1;
        console.log((new Date()) + ' Connection accepted.');
        // send back chat history

        // user sent some message
        connection.on('message', function(message) {


            if (message.type === 'utf8') { // accept only text
            // first message sent by user is their name
            // log and broadcast the message
                console.log((new Date()) + ' Received Message from ' + userNames[index] + ': ' + message.utf8Data);

                if (message.utf8Data.indexOf("user:>") === 0) {
                    console.log("Adding user: "+message.utf8Data.slice(6));
                    userNames.push(message.utf8Data.slice(6));

                    var debugMsg = 'Current Users: ';
                    for (var i=0; i < userNames.length; i++) {
                      debugMsg = debugMsg + userNames[i] + ', ';
                    }
                    console.log(debugMsg);

                    broadcast('users',userNames);
                } else if (message.utf8Data.indexOf("est:>") === 0) {
                    console.log("Received an estimate");
                    var data = JSON.parse(message.utf8Data.slice(5))
                    broadcast('est',data);
                } else if (message.utf8Data.indexOf("cmd:>") === 0) {
                    console.log("Received a command");
                    broadcast('cmd',message.utf8Data.slice(5));
                } else if (message.utf8Data.indexOf("note:>") === 0) {
                    console.log("Received a note");
                    var data = { note: message.utf8Data.slice(6), timestamp: new Date()};
                    broadcast('note',data);
                } else if (message.utf8Data.indexOf("task:>") === 0) {
                    console.log("Received a task change");
                    var data = message.utf8Data.slice(6);
                    broadcast('task',data);
                } else {
                }
                    console.log("Unrecognised message format: " + message.utf8Data);
                }
            }
          });
        // user disconnected
        connection.on('close', function(connection) {
        if (userNames[index] !== '') {
            console.log((new Date()) + " Peer " + connection.remoteAddress + " disconnected.");
            console.log("Removing user: "+userNames[index]);
            // remove user from the list of connected clients
            clients.splice(index, 1);
            userNames.splice(index,1);
            var json = JSON.stringify({ type:'users', data: userNames });
            for (var i=0; i < clients.length; i++) {
                clients[i].sendUTF(json);
            }

                var debugMsg = 'Current Users: ';
                for (var i=0; i < userNames.length; i++) {
                  debugMsg = debugMsg + userNames[i] + ', ';
                }
                console.log(debugMsg);
        }
        });
    });
}());