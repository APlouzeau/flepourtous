import CardLesson from "@/app/components/front/CardLesson";
import type { LessonProps } from "@/app/types/lessons";
import axios from "axios";

export default async function OfferPage() {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/lessons`);
    const lessons: LessonProps[] = await response.data;
    console.log(lessons);

    return (
        <>
            <h2 className="mt-12 text-5xl font-bold text-center">Offre de cours</h2>
            <div className="flex flex-wrap lg:flex-nowrap justify-center gap-8">
                {lessons.map((lesson, index) => (
                    <CardLesson
                        key={`${lesson.id_lesson}-${lesson.slug}-${index}`}
                        title={lesson.title}
                        shortDescription={lesson.shortDescription}
                        imagePath={lesson.imagePath}
                        slug={lesson.slug}
                    />
                ))}
            </div>
        </>
    );
}
