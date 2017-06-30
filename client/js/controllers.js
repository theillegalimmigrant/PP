pokerplannerApp.controller('HomeCtrl', function ($rootScope, $scope,mongodbFactory) {

    // Get a Room
    $scope.getRoom = function() {
    mongodbFactory.getRoom($scope.id).then(function(data) {
     $scope.room = data.data;
     });
    };

    // Create a poker room
    $scope.createRoom = function($event) {
        if ($event.which == 1 && $rootScope.nameInput) {
            mongodbFactory.findOrCreateUser({"name": $rootScope.nameInput});

            mongodbFactory.saveRoom({
                "leader": $rootScope.nameInput
            }).then(function(data) {
                $scope.id = data.data._id;
            });
        }
    };
});

pokerplannerApp.controller('RoomsCtrl', function ($rootScope, $scope,mongodbFactory) {
    $scope.rooms=[];

    // get all rooms on Load
    mongodbFactory.getRooms().then(function(data) {
        $scope.rooms = data.data;
    });

});

pokerplannerApp.controller('RoomSetupCtrl',function ($rootScope, $scope,$routeParams,mongodbFactory) {

    mongodbFactory.getRoom($routeParams.id).then(function(data) {
        $scope.room = data.data;
        if (data.data.name) $scope.roomNameInput = data.data.name;
        for ( var i = 0; i<$scope.room.jiras.length; i++ ) {
            $scope.taskEditInput[i] = $scope.room.jiras[i].jiraId;
            $scope.taskDescEditInput[i] = $scope.room.jiras[i].description;
        }
    });

    // Update room name
    $scope.saveRoom = function() {
        if (this.roomNameInput) {

           mongodbFactory.updateRoom({
                _id: $scope.room._id,
                name: $scope.roomNameInput,
                leader: $scope.room.leader,
                jiras: $scope.room.jiras,
            }).then(function(data) {
                if (data.data.nModified) {
                    alert('It worked!');
                } else {
                    alert('Oops something went wrong!');
                }
            });
        }
    };

    // Delete a Pokerplanner
    $scope.delete = function(i) {
        $scope.room.jiras.splice(i, 1);
    };

    // Save a task to local room
    $scope.newTask = function($event) {
        if ($event.which == 13 && $scope.taskInput) {
            var newTask = {
                jiraId: $scope.taskInput,
                description: $scope.taskDescInput,
                estimates: [],
                notes: []
            };
            $scope.room.jiras.push(newTask);
            $scope.taskInput='';
            $scope.taskDescInput='';
        }
    };

    // Edit tasks to local room
    $scope.editTask = function(i) {
        $scope.room.jiras[i].jiraId = $scope.taskEditInput[i];
        $scope.room.jiras[i].description = $scope.taskDescEditInput[i];
        $scope.isEditable[i] = false;
    };

});

pokerplannerApp.controller('RoomCtrl', function ($rootScope, $scope,$routeParams,mongodbFactory) {

    $scope.round=1;
    $scope.focusIndex=0;
    $scope.showDeck=1;
    $scope.players = [];
    $scope.estimates= [];
    $scope.notes = [];
    $scope.cards = [
        { value: 0, display: '0' },
        { value: 1, display: '1' },
        { value: 2, display: '2' },
        { value: 3, display: '3' },
        { value: 5, display: '5' },
        { value: 8, display: '8' },
        { value: 13, display: '13' },
        { value: 21, display: '21' },
        { value: 34, display: '34' },
        { value: 55, display: '55' },
        { value: 999, display: '∞' },
        { value: 999, display: '?' }
    ];

    // get all room on Load
    mongodbFactory.getRoom($routeParams.id).then(function(data) {
            $scope.room = data.data;
            $scope.focusIndex = 0;
            $scope.task = $scope.room.jiras[$scope.focusIndex];
    });

    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    // if browser doesn't support WebSocket, just show some notification and exit
    if (!window.WebSocket) {
        content.html($('<p>', { text: 'Sorry, but your browser doesn\'t ' + 'support WebSockets.'} ));
        return;
    }
    // open connection
    var connection = new WebSocket('ws://127.0.0.1:1337');
    connection.onopen = function () {
        // first we want to register users names
        connection.send('user:>'+$rootScope.nameInput);
    };

    connection.onerror = function (error) {
        // just in there were some problems with conenction...
        content.html($('<p>', { text: 'Sorry, but there\'s some problem with your '
                                    + 'connection or the server is down.' } ));
    };

    // most important part - incoming messages
    connection.onmessage = function (message) {
        // try to parse JSON message. Because we know that the server always returns
        // JSON this should work without any problem but we should make sure that
        // the massage is not chunked or otherwise damaged.
        try {
            var json = JSON.parse(message.data);
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }

        // NOTE: if you're not sure about the JSON structure
        // check the server source code above
        if (json.type === 'users') {
            $scope.players = json.data;
            $scope.$apply();
        } else if (json.type === 'est') {
            var estObj = { user: json.data.user, estIndex: json.data.estIndex };
            $scope.estimates.push(estObj);
            $scope.$apply();
        } else if (json.type === 'cmd') {
            switch(json.data) {
                case 'reveal':
                    $scope.show = true;
                    break;
                case 'replay':
                    $scope.show = '';
                    $scope.estimates= [];
                    $scope.round++;
                    // save estimates to mongodb
                    break;
                case 'endTask':
                    // save estimates
                    $scope.show = '';
                    $scope.estimates= [];
                    $scope.round = 1;
                    if ($scope.focusIndex === $scope.room.jiras.length-1) {
                        //end story
                    } else {
                        $scope.focusIndex++;
                        $scope.task = $scope.room.jiras[$scope.focusIndex];
                    }
                    break;
                default:
            }
        } else if (json.type = 'task') {
            $scope.show = '';
            $scope.estimates= [];
            $scope.round = 1;
            $scope.focusIndex = json.data;
            $scope.task = $scope.room.jiras[$scope.focusIndex];
        } else if (json.type === 'note') {
            $scope.notes.push(json.data);
        } else {
            console.log('Hmm..., I\'ve never seen JSON like this: ', json);
        }
    };
//        switch (message.type) {
//              case est: // get player estimates and broadcast
//              case leaderMsg: // the leader messages that influence estimates: reveal, replay, endTask, nextTask, prevTask, notes
// reveal shows all cards
// replay increments round and resets player estimates
// endTask averages the final estimates, moves to next task
// nextTask moves to nextTask - resets estimates
// prevTask goes to prev task
// notes displays notes to all players and persists notes
//              case notes:
//              default:
//          }
    $scope.findPlayerEstimate = function (player) {
        for (var i=0; i<$scope.estimates.length; i++) {
            if (player === $scope.estimates[i].user) {
                return $scope.cards[$scope.estimates[i].estIndex].display;
            }
        }
    };

    $scope.sendEstimate = function(i) {
        var header = 'est:>';
        var est = { user: $rootScope.nameInput, estIndex: i };
        connection.send(header+JSON.stringify(est));
    };

    $scope.changeTask=function(i) {
        $scope.focusIndex = i;
        $scope.task = $scope.room.jiras[$scope.focusIndex];
    };



});

