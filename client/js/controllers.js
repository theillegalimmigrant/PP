pokerplannerApp.controller('PokerplannerCtrl', function($rootScope, $scope, pokerplannersFactory) {
 
  $scope.pokerplanners = [];
  $scope.isEditable = [];
 
  // get all Pokerplanners on Load
  pokerplannersFactory.getPokerplanners().then(function(data) {
    $scope.pokerplanners = data.data;
  });
 
  // Save a Pokerplanner to the server
  $scope.save = function($event) {
    if ($event.which == 13 && $scope.pokerplannerInput) {
 
      pokerplannersFactory.savePokerplanner({
        "pokerplanner": $scope.pokerplannerInput,
        "isCompleted": false
      }).then(function(data) {
        $scope.pokerplanners.push(data.data);
      });
      $scope.pokerplannerInput = '';
    }
  };
 
  //update the status of the Pokerplanner
  $scope.updateStatus = function($event, _id, i) {
    var cbk = $event.target.checked;
    var _t = $scope.pokerplanners[i];
    pokerplannersFactory.updatePokerplanner({
      _id: _id,
      isCompleted: cbk,
      pokerplanner: _t.pokerplanner
    }).then(function(data) {
      if (data.data.nModified) {
        _t.isCompleted = cbk;
      } else {
        alert('Oops something went wrong!');
      }
    });
  };
 
  // Update the edited Pokerplanner
  $scope.edit = function($event, i) {
    if ($event.which == 13 && $event.target.value.trim()) {
      var _t = $scope.pokerplanners[i];
      pokerplannersFactory.updatePokerplanner({
        _id: _t._id,
        pokerplanner: $event.target.value.trim(),
        isCompleted: _t.isCompleted
      }).then(function(data) {
        if (data.data.nModified) {
          _t.pokerplanner = $event.target.value.trim();
          $scope.isEditable[i] = false;
        } else {
          alert('Oops something went wrong!');
        }
      });
    }
  };
 
  // Delete a Pokerplanner
  $scope.delete = function(i) {
    pokerplannersFactory.deletePokerplanner($scope.pokerplanners[i]._id).then(function(data) {
      if (data.data) {
        $scope.pokerplanners.splice(i, 1);
      }
    });
  };
 
});