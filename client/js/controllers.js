pokerplannerApp.controller('HomeCtrl', function ($scope,mongodbFactory) {
    $scope.id;

    // Get a Room
    $scope.getRoom = function() {
    mongodbFactory.getRoom($scope.id).then(function(data) {
     $scope.room = data.data;
     })
    };

    // Create a poker room
    $scope.createRoom = function($event) {
        if ($event.which == 1 && $scope.nameInput) {
            mongodbFactory.findOrCreateUser({"name": $scope.nameInput});

            mongodbFactory.saveRoom({
                "leader": this.nameInput
            }).then(function(data) {
                $scope.id = data.data._id;
            });
                $scope.nameInput = '';
        }
    };
});

pokerplannerApp.controller('RoomsCtrl', function ($scope,mongodbFactory) {
    $scope.rooms=[];

    // get all rooms on Load
    mongodbFactory.getRooms().then(function(data) {
        $scope.rooms = data.data;
    });

});

pokerplannerApp.controller('RoomSetupCtrl',function ($scope,$routeParams,mongodbFactory) {

    $scope.roomNameInput;
    $scope.taskInput;
    $scope.taskDescInput;
    $scope.taskEditInput = [];
    $scope.taskDescEditInput = [];
    $scope.room;
    $scope.isEditable = [];

    //roomService.getRoom().then(function(data){
    //    $scope.room = data;
    //});
    mongodbFactory.getRoom($routeParams.id).then(function(data) {
        $scope.room = data.data;
        if (data.data.name) $scope.roomNameInput = data.data.name;
        for ( var i = 0; i<$scope.room.jiras.length; i++ ) {
            $scope.taskEditInput[i] = $scope.room.jiras[i].jiraId;
            $scope.taskDescEditInput[i] = $scope.room.jiras[i].description;;
        };
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
    }

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

pokerplannerApp.controller('RoomCtrl', function ($scope,$routeParams,mongodbFactory) {
    $scope.room;
    $scope.focusIndex=0;
    $scope.task;

    $scope.users = [];
    $scope.estimates = [];

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
        { value: 100, display: '?' }
    ];

    // get all room on Load
    mongodbFactory.getRoom($routeParams.id).then(function(data) {
            $scope.room = data.data;
            $scope.focusIndex = 0;
            $scope.task = $scope.room.jiras[$scope.focusIndex];
    });

});

