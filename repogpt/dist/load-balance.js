/**
 * Split `sizes` into `batches` batches while balancing both the largest and remaining sums.
 * - Returns an array of `batches` length, each containing an array of indices.
 */
export function loadBalance(sizes, batches) {
    const n = sizes.length;
    // Edge cases
    if (batches >= n) {
        return sizes.map((_, idx) => [idx]); // One index per batch
    }
    if (batches === 1) {
        return [sizes.map((_, idx) => idx)]; // All indices in one batch
    }
    // Prefix sum for quick range sum calculations
    const prefixSum = new Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) {
        prefixSum[i + 1] = prefixSum[i] + sizes[i];
    }
    // DP table and backtracking pointer
    const dp = Array.from({ length: batches + 1 }, () => new Array(n + 1).fill(Infinity));
    const split = Array.from({ length: batches + 1 }, () => new Array(n + 1).fill(0));
    // Base case: One batch, all sizes in one group
    for (let i = 1; i <= n; i++) {
        dp[1][i] = prefixSum[i];
    }
    // Fill DP table
    for (let k = 2; k <= batches; k++) {
        for (let i = 1; i <= n; i++) {
            for (let j = 0; j < i; j++) {
                const currentMax = Math.max(dp[k - 1][j], prefixSum[i] - prefixSum[j]);
                // If there's a tie, prefer configurations that balance the remaining sums better
                if (currentMax < dp[k][i] ||
                    (currentMax === dp[k][i] &&
                        prefixSum[i] - prefixSum[j] < dp[k - 1][j]) // Secondary balance criterion
                ) {
                    dp[k][i] = currentMax;
                    split[k][i] = j; // Record the split point
                }
            }
        }
    }
    // Backtrack to get the batch assignments
    const result = [];
    let i = n;
    for (let k = batches; k > 0; k--) {
        const j = split[k][i];
        result.unshift(Array.from({ length: i - j }, (_, idx) => j + idx));
        i = j;
    }
    return result;
}
