import CardLesson from "@/app/components/card-lesson/CardLesson";
import type { Lessons } from "@/app/types/lessons";
import lessonsData from "@/public/static/lessons.json";

export default function OfferPage() {
    const lessons = lessonsData as Lessons;
    return (
        <>
            <h2 className="mt-12 text-5xl font-bold text-center">Offre de cours</h2>
            <div className="flex flex-wrap justify-center">
                <CardLesson
                    title={lessons[0].title}
                    description={lessons[0].description}
                    imageUrl={lessons[0].imageUrl}
                />
                <CardLesson
                    title={lessons[1].title}
                    description={lessons[1].description}
                    imageUrl={lessons[1].imageUrl}
                />
                <CardLesson
                    title={lessons[0].title}
                    description={lessons[0].description}
                    imageUrl={lessons[0].imageUrl}
                />
                <CardLesson
                    title={lessons[1].title}
                    description={lessons[1].description}
                    imageUrl={lessons[1].imageUrl}
                />
                <CardLesson
                    title={lessons[0].title}
                    description={lessons[0].description}
                    imageUrl={lessons[0].imageUrl}
                />
                <CardLesson
                    title={lessons[1].title}
                    description={lessons[1].description}
                    imageUrl={lessons[1].imageUrl}
                />
                <CardLesson
                    title={lessons[0].title}
                    description={lessons[0].description}
                    imageUrl={lessons[0].imageUrl}
                />
            </div>
        </>
    );
}
