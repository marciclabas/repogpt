export type Branch = {
    owner: string;
    repo: string;
    branch?: string;
};
export declare function zipUrl({ owner, repo, branch }: Branch): string;
export type Params = Branch & {
    batches: number;
    ignoredExtensions?: string[];
};
export declare const IGNORED_EXTENSIONS: string[];
export declare function summarizeZip(buffer: ArrayBuffer, { batches, ignoredExtensions, ...branch }: Params): AsyncIterable<string>;
