
// I KNOW IT'S DIRTY
// ...don't know why ng-model in input not works

// Countdown Controller
angular.module('App').controller('Countdown', ['$scope', 'VarStorage', 'Player', '$rootScope', '$location', '$anchorScroll', function($scope, VarStorage, Player, $rootScope, $location, $anchorScroll) {

    var playerEl      = document.getElementById('countdownPlayer'),
        startCount    = {minutes:0,seconds:0},
        curCount      = {minutes:0,seconds:0},
        minObj        = $('input#countdown-minutes'),
        secObj        = $('input#countdown-seconds');

    var countdownInterval = null;

    // Initialize
    $('.knob').knob();
    playerEl.volume = 1;



    // start the countdown
    $scope.start = function() {
        $('#countdownStart').addClass('disabled');
        $('#countdownStop').removeClass('disabled');

        startCount.minutes = minObj.val();
        startCount.seconds = secObj.val();
        curCount.minutes   = minObj.val();
        curCount.seconds   = secObj.val();

        Player.pause();
        setTimeout(function() {
            playerEl.play();

            setTimeout(function() {
                Player.play();

                countdownInterval = setInterval(function() {
                    countIt();
                }, 1000);
            }, 4000);
        }, 1000);
    };

    // stop it
    $scope.reset = function() {
        clearInterval(countdownInterval);

        reset();
    };

    $scope.scrollTo = function(id) {
        $location.hash(id);
        $anchorScroll();
    }



    // the countdown function
    var countIt = function() {
        // sub 1 second
        curCount.seconds--;

        // play countdown before stop
        if ( (curCount.seconds == 5) && (curCount.minutes == 0) )  {
            Player.pause();
            setTimeout(function() {
                playerEl.play();

                setTimeout(function() {
                    Player.play();
                    clearInterval(countdownInterval);
                    reset();
                }, 4000);
            }, 1000);
        }

        if ( curCount.seconds > 0 ) {
            secObj.val(curCount.seconds);
        } else if ( curCount.minutes > 0 ) {
            curCount.seconds = 60;
            secObj.val(curCount.seconds);
        }

        // sub 1 minute
        if ( (curCount.seconds == 60) && (curCount.minutes > 0) ) {
            curCount.minutes--;
        }

        minObj.val(curCount.minutes);

        $('.knob').trigger('change');
    };

    // reset to the start value
    var reset = function() {
        minObj.val(startCount.minutes);
        secObj.val(startCount.seconds);

        $('#countdownStart').removeClass('disabled');
        $('#countdownStop').addClass('disabled');

        $('.knob').trigger('change');
    };

}]);