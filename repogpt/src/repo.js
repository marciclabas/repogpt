"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IGNORED_EXTENSIONS = void 0;
exports.zipUrl = zipUrl;
exports.summarizeZip = summarizeZip;
const jszip_1 = __importDefault(require("jszip"));
const load_balance_js_1 = require("./load-balance.js");
function zipUrl({ owner, repo, branch = 'main' }) {
    return `https://codeload.github.com/${owner}/${repo}/zip/refs/heads/${branch}`;
}
function size(file) {
    var _a;
    return (_a = file['_data'].uncompressedSize) !== null && _a !== void 0 ? _a : 0;
}
function removePrefix(s, prefix) {
    return s.startsWith(prefix) ? s.slice(prefix.length) : s;
}
function fixPath(file, { repo, branch = 'main' }) {
    const prefix = `${repo}-${branch}/`;
    file.name = removePrefix(file.name, prefix);
    return file;
}
const hr = '='.repeat(80);
function concat(files) {
    return __awaiter(this, void 0, void 0, function* () {
        let out = '';
        for (const [i, file] of files.entries()) {
            const content = yield file.async('text');
            if (i > 0)
                out += '\n\n';
            out += `${hr}\n${file.name}\n${hr}\n\n${content}`;
        }
        return out;
    });
}
exports.IGNORED_EXTENSIONS = [
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.ico', '.svg',
    '.mp3', '.mp4', '.avi', '.mov', '.webm', '.flac', '.wav', '.ogg',
    '.zip', '.rar', '.7z', '.gz',
    '.wasm', '.asm', '.obj', '.dll', '.exe', '.so', '.a', '.lib',
];
function summarizeZip(buffer_1, _a) {
    return __asyncGenerator(this, arguments, function* summarizeZip_1(buffer, _b) {
        var { batches, ignoredExtensions = exports.IGNORED_EXTENSIONS } = _b, branch = __rest(_b, ["batches", "ignoredExtensions"]);
        const data = (yield __await(jszip_1.default.loadAsync(buffer))).files;
        const files = Object.values(data)
            .filter(file => !file.dir)
            .filter(file => !ignoredExtensions.some(ext => file.name.endsWith(ext)))
            .map(file => fixPath(file, branch));
        const sizes = files.map(size);
        const indices = (0, load_balance_js_1.loadBalance)(sizes, batches);
        for (const group of indices) {
            const content = yield __await(concat(group.map(i => files[i])));
            yield yield __await(content);
        }
    });
}
