pokerplannerApp.factory('mongodbFactory', mongodbFactory);

function mongodbFactory($http) {

  var urls = {
      urlRooms: '/api/rooms',
      urlRoom: '/api/room',
      urlUser: '/api/users',
      urlEstimate: 'api/estimates',
      urlNote: 'api/note',
      urlTaskEstimate: 'api/taskestimate'
  };

  var service = {
    getRooms: getRooms,
    getRoom: getRoom,
    getUsers: getUsers,
    saveRoom: saveRoom,
    findOrCreateUser: findOrCreateUser,
    updateRoom: updateRoom,
    deleteRoom: deleteRoom,
    saveEstimate: saveEstimate,
    saveNote: saveNote,
    getNotes: getNotes,
    saveTaskEstimate: saveTaskEstimate,
    urls: urls
  };
  return service;

  function getRooms() {
    return $http.get(this.urls.urlRooms);
  }

  function getRoom(id) {
    return $http.get(this.urls.urlRoom, {params:{"id":id}});
  }

  function getUsers() {
    return $http.get(this.urls.urlUser);
  }

  function saveRoom(room) {
    return $http.post(this.urls.urlRooms, room);
  }

  function findOrCreateUser(user) {
      return $http.post(this.urls.urlUser, user);
  }

  function updateRoom(room) {
    return $http.put(this.urls.urlRoom, room);
  }

  function saveEstimate(obj) {
    return $http.put(this.urls.urlEstimate, obj);
  }

  function saveTaskEstimate(obj) {
    return $http.put(this.urls.urlTaskEstimate, obj);
  }

  function saveNote(obj) {
    return $http.put(this.urls.urlNote, obj);
  }

  function getNotes(obj) {
    return $http.get(this.urls.urlNote, obj);
  }

  function deleteRoom(id) {
    return $http.delete(this.urls.urlRooms + '/' + id);
  }
}
