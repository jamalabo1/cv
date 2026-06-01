import {RefObject} from "react";

export type CollectableItemType = {
    ref: RefObject<HTMLDivElement>;
    type: string;
}