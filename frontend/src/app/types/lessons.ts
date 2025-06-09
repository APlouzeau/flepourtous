export interface LessonProps {
    id_lesson: number;
    title: string;
    shortDescription: string;
    imagePath: string;
    slug: string;
}
export type lessons = LessonProps[];

export interface Lesson {
    title: string;
    fullDescription: string;
    imagePath: string;
    slug: string;
    times: [
        {
            duration: number;
            price: number;
        }
    ];
}
export type allLessons = Lesson[];
