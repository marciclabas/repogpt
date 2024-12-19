"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.progressDownload = progressDownload;
const managed_js_1 = require("haskellian/asyn_iter/managed.js");
function progressDownload(url, responseType) {
    const stream = (0, managed_js_1.managedAsync)();
    const xhr = new XMLHttpRequest();
    xhr.onprogress = e => stream.push({ tag: 'progress', loaded: e.loaded, total: e.lengthComputable ? e.total : undefined });
    xhr.onload = () => {
        if (xhr.status === 404)
            stream.push({ tag: 'not-found' });
        else if (xhr.status === 200)
            stream.push({ tag: 'done', data: xhr.response });
        else
            stream.push({ tag: 'error', detail: `Received status ${xhr.status}` });
        stream.end();
    };
    xhr.open('GET', url);
    xhr.responseType = responseType;
    xhr.send();
    return stream;
}
