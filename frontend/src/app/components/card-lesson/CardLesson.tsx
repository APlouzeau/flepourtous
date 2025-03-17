import Image from "next/image";
import Link from "next/link";

interface CardLessonProps {
    title: string;
    shortDescription: string;
    imagePath: string;
    slug: string;
}

export default function CardLesson(props: CardLessonProps) {
    return (
        <div className="w-5/6 mt-16 mx-8 flex justify-center">
            <div className="card card-compact bg-base-100 w-96 shadow-[5px_5px_15px_8px_rgba(0,0,0,0.78)]">
                <figure className="relative h-64">
                    <Image
                        src={props.imagePath}
                        alt="Shoes"
                        fill
                        style={{ objectFit: "cover" }}
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </figure>
                <div className="card-body">
                    <h2 className="card-title">{props.title}</h2>
                    <p>{props.shortDescription}</p>
                    <div className="card-actions justify-end">
                        <Link href={`/offre-de-cours/${props.slug}`} className="btn btn-primary">
                            Découvrir
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
