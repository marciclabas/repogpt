export type Progress<T> = {
    tag: 'progress';
    loaded: number;
    total?: number;
} | {
    tag: 'done';
    data: T;
};
export type Return<T extends XMLHttpRequestResponseType> = T extends 'arraybuffer' ? ArrayBuffer : T extends 'blob' ? Blob : T extends 'document' ? Document : T extends 'json' ? any : T extends 'text' ? string : never;
export declare function progressDownload<T extends XMLHttpRequestResponseType>(url: string, responseType: T): AsyncIterable<Progress<Return<T>>>;
