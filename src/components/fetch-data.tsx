"use client";
import React, { useEffect, useState } from "react";
import CarouselWrapper from "@/components/carousel-wrapper";
import { Skeleton } from "@/components/ui/skeleton";

interface Question {
  question: string;
  solutions: string[];
  hint: string;
  test_cases: string[];
  fail_cases: string[];
}

interface MyData {
  easy: Question[];
  medium: Question[];
  hard: Question[];
}

const ParentComponent: React.FC = () => {
  const [data, setData] = useState<MyData | null>(null);
  const [qSet, setQSet] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/res/questions.json");
        const json: MyData = await response.json();
        setData(json);

        const selectedQuestions = createQset(json);
        setQSet(selectedQuestions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const createQset = (questions: MyData): Question[] => {
    const qSet: Question[] = [];
    qSet.push(...getRandomElements(questions.easy, 4));
    qSet.push(...getRandomElements(questions.medium, 4));
    qSet.push(...getRandomElements(questions.hard, 2));
    return qSet;
  };

  const getRandomElements = (arr: Question[], n: number): Question[] => {
    if (n > arr.length) {
      throw new RangeError(
        "getRandomElements: more elements taken than available"
      );
    }

    const shuffled = arr.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, n);
  };

  if (!data || qSet.length === 0) {
    return <Skeleton className="min-w-28 min-h-28 rounded-[10px]" />;
  }

  return (
    <div>
      <CarouselWrapper data={qSet} />
    </div>
  );
};

export default ParentComponent;
