// Context menu options
var menuOptions = [
    {
        id: '1',
        title: 'Slo-mo (0.25x)',
        speedFactor: 0.25
    }, {
        id: '2',
        title: 'Slower (0.5x)',
        speedFactor: 0.5
    }, {
        id: '3',
        title: 'Normal',
        speedFactor: 1,
        default: true
    }, {
        id: '4',
        title: 'Faster (1.25x)',
        speedFactor: 1.25
    }, {
        id: '5',
        title: 'High Speed (1.5x)',
        speedFactor: 1.5
    }, {
        id: '6',
        title: 'Ludicrous Speed (2x)',
        speedFactor: 2
    }
];

// Create the context menu
menuOptions.forEach(function(option) {
    chrome.contextMenus.create({
        id: option.id,
        type: 'radio',
        onclick: onClick,
        title: option.title,
        contexts: ['video'],
        checked: option.default ? true : false
    });
});

// Keep track of the last active video
var lastActiveVideo = {
    id: null,
    speed: null
};

/**
 * Handle click of context menu option
 */
function onClick(info, tab) {
    var optionClicked = findMenuOptionById(info.menuItemId);

    if (optionClicked && lastActiveVideo) {
        var message = {
            videoId: lastActiveVideo.id,
            speed: optionClicked.speedFactor
        };

        chrome.tabs.sendMessage(tab.id, message);
    }
}

/**
 * Listen for message from content script
 */
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    lastActiveVideo.id = message.videoId;
    lastActiveVideo.speed = message.videoSpeed;

    var selectedOption = findMenuOptionBySpeed(lastActiveVideo.speed);

    if (selectedOption) {
        menuOptions.forEach(function(option) {
            chrome.contextMenus.update(option.id, {
                checked: (option.id == selectedOption.id) ? true : false
            });
        });
    }
});

/**
 * Find a context menu option by its ID
 */
function findMenuOptionById(id) {
    for (var i = 0; i < menuOptions.length; i++) {
        if (menuOptions[i].id == id) {
            return menuOptions[i];
        }
    }

    return null;
}

/**
 * Find a context menu option by speed factor
 */
function findMenuOptionBySpeed(speedFactor) {
    for (var i = 0; i < menuOptions.length; i++) {
        if (menuOptions[i].speedFactor == speedFactor) {
            return menuOptions[i];
        }
    }

    return null;
}
