import { addComand } from "./comands.js";

// const background = chrome.extension.getBackgroundPage();

let eventsEnabled = false;

export const addEventListeners = () => {
    // background.eventsEnabled = true;
    eventsEnabled = true;
};

export const removeEventListeners = () => {
    // background.eventsEnabled = false;
    eventsEnabled = false;
};

export const recordMouseDown = function (event) {

    // if(event.target) {
    //     addComand({ timestamp: event.timestamp, comand: `await page.$("${event.target}");` });
    // }
    
    // addComand({ timestamp: event.timestamp, comand: `await page.mouse.down();` });
};

export const recordMouseUp = function (event) {

    // if(event.target) {
    //     addComand({ timestamp: event.timestamp, comand: `await page.$("${event.target}");` });
    // }
    
    addComand({ timestamp: event.timestamp, comand: `await page.mouse.up();` });
};

export const recordMouseMove = throttle(function (event) {
    // console.log("page mouse move");
    addComand({ timestamp: event.timestamp, comand: `await page.mouse.move(${event.pageX}, ${event.pageY});` });
}, 300);

export const recordMouseClick = function (event) {

    // If generated on keyboard Enter
    if (event.pageX === 0 && event.pageY === 0) {
        return;
    }

    if (event.target) {
        addComand({
            timestamp: event.timestamp,
            comand: `
element = await page.$("${event.target}");
element && element.click();
            `
        });
    }
    else {
        addComand({
            timestamp: event.timestamp,
            comand: `
                await page.mouse.click(${event.pageX}, ${event.pageY}, {
                    button: "left",
                    clickCount: 1
                });
            `
        });
    }
};

export const recordMouseDblClick = function (event) {
    addComand({
        timestamp: event.timestamp,
        comand: `await page.mouse.click(${event.pageX}, ${event.pageY}, {
            button: "left",
            clickCount: 2
        });`
    });
};

export const recordKeyboardDown = function (event) {
    addComand({ timestamp: event.timestamp, comand: `await page.focus("${event.target}");` });
    addComand({ timestamp: event.timestamp, comand: `await page.keyboard.down("${event.key}");` });
    // addComand({ comand: `await page.keyboard.type("${event.key}");` });
};

export const recordKeyboardUp = function (event) {
    addComand({ timestamp: event.timestamp, comand: `await page.keyboard.up("${event.key}");` });
};

function throttle(callback, interval) {
    let enableCall = true;

    return function (...args) {
        if (!enableCall) return;

        enableCall = false;
        callback.apply(this, args);
        setTimeout(() => enableCall = true, interval);
    }
}
