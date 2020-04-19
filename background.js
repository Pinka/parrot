import {
    recordMouseDown,
    recordMouseUp,
    recordMouseMove,
    recordMouseClick,
    recordMouseDblClick,
    recordKeyboardDown, 
    recordKeyboardUp
} from "/src/events.js";

const recorderState = {
    isRecording: false,
    isPaused: false
};

// On Installed
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.set({ scriptLines: [] });
});

chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [
            new chrome.declarativeContent.PageStateMatcher({
                // pageUrl: { hostEquals: 'developer.chrome.com' },
                pageUrl: { schemes: ["http", "https"] },
            })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
});

// var eventsEnabled = false;
chrome.runtime.onMessage.addListener(

    function (request, sender, sendResponse) {

        if (sender.tab) {

            // recorder events
            const events = [

                // mouse
                ["auxclick", null], // TODO: recordMouseAuxClick
                ["click", recordMouseClick],
                ["dblclick", recordMouseDblClick],
                ["mousedown", recordMouseDown],
                ["mousemove", recordMouseMove],
                ["mouseup", recordMouseUp],

                // touch
                ["touchend", null],
                ["touchmove", null],
                ["touchstart", null],

                // keyboard
                ["keydown", recordKeyboardDown],
                ["keyup", recordKeyboardUp],

                // Focus
                ["blur", null],
                ["focus", null],

                // Clipboard
                ["copy", null],
                ["cut", null],
                ["paste", null]
            ];

            events.forEach(([name, callback]) => {
                if (request.name === name) {
                    callback && callback(request.event);
                }
            });
        }
    }
);
