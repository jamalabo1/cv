import {HTMLProps, PropsWithChildren} from 'react';

declare module 'react' {
    export type FCWithChildren<T = {}> = FC<PropsWithChildren<T>>;
    export type ExtendableDiv<T = {}> = FC<PropsWithChildren<HTMLProps<HTMLDivElement & T>>>;
}