/**
 * Created by richardburkhardt on 5/22/14.
 */
(function(tankGame) {
    tankGame.Tank = function(scaleFactor, cannonAngle) {
        var locationX, locationY;
        var treadHeight = 5 * scaleFactor;
        var treadWidth = 15 * scaleFactor;
        var turretRadius = 4 * scaleFactor;
        var cannonWidth = 2 * scaleFactor;
        var cannonLength = 10 * scaleFactor;
        var cannonAngle = cannonAngle;
        this.cannonUp = false;
        this.cannonDown = false;
        var maxAngle = 180;
        var minAngle = 0;
        //locationX = locationX ;

        this.setLocation = function(x, y){
            locationX = x - treadWidth/2;
            locationY = y;
        };


        function circle(x, y, r) {
            tankGame.ctx.beginPath();
            tankGame.ctx.arc(x, y, r, 0, Math.PI * 2, true);
            tankGame.ctx.fill();
            tankGame.ctx.lineWidth = .5;
            tankGame.ctx.stroke();
        }

        function rect(x, y, w, h) {
            tankGame.ctx.beginPath();
            tankGame.ctx.rect(x, y, w, h);
            tankGame.ctx.closePath();
            tankGame.ctx.fill();
            tankGame.ctx.lineWidth = .5;
            tankGame.ctx.stroke();
        }


        this.draw = function () {
            tankGame.ctx.fillStyle = "white";
            tankGame.ctx.strokeStyle = "black";

            if(this.cannonUp && cannonAngle < maxAngle) {
                this.setAngle(cannonAngle + 1);
            }
            if(this.cannonDown && cannonAngle > minAngle) {
                this.setAngle(cannonAngle + -1);
            }

            // draw cannon
            tankGame.ctx.save();
            var cannonRotationCenterX = locationX + treadWidth / 2;
            var cannonRotationCenterY = locationY + treadHeight + cannonWidth / 2;
            tankGame.ctx.translate(cannonRotationCenterX, cannonRotationCenterY);
            tankGame.ctx.rotate(cannonAngle * Math.PI / 180);
            tankGame.ctx.translate(0, -cannonWidth / 2);
            rect(0, 0, cannonLength, cannonWidth);
            tankGame.ctx.restore();

            // draw turret
            circle(locationX + treadWidth / 2, locationY + treadHeight, turretRadius);

            // draw tread
            rect(locationX, locationY, treadWidth, treadHeight);
        };

        this.fireCannon = function () {
            var angle = document.getElementById("angle").value;
            var projectileStart = this.muzzleEndLocation();
            var projectile = new tankGame.Projectile(projectileStart.x, projectileStart.y, 2, "black", "white");
            //projectile.draw();
            projectile.fire(cannonAngle);
            tankGame.sound.playSound(tankGame.sound.bangBuffer);
            return projectile;
        };

        this.setAngle = function(angle){
            cannonAngle = angle;
            tankGame.cannonAngleChangeEvent.angle = cannonAngle;
            document.dispatchEvent(tankGame.cannonAngleChangeEvent)
        };

        this.muzzleEndLocation = function () {
            var location = {x: null, y: null};
            location.x = locationX + treadWidth / 2 + cannonLength * Math.cos(cannonAngle * Math.PI / 180);
            location.y = locationY + treadHeight + cannonLength * Math.sin(cannonAngle * Math.PI / 180);
            return location;
        }
    }
})(window.tankGame = window.tankGame || {});