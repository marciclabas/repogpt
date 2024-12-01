/**
 * Split `sizes` into `batches` batches while balancing both the largest and remaining sums.
 * - Returns an array of `batches` length, each containing an array of indices.
 */
export declare function loadBalance(sizes: number[], batches: number): number[][];
