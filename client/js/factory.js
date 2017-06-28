pokerplannerApp.factory('mongodbFactory', mongodbFactory);

function mongodbFactory($http) {

var urls = {
      urlRooms: '/api/rooms',
      urlRoom: '/api/room',
      urlUser: '/api/users',

      urlTest: '/api/test'
  }

  var service = {
    getRooms: getRooms,
    getRoom: getRoom,
    getUsers: getUsers,
    saveRoom: saveRoom,
    findOrCreateUser: findOrCreateUser,
    updateRoom: updateRoom,
    deleteRoom: deleteRoom,
    urls: urls
  };
  return service;

  function getRooms() {
    return $http.get(this.urls.urlRooms);
  };

  function getRoom(id) {
    return $http.get(this.urls.urlRoom, {params:{"id":id}});
  };

  function getUsers() {
    return $http.get(this.urls.urlUser);
  };

  function saveRoom(room) {
    return $http.post(this.urls.urlRooms, room);
  };

  function findOrCreateUser(user) {
      return $http.post(this.urls.urlUser, user);
    };

  function updateRoom(room) {
    return $http.put(this.urls.urlTest, room);
  };

  function deleteRoom(id) {
    return $http.delete(this.urls.urlRooms + '/' + id);
  };
};
