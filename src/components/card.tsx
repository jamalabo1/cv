import React, {FCWithChildren, PropsWithChildren} from 'react';
import clsx from "clsx";
import Elements from "./elements";


const CardTitle: FCWithChildren = ({children}) => {
    return (
        <h2 className='text-sm font-semibold tracking-wider text-brand-700 uppercase'>
            {children}
        </h2>
    )
}

const CardContent: FCWithChildren = ({children}) => {
    return (
        <p className="mt-2 leading-relaxed text-slate-700">
            {children}
        </p>
    )
};

export const CardFooter: FCWithChildren = ({children}) => {
    return (
        <div>
            {children}
        </div>
    )
}

export type CardProps = {
    className?: string;
    atomic?:boolean
};

function Card(
    {
        className,
        children,
        ...rest
    }: PropsWithChildren<CardProps>) {
    return (
        <Elements.Atomic
            className={
                clsx(
                    "bg-white rounded-2xl border border-slate-200",
                    className
                )
            }
            {...rest}
        >
            {children}
        </Elements.Atomic>
    );
}

Card.Title = CardTitle;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;