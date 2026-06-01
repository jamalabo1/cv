import {useLayoutEffect, useMemo, useRef, useState} from "react";
import DivideChunks from "@utils";

export type ItemType = "overview" | "project" | "course" | "education" | "skill" | "note";

export type FlatItem = {
    type: ItemType;
    data: any;
    groupId: string;
};

export type PageMatrix = FlatItem[][];

export type SectionInput = {
    type: ItemType;
    items: readonly any[];
    groupSize?: number;
};


export function groupByType(pageItems: FlatItem[]): { type: ItemType; data: any[] }[] {
    const groups: { type: ItemType; data: any[] }[] = [];

    for (const item of pageItems) {
        const last = groups[groups.length - 1];
        if (last && last.type === item.type) {
            last.data.push(item.data);
        } else {
            groups.push({type: item.type, data: [item.data]});
        }
    }

    return groups;
}

export function usePagedLayout({
                                   sections
                               }: {
    sections: readonly SectionInput[];
}) {

    const CHUNK_PARAMS = typeof window !== "undefined" ? [
        window.innerHeight - 400,
        window.innerHeight
    ] : [900, 1200];

    const flatItems = useMemo<FlatItem[]>(
        () =>
            sections.flatMap((section, sectionIndex) => {
                const groupSize = Math.max(1, section.groupSize ?? 1);
                return section.items.map((item, itemIndex) => ({
                    type: section.type,
                    data: item,
                    groupId: `${section.type}-${sectionIndex}-${Math.floor(itemIndex / groupSize)}`
                }));
            }),
        [sections]
    );

    const itemRefs = useRef<HTMLDivElement[]>([]);
    const [chunkMatrix, setChunkMatrix] = useState<number[][] | null>(null);

    const measureRef = (index: number) => (el: HTMLDivElement | null) => {
        if (el) {
            itemRefs.current[index] = el;
        }
    };

    useLayoutEffect(() => {
        if (chunkMatrix !== null) return;
        if (flatItems.length === 0) {
            setChunkMatrix([]);
            return;
        }

        const weights = flatItems.map((_, index) => itemRefs.current[index]?.offsetHeight ?? 0);
        const groupRanges: { groupId: string; start: number; end: number }[] = [];
        flatItems.forEach((item, index) => {
            const last = groupRanges[groupRanges.length - 1];
            if (last && last.groupId === item.groupId) {
                last.end = index;
            } else {
                groupRanges.push({groupId: item.groupId, start: index, end: index});
            }
        });

        const groupWeights = groupRanges.map((range) => {
            let sum = 0;
            for (let i = range.start; i <= range.end; i++) {
                sum += weights[i] ?? 0;
            }
            return sum;
        });

        const groupedChunks = DivideChunks(groupRanges, groupWeights, CHUNK_PARAMS);
        const next = groupedChunks.map((page) => {
            const indices: number[] = [];
            page.forEach((groupIndex) => {
                const range = groupRanges[groupIndex];
                for (let i = range.start; i <= range.end; i++) {
                    indices.push(i);
                }
            });
            return indices;
        });

        setChunkMatrix(next);

        if (typeof window !== "undefined") {
            window.__PDF_READY__ = true;
            document.documentElement.dataset.pdfReady = "1";
        }
    }, [chunkMatrix, flatItems]);

    const pages = useMemo<PageMatrix | null>(() => {
        if (chunkMatrix === null) return null;
        return chunkMatrix.map((page) => page.map((index) => flatItems[index]));
    }, [chunkMatrix, flatItems]);

    return {
        flatItems,
        pages,
        chunkMatrix,
        measureRef
    };
}
