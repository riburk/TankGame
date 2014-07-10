/**
 * Created by richardburkhardt on 5/27/14.
 */

(function(tankGame){
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    tankGame.sound =
    {
        context : new window.AudioContext(),
        source : null,
        bangBuffer : null,
        boomBuffer : null,
        bonkBuffer : null,
        boingBuffer : null,
        whistleBuffer : null,

        init : function() {
            tankGame.sound.loadSoundFile("Cannon.wav", "bangBuffer");
            tankGame.sound.loadSoundFile("Explosion.wav", "boomBuffer");
            tankGame.sound.loadSoundFile("Miss.wav", "bonkBuffer");
            tankGame.sound.loadSoundFile("Whistle.wav", "whistleBuffer");
            tankGame.sound.loadSoundFile("boing_spring.wav", "boingBuffer");

        },

        stopSound : function() {
            if (tankGame.sound.source) {
                tankGame.sound.source.stop(0);
            }
        },

        playSound: function(buffer, offset) {
            // source is global so we can unset it later to stop the sound.
            tankGame.sound.source = tankGame.sound.context.createBufferSource();
            tankGame.sound.source.offset = offset || 0;
            tankGame.sound.source.buffer = buffer;
            tankGame.sound.source.loop = false;
            tankGame.sound.source.connect(tankGame.sound.context.destination);
            tankGame.sound.source.start(0); // Play immediately.
        },

        initSound : function(arrayBuffer, audioBuffer) {
            tankGame.sound.context.decodeAudioData(arrayBuffer, function (buffer) {
                tankGame.sound[audioBuffer] = buffer;

            }, function (e) {
                console.log('Error decoding file', e);
            });
        },


        // Load file from a URL as an ArrayBuffer.
        // Example: loading via xhr2: loadSoundFile('sounds/test.mp3');
        loadSoundFile : function(url, buffer) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function (e) {
                tankGame.sound.initSound(this.response, buffer); // this.response is an ArrayBuffer.
            };
            xhr.send();
        }
    }
})(window.tankGame = window.tankGame || {});