import React, {FCWithChildren} from 'react';

const Container: FCWithChildren = ({children}) => {
    return (
        <div
            className='w-full  text-slate-800 antialiased'>

            <div id='resume' className="mx-auto max-w-4xl p-4">

                <section
                    className="bg-white rounded-3xl shadow-[0_20px_50px_-20px_rgb(2,6,23,0.2)] ring-1 ring-slate-200 overflow-hidden">
                    {children}
                </section>
            </div>
        </div>
    );
};

export default Container;