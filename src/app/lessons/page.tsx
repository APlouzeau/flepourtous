"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Lesson {
  id: number;
  title: string;
  description: string;
  date: Date;
  author: string;
}

export default function Lessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const getLessons = async () => {
    try {
      const response = await fetch("../api/readlessons", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        setLessons(data);
      } else {
        console.log("J'ai rien reçu chef :(");
      }
    } catch (error) {
      console.log("Erreur de catch : ", error);
    }
  };

  useEffect(() => {
    getLessons();
  }, []);

  return (
    <div>
      <div className=" flex flex-wrap justify-around">
        {lessons.map((lesson) => {
          const link = `/lessons/${lesson.id}`;
          return (
            <div
              key={lesson.id.toString()}
              className="card card-compact bg-base-100 w-96 shadow-xl m-4"
            >
              <figure>
                <Image
                  src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                  alt="Shoes"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{lesson.title}</h2>
                <p>{lesson.description}</p>
                <div className="card-actions justify-end">
                  <Link href={link}>
                    <button className="btn btn-primary">En savoir plus</button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-center m-2">
        <Link href="/newlesson">
          <button className="btn btn-primary">Ajouter une leçon</button>
        </Link>
      </div>
    </div>
  );
}
