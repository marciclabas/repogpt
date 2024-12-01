import { managedAsync } from 'haskellian/asyn_iter';
export function progressDownload(url, responseType) {
    const stream = managedAsync();
    const xhr = new XMLHttpRequest();
    xhr.onprogress = e => stream.push({ tag: 'progress', loaded: e.loaded, total: e.lengthComputable ? e.total : undefined });
    xhr.onload = () => {
        stream.push({ tag: 'done', data: xhr.response });
        stream.end();
    };
    xhr.open('GET', url);
    xhr.responseType = responseType;
    xhr.send();
    return stream;
}
