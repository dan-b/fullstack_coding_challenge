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
    $scope.url = [
        "http://eightbitavatar.herokuapp.com/?id=",
        "&s=female&size=400"
    ];
    $scope.users = [];
    $scope.currentUser = null;
    $scope.userIndex = 0;
    $scope.userCount = 5;
    $scope.center = {
        x: null,
        y: null
    };
    $scope.opacityLeft = 0;
    $scope.opacityRight = 0;
    $scope.xThresholdLeft = null;
    $scope.xThresholdRight = null;
    $scope.cardIndex = 0;
    $scope.cardStack = [];
    $scope.event = null;
    $scope.card = null;
    $scope.content = null;
    $scope.panCard = function (event) {
        $scope.event = event;
        requestElementUpdate( function () {
            var card = document.querySelector("#active.card");
            var START_X = Math.round((window.innerWidth - card.offsetWidth) / 2) + $scope.event.deltaX;
            var START_Y = Math.round((window.innerHeight - card.offsetHeight) / 2) + $scope.event.deltaY;
            //console.log(JSON.stringify($scope.event, null, 2));
            card.style.webkitTransform = ['translate3d(' + START_X + 'px, ' + START_Y + 'px, 0)'];
            ticking = false;
        });
        $scope.opacityLeft = Math.round($scope.event.deltaX/$scope.xThresholdLeft*100)/100;
        $scope.opacityRight = Math.round($scope.event.deltaX/$scope.xThresholdRight*100)/100;
        //console.log(JSON.stringify(event, null, 2));
    }
    $scope.panEnd = function (event) {
        event.element[0].classList.add("animate");
        window.setTimeout(function (card) {
            var START_X = -card.offsetWidth;
            var START_Y = Math.round((window.innerHeight - card.offsetHeight) / 2) + $scope.event.deltaY;
            var value = ['translate3d(' + START_X + 'px, ' + START_Y + 'px, 0)'];
            card.style.webkitTransform = value;
            card.style.mozTransform = value;
            card.style.transform = value;
            $scope.users.pop();
            $scope.currentUser = $scope.users[$scope.users.length-1];
            console.log("users: " + JSON.stringify($scope.users, null, 2));
        }, 50, event.element[0]);
    }
    $scope.resetActiveCard = function () {
        var card = document.querySelector("#active.card");
        var START_X = -card.offsetWidth;
        var START_Y = Math.round((window.innerHeight - card.offsetHeight) / 2);
        requestElementUpdate( function () {
            card.classList.add("animate");
            var value = ['translate3d(' + START_X + 'px, ' + START_Y + 'px, 0)'];
            card.style.webkitTransform = value;
            card.style.mozTransform = value;
            card.style.transform = value;
            ticking = false;
        });
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
    $scope.moveCardsTopCenter = function () {
        var cards = document.getElementsByClassName('card');
        var START_X = Math.round((window.innerWidth - cards[0].offsetWidth) / 2);
        var START_Y = Math.round( -cards[0].offsetHeight);
        for (var i=0; i<cards.length; i++) {
            $scope.cardStack.push(cards[i]);
            cards[i].style.webkitTransform = ['translate3d(' + START_X + 'px, ' + START_Y + 'px, 0)'];
        }
    }
    $scope.moveCardsCenter = function () {
        var cards = document.getElementsByClassName('card');
        var START_X = Math.round((window.innerWidth - cards[0].offsetWidth) / 2);
        var START_Y = Math.round((window.innerHeight - cards[0].offsetHeight) / 2);
        requestElementUpdate( function () {
                var cards = document.getElementsByClassName('card');
                for (var i = 0; i < cards.length; i++) {
                    var el = cards[i];
                    el.classList.add("animate");
                    var value = ['translate3d(' + START_X + 'px, ' + START_Y + 'px, 0)'];
                    el.style.webkitTransform = value;
                    el.style.mozTransform = value;
                    el.style.transform = value;
                    el.style.transitionDelay = (i + 1) * .125 + "s";
                    ticking = false;
                }
        });
        window.setTimeout(function () {
            var cards = document.getElementsByClassName('card');
            for (var i = 0; i < cards.length; i++) {
                cards[i].classList.remove("animate");
                cards[i].style.transitionDelay = "0s";
            }
        }, 500);
    }
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        $scope.card = document.querySelector(".active.card");
        $scope.content = document.querySelector("#content");
        $scope.moveCardsTopCenter();
        $scope.moveCardsCenter();
        var card = document.querySelector("#active.card");
        $scope.xThresholdLeft = Math.round(-card.offsetWidth/4);
        $scope.xThresholdRight = Math.round(card.offsetWidth/4);
        $scope.currentUser = $scope.users[$scope.users.length-1];
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
var ticking = false;
var transform;
var timer;
//var event;
function requestElementUpdate(callback) {
    console.log("requestElementUpdate");
    if(!ticking) {
        reqAnimationFrame(callback);
        ticking = true;
    }
}
var reqAnimationFrame = (function () {
    console.log("reqAnimationFrame");
    return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
/*
// original
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

    value = value.join(" ");
    el.style.webkitTransform = value;
    el.style.mozTransform = value;
    el.style.transform = value;
    ticking = false;
}*/
