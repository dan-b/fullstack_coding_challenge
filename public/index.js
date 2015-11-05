var browse = angular.module('browseApp', ['hmTouchEvents']);
/*browse.config(function (hammerDefaultOptsProvider) {
    hammerDefaultOptsProvider.set({
        recognizers: [
            [Hammer.Tap,{ event: 'tap'}],
            [Hammer.Tap, { event: 'doubletap', taps: 2 }, [], ['tap']],
            [Hammer.Press],
            [Hammer.Pan]
        ]
    });
});*/
browse.controller('browseCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.users = [];
    $scope.userIndex = 0;
    $scope.userCount = 3;
    $scope.pos = {
        x: null,
        y: null
    };
    $scope.card = null;
    $scope.content = null;
    $scope.panCard = function (event) {
        document.querySelector('#active.card').style.webkitTransform = ['translate3d(' + event.deltaX + 'px, ' + event.deltaY + 'px, 0)'];
        console.log(JSON.stringify(event, null, 2));
    }
    $scope.loadUsers = function () {
        $http.get('/api/users/' + $scope.userIndex + "/" + $scope.userCount).then(
            function success (res) {
                $scope.userIndex += $scope.userCount;
                $scope.users = res.data;
            },
            function error (res) {
                console.log("error res: " + JSON.stringify(res, null, 2))
            });
    }
    $scope.swipe = function () {
    }
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        $scope.card = document.querySelector(".active.card");
        $scope.content = document.querySelector("#content");
    });
}]);
browse.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    }
});
/*var START_X = null;
var START_Y = null;
var ticking = false;
var transform;
var timer;
function requestElementUpdate(el) {
    if(!ticking) {
        reqAnimationFrame(updateElementTransform(el));
        ticking = true;
    }
}
var reqAnimationFrame = (function () {
    return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
function updateElementTransform(el) {
    var value = [
        'translate3d(' + transform.translate.x + 'px, ' + transform.translate.y + 'px, 0)',
        'scale(' + transform.scale + ', ' + transform.scale + ')',
        'rotate3d('+ transform.rx +','+ transform.ry +','+ transform.rz +','+  transform.angle + 'deg)'
    ];

    value = value.join(" ");
    el.style.webkitTransform = value;
    el.style.mozTransform = value;
    el.style.transform = value;
    ticking = false;
}*/
var url = [
    "http://eightbitavatar.herokuapp.com/?id=",
    "&s=female&size=400"
];

(function () {

})();
