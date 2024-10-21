import { PrismaClient } from "@prisma/client";
import { NextApiResponse, NextApiRequest } from "next";

const prisma = new PrismaClient();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { title, date, description, author } = req.body;

      const newLesson = await prisma.lesson.create({
        data: {
          title,
          date: new Date(date),
          description,
          author,
        },
      });
      console.log("Nouvelle leçon créée:", newLesson);

      res.status(201).json(newLesson);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erreur lors de la création de la leçon" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
