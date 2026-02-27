import type {CSSProperties} from "react";
import {useLayoutEffect, useMemo, useRef, useState} from "react";
import DivideChunks from "@utils";

export type ItemType = "overview" | "project" | "course" | "education" | "skill";

export type FlatItem = {
    type: ItemType;
    data: any;
};

export type PageMatrix = FlatItem[][];

export type SectionInput = {
    type: ItemType;
    items: readonly any[];
};

const MEASURE_CONTAINER_STYLE: CSSProperties = {
    position: "absolute",
    opacity: 0,
    pointerEvents: "none",
    left: "-10000px",
    top: 0,
    width: "100%"
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
                                   sections,
                                   pageHeight
                               }: {
    sections: readonly SectionInput[];
    pageHeight: number;
}) {
    const flatItems = useMemo<FlatItem[]>(
        () => sections.flatMap((section) => section.items.map((item) => ({
            type: section.type,
            data: item
        }))),
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
        const next = DivideChunks(flatItems, weights, pageHeight);

        setChunkMatrix(next);
    }, [chunkMatrix, flatItems, pageHeight]);

    const pages = useMemo<PageMatrix | null>(() => {
        if (chunkMatrix === null) return null;
        return chunkMatrix.map((page) => page.map((index) => flatItems[index]));
    }, [chunkMatrix, flatItems]);

    return {
        flatItems,
        pages,
        chunkMatrix,
        measureRef,
        measureContainerStyle: {}
    };
}
