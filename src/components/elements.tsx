import type {FC, HTMLProps, PropsWithChildren} from 'react'
import React, {FCWithChildren} from 'react';
import clsx from "clsx";

const Note: FCWithChildren = ({children}) => {
    return (
        <div className="mb-4">
            <span className="px-2 italic text-slate-600">
                {children}
            </span>
        </div>
    );
};

const ListAnchor: FCWithChildren = ({children}) => {
    return (
        <li
            className="flex items-center gap-2"
        >
            <span className="inline-block h-2 w-2 rounded-full bg-brand-600"/>
            {children}
        </li>
    )
}

const Atomic: FC<HTMLProps<HTMLDivElement> & { disable?: boolean }> = ({className, disable, ...rest}) => {
    return (
        <div
            className={
                clsx(
                    className,
                    {
                        "break-inside-avoid": !disable
                    }
                )
            }
            {...rest}
        />
    );
};

type ComponentProps = {
    breakable?: boolean
}
const Component: FC<PropsWithChildren<ComponentProps>> = ({children, breakable = false}) => {
    return (
        <Atomic className={"mt-8"} disable={breakable}>
            {children}
        </Atomic>
    );
};

class Elements {
    static ListAnchor = ListAnchor;
    static Note = Note;
    static Atomic = Atomic;
    static Component = Component;
}

export default Elements;