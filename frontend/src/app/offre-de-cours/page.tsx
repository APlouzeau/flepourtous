import CardLesson from "@/app/components/CardLesson/CardLesson";
import type { lessons } from "@/app/types/lessons";

export default async function OfferPage() {
    console.log("fonction");
    const response = await fetch("http://flepourtous.plouzor.fr/api/lessons");
    console.log(response);
    const lessons: lessons = await response.json();
    console.log("lessons", lessons);
    return (
        <>
            <h1 className="text-5xl">Ceci est un test de déploiement auto </h1>
            <h2 className="mt-12 text-5xl font-bold text-center">Offre de cours</h2>
            <div className="flex flex-wrap lg:flex-nowrap justify-center gap-8">
                {lessons.map((lesson, index) => (
                    <CardLesson
                        key={index}
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
