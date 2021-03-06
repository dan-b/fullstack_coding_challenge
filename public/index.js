var browse = angular.module('browseApp', ['hmTouchEvents']);
browse.controller('browseCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.users = [];
    $scope.currentUser = null;
    $scope.likedUser = null;
    $scope.swipe = null;
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
    $scope.popUser = function () {
        $scope.users.pop();
        if ($scope.users.length == 0)
            $scope.loadUsers();
    }
    $scope.panCard = function (event) {
        $scope.event = event;
        requestElementUpdate( function () {
            var card = document.querySelector("#active.card");
            var START_X = Math.round((window.innerWidth - card.offsetWidth) / 2) + $scope.event.deltaX;
            var START_Y = Math.round((window.innerHeight - card.offsetHeight) / 2) + $scope.event.deltaY;
            card.style.webkitTransform = ['translate3d(' + START_X + 'px, ' + START_Y + 'px, 0)'];
            ticking = false;
        });
        $scope.opacityLeft = Math.round($scope.event.deltaX/$scope.xThresholdLeft*100)/100;
        $scope.opacityRight = Math.round($scope.event.deltaX/$scope.xThresholdRight*100)/100;
    }
    $scope.likeUser = function (user) {
        $scope.likedUser = user;
        var modal = document.querySelector("#meet-me-modal");
        modal.classList.add("active");
        modal.style.width = window.innerWidth + "px";
        modal.style.height = window.innerHeight + "px";
        var body = document.querySelector("body");
        body.style.width = window.innerWidth + "px";
        body.style.height = window.innerHeight + "px";
        body.style.overflow = "hidden";
        body.style.position = "fixed";
        $scope.opacityRight = 0;
        $scope.$apply();
    }
    $scope.nopeUser = function (user) {
        $scope.popUser();
        $scope.currentUser = $scope.users[$scope.users.length-1];
        $scope.opacityLeft = 0;
    }
    $scope.hideMeetMeModal = function () {
        document.querySelector("#meet-me-modal").classList.remove("active");
        $scope.popUser();
        $scope.currentUser = $scope.users[$scope.users.length-1];
    }
    $scope.panEnd = function (event, user) {
        var card = event.element[0];
        card.classList.add("animate");
        if (event.deltaX <= $scope.xThresholdLeft) {
            var START_X = -card.offsetWidth;
            var START_Y = Math.round((window.innerHeight - card.offsetHeight) / 2) + $scope.event.deltaY;
            var nope = true;
        } else if (event.deltaX >= $scope.xThresholdRight) {
            var START_X = window.innerWidth + card.offsetWidth;
            var START_Y = Math.round((window.innerHeight - card.offsetHeight) / 2) + $scope.event.deltaY;
            var like = true;
        } else {
            var START_X = Math.round((window.innerWidth - card.offsetWidth) / 2);
            var START_Y = Math.round((window.innerHeight - card.offsetHeight) / 2);
        }
        var value = ['translate3d(' + START_X + 'px, ' + START_Y + 'px, 0)'];
        window.setTimeout(function (card, user) {
            card.style.webkitTransform = value;
            card.style.mozTransform = value;
            card.style.transform = value;
            if (nope)
                $scope.nopeUser(user);
            else if (like)
                $scope.likeUser(user);
            else {
                document.querySelector('#active>.like').style.opacity = 0;
                document.querySelector('#active>.nope').style.opacity = 0;
                window.setTimeout(function (card) {
                    $scope.resetActiveCard(card);
                }, 300, card);
            }
        }, 50, event.element[0], user);
    }
    $scope.swipeLeft = function (event, user) {
        $scope.swipe = "left";
    }
    $scope.swipeRight = function (event, user) {
        $scope.swipe = "right";
    }
    $scope.resetActiveCard = function (card) {
        card.classList.remove("animate");
    }
    $scope.loadUsers = function () {
        $http.get('/api/users/' + $scope.userIndex + "/" + $scope.userCount).then(
            function success (res) {
                $scope.userIndex += $scope.userCount;
                $scope.users = res.data;
                $scope.opacityLeft = 0;
                $scope.opacityRight = 0;
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