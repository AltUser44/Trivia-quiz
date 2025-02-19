"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ThemeToggle } from "@/components/theme-toggle"
import { BackgroundAnimation } from "@/components/background-animation"
import confetti from "canvas-confetti"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: string
  explanation?: string
}

// Sample questions - in a real app, these would come from an API
const generateQuestions = (category: string, count: number): Question[] => {
  const questions: Question[] = []

  const questionTemplates = {
    science: [
      {
        question: "What is the chemical symbol for gold?",
        options: ["Au", "Ag", "Fe", "Cu"],
        correctAnswer: "Au",
        explanation: "Au is derived from the Latin word for gold, 'aurum'.",
      },
      {
        question: "What is the hardest natural substance on Earth?",
        options: ["Diamond", "Titanium", "Platinum", "Graphene"],
        correctAnswer: "Diamond",
        explanation: "Diamond ranks 10 on the Mohs scale of mineral hardness.",
      },
      {
        question: "Which planet is known as the Red Planet?",
        options: ["Mars", "Venus", "Jupiter", "Mercury"],
        correctAnswer: "Mars",
        explanation: "Mars appears red due to iron oxide (rust) on its surface.",
      },
      {
        question: "What is the speed of light in vacuum?",
        options: ["299,792 km/s", "199,792 km/s", "399,792 km/s", "499,792 km/s"],
        correctAnswer: "299,792 km/s",
        explanation: "Light travels at approximately 299,792 kilometers per second in a vacuum.",
      },
      {
        question: "What is the smallest unit of matter?",
        options: ["Atom", "Molecule", "Quark", "Electron"],
        correctAnswer: "Quark",
        explanation: "Quarks are the fundamental particles that make up protons and neutrons.",
      },
      {
        question: "Which gas do plants absorb from the atmosphere?",
        options: ["Carbon Dioxide", "Oxygen", "Nitrogen", "Hydrogen"],
        correctAnswer: "Carbon Dioxide",
        explanation: "Plants absorb CO2 during photosynthesis to produce glucose and oxygen.",
      },
      {
        question: "What is the largest organ in the human body?",
        options: ["Skin", "Liver", "Brain", "Heart"],
        correctAnswer: "Skin",
        explanation: "The skin is the largest organ, covering about 20 square feet in adults.",
      },
      {
        question: "Which element has the atomic number 1?",
        options: ["Hydrogen", "Helium", "Carbon", "Oxygen"],
        correctAnswer: "Hydrogen",
        explanation: "Hydrogen is the lightest and most abundant element in the universe.",
      },
      {
        question: "What is the process by which plants make their own food?",
        options: ["Photosynthesis", "Respiration", "Digestion", "Fermentation"],
        correctAnswer: "Photosynthesis",
        explanation: "Photosynthesis uses sunlight to convert CO2 and water into glucose.",
      },
      {
        question: "Which force keeps planets in orbit around the Sun?",
        options: ["Gravity", "Magnetism", "Friction", "Nuclear Force"],
        correctAnswer: "Gravity",
        explanation: "Gravity is the force of attraction between all masses in the universe.",
      },
      // Add 10 more unique science questions for higher difficulties...
    ],
    math: [
      {
        question: "What is the square root of 144?",
        options: ["10", "12", "14", "16"],
        correctAnswer: "12",
        explanation: "12 × 12 = 144",
      },
      {
        question: "What is the value of π (pi) to two decimal places?",
        options: ["3.14", "3.16", "3.12", "3.18"],
        correctAnswer: "3.14",
        explanation: "Pi is approximately equal to 3.14159...",
      },
      {
        question: "What is the sum of angles in a triangle?",
        options: ["180°", "360°", "90°", "270°"],
        correctAnswer: "180°",
        explanation: "The sum of angles in any triangle is always 180 degrees.",
      },
      {
        question: "What is 25% of 80?",
        options: ["20", "25", "15", "30"],
        correctAnswer: "20",
        explanation: "25% is one quarter, so 80 ÷ 4 = 20",
      },
      {
        question: "What is the next number in the sequence: 2, 4, 8, 16, ...?",
        options: ["32", "24", "20", "28"],
        correctAnswer: "32",
        explanation: "Each number is doubled to get the next number in the sequence.",
      },
      {
        question: "What is the area of a square with sides of length 5?",
        options: ["25", "20", "30", "10"],
        correctAnswer: "25",
        explanation: "The area of a square is length × length, so 5 × 5 = 25",
      },
      {
        question: "What is the result of 7 × 8?",
        options: ["56", "54", "58", "52"],
        correctAnswer: "56",
        explanation: "7 × 8 = 56",
      },
      {
        question: "What is the perimeter of a rectangle with length 6 and width 4?",
        options: ["20", "24", "18", "22"],
        correctAnswer: "20",
        explanation: "Perimeter = 2(length + width), so 2(6 + 4) = 20",
      },
      {
        question: "What is 3² + 4²?",
        options: ["25", "49", "16", "36"],
        correctAnswer: "25",
        explanation: "3² = 9, 4² = 16, 9 + 16 = 25",
      },
      {
        question: "If x + 5 = 12, what is x?",
        options: ["7", "8", "6", "5"],
        correctAnswer: "7",
        explanation: "Subtract 5 from both sides: x = 12 - 5 = 7",
      },
      // Add 10 more unique math questions for higher difficulties...
    ],
    // Add more categories with 20+ unique questions each...
  }

  const templates = questionTemplates[category as keyof typeof questionTemplates] || questionTemplates.science
  const availableQuestions = [...templates]
  const selectedQuestions: Question[] = []

  // Select random questions without repetition
  for (let i = 0; i < count && availableQuestions.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * availableQuestions.length)
    const question = availableQuestions.splice(randomIndex, 1)[0]
    selectedQuestions.push({
      id: i + 1,
      ...question,
    })
  }

  return selectedQuestions
}

export default function QuizPage({ params }: { params: { category: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const difficulty = searchParams.get("difficulty") || "easy"

  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [userData, setUserData] = useState({})

  useEffect(() => {
    // Generate questions based on category
    const questionCount =
      {
        easy: 10,
        medium: 15,
        hard: 20,
      }[difficulty] || 10

    const generatedQuestions = generateQuestions(params.category, questionCount)
    setQuestions(generatedQuestions)
  }, [params.category, difficulty])

  useEffect(() => {
    // Load and update user score
    const userData = localStorage.getItem("userData")
    if (userData) {
      const parsed = JSON.parse(userData)
      const scores = parsed.scores || {}
      setUserData({ ...parsed, scores })
    }
  }, [])

  const updateScore = (newScore: number) => {
    const userData = localStorage.getItem("userData")
    if (userData) {
      const parsed = JSON.parse(userData)
      const scores = parsed.scores || {}
      scores[params.category] = scores[params.category] || []
      scores[params.category].push({
        difficulty,
        score: newScore,
        date: new Date().toISOString(),
      })
      localStorage.setItem("userData", JSON.stringify({ ...parsed, scores }))
    }
  }

  const getButtonClass = (
    option: string,
    isAnswered: boolean,
    selectedAnswer: string | null,
    correctAnswer: string,
  ) => {
    if (!isAnswered) return "hover:bg-secondary"
    if (option === correctAnswer) return "!bg-emerald-500 hover:!bg-emerald-600 text-white"
    if (option === selectedAnswer) return "!bg-red-500 hover:!bg-red-600 text-white"
    return "opacity-50"
  }

  const handleAnswer = (answer: string) => {
    if (isAnswered) return

    setSelectedAnswer(answer)
    setIsAnswered(true)

    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }

    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setIsAnswered(false)
      } else {
        const finalScore = score + (answer === questions[currentQuestion].correctAnswer ? 1 : 0)
        updateScore(finalScore)
        setShowResult(true)
        const percentage = (finalScore / questions.length) * 100
        if (percentage >= 70) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          })
        }
      }
    }, 1500)
  }

  const getResultMessage = (percentage: number) => {
    if (percentage >= 95) return "🎯 Excellent! You're a genius!"
    if (percentage >= 80) return "🌟 Great job! You're doing amazing!"
    if (percentage >= 70) return "👏 Well done! You passed!"
    return "📚 Keep practicing! You'll get there!"
  }

  return (
    <div className="min-h-screen bg-background">
      <BackgroundAnimation />
      <div className="container p-4 flex items-center justify-center min-h-screen">
        <ThemeToggle />

        <Card className="w-full max-w-2xl relative z-10">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                {params.category.charAt(0).toUpperCase() + params.category.slice(1)} Quiz
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({difficulty.charAt(0).toUpperCase() + difficulty.slice(1)})
                </span>
              </CardTitle>
              <span className="text-sm text-muted-foreground">
                Question {currentQuestion + 1}/{questions.length}
              </span>
            </div>
            <Progress value={(currentQuestion / questions.length) * 100} className="mt-2" />
          </CardHeader>

          <CardContent>
            {showResult ? (
              <div className="space-y-4 text-center">
                <h2 className="text-2xl font-bold">{getResultMessage((score / questions.length) * 100)}</h2>
                <p className="text-xl">
                  Your score: {score}/{questions.length} ({Math.round((score / questions.length) * 100)}%)
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => router.push("/welcome")}>Back to Categories</Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCurrentQuestion(0)
                      setScore(0)
                      setShowResult(false)
                      setSelectedAnswer(null)
                      setIsAnswered(false)
                    }}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">{questions[currentQuestion]?.question}</h2>
                <div className="grid gap-3">
                  {questions[currentQuestion]?.options.map((option) => (
                    <Button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      className={`w-full text-left justify-start ${getButtonClass(option, isAnswered, selectedAnswer, questions[currentQuestion].correctAnswer)}`}
                      disabled={isAnswered}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
                {isAnswered && (
                  <p className="text-sm text-muted-foreground mt-4">{questions[currentQuestion]?.explanation}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

