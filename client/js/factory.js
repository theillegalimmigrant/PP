pokerplannerApp.factory('pokerplannersFactory', function($http) {
  var urlBase = '/api/pokerplanner';
  var _pokerplannerService = {};
 
  _pokerplannerService.getPokerplanners = function() {
    return $http.get(urlBase);
  };
 
  _pokerplannerService.savePokerplanner = function(pokerplanner) {
    return $http.post(urlBase, pokerplanner);
  };
 
  _pokerplannerService.updatePokerplanner = function(pokerplanner) {
    return $http.put(urlBase, pokerplanner);
  };
 
  _pokerplannerService.deletePokerplanner = function(id) {
    return $http.delete(urlBase + '/' + id);
  };
 
  return _pokerplannerService;
});