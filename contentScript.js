

const getCssSelector = (el) => {
    let path = [], parent;
    while (parent = el.parentNode) {
        path.unshift(`${el.tagName}:nth-child(${[].indexOf.call(parent.children, el) + 1})`);
        el = parent;
    }
    return `${path.join(' > ')}`.toLowerCase();
};

// debugger;
[
    // mouse
    "auxclick",
    "click",
    "dblclick",
    "mousedown",
    "mousemove",
    "mouseup",

    // touch
    "touchend",
    "touchmove",
    "touchstart",

    // keyboard
    "keydown",
    "keyup",

    // Focus
    "blur",
    "focus",

    // Clipboard
    "copy",
    "cut",
    "paste"

    // Wheel
    // "scroll"
    // "wheel"
].forEach(name => {
    window.addEventListener(name, (event) => {
        //debugger;
        if (event.isTrusted) {

            try {
                chrome.runtime.sendMessage({
                    name, event: {
                        timestamp: new Date().toJSON(),
                        pageX: event.pageX,
                        pageY: event.pageY,
                        key: event.key,
                        target: (event.target && getCssSelector(event.target))
                    }
                });
            }
            catch(error) {
                console.log("chrome.runtime.sendMessage error:", error);
            }
        }
        else {
            console.log("untrusted event:", event);
        }
    });
});
