import type { Lesson } from "@/app/types/lessons";
import Image from "next/image";

export default async function LessonPage({
    params,
}: {
    params: {
        slug: string;
    };
}) {
    const { slug } = await params;
    console.log("slug", slug);
    const response = await fetch(`http://flepourtous.localhost/api/offre-de-cours/${slug}`);
    const lesson: Lesson = await response.json();
    const { title, fullDescription, imagePath } = lesson;
    console.log("lessons", lesson);
    return (
        <>
            <h2 className="mt-12 text-5xl font-bold text-center">Cours</h2>
            <div className="flex flex-col items-center gap-8">
                <h3>{title}</h3>
                <Image src={imagePath} alt="Shoes" width={100} height={100} />
                <p className="w-1/2">{fullDescription}</p>
            </div>
        </>
    );
}
