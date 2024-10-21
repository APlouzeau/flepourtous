// app/[id]/page.tsx
import { PrismaClient } from "@prisma/client";

interface Lesson {
  id: number;
  title: string;
  description: string;
  date: Date;
  author: string;
}

const prisma = new PrismaClient();

export default async function LessonDetails({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  let lesson: Lesson | null = null;

  try {
    const lessonId = Number(id);
    lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de la leçon :", error);
  }

  if (!lesson) {
    return <h1>Leçon non trouvée</h1>;
  } else {
    return (
      <>
        <h1>Détails de la leçon : {lesson.title}</h1>
        <p>{lesson.date.toString()}</p>
        <p>{lesson.description}</p>
        <p>{lesson.author}</p>
      </>
    );
  }
}
