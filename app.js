(function () {
'use-strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service("MenuSearchService", MenuSearchService)
.directive('foundItems', FoundItems)


function FoundItems() {
  var ddo = {
    templateUrl: "founditems.html",
    controller: NarrowItDownController,
    controllerAs: 'narrow',
    bindToController: true
  };
  return ddo;
}

NarrowItDownController.$inject= ['MenuSearchService'];
function NarrowItDownController(MenuSearchService){
  var narrow = this;
  narrow.searchTerm = "";

  narrow.narrowDown = function(){
    MenuSearchService.getMatchedMenuItems(narrow.searchTerm).then(function(){
      narrow.found = MenuSearchService.getFoundItems();
    }
    );
  };

  narrow.removeItem = function(itemIndex){
    MenuSearchService.removeItem(itemIndex);
    narrow.found = MenuSearchService.foundItems;
  };
}


MenuSearchService =['$http']
function MenuSearchService($http){
  var service = this;
  service.foundItems = [{
    description: "Description",
    name: "Name",
    shortName: "Short Name"
  }];

  service.getFoundItems = function(){
    return service.foundItems;
  }

  service.getMatchedMenuItems = function(searchTerm){
    return $http({
      method:"GET",
      url:  "https://davids-restaurant.herokuapp.com/menu_items.json"
    }).then(function (response) {
      var menuItems = response.data.menu_items;
      service.foundItems = [];
      if (searchTerm!=""){
      for (var i=0; i<menuItems.length; i++){
        if (menuItems[i].description.toLowerCase().indexOf(searchTerm) !== -1){
          var item = {
            description: menuItems[i].description,
            shortName: menuItems[i].short_name,
            name: menuItems[i].name
          }
          service.foundItems.push(item);
        }
      }
    }
      return service.foundItems;
    });
  }

  service.removeItem = function(itemIndex){
    service.foundItems.splice(itemIndex, 1);
    return service.foundItems;
  }

}

})();
