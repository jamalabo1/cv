import * as React from "react"
import {FC, RefObject, useLayoutEffect, useRef, useState} from "react"
import type {HeadFC, PageProps} from "gatsby"
import {graphql} from 'gatsby';
import PageHeader from "../components/header";
import Container from "@components/container";
import Elements from "@components/elements";
import DivideChunks from '@utils'
import {
    CollectablesProvider,
    CoreSkillsSection,
    EducationSection,
    HighlightedCoursesSection,
    OverviewSection,
    SelectedProjectsSection
} from "@components/elm";
import {CollectableItemType} from "../types/collectable";

type DeepRequired<T> = {
    [K in keyof T]-?: NonNullable<T[K]> extends object
        ? DeepRequired<NonNullable<T[K]>>
        : NonNullable<T[K]>;
};



const IndexPageComponent: FC<DeepRequired<Queries.ResumeQuery>> = ({
                                                                       dataJson: data
                                                                   }) => {


    const mapRef = useRef<{ elements: Map<string, CollectableItemType> }>({
        elements: new Map(),
    });
    const registerFunc = (id: any, item: CollectableItemType) => {
        mapRef.current.elements.set(id, item);
    };

    const [chunks, setChunks] = useState<Item[][]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!containerRef.current || chunks.length > 0) return;

        const children = Array.from(containerRef.current.children);
        const heights = children.map(child => child.getBoundingClientRect().height);

        console.log(children);
        console.log(heights)
        DivideChunks(children, heights, 900);
        console.log(mapRef.current.elements);


        // Execute splitting algorithm using 'heights' array
        // setChunks(algorithmResult)
    }, []);


    const {
        description,
        links,
        sections: {
            note,
            summary_highlights,
            projects,
            courses,
            education,
            skills
        },
    } = data;

    return (
        <CollectablesProvider
            value={{
                registerFunc
            }}
        >
            <Container>
                <PageHeader description={description} links={links}/>

                <div className="p-8 pb-10" ref={containerRef}>
                    <Elements.Note>{note}</Elements.Note>

                    <OverviewSection note={note} summaryHighlights={summary_highlights}/>

                    <SelectedProjectsSection projects={projects}/>

                    <HighlightedCoursesSection courses={courses}/>

                    <EducationSection education={education}/>

                    <CoreSkillsSection skills={skills}/>
                </div>
            </Container>

            <Container>
                <div className="p-8 pb-10">more content?</div>
            </Container>
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