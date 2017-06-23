pokerplannerApp.factory('pokerplannersFactory', function($http) {
  var urlBase = '/api/pokerplanner';
  var urlName = '/api/name'
  var _pokerplannerService = {};
 
  _pokerplannerService.getPokerplanners = function() {
    return $http.get(urlBase);
  };

  _pokerplannerService.savePokerplanner = function(pokerplanner) {
    return $http.post(urlBase, pokerplanner);
  };

  _pokerplannerService.saveName = function(name) {
      return $http.post(urlName, name);
    };
 
  _pokerplannerService.updatePokerplanner = function(pokerplanner) {
    return $http.put(urlBase, pokerplanner);
  };
 
  _pokerplannerService.deletePokerplanner = function(id) {
    return $http.delete(urlBase + '/' + id);
  };

  _pokerplannerService.getRooms = function() {
    return $http.get(urlBase);
  };



  return _pokerplannerService;
});