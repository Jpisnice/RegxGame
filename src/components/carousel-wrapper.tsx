import React, { useState, useEffect, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { EvervaultCard, Icon } from "@/components/ui/evervault-card";

interface Question {
  question: string;
  solutions: string[];
  hint: string;
  test_cases: string[]; // Ensure this matches the structure of your data
}

interface CarouselWrapperProps {
  data: Question[];
}

const CarouselWrapper: React.FC<CarouselWrapperProps> = ({ data }) => {
  const [regexInput, setRegexInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0); // State to manage current index
  const [score, setScore] = useState(0); // State to manage the score
  const [answered, setAnswered] = useState<boolean[]>(
    Array(data.length).fill(false)
  ); // State to track answered questions
  const [showScore, setShowScore] = useState(false); // State to manage the display of score card
  const [showHint, setShowHint] = useState(false); // State to toggle hint display
  const carouselItemsRef = useRef<(HTMLElement | null)[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRegexInput(event.target.value);
  };

  const handleSubmit = () => {
    console.log("Submit button clicked with regex:", regexInput);

    const currentQuestion = data[currentIndex];
    if (regexInput!='')
    {
      const regex = new RegExp(regexInput);
      
    const results = currentQuestion.test_cases.map((testCase) => {
      const result = regex.test(testCase);
      console.log(`Test case: "${testCase}" - Result: ${result}`);
      return result;
    });

    const allPassed = results.every((result) => result);
    if (allPassed) {
      console.log("All test cases passed!");
      setScore((prevScore) => Math.min(prevScore + 1, 10));
    } else {
      console.log("Some test cases failed.");
    }

    const newAnswered = [...answered];
    newAnswered[currentIndex] = true;
    setAnswered(newAnswered);

    if (newAnswered.every((answer) => answer)) {
      setShowScore(true);
    }
    }
    else{
      alert('Regex is empty')
    }

  };

  const handleHint = () => {
    setShowHint((prevShowHint) => !prevShowHint);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = carouselItemsRef.current.indexOf(
              entry.target as HTMLElement
            );
            setCurrentIndex(index);
            setShowHint(false); // Reset hint visibility when changing questions
          }
        });
      },
      { threshold: 0.5 }
    );

    carouselItemsRef.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => {
      carouselItemsRef.current.forEach((item) => {
        if (item) observer.unobserve(item);
      });
    };
  }, [data]);

  return (
    <div className="m-10">
      <Card className="flex flex-col items-center p-5 relative">
        <h1 className="text-xl m-3 font-semibold leading-none tracking-tight">
          Regex Game
        </h1>
        <div className="absolute top-0 right-0 p-2">
          <ModeToggle />
        </div>
        <Carousel className="w-full max-w-xs">
          <CarouselContent>
            {data.map((question, index) => (
              <CarouselItem key={index}>
                <div
                  className="p-1"
                  ref={(el) => {
                    carouselItemsRef.current[index] = el;
                  }}
                >
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <div className="text-xl md:text-xxl font-semibold">
                        <p>{question.question}</p>
                        {showHint && currentIndex === index && (
                          <p className="text-sm text-gray-500 mt-2">
                            Hint: {question.hint}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className="flex items-center gap-4 flex-wrap p-10">
          <Input
            type="text"
            placeholder="Enter the Regex"
            value={regexInput}
            onChange={handleInputChange}
          />
          <Button
            variant={"ghost"}
            onClick={handleSubmit}
            disabled={answered[currentIndex]}
          >
            Submit
          </Button>
          <Button variant={"yellow"} onClick={handleHint}>
            Hint
          </Button>
        </div>
        {showScore && (
          <div className="border border-black/[0.2] dark:border-white/[0.2] flex flex-col items-start max-w-sm mx-auto p-4 relative h-[20rem]">
            <Icon className="absolute h-3 w-3 -top-3 -left-3 dark:text-white text-black" />
            <Icon className="absolute h-3 w-3 -bottom-3 -left-3 dark:text-white text-black" />
            <Icon className="absolute h-3 w-3 -top-3 -right-3 dark:text-white text-black" />
            <Icon className="absolute h-3 w-3 -bottom-3 -right-3 dark:text-white text-black" />
            <EvervaultCard text={`Final score is ${score}/10`} />
          </div>
        )}
      </Card>
    </div>
  );
};

export default CarouselWrapper;
