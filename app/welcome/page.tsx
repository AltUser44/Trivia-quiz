"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  User,
  Trophy,
  Brain,
  Atom,
  Calculator,
  Globe2,
  DollarSign,
  Scale,
  Rocket,
  Music,
  Film,
  Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BackgroundAnimation } from "@/components/background-animation"
import { ThemeToggle } from "@/components/theme-toggle"

const categories = [
  {
    id: "science",
    name: "Science",
    icon: Atom,
    questions: 20,
    description: "Explore the wonders of scientific discovery",
  },
  {
    id: "math",
    name: "Mathematics",
    icon: Calculator,
    questions: 15,
    description: "Test your mathematical prowess",
  },
  {
    id: "geography",
    name: "Geography",
    icon: Globe2,
    questions: 25,
    description: "Journey around the world",
  },
  {
    id: "economy",
    name: "Economy",
    icon: DollarSign,
    questions: 18,
    description: "Master the principles of economics",
  },
  {
    id: "civics",
    name: "Civics",
    icon: Scale,
    questions: 22,
    description: "Learn about government and citizenship",
  },
  {
    id: "astronomy",
    name: "Astronomy",
    icon: Rocket,
    questions: 20,
    description: "Discover the mysteries of space",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: Film,
    questions: 25,
    description: "Test your pop culture knowledge",
  },
  {
    id: "music",
    name: "Music",
    icon: Music,
    questions: 20,
    description: "Explore the world of music",
  },
  {
    id: "architecture",
    name: "Architecture",
    icon: Building2,
    questions: 15,
    description: "Learn about building design and history",
  },
]

export default function WelcomePage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [totalScore, setTotalScore] = useState(0)
  const [averageScore, setAverageScore] = useState(0)

  useEffect(() => {
    const data = localStorage.getItem("userData")
    if (data) {
      const parsed = JSON.parse(data)
      setUserData(parsed)

      // Calculate total and average scores
      const scores = parsed.scores || {}
      let total = 0
      let count = 0

      Object.values(scores).forEach((categoryScores: any[]) => {
        categoryScores.forEach((score: any) => {
          total += (score.score / score.total) * 100
          count++
        })
      })

      setTotalScore(total)
      setAverageScore(count > 0 ? Math.round(total / count) : 0)
    }
  }, [])

  const startQuiz = (categoryId: string, difficulty: string) => {
    router.push(`/quiz/${categoryId}?difficulty=${difficulty}`)
  }

  if (!userData) return null

  return (
    <div className="min-h-screen bg-background">
      <BackgroundAnimation />
      <div className="container px-4 py-6 relative z-10">
        <ThemeToggle />

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-purple-200 dark:ring-purple-800">
              <Image src={userData?.avatar || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-violet-600 dark:from-purple-400 dark:to-violet-400">
                Hi, {userData?.preferredName} 👋
              </h2>
              <p className="text-purple-600/70 dark:text-purple-300/70">Ready to challenge yourself?</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/30 px-3 py-1.5 rounded-full">
              <Trophy className="h-5 w-5 text-purple-500 dark:text-purple-400" />
              <span className="text-purple-700 dark:text-purple-300">Average Score: {averageScore}%</span>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/profile")}
              className="border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/30"
            >
              <User className="h-5 w-5 mr-2 text-purple-500 dark:text-purple-400" />
              Profile
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Card key={category.id} className="card overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-6 w-6 text-purple-500 dark:text-purple-400" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-violet-600 dark:from-purple-400 dark:to-violet-400">
                      {category.name}
                    </span>
                  </CardTitle>
                  <CardDescription className="text-purple-600/70 dark:text-purple-300/70">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-purple-600/70 dark:text-purple-300/70">
                      {category.questions} questions
                    </span>
                    <Brain className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="w-full bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/40 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                        Select Difficulty
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-purple-100 dark:border-purple-900">
                      <DropdownMenuItem
                        onClick={() => startQuiz(category.id, "easy")}
                        className="text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                      >
                        Easy 😊
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => startQuiz(category.id, "medium")}
                        className="text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                      >
                        Medium 🤔
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => startQuiz(category.id, "hard")}
                        className="text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                      >
                        Hard 🤯
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

