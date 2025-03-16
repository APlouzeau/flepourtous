import CardLesson from "@/app/components/card-lesson/CardLesson";
import type { Lessons } from "@/app/types/lessons";
import lessonsData from "../data/lessons.json";

export default async function OfferPage() {
    console.log("fonction");
    const response = await fetch("http://flepourtous.localhost/api/lessons");
    console.log(response);
    const lessons: Lessons = await response.json();
    console.log("lesons", lessons);
    return (
        <>
            <h2 className="mt-12 text-5xl font-bold text-center">Offre de cours</h2>
            <div className="flex flex-wrap lg:flex-nowrap justify-center gap-8">
                {lessons.map((lesson, index) => (
                    <CardLesson
                        key={index}
                        title={lesson.title}
                        shortDescription={lesson.shortDescription}
                        imagePath={lesson.imagePath}
                    />
                ))}
            </div>
        </>
    );
}
