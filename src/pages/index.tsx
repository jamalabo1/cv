import * as React from "react"
import {FC, useCallback, useMemo} from "react"
import type {HeadFC, PageProps} from "gatsby"
import {graphql} from 'gatsby';
import PageHeader from "../components/header";
import Container from "@components/container";
import {
    CollectablesProvider,
    CoreSkillsSection,
    CourseCard,
    EducationSection,
    HighlightedCoursesSection,
    MathWorkCard,
    NoteSection,
    OverviewSection,
    ProjectCard,
    SelectedMathWorkSection,
    SelectedProjectsSection,
    SkillCard
} from "@components/elm";
import {groupByType, ItemType, SectionInput, usePagedLayout} from "../hooks/usePagedLayout";

type DeepRequired<T> = {
    [K in keyof T]-?: NonNullable<T[K]> extends object
        ? DeepRequired<NonNullable<T[K]>>
        : NonNullable<T[K]>;
};

const IndexPageComponent: FC<DeepRequired<Queries.ResumeQuery>> = ({
                                                                       dataJson: data
                                                                   }) => {
    const registerFunc = useCallback(() => {
    }, []);

    const {
        description,
        links,
        sections: {
            projects,
            math_work,
            courses,
            skills,
            summary_highlights,
            education,
            note
        },
    } = data;

    const sections = useMemo<readonly SectionInput[]>(() => ([
        {type: "note", items: [summary_highlights]},
        {type: "education", items: [education]},
        {type: "project", items: projects.items, groupSize: 2},
        {type: "math_work", items: math_work.items, groupSize: 2},
        {type: "skill", items: skills.items, groupSize: 3},
        {type: "overview", items: [summary_highlights]},
        {type: "course", items: courses, groupSize: 3},
    ]), [summary_highlights, projects.items, math_work.items, courses, education, skills.items]);

    const {
        flatItems,
        pages,
        measureRef
    } = usePagedLayout({
        sections
    });

    const renderMeasureItem = (item: typeof flatItems[number]) => {
        switch (item.type) {
            case "note":
                return (
                    <NoteSection
                        note={note}
                    />
                )
            case "overview":
                return (
                    <OverviewSection
                        summaryHighlights={item.data}
                    />
                );
            case "project":
                return <ProjectCard project={item.data}/>;
            case "math_work":
                return <MathWorkCard item={item.data}/>;
            case "skill":
                return <SkillCard skill={item.data}/>;
            case "course":
                return <CourseCard course={item.data}/>;
            case "education":
                return <EducationSection education={item.data}/>;
            default:
                return null;
        }
    };

    const renderGroup = (group: { type: ItemType; data: any[] }) => {
        switch (group.type) {
            case "note":
                return (
                    <NoteSection
                        note={note}
                    />
                )
            case "overview":
                return (
                    <OverviewSection
                        summaryHighlights={group.data[0]}
                    />
                );
            case "project":
                return <SelectedProjectsSection projects={{items: group.data}}/>;
            case "math_work":
                return (
                    <SelectedMathWorkSection
                        mathWork={{
                            title: math_work.title,
                            description: math_work.description,
                            repo: math_work.repo,
                            items: group.data
                        }}
                    />
                );
            case "education":
                return <EducationSection education={group.data[0]}/>;
            case "skill":
                return <CoreSkillsSection skills={{items: group.data}}/>;
            case "course":
                return <HighlightedCoursesSection courses={group.data}/>;
            default:
                return null;
        }
    };

    return (
        <CollectablesProvider
            value={{
                registerFunc
            }}
        >
            {pages === null ? (
                <Container>
                    <PageHeader description={description} links={links}/>
                    <div className="relative p-8 pb-10">
                        <div>
                            {flatItems.map((item, index) => (
                                <div key={`${item.groupId}-${index}`} ref={measureRef(index)}>
                                    {renderMeasureItem(item)}
                                </div>
                            ))}
                        </div>
                    </div>
                </Container>
            ) : (
                pages.map((pageItems, pageIndex) => (
                    <Container key={pageIndex}>
                        {pageIndex === 0 ? <PageHeader description={description} links={links}/> : null}
                        <div className="relative p-8 pb-10">
                            {groupByType(pageItems).map((group, index) => (
                                <React.Fragment key={`${group.type}-${index}`}>
                                    {renderGroup(group)}
                                </React.Fragment>
                            ))}
                        </div>
                    </Container>
                ))
            )}
        </CollectablesProvider>
    );
};

const IndexPage: FC<
    PageProps<
        DeepRequired<Queries.ResumeQuery>
    >>
    = ({data}) => {
    return (
        <IndexPageComponent
            dataJson={data.dataJson}
        />

    )
}


export default IndexPage

export const Head: HeadFC = () =>
    <title>Jamal's Resume</title>

export const query = graphql`
    query Resume {
        dataJson
        {
            name
            description
            links
            sections
            {
                summary_highlights
                {
                    summary
                    {
                        content
                    }
                    highlights
                    {
                        content
                    }
                }
                skills
                {
                    items
                    {
                        title
                        description
                        tags
                    }
                }
                projects
                {
                    items
                    {
                        title
                        description
                        highlights
                    }
                }
                math_work
                {
                    title
                    description
                    repo
                    items
                    {
                        title
                        area
                        file
                        url
                        summary
                        tags
                    }
                }
                education
                {
                    degree
                    institution
                    year
                }
                courses
                {
                    id
                    title
                }
                note
            }
        }
    }
`;
