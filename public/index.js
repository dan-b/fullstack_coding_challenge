/*var cards = angular.module('cardsApp', []);

cards.controller('cardsCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.users = [];
    $scope.pos = {
        x: null,
        y: null
    }
    $scope.init = function () {
        var myElement = document.getElementById('front-card');
        var mc = new Hammer(myElement);
        mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
        //mc.on("panleft panright panup pandown", function(ev) {
        mc.on("panend", function(ev) {
            console.log(ev.type + " " + ev.deltaX);
            $scope.pos.x = ev.deltaX;
            $scope.pos.y = ev.deltaY;
            var x = ev.deltaX + 'px';
            var y = ev.deltaY + 'px';
            $(myElement).transition({x:x, y:y});
        });
/!*        myData.forEach( function (item) {
            $scope.data.push(item);
        });*!/
    }
    $scope.swipe = function () {
    }
}]);
var url = [
    "http://eightbitavatar.herokuapp.com/?id=",
    "&s=female&size=400"
];

(function () {

})();*/

var reqAnimationFrame = (function () {
    return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

var el = document.querySelector("#active-card");

var START_X = Math.round((window.innerWidth - el.offsetWidth) / 2);
var START_Y = Math.round((window.innerHeight - el.offsetHeight) / 2);

var ticking = false;
var transform;
var timer;

var mc = new Hammer.Manager(el);

mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));

mc.add(new Hammer.Swipe()).recognizeWith(mc.get('pan'));
mc.add(new Hammer.Rotate({ threshold: 0 })).recognizeWith(mc.get('pan'));
mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([mc.get('pan'), mc.get('rotate')]);

mc.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));
mc.add(new Hammer.Tap());

mc.on("panstart panmove", onPan);
mc.on("swipe", onSwipe);
mc.on("tap", onTap);

mc.on("hammer.input", function(ev) {
    if(ev.isFinal) {
        resetElement();
    }
});


function resetElement() {
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
}

function requestElementUpdate() {
    if(!ticking) {
        reqAnimationFrame(updateElementTransform);
        ticking = true;
    }
}

function logEvent(str) {
    console.log(str);
}

function onPan(ev) {
    el.className = '';
    transform.translate = {
        x: START_X + ev.deltaX,
        y: START_Y + ev.deltaY
    };

    requestElementUpdate();
    logEvent(ev.type);
}

function onSwipe(ev) {
    var angle = 50;
    transform.ry = (ev.direction & Hammer.DIRECTION_HORIZONTAL) ? 1 : 0;
    transform.rx = (ev.direction & Hammer.DIRECTION_VERTICAL) ? 1 : 0;
    transform.angle = (ev.direction & (Hammer.DIRECTION_RIGHT | Hammer.DIRECTION_UP)) ? angle : -angle;

    clearTimeout(timer);
    timer = setTimeout(function () {
        resetElement();
    }, 300);
    requestElementUpdate();
    logEvent(ev.type);
}

function onTap(ev) {
    transform.rx = 1;
    transform.angle = 25;

    clearTimeout(timer);
    timer = setTimeout(function () {
        resetElement();
    }, 200);
    requestElementUpdate();
    logEvent(ev.type);
}

resetElement();