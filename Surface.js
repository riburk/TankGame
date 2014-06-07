/**
 * Created by richardburkhardt on 5/27/14.
 */

(function(tankGame){
    tankGame.Surface = function(numGroundSegments){
        this.surfaceArray = [];
        var groundArray = generateGroundArray(numGroundSegments);
        this.segmentWidth = tankGame.WIDTH / groundArray.length;

        for (var i = 0; i < groundArray.length; i++) {
            this.surfaceArray.push(new SurfaceBlock(i * this.segmentWidth, 1, this.segmentWidth, groundArray[i]));
        }

        function generateGroundArray(numGroundSegments) {
            groundArray = [];
            for (var i = 0; i < numGroundSegments; i++) {
                groundArray.push(Math.random() * 9 * 30 + 20)
            }
            return groundArray;
        }

        this.draw = function() {
            for (var surfaceBlock in this.surfaceArray) {
                this.surfaceArray[surfaceBlock].draw();
            }
        };

        this.checkCollision = function(other, collisionFunction){
            var currentSegment = Math.floor(other.x / this.segmentWidth);
            var minSegment = Math.max(0, currentSegment - 1);
            var maxSegment = Math.min(numGroundSegments - 1, currentSegment + 1);
            for (var i = minSegment; i <= maxSegment; i++) {
                if(this.surfaceArray[i].checkCollision(other)){
                    collisionFunction.call(other, this.surfaceArray[i]);
                    if(i>0 && this.surfaceArray[i-1].checkCollision(other)){
                        collisionFunction.call(other, this.surfaceArray[i-1]);
                    }
                }
            }
        }
    };

    function SurfaceBlock(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    SurfaceBlock.prototype = new tankGame.Rect();
    SurfaceBlock.prototype.constructor = SurfaceBlock;

})(window.tankGame = window.tankGame || {});
