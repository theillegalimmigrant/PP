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
                confirmed: -1
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

pokerplannerApp.controller('RoomCtrl', function ($rootScope, $scope,$routeParams,$location,mongodbFactory) {

    $scope.focusIndex=0;
    $scope.players = [];
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

    function calculateAverage() {
        var sum = 0;
        for (var i=0;i<$scope.estimates.length;i++) {
            sum = sum + $scope.estimates[i].estIndex;
        }
        return $scope.cards[Math.round(sum / $scope.estimates.length)].display;
    }

    function newTask() {
        $scope.round=1;
        $scope.showDeck=true;
        $scope.show = false;
        $scope.estimates= [];
        $scope.currEstimate=0;
        $scope.notes=$scope.room.jiras[$scope.focusIndex].notes;
    };

    function newRound() {
        $scope.showDeck=true;
        $scope.show = false;
        $scope.estimates= [];
    };
    function setJiraDetails() {
        $scope.jiraId = $scope.room.jiras[$scope.focusIndex].jiraId;
        $scope.description = $scope.room.jiras[$scope.focusIndex].description;
    };


    // get all room on Load
    mongodbFactory.getRoom($routeParams.id).then(function(data) {
        $scope.room = data.data;
        setJiraDetails();
        $scope.focusIndex = 0;
        newTask();
    });


    if (angular.isUndefined($rootScope.nameInput)) {
        //send user to start
        $location.path('/');
        $location.replace();
    } else {

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
                        $scope.currEstimate = calculateAverage();
                        $scope.$apply();
                        break;
                    case 'replay':
                        newRound();
                        $scope.round++;
                        $scope.$apply();
                        break;
                    case 'endTask':
                        if ($scope.focusIndex < $scope.room.jiras.length-1) {
                            $scope.focusIndex++;
                            setJiraDetails();
                        }
                        newTask();
                        break;
                    default:
                }
            } else if (json.type === 'task') {
                newTask();
                $scope.focusIndex = json.data;
                setJiraDetails();
                $scope.$apply();
            } else if (json.type === 'note') {
                var msg = json.data;
                $scope.notes.push(msg);
                $scope.$apply();
            } else {
                console.log('Hmm..., I\'ve never seen JSON like this: ', json);
            }
        };
    }

    $scope.findPlayerEstimate = function (player) {
        for (var i=0; i<$scope.estimates.length; i++) {
            if (player === $scope.estimates[i].user) {
                if ($scope.show || player===$rootScope.nameInput) {
                    return $scope.cards[$scope.estimates[i].estIndex].display;
                } else {
                    return '{Hidden}';
                }
            }
        }
    };

    $scope.sendEstimate = function(i) {
        $scope.showDeck = false;
        var header = 'est:>';
        var est = { user: $rootScope.nameInput, estIndex: i };
        connection.send(header+JSON.stringify(est));
    };

    $scope.changeTask=function(i) {
        $scope.focusIndex = i;
        setJiraDetails();
        var header = 'task:>';
        connection.send(header+i);
    };

    $scope.sendCmd=function(msg) {
        if (msg === 'replay' || msg === 'endTask') {
            for (i=0;i<$scope.estimates.length;i++){
                var est = {estimate: $scope.cards[$scope.estimates[i].estIndex].display, round: $scope.round, user: $scope.estimates.user};
                mongodbFactory.saveEstimate({
                    roomIndex:$scope.room._id,
                    jiraIndex:$scope.focusIndex,
                    estimate:est
                });
            }
            if ( msg === 'endTask') {
                //save current estimate to DB
                mongodbFactory.saveTaskEstimate({
                    roomIndex: $scope.room._id,
                    jiraIndex: $scope.focusIndex,
                    confirmedEstimate: $scope.currEstimate
                });
            }
        }
        var header = 'cmd:>';
        connection.send(header+msg);
    };

    $scope.sendNotes = function($event) {
        if ($event.which == 13 && $scope.noteInput) { //Send on enter
            var newNote = {note: $scope.noteInput, timestamp: new Date() };
            mongodbFactory.saveNote({
                roomIndex: $scope.room._id,
                jiraIndex: $scope.focusIndex,
                note: newNote
            });
            var header = 'note:>';
            connection.send(header+JSON.stringify(newNote));
            $scope.noteInput='';
        }
    };
});

