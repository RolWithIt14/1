angular.module('landingBuilder', ['ui.router', 'ngAnimate', 'ngSanitize', 'toastr']);

angular.module('landingBuilder')
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('');
        $stateProvider
            .state('landing-page', {
                url: '',
                template: '<page-preview-directive></page-preview-directive>'
            });
    })
    .controller('mainCtrl', function ($rootScope) {
        $rootScope.appState = {};
    })
    .directive('activateTimer', activateTimerDirective)
    .run(function () {
        
    });

function activateTimerDirective($timeout) {
    return {
        restrict: 'A',
        link: function () {
            var timer;
            var minutes;
            var seconds;

            $timeout(callAtTimeout, 200);

            function callAtTimeout() {
                var minutes = 60 * 2,
                    display = document.getElementById('time');
                startTimer(minutes, display);
                setTimeout(getVisitors, 1000);
                getRandomGift(randomInteger(17, 33, 1));
                getGift();
            }

        function showPopup() {
            var dialog = document.getElementById('window');

                dialog.style.display = 'block';

                if ($('#window').length > 0 && $('.mask').length < 1) {
                    $('body').append('<span class="mask"></span>');
                }

                document.getElementById('exit').onclick = function () {
                    dialog.style.display = 'none';
                    $('.mask').remove();
                    timer = 55;
                };
                document.getElementById('exit-button').onclick = function () {
                    dialog.style.display = 'none';
                    $('.mask').remove();
                    timer = 55;
                };
            }

            function startTimer(duration, display) {
                timer = duration;

                var intervalTimer = setInterval(function () {
                    minutes = parseInt(timer / 60, 10);
                    seconds = parseInt(timer % 60, 10);

                    minutes = minutes < 10 ? "0" + minutes : minutes;
                    seconds = seconds < 10 ? "0" + seconds : seconds;

                    display.textContent = minutes + ":" + seconds;

                    if (timer === 0) {
                        showPopup();
                    } else {
                        --timer;
                    }

                }, 1000);

            }

            function getVisitors() {
                var obj = document.getElementById('visitors');
                obj.innerHTML = Math.abs(parseInt(obj.innerHTML) + Math.floor((Math.random() > 0.5 ? -1 : 1) * Math.random() * 10));

                if (obj.innerHTML <= 0) {
                    setTimeout(function () {
                    }, randomInteger(1, 5, 1000));
                } else {
                    setTimeout(getVisitors, randomInteger(1, 5, 1000));
                }
            }

            function getRandomGift(randomTime) {
                var gift = document.getElementById('gift');
                gift.textContent = randomTime;
            }

            function getGift() {
                var intervalTimerForGift = setInterval(function () {

                    if (gift.innerHTML == 3) {
                        clearTimeout(intervalTimerForGift);
                    } else {
                        gift.innerHTML--;
                    }

                }, 10000);

            }

            function randomInteger(min, max, count) {
                var randomTime = min - 0.5 + Math.random() * (max - min + 1)
                randomTime = Math.round(randomTime) * count;
                return randomTime;
            }

            var curr =  {x: null, y: null};

            var getMouseForPopup = function(){
                if (curr.y < 10 && $('.mask').length < 1) {
                    showPopup();
                }
            };

            $('body').mouseleave(function(){
                setTimeout(getMouseForPopup, 3000);
            });

            $('body').mousemove(function(e){
                curr.x = e.clientX;
                curr.y = e.clientY;
            });

        }
    }
}

