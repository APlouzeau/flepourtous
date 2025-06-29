import { Lesson } from "@/app/types/lessons";
import Image from "next/image";
import Link from "next/link";

type tParams = Promise<{ slug: string }>;

export default async function LessonPage(props: { params: tParams }) {
    const { slug } = await props.params;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offre-de-cours/${slug}`);
    const lesson: Lesson = await response.json();
    const { title, fullDescription, imagePath } = lesson;

    return (
        <>
            <h2 className="mt-12 text-5xl font-bold text-center">Cours</h2>
            <div className="flex flex-col items-center gap-8">
                <h3>{title}</h3>
                <Image src={imagePath} alt="Shoes" width={100} height={100} />
                <p className="w-1/2">{fullDescription}</p>
            </div>
            {lesson.times.length > 0 &&
                lesson.times.map((lessonTime) => (
                    <div key={`${lessonTime.duration}-${lessonTime.price}`} className="flex flex-col items-center mt-4">
                        <p className="text-lg font-semibold">Durée : {lessonTime.duration} minutes</p>
                        <p className="text-lg font-semibold">Prix : {lessonTime.price} €</p>
                    </div>
                ))}
            <Link
                href={`/calendrier/nouveau-rendez-vous`}
                className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700 disabled:opacity-50"
            >
                Reserver !
            </Link>
        </>
    );
}
