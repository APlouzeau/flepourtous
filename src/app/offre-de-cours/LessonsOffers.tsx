import CardLesson from "@/app/components/card-lesson/CardLesson";
import type { Lessons } from "@/app/types/lessons";
import lessonsData from "@/app/data/lessons.json";

export default function OfferPage() {
    const lessons = lessonsData as Lessons;
    return (
        <>
            <h2 className="mt-12 text-5xl font-bold text-center">Offre de cours</h2>
            <div className="flex flex-wrap justify-center gap-8">
                {Array(7)
                    .fill(null)
                    .map((_, index) => (
                        <CardLesson
                            key={index}
                            title={lessons[index % 2].title}
                            description={lessons[index % 2].description}
                            imageUrl={lessons[index % 2].imageUrl}
                        />
                    ))}
            </div>
        </>
    );
}
