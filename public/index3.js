var browse = angular.module('browseApp', []);

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
    $scope.lowerContent = function () {
        var el = $scope.content;
        START_X = Math.round((window.innerWidth - el.offsetWidth) / 2);
        START_Y = Math.round((window.innerHeight - el.offsetHeight) / 2);
        el.className = 'animate';
        transform = {
            translate: { x: START_X, y: START_Y },
            scale: 1,
            angle: 0,
            rx: 0,
            ry: 0,
            rz: 0
        };
        requestElementUpdate();
    }
    $scope.centerContent = function () {
        var el = $scope.content;
        START_X = Math.round((window.innerWidth - el.offsetWidth) / 2);
        START_Y = Math.round( -el.offsetHeight + 50);
        console.log("el.offsetWidth:" + el.offsetWidth);
        console.log("el.offsetHeight:" + el.offsetHeight);
        el.className = 'animate';
        transform = {
            translate: { x: START_X, y: START_Y },
            scale: 1,
            angle: 0,
            rx: 0,
            ry: 0,
            rz: 0
        };
        requestElementUpdate();
    }
    var START_X = null;
    var START_Y = null;
    var ticking = false;
    var transform;
    var timer;
    function requestElementUpdate() {
        if(!ticking) {
            reqAnimationFrame(updateElementTransform);
            ticking = true;
        }
    }
    var reqAnimationFrame = (function () {
        return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();
    function updateElementTransform() {
        var value = [
            'translate3d(' + transform.translate.x + 'px, ' + transform.translate.y + 'px, 0)',
            'scale(' + transform.scale + ', ' + transform.scale + ')',
            'rotate3d('+ transform.rx +','+ transform.ry +','+ transform.rz +','+  transform.angle + 'deg)'
        ];
        var el = $scope.content;
        value = value.join(" ");
        el.style.webkitTransform = value;
        el.style.mozTransform = value;
        el.style.transform = value;
        ticking = false;
    }
    function setUpTouchEvents () {
        var card = new Hammer.Manager($scope.card);
        card.add(new Hammer.Pan({threshold: 0, pointers: 0}));
        card.on("panstart panmove", onPan);
    }
    function onPan(ev) {
        $scope.card.className = '';
        transform.translate = {
            x: START_X + ev.deltaX,
            y: START_Y + ev.deltaY
        };
        requestElementUpdate();
    }
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        $scope.card = document.querySelector(".active.card");
        $scope.content = document.querySelector("#content");
        $scope.centerContent();
        setUpTouchEvents();
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
