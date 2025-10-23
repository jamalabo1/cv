import * as React from "react"
import {FC} from "react"
import type {HeadFC, PageProps} from "gatsby"
import {graphql} from 'gatsby';
import PageHeader from "../components/header";
import Card from "@components/card";
import Chip from "@components/chip";

type DeepRequired<T> = {
    [K in keyof T]-?: NonNullable<T[K]> extends object
        ? DeepRequired<NonNullable<T[K]>>
        : NonNullable<T[K]>;
};

const IndexPage: FC<
    PageProps<
        DeepRequired<Queries.ResumeQuery>
    >
> = ({
         data: {
             dataJson: {
                 description,
                 links,
                 sections: {
                     summary_highlights,
                     skills,
                     projects,
                     education
                 },
                 note
             }
         }
     }) => {

    return (
        <div
             className='w-full  text-slate-800 antialiased'>

            <div  id='resume' className="mx-auto max-w-4xl p-4">

                <section
                    className="bg-white rounded-3xl shadow-[0_20px_50px_-20px_rgb(2,6,23,0.2)] ring-1 ring-slate-200 overflow-hidden">

                    <PageHeader
                        description={description}
                        links={links}
                    />

                    <div className="p-8 pb-10">

                        <div className="mb-4">
                            <span className="px-2 italic text-slate-500">{note}</span>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <Card
                                className="col-span-2 p-5 shadow-sm"
                            >
                                <Card.Title>
                                    Summary
                                </Card.Title>
                                <Card.Content>
                                    {summary_highlights.summary.content}
                                </Card.Content>
                            </Card>

                            <Card
                                className="flex flex-col gap-2 p-5 shadow-sm"
                            >
                                <Card.Title>
                                    Highlights
                                </Card.Title>

                                <ul className="space-y-2 text-sm">
                                    {
                                        summary_highlights.highlights.content.map(highlight => (
                                            <li
                                                key={highlight}
                                                className="flex items-center gap-2"
                                            >
                                                <span className="inline-block h-2 w-2 rounded-full bg-brand-600"/>
                                                {highlight}
                                            </li>
                                        ))
                                    }
                                </ul>
                            </Card>
                        </div>

                        <div className="mt-6">
                            <Card.Title>Core Skills</Card.Title>

                            <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {
                                    skills.items.map((skill) => (
                                        <Card
                                            key={skill.title}
                                            className="flex flex-col justify-between rounded-2xl border border-slate-200 p-4 bg-white/70"
                                        >
                                            <div>
                                                <h3 className="font-semibold">
                                                    {skill.title}
                                                </h3>
                                                <p className="mt-1 text-sm text-slate-600">
                                                    {skill.description}
                                                </p>
                                            </div>
                                            <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                                {
                                                    skill.tags.map((tag) => (
                                                        <Chip
                                                            key={tag}
                                                        >
                                                            {tag}
                                                        </Chip>
                                                    ))
                                                }
                                            </div>
                                        </Card>
                                    ))
                                }
                            </div>
                        </div>

                        <div className="mt-8">
                            <Card.Title>
                                Selected Projects
                            </Card.Title>
                            <div className="mt-3 grid md:grid-cols-2 gap-4">
                                {
                                    projects.items.map(project => (
                                        <Card
                                            key={project.title}
                                            className="p-5"
                                        >
                                            <h3 className="font-semibold">
                                                {project.title}
                                            </h3>
                                            <p className="mt-1 text-sm text-slate-700">
                                                {project.description}
                                            </p>

                                            <ul className="mt-2 text-xs text-slate-600 space-y-1 list-disc pl-5">

                                                {project.highlights.map((hl) => (
                                                    <li key={hl}>{hl}</li>
                                                ))}
                                            </ul>
                                        </Card>
                                    ))
                                }
                            </div>
                        </div>

                        <div className="mt-8 grid gap-6">
                            <Card className='p-4'>
                                <Card.Title>
                                    Education
                                </Card.Title>
                                <div className="mt-2 text-sm text-slate-700">
                                    {
                                        <div
                                            key={`${education.degree}-${education.institution}`}
                                            className="flex items-baseline justify-between"
                                        >
                                            <p className="font-medium">
                                                {education.degree} — {education.institution}
                                            </p>
                                            <span className="text-slate-500">
                                                {education.year} -
                                            </span>
                                        </div>
                                    }
                                </div>
                            </Card>
                        </div>

                    </div>
                </section>
            </div>
        </div>
    );
};


export default IndexPage

export const Head: HeadFC = () =>
    <title>Jamal's Resume</title>

export const query = graphql`
    query Resume {
        dataJson {
            name
            description
            links
            sections {
                summary_highlights {
                    summary {
                        content
                    }
                    highlights {
                        content
                    }
                }
                skills {
                    items {
                        title
                        description
                        tags
                    }
                }
                projects {
                    items {
                        title
                        description
                        highlights
                    }
                }
                education {
                    degree
                    institution
                    year
                }
            }
            note
        }
    }
`;