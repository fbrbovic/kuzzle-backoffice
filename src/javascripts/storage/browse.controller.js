require('../collection/collectionsDropDownSearch/collectionsDropDownSearch.directive');
require('../collection/cogOptionsCollection/cogOptionsCollection.directive');

angular.module('kuzzle.storage')
  .controller('StorageBrowseCtrl', [
    '$scope',
    '$http',
    '$stateParams',
    '$state',
    'collectionApi',
    'authorizationApi',
    function ($scope, $http, $stateParams, $state, collectionApi, authorization) {
      var checkRights = function (collection) {
        $scope.canCreateDocument = authorization.canDoAction($stateParams.index, collection, 'write', 'create');
        $scope.canDeleteCollection = authorization.canDeleteCollection($stateParams.index, collection);
        $scope.canEditCollection = authorization.canDoAction(
          $stateParams.index,
          collection,
          'admin',
          'updateMapping'
        );
        $scope.canEmptyCollection = authorization.canDoAction(
          $stateParams.index,
          collection,
          'admin',
          'truncateCollection'
        );

        $scope.showCog = $scope.canDeleteCollection || $scope.canEditCollection || $scope.canEmptyCollection;
      };

      $scope.collections = [];
      $scope.stateParams = $stateParams;

      $scope.init = function () {

        collectionApi.list()
          .then(function (response) {
            $scope.collections = response.stored.map(function (collection) {
              return {name: collection};
            });

            if ($stateParams.collection) {
              checkRights($stateParams.collection);
            }
          })
          .catch(function (error) {
            console.error(error);
          });
      };

      /**
       * Redirect the user on the corresponding list when a collection is clicked
       * @param collection
       */
      $scope.onSelectCollection = function (collection) {
        checkRights(collection.name);
        $state.go('storage.browse.documents', {index: $stateParams.index, collection: collection.name, advancedFilter: null, basicFilter: null});
      };

      /**
       * Redirect to the collection creation when the user click on link "New collection"
       * @param collection
       */
      $scope.onCreateCollection = function (collection) {
        $state.go('collection.create', {
          index: $stateParams.index,
          newCollection: collection
        });
      };

      /**
       * Delete the entire collection
       */
      $scope.onDeleteCollection = function () {
        setTimeout(function () {
          $state.go('storage.browse', {index: $stateParams.index}, {reload: true});
        }, 1000);
      };

      /**
       * Empty/flush the collection
       */
      $scope.onEmptyCollection = function () {
        setTimeout(function () {
          $state.go('storage.browse.documents', {
            collection: $stateParams.collection,
            index: $stateParams.index
          }, {reload: true});
        }, 1000);
      };
    }]);
