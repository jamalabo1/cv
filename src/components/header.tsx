import React, {FC} from 'react';


export interface HeaderProps {
    description: string;
    links: readonly string[];

}

const HeaderLink = (
    {
        content
    }: {
        content: string
    }
) => {
    return (
        <li className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
            <span>
                {content}
            </span>
        </li>
    )
};

const PageHeader: FC<HeaderProps> = (
    {
        description,
        links
    }
) => {
    return (
        <header className="relative isolate">
            <div
                className="px-8 pt-10 pb-6 h-40 bg-gradient-to-r from-brand-600 via-indigo-600 to-fuchsia-600 text-white">
                <div className="flex flex-row sm:flex-row sm:items-end sm:justify-between gap-6">
                    <div>
                        <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight">
                            Jamal Abo Mokh
                        </h1>
                        <p className="mt-1 text-white/90">
                            {description}
                        </p>
                    </div>
                    <ul className="grid grid-rows-2 gap-2 text-sm">
                        {
                            links.map(link => (
                                <HeaderLink
                                    key={link}
                                    content={link}
                                />
                            ))
                        }
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default PageHeader;