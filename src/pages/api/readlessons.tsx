import { PrismaClient } from "@prisma/client";
import { NextApiResponse, NextApiRequest } from "next";

const prisma = new PrismaClient();

export default async function readLessons(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const getLessons = await prisma.lesson.findMany();
      res.status(200).json(getLessons);
      console.log(getLessons);
    } catch (error) {
      console.log(error);
    }
  }
}
