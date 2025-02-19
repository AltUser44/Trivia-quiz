"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BackgroundAnimation } from "@/components/background-animation"

const avatars = {
  male: [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-18%20232406-CCQgff3IYr65hgVPfJ09SNtV7k3AbK.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-18%20232344-Erzli3VL7Aqy58KptACLt4JTXt8v1F.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Super_kids_icons_cute_cartoon_characters_sketch_vector_10490328.jpg-MGuC1STZIQxFQeJCurrU6oLMVxC5Ak.jpeg",
  ],
  female: [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-18%20232416-5UB8fTM0Gy2UBypykGnVzss5d5OuH8.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-18%20232356-0vN8esHVbNnKGzvEW4CZEjZQLhlZKV.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-18%20232426-c0MFoBu3AD4OQozTPsbPrTzvYu233H.png",
  ],
}

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    preferredName: "",
    gender: "",
    age: "",
    avatar: "",
  })
  const [customImage, setCustomImage] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setCustomImage(result)
        setFormData((prev) => ({ ...prev, avatar: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem("userData", JSON.stringify(formData))
    router.push("/welcome")
  }

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center relative">
      <BackgroundAnimation />
      <ThemeToggle />

      <Card className="w-full max-w-md relative">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome to Quiz Trivia! 🎯</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredName">Preferred Name</Label>
              <Input
                id="preferredName"
                required
                value={formData.preferredName}
                onChange={(e) => setFormData({ ...formData, preferredName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <RadioGroup
                required
                value={formData.gender}
                onValueChange={(value) => {
                  setFormData({
                    ...formData,
                    gender: value,
                    avatar: value === "male" ? avatars.male[0] : avatars.female[0],
                  })
                }}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male 👨</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female 👩</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                required
                min="1"
                max="120"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>

            {formData.gender && (
              <div className="space-y-2">
                <Label>Choose your avatar</Label>
                <div className="grid grid-cols-3 gap-4">
                  {(formData.gender === "male" ? avatars.male : avatars.female).map((avatar, index) => (
                    <div
                      key={index}
                      className={`relative cursor-pointer rounded-full overflow-hidden aspect-square ${
                        formData.avatar === avatar ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setFormData({ ...formData, avatar })}
                    >
                      <Image
                        src={avatar || "/placeholder.svg"}
                        alt={`Avatar ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="custom-avatar">Or upload your own (JPG/PNG)</Label>
              <Input id="custom-avatar" type="file" accept="image/jpeg,image/png" onChange={handleImageUpload} />
              {customImage && (
                <div className="mt-2 relative w-20 h-20">
                  <Image
                    src={customImage || "/placeholder.svg"}
                    alt="Custom avatar preview"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              )}
            </div>

            <Button type="submit" className="w-full">
              Start Your Journey 🚀
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

