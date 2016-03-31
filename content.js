// Find all videos and add a unique ID and play speed
var videos = document.querySelectorAll('video');

for (var i = 0; i < videos.length; i++) {
    videos[i].setAttribute('data-vps-id', guid());
    videos[i].setAttribute('data-vps-speed', '1');
}

/**
 * Generate a Global Unique ID
 */
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

/**
 * Listen for Right-click on <video>
 */
window.addEventListener('contextmenu', function(e) {
    if (e.target.nodeName.toLowerCase() === 'video') {
        var message = {
            videoId: e.target.getAttribute('data-vps-id'),
            videoSpeed: e.target.getAttribute('data-vps-speed')
        };

        chrome.runtime.sendMessage(message);
    }
}, false);

/**
 * Listen for message from extension
 */
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.videoId) {
        var video = document.querySelector('video[data-vps-id="' + message.videoId + '"]');

        video.defaultPlaybackRate = message.speed;
        video.playbackRate = message.speed;

        video.setAttribute('data-vps-speed', message.speed);
    }
});
