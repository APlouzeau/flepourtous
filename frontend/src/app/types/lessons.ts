export interface LessonProps {
    id_lesson: number;
    title: string;
    shortDescription: string;
    imagePath: string;
    slug: string;
}
export type lessons = LessonProps[];
