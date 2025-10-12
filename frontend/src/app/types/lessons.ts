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
    fullDescription_1: string;
    fullDescription_2: string;
    fullDescription_3?: string;
    imagePath: string;
    slug: string;
    introduction?: string;
    subtitle_1?: string;
    text_1?: string;
    subtitle_2?: string;
    text_2?: string;
    subtitle_3?: string;
    text_3?: string;
    subtitle_4?: string;
    text_4?: string;
    subtitle_5?: string;
    text_5?: string;
    subtitle_6?: string;
    text_6?: string;
    times: [
        {
            duration: number;
            price: number;
        }
    ];
}
export type allLessons = Lesson[];

export interface LessonWithPrice {
    idLesson: number;
    title: string;
    shortDescription: string;
    imagePath: string;
    slug: string;
    price: [{ price: number; duration: number }];
    popular: false;
}
export type LessonsWithPrices = LessonWithPrice[];

export interface DetailedOffer {
    imagePath: string;
    title: string;
    description: string;
    price: number;
    duration: number;
    slug: string;
    popular: boolean;
}
export type detailedOffers = DetailedOffer[];
