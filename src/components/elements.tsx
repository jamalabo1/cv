import React, {FCWithChildren} from 'react';

const Note: FCWithChildren = ({children}) => {
    return (
        <div className="mb-4">
            <span className="px-2 italic text-slate-500">
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

class Elements {
    static ListAnchor = ListAnchor;
    static Note = Note;
}

export default Elements;