import React, {createContext, FCWithChildren, useContext, useId, useLayoutEffect, useRef} from "react";
import Elements from "./elements";
import Card from "@components/card";
import Chip from "@components/chip";
import {CollectableItemType} from "../types/collectable";
import {chunk} from 'lodash';
/* ---------------------------------- Types --------------------------------- */

type SummaryHighlights = {
    summary: { content: string };
    highlights: { content: readonly  string[] };
};

type Project = {
    title: string;
    description: string;
    highlights: readonly string[];
};

type ProjectsBlock = {
    items: readonly Project[];
};

type Course = {
    title: string;
    id: string;
};

type Education = {
    degree: string;
    institution: string;
    year: number;
};

type Skill = {
    title: string;
    description: string;
    tags: readonly  string[];
};

type SkillsBlock = {
    items: readonly Skill[];
};

type CollectableCtxValue = {
    registerFunc: (id: string, item: CollectableItemType) => void;
}

const CollectablesContext = createContext<CollectableCtxValue | null>(null);

export function CollectablesProvider({
                                         value,
                                         children,
                                     }: {
    value: CollectableCtxValue;
    children: React.ReactNode;
}) {
    return (
        <CollectablesContext.Provider value={value}>
            {children}
        </CollectablesContext.Provider>
    );
}

export function useCollectables() {
    const ctx = useContext(CollectablesContext);
    if (!ctx) {
        throw new Error("useCollectables must be used within <CollectablesProvider />");
    }
    return ctx;
}

const Collectable: FCWithChildren<{ type: string }> = ({children, type}) => {
    const id = useId();

    const ref = useRef<HTMLDivElement>(null);

    const collectables = useCollectables();

    useLayoutEffect(() => {
        collectables.registerFunc(id, {
            ref,
            type
        });
    }, []);

    return (
        <div ref={ref}>
            {children}
        </div>
    )
};

function CollectableChunks<T>({items, size}: { size: number, items: T[] }) {

    const chunks = chunk(items, size);

    return (
        <Elements.Component breakable>
            <Card.Title>Selected </Card.Title>

            <div className="mt-3 grid gap-4">
                {chunks.map((chunk) => (
                    <Collectable type={"project"}>
                        <div className="grid grid-cols-2 gap-2">
                            {
                                chunk.map((project) => (
                                    <ProjectCard key={project.title} project={project}/>
                                ))
                            }
                        </div>
                    </Collectable>
                ))}
            </div>
        </Elements.Component>
    );
}


/* ----------------------------- Reusable cards ----------------------------- */

export function SummaryCard({content}: { content: React.ReactNode }) {
    return (
        <Card className="col-span-2 p-5 shadow-sm">
            <Card.Title>Summary</Card.Title>
            <Card.Content>{content}</Card.Content>
        </Card>
    );
}

export function HighlightsCard({highlights}: { highlights: readonly string[] }) {
    return (
        <Collectable type="highlight">
            <Card className="flex flex-col gap-2 p-5 shadow-sm">
                <Card.Title>Highlights</Card.Title>

                <ul className="space-y-2 text-sm">
                    {highlights.map((highlight) => (
                        <Elements.ListAnchor key={highlight}>{highlight}</Elements.ListAnchor>
                    ))}
                </ul>
            </Card>
        </Collectable>
    );
}

export function ProjectCard({project}: { project: Project }) {
    return (
        <Card className="p-5">
            <h3 className="font-semibold">{project.title}</h3>
            <p className="mt-1 text-sm text-slate-700">{project.description}</p>
            <ul className="mt-2 text-xs text-slate-600 space-y-1 list-disc pl-5">
                {project.highlights.map((hl) => (
                    <li key={hl}>{hl}</li>
                ))}
            </ul>
        </Card>
    );
}

export function CourseCard({course}: { course: Course }) {
    return (
        <Card className="flex items-center justify-center p-5">
            <h3 className="font-semibold break-words hyphens-auto text-center">
                {course.title}
                <span className="px-1">-</span>
                <span className="text-brand-700">{course.id}</span>
            </h3>
        </Card>
    );
}

export function SkillCard({skill}: { skill: Skill }) {
    return (
        <Card className="flex flex-col justify-between rounded-2xl border border-slate-200 p-4 bg-white/70">
            <div>
                <h3 className="font-semibold">{skill.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{skill.description}</p>
            </div>

            <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {skill.tags.map((tag) => (
                    <Chip key={tag}>{tag}</Chip>
                ))}
            </div>
        </Card>
    );
}

/* ------------------------------ Page sections ----------------------------- */

export function OverviewSection({
                                    note,
                                    summaryHighlights,
                                }: {
    note: React.ReactNode;
    summaryHighlights: SummaryHighlights;
}) {
    return (
        <Collectable type="highlight">
            <Elements.Component>
                <Card.Title>Overview</Card.Title>
                <div className="mt-3 grid grid-cols-3 gap-6">
                    <SummaryCard content={summaryHighlights.summary.content}/>
                    <HighlightsCard highlights={summaryHighlights.highlights.content}/>
                </div>
            </Elements.Component>
        </Collectable>
    );
}

export function SelectedProjectsSection({projects}: { projects: ProjectsBlock }) {

    const chunks = chunk(projects.items, 2);

    return (
        <Elements.Component breakable>
            <Card.Title>Selected Projects</Card.Title>

            <div className="mt-3 grid gap-4">
                {chunks.map((chunk) => (
                    <Collectable type={"project"}>
                        <div className="grid grid-cols-2 gap-2">
                            {
                                chunk.map((project) => (
                                    <ProjectCard key={project.title} project={project}/>
                                ))
                            }
                        </div>
                    </Collectable>
                ))}
            </div>
        </Elements.Component>
    );
}

export function HighlightedCoursesSection({courses}: { courses: readonly Course[] }) {
    return (
        <Collectable type="courses">
            <Elements.Component>
                <Card.Title>Highlighted Courses</Card.Title>

                <div className="mt-3 grid grid-cols-3 gap-4">
                    {courses.map((course) => (
                        <CourseCard key={`${course.id}-${course.title}`} course={course}/>
                    ))}
                </div>
            </Elements.Component>
        </Collectable>
    );
}

export function EducationSection({education}: { education: Education }) {
    return (
        <Elements.Component>
            <Card className="p-4">
                <Card.Title>Education</Card.Title>

                <div className="mt-2 text-sm text-slate-700">
                    <div
                        className="flex items-baseline justify-between"
                        key={`${education.degree}-${education.institution}`}
                    >
                        <p className="font-medium">
                            {education.degree} — {education.institution}
                        </p>
                        <span className="text-slate-500">{education.year} -</span>
                    </div>
                </div>
            </Card>
        </Elements.Component>
    );
}

export function CoreSkillsSection({skills}: { skills: SkillsBlock }) {
    return (
        <Elements.Component>
            <Card.Title>Core Skills</Card.Title>

            <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {skills.items.map((skill) => (
                    <SkillCard key={skill.title} skill={skill}/>
                ))}
            </div>
        </Elements.Component>
    );
}

