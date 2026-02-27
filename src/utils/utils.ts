/*
* divides elements with weights indexed by position in elements in knuth-palas like algorithm
* **/
export default function DivideChunks(elements: any[], weights: number[], maxSizes: number[]): number[][] {
    if (elements.length == 0) return [];
    const n = elements.length;

    const sums: number[] = Array(n + 1).fill(0);

    // calc range sum
    for (let i = 0; i < n; i++) {
        sums[i + 1] = sums[i] + weights[i];
    }
    // the dp array
    const dp = Array(n + 1).fill(Infinity); // start with inf as init value
    // start-end segment
    const ses = Array(n + 1).fill(-1);

    // for first size length
    const depth = Array(n + 1).fill(0);

    dp[0] = 0;

    for (let i = 1; i <= n; i++) {
        for (let j = 0; j < i; j++) {
            //weight
            const w = sums[i] - sums[j] // weights of the elements [i, j]
            // if first page, then use first maxSize, otherwise the other.
            const currentChunkIndex = depth[j];
            const maxSize = (currentChunkIndex === 0) ? maxSizes[0] : maxSizes[1];

            if (maxSize < w) {
                // this solution cannot be accepted
                continue;
            }

            // very high penalty for the first page to be empty.
            const p = currentChunkIndex === 0 ? 3 : 2;

            const cost = (j < n) ? Math.pow((maxSize - w), p) : 0 // if last page don't pay

            // what if we ended the segment at j?
            if (dp[j] + cost < dp[i]) {
                // then it's a better solution
                dp[i] = dp[j] + cost

                // and the last page actually started here
                ses[i] = j;

                depth[i] = depth[j] + 1;
            }
        }
    }

    const chunks: number[][] = [];

    let i = n;

    while (i > 0) {
        // the ses array is like a function, we need to keep applying it until we reach ses^i(x) = 0
        const start = ses[i];

        const indices: number[] = [];
        for (let j = start; j < i; j++) {
            indices.push(j);
        }

        chunks.push(indices);
        i = start;
    }

    return chunks.reverse();
}
