import {PropsWithChildren} from 'react';

declare module 'react' {
    export type FCWithChildren = FC<PropsWithChildren>;
}