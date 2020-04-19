import {
    addEventListeners,
    removeEventListeners
} from "./events.js";
import { addComand } from "./comands.js";

window.onload = function () {
    initParrot();
};

const startRecord = () => {

    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {

        const tab = tabs[0];
        const scriptView = document.querySelector('.parrot-script');

        scriptView && (scriptView.innerHTML = '');
        chrome.storage.local.set({ scriptLines: [] });

        addComand({
            comand: `
const puppeteer = require('puppeteer');

(async () => {
    let element = null;

    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 50
    });

    const page = await browser.newPage();
    await page.setViewport({ width: ${tab.width}, height: ${tab.height} });
    await page.goto('${tab.url}');

            ` });

        addEventListeners();
    });
};

const endRecord = () => {
    removeEventListeners();
    addComand({ comand: `await browser.close();` });
    addComand({ comand: `})()` });
};

const copyScript = () => {

    chrome.storage.local.get(['scriptLines'], function (result) {
        copyToClipboard(result.scriptLines.join('\n'));
    });
};

function copyDivToClipboard(container) {

    if (!container) {
        return;
    }

    const range = document.createRange();
    range.selectNode(container);
    window.getSelection().removeAllRanges(); // clear current selection
    window.getSelection().addRange(range); // to select text
    document.execCommand("copy");
    window.getSelection().removeAllRanges();// to deselect

    alert("Copied to Clipboard");
}

function copyToClipboard(text) {
    const input = document.createElement('textarea');
    // input.style.position = 'fixed';
    input.style.opacity = 0;
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('Copy');
    document.body.removeChild(input);
};

const initParrot = () => {

    const container = document.createElement("div");
    container.classList.add("parrot");
    document.body.appendChild(container);

    const controls = document.createElement("div");
    controls.classList.add("parrot-controls");
    container.appendChild(controls);

    const start = document.createElement("button");
    start.className = "parrot-button parrot-start";
    start.textContent = "Start";
    start.onclick = startRecord;
    controls.appendChild(start);

    const end = document.createElement("button");
    end.className = "parrot-button parrot-end";
    end.textContent = "End";
    end.onclick = endRecord;
    controls.appendChild(end);

    const copy = document.createElement("button");
    copy.className = "parrot-button parrot-copy";
    copy.textContent = "Copy";
    copy.onclick = copyScript;
    controls.appendChild(copy);

    const scriptView = document.createElement("div");
    scriptView.classList.add("parrot-script");
    container.appendChild(scriptView);
};
