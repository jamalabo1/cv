import React, {FCWithChildren, PropsWithChildren} from 'react';
import clsx from "clsx";


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
};

function Card(
    {
        className,
        children,
        ...rest
    }: PropsWithChildren<CardProps>) {
    return (
        <div
            className={
                clsx(
                    "bg-white rounded-2xl border border-slate-200",
                    className
                )
            }
            {...rest}
        >
            {children}
        </div>
    );
}

Card.Title = CardTitle;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;