import React, {FCWithChildren} from 'react';

const Chip: FCWithChildren = ({children}) => {
    return (
        <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 ring-1 ring-slate-200">
            {children}
        </span>
    );
};

export default Chip;