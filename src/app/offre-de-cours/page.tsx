import CardLesson from "../components/card-lesson/page";

export default function OfferPage() {
    return (
        <>
            <h2 className="mt-12 text-5xl font-bold text-center">Offre de cours</h2>
            <div className="flex flex-wrap justify-center">
                <CardLesson
                    title="Cours de français pour débutants"
                    description="Apprenez les bases de la langue française avec ce cours pour débutant"
                    imageUrl="/images/enfant.jpg"
                />
                <CardLesson
                    title="Cours de français pour niveau intermédiaire"
                    description="Apprenez les bases de la langue française avec ce cours pour niveau intermédiaire"
                    imageUrl="/images/ados.jpg"
                />
                <CardLesson
                    title="Cours de français pour débutants"
                    description="Apprenez les bases de la langue française avec ce cours pour débutant"
                    imageUrl="/images/enfant.jpg"
                />
                <CardLesson
                    title="Cours de français pour niveau intermédiaire"
                    description="Apprenez les bases de la langue française avec ce cours pour niveau intermédiaire"
                    imageUrl="/images/ados.jpg"
                />
                <CardLesson
                    title="Cours de français pour débutants"
                    description="Apprenez les bases de la langue française avec ce cours pour débutant"
                    imageUrl="/images/enfant.jpg"
                />
                <CardLesson
                    title="Cours de français pour niveau intermédiaire"
                    description="Apprenez les bases de la langue française avec ce cours pour niveau intermédiaire"
                    imageUrl="/images/ados.jpg"
                />
                <CardLesson
                    title="Cours de français pour débutants"
                    description="Apprenez les bases de la langue française avec ce cours pour débutant"
                    imageUrl="/images/enfant.jpg"
                />
            </div>
        </>
    );
}
