import Image from "next/image";

interface Lesson {
    title: string;
    fullDescription: string;
    imagePath: string;
    slug: string;
}

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
        </>
    );
}
