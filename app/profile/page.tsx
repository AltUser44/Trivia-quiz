"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
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

export default function ProfilePage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [selectedAvatar, setSelectedAvatar] = useState("")
  const [customImage, setCustomImage] = useState<string | null>(null)

  useEffect(() => {
    const data = localStorage.getItem("userData")
    if (data) {
      const parsed = JSON.parse(data)
      setUserData(parsed)
      setSelectedAvatar(parsed.avatar)
    }
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setCustomImage(result)
        setSelectedAvatar(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const updatedData = {
      ...userData,
      avatar: selectedAvatar,
    }
    localStorage.setItem("userData", JSON.stringify(updatedData))
    router.push("/welcome")
  }

  if (!userData) return null

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <BackgroundAnimation />
      <ThemeToggle />

      <Card className="w-full max-w-md relative z-10">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Edit Profile ✏️</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredName">Preferred Name</Label>
              <Input
                id="preferredName"
                value={userData.preferredName}
                onChange={(e) => setUserData({ ...userData, preferredName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <RadioGroup
                value={userData.gender}
                onValueChange={(value) => {
                  setUserData({ ...userData, gender: value })
                  setSelectedAvatar(avatars[value as keyof typeof avatars][0])
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
                min="1"
                max="120"
                value={userData.age}
                onChange={(e) => setUserData({ ...userData, age: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Avatar</Label>
              <div className="grid grid-cols-3 gap-4">
                {(userData.gender === "male" ? avatars.male : avatars.female).map((avatar, index) => (
                  <div
                    key={index}
                    className={`relative cursor-pointer rounded-full overflow-hidden aspect-square ${
                      selectedAvatar === avatar ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedAvatar(avatar)}
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

            <div className="space-y-2">
              <Label htmlFor="custom-avatar">Upload Custom Avatar (JPG/PNG)</Label>
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

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                Save Changes
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/welcome")} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

