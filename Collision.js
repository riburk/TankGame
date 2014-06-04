/**
 * Created by richardburkhardt on 5/27/14.
 */

(function(tankGame){
    tankGame.collision = {
        // 'this' is the object that is moving
        rebound: function (other) {
            var top, bottom, left, right;
            if (this instanceof tankGame.Rect) {
                top = this.y + this.height;
                bottom = this.y;
                left = this.x;
                right = this.x + this.width;
            } else if (this instanceof tankGame.Circle) {
                top = this.y + this.radius;
                bottom = this.y - this.radius;
                left = this.x - this.radius;
                right = this.x + this.radius;
                document.dispatchEvent(tankGame.projectileBounceEvent);
            }
            // if striking a vertical side
            if (right < other.x || left > other.x + other.width) {
                this.dx = -this.dx * .7;
            }
            // if striking a horizontal side
            if (bottom > other.y + other.height || top < other.y) {
                this.dy = -this.dy * .3;
            }
        },

        stick: function (other) {
            var top, bottom, left, right, width, height;
            if (this instanceof tankGame.Rect) {
                top = this.y + this.height;
                bottom = this.y;
                left = this.x;
                right = this.x + this.width;
                width = this.width;
                height = this.height;
            } else if (this instanceof tankGame.Circle) {
                top = this.y + this.radius;
                bottom = this.y - this.radius;
                left = this.x - this.radius;
                right = this.x + this.radius;
                width = height = 2 * this.radius;
            }

            // if striking the top
            if (bottom > other.y + other.height) {
                this.x = this.x + this.dx * Math.abs((this.y - (other.y + other.height + this.radius)) / this.dy);
                this.y = other.y + other.height + this.radius;
            }
            // if striking the bottom
            else if (top < other.y) {
                this.x = this.x + this.dx * Math.abs(((other.y - radius) - this.y) / this.dy);
                this.y = other.y - radius;
            }
            // if striking left side
            else if (right < other.x) {
                this.y = this.y + this.dy * Math.abs(((other.x - this.radius) - this.x) / this.dx);
                this.x = other.x - this.radius;
            }
            // if striking the right side
            else if (left > other.x + other.width) {
                this.y = this.y + this.dy * Math.abs(((other.x + other.width + this.radius) - this.x) / this.dx);
                this.x = other.x + other.width + this.radius;
            }
            this.dx = this.dy = 0;
            this.firing = false;
            tankGame.sound.stopSound();
            tankGame.sound.playSound(tankGame.sound.bonkBuffer);
            document.dispatchEvent(tankGame.projectileMissEvent);
        },

        reset: function (other) {
            this.reset();
        },

        blowUp: function (other) {
            other.explode();
            document.dispatchEvent(tankGame.explosionStartEvent);
            tankGame.collision.runExplosion(other);
            tankGame.sound.stopSound();
            tankGame.sound.playSound(tankGame.sound.boomBuffer);
        },

        runExplosion : function (target) {
            var explosionInterval = setInterval(waitForExplosionToComplete, 50);

            function waitForExplosionToComplete() {
                if (target.isDone()) {
                    clearInterval(explosionInterval);
                    document.dispatchEvent(tankGame.explosionEndEvent);
                }
            }
        }
    }
})(window.tankGame = window.tankGame || {})