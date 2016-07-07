require('tv4');
require('angular-ui-ace/src/ui-ace');

export default angular.module('jsonEdit', ['ui.ace'])
  .controller('AceCtrl', ['$scope', function ($scope) {
    $scope.aceLoaded = function (editor) {
      $scope.aceSession = editor.getSession();
      editor.$blockScrolling = Infinity;
    };

    $scope.aceChanged = function () {
      $scope.content = $scope.aceSession.getDocument().getValue();
    };
  }])
  .directive('jsonEdit', [function () {
    return {
      restrict: 'E',
      scope: {
        content: '=',
        canEdit: '='
      },
      controller: 'AceCtrl',
      templateUrl: '/templates/common/components/jsonEdit/jsonEdit.tpl.html'
    };
  }])
  .name;