

let comandQueue = [];

setInterval(() => {

    if(comandQueue.length > 0) {

        chrome.storage.local.get(['scriptLines'], function (result) {
            console.log(comandQueue);
            const scriptLines = result.scriptLines.concat(comandQueue);
            comandQueue = [];

            chrome.storage.local.set({ scriptLines }, function () { });
        });
    }

}, 1000);

// Listen for state changes
chrome.storage.onChanged.addListener(function (changes, namespace) {

    for (var key in changes) {

        if (key === 'scriptLines') {
            const scriptLines = changes[key].newValue;
            renderScript({ scriptLines });
        }

        // console.log('Storage key "%s" in namespace "%s" changed. ' +
        //     'Old value was "%s", new value is "%s".',
        //     key,
        //     namespace,
        //     changes[key].oldValue,
        //     changes[key].newValue);

    }
});

export const addComand = ({ timestamp, comand }) => {

    comandQueue.push(comand);
console.log(timestamp, comand);

    // chrome.storage.local.get(['scriptLines'], function (result) {
    //     const scriptLines = result.scriptLines.concat([comand]);
    //     chrome.storage.local.set({ scriptLines }, function () { });
    // });
};

const renderScript = ({ scriptLines }) => {

    const scriptView = document.querySelector('.parrot-script');
    console.log("scriptView", scriptView);
    if (scriptView) {

        scriptView.innerHTML = '';

        scriptLines.map(line => {
            const item = document.createElement("div");
            item.innerHTML = line;
            scriptView.appendChild(item);
        });

        scriptView.scrollTop = scriptView.scrollHeight;
    }
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
