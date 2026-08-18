
export function QRCode({ value, size = 160 }: { value: string; size?: number }) {
    const grid = 21;
    const cells: boolean[] = [];
    let h = 0;
    for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) >>> 0;
    for (let i = 0; i < grid * grid; i++) {
        h = (h * 1103515245 + 12345) >>> 0;
        cells.push((h & 1) === 1);
    }
    const isFinder = (r: number, c: number) => {
        const inBox = (r0: number, c0: number) =>
            r >= r0 && r < r0 + 7 && c >= c0 && c < c0 + 7 &&
            (r === r0 || r === r0 + 6 || c === c0 || c === c0 + 6 ||
                (r >= r0 + 2 && r <= r0 + 4 && c >= c0 + 2 && c <= c0 + 4));
        return inBox(0, 0) || inBox(0, grid - 7) || inBox(grid - 7, 0);
    };
    const isFinderBlank = (r: number, c: number) =>
        (r < 8 && c < 8) || (r < 8 && c >= grid - 8) || (r >= grid - 8 && c < 8);
    return (
        <svg width={size} height={size} viewBox={`0 0 ${grid} ${grid}`} className="rounded-lg bg-white p-1 shadow-sm text-primary">
            {Array.from({ length: grid }).map((_, r) =>
                Array.from({ length: grid }).map((_, c) => {
                    const finder = isFinder(r, c);
                    const blank = isFinderBlank(r, c) && !finder;
                    const on = finder || (!blank && cells[r * grid + c]);
                    return on ? <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="currentColor" /> : null;
                })
            )}
        </svg>
    );
}
