import React, {ExtendableDiv} from 'react';

const Container: ExtendableDiv = ({children, ...rest}) => {
    return (
        <div className="h-screen">
            <div
                className='w-full h-full text-slate-800 antialiased'
                {...rest}
            >
                <div className="mx-auto max-w-4xl p-2 h-full">
                    <section
                        className="bg-white rounded-3xl shadow-[0_20px_50px_-20px_rgb(2,6,23,0.2)] ring-1 ring-slate-200 overflow-hidden h-full">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Container;