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
    ],
    geography: [
      {
        question: "What is the capital of France?",
        options: ["Paris", "London", "Berlin", "Madrid"],
        correctAnswer: "Paris",
        explanation: "Paris is the capital and most populous city of France.",
      },
      {
        question: "Which is the largest ocean on Earth?",
        options: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
        correctAnswer: "Pacific Ocean",
        explanation: "The Pacific Ocean is the largest and deepest of Earth's oceanic divisions.",
      },
      {
        question: "What is the longest river in the world?",
        options: ["Nile", "Amazon", "Yangtze", "Mississippi"],
        correctAnswer: "Nile",
        explanation: "The Nile is the longest river in the world, stretching 6,650 kilometers.",
      },
      {
        question: "Which country is home to the Great Barrier Reef?",
        options: ["Australia", "Brazil", "Indonesia", "Mexico"],
        correctAnswer: "Australia",
        explanation: "The Great Barrier Reef is located off the coast of Queensland, Australia.",
      },
      {
        question: "What is the highest mountain in the world?",
        options: ["Mount Everest", "K2", "Kangchenjunga", "Lhotse"],
        correctAnswer: "Mount Everest",
        explanation: "Mount Everest, located in the Himalayas, stands at 8,848 meters above sea level.",
      },
      {
        question: "Which desert is the largest in the world?",
        options: ["Sahara", "Arabian", "Gobi", "Antarctic"],
        correctAnswer: "Antarctic",
        explanation: "The Antarctic Desert is the largest desert in the world, covering 5.5 million square miles.",
      },
      {
        question: "What is the smallest country in the world?",
        options: ["Vatican City", "Monaco", "San Marino", "Liechtenstein"],
        correctAnswer: "Vatican City",
        explanation: "Vatican City is an independent city-state covering just 0.44 square kilometers.",
      },
      {
        question: "Which continent is the least populous?",
        options: ["Antarctica", "Australia", "South America", "Europe"],
        correctAnswer: "Antarctica",
        explanation: "Antarctica has no permanent human population, only research stations.",
      },
      {
        question: "Through which country does the prime meridian pass?",
        options: ["United Kingdom", "France", "Spain", "Italy"],
        correctAnswer: "United Kingdom",
        explanation: "The prime meridian passes through Greenwich, London, in the United Kingdom.",
      },
      {
        question: "What is the largest country by land area?",
        options: ["Russia", "Canada", "China", "United States"],
        correctAnswer: "Russia",
        explanation: "Russia is the largest country, covering over 17 million square kilometers.",
      },
    ],
    economy: [
      {
        question: "What does GDP stand for?",
        options: [
          "Gross Domestic Product",
          "General Domestic Product",
          "Gross Domestic Profit",
          "General Domestic Profit",
        ],
        correctAnswer: "Gross Domestic Product",
        explanation: "GDP is the total value of goods produced and services provided in a country during one year.",
      },
      {
        question: "What is inflation?",
        options: ["Rise in prices", "Fall in prices", "Stable prices", "Rise in employment"],
        correctAnswer: "Rise in prices",
        explanation: "Inflation is a general increase in prices and fall in the purchasing value of money.",
      },
      {
        question: "Which of these is not a type of economic system?",
        options: ["Capitalist", "Socialist", "Mixed", "Democratic"],
        correctAnswer: "Democratic",
        explanation: "While democracy is a political system, it's not an economic system like the others listed.",
      },
      {
        question: "What is a bear market?",
        options: [
          "When stock prices fall",
          "When stock prices rise",
          "When the economy is stable",
          "When unemployment is high",
        ],
        correctAnswer: "When stock prices fall",
        explanation: "A bear market is when stock prices fall 20% or more from recent highs.",
      },
      {
        question: "What does FOREX stand for?",
        options: ["Foreign Exchange", "Foreign Excess", "Financial Exchange", "Financial Excess"],
        correctAnswer: "Foreign Exchange",
        explanation: "FOREX refers to the foreign exchange market where currencies are traded.",
      },
      {
        question: "What is a monopoly?",
        options: ["Single seller", "Many sellers", "Two sellers", "No sellers"],
        correctAnswer: "Single seller",
        explanation:
          "A monopoly is a market structure where a single company or group owns all or nearly all of the market.",
      },
      {
        question: "What is the law of supply?",
        options: [
          "As price increases, quantity supplied increases",
          "As price decreases, quantity supplied increases",
          "Price doesn't affect supply",
          "Supply always equals demand",
        ],
        correctAnswer: "As price increases, quantity supplied increases",
        explanation:
          "The law of supply states that as the price of a good increases, the quantity supplied of that good increases.",
      },
      {
        question: "What is a recession?",
        options: ["Economic decline", "Economic growth", "Stable economy", "High inflation"],
        correctAnswer: "Economic decline",
        explanation:
          "A recession is a period of temporary economic decline, generally identified by a fall in GDP in two successive quarters.",
      },
      {
        question: "What does ROI stand for?",
        options: ["Return on Investment", "Rate of Inflation", "Risk of Investment", "Rate of Interest"],
        correctAnswer: "Return on Investment",
        explanation:
          "ROI measures the efficiency of an investment or compares the efficiency of different investments.",
      },
      {
        question: "What is fiscal policy?",
        options: [
          "Government spending and taxation",
          "Central bank's control of money supply",
          "Trade between countries",
          "Stock market regulations",
        ],
        correctAnswer: "Government spending and taxation",
        explanation: "Fiscal policy involves government spending and taxation to influence the economy.",
      },
    ],
    civics: [
      {
        question: "What are the three branches of the U.S. government?",
        options: [
          "Executive, Legislative, Judicial",
          "Federal, State, Local",
          "Democratic, Republican, Independent",
          "President, Congress, Supreme Court",
        ],
        correctAnswer: "Executive, Legislative, Judicial",
        explanation: "The U.S. government is divided into these three branches to ensure a separation of powers.",
      },
      {
        question: "What does the First Amendment to the U.S. Constitution protect?",
        options: [
          "Freedom of speech, religion, press, assembly, and petition",
          "Right to bear arms",
          "Protection against unreasonable searches",
          "Right to a speedy trial",
        ],
        correctAnswer: "Freedom of speech, religion, press, assembly, and petition",
        explanation:
          "The First Amendment protects several basic liberties: freedom of religion, speech, press, assembly, and petition.",
      },
      {
        question: "How many years is a term for a U.S. Senator?",
        options: ["6 years", "2 years", "4 years", "8 years"],
        correctAnswer: "6 years",
        explanation: "U.S. Senators are elected to six-year terms.",
      },
      {
        question: "What is the highest court in the United States?",
        options: ["Supreme Court", "District Court", "Circuit Court", "State Court"],
        correctAnswer: "Supreme Court",
        explanation: "The Supreme Court is the highest court in the federal judiciary of the United States.",
      },
      {
        question: "Who has the power to declare war?",
        options: ["Congress", "The President", "The Supreme Court", "The Department of Defense"],
        correctAnswer: "Congress",
        explanation: "The Constitution gives Congress the power to declare war.",
      },
      {
        question: "What is the minimum age to be President of the United States?",
        options: ["35", "30", "40", "45"],
        correctAnswer: "35",
        explanation: "The Constitution requires the President to be at least 35 years old.",
      },
      {
        question: "How many amendments does the U.S. Constitution have?",
        options: ["27", "10", "50", "100"],
        correctAnswer: "27",
        explanation: "The Constitution has been amended 27 times since its ratification.",
      },
      {
        question: "What is the 'rule of law'?",
        options: [
          "No one is above the law",
          "Only the President can make laws",
          "Laws are made by judges",
          "Laws don't apply to government officials",
        ],
        correctAnswer: "No one is above the law",
        explanation: "The rule of law means that everyone, including government officials, must follow the law.",
      },
      {
        question: "What is a filibuster?",
        options: [
          "A tactic to delay a vote in the Senate",
          "A type of legislation",
          "A government position",
          "A voting method",
        ],
        correctAnswer: "A tactic to delay a vote in the Senate",
        explanation:
          "A filibuster is a political procedure where debate over a proposed piece of legislation is extended, potentially indefinitely, to delay or prevent a vote.",
      },
      {
        question: "What is the Electoral College?",
        options: [
          "A system for electing the President",
          "A college for politicians",
          "A type of political party",
          "A branch of government",
        ],
        correctAnswer: "A system for electing the President",
        explanation:
          "The Electoral College is the system used in U.S. presidential elections where voters in each state choose electors to cast electoral votes.",
      },
    ],
    astronomy: [
      {
        question: "What is the closest planet to the Sun?",
        options: ["Mercury", "Venus", "Earth", "Mars"],
        correctAnswer: "Mercury",
        explanation:
          "Mercury is the first planet from the Sun, orbiting at an average distance of about 57.9 million kilometers.",
      },
      {
        question: "What is a light year?",
        options: [
          "Distance light travels in a year",
          "Brightness of a star",
          "Age of a star",
          "Time between solar eclipses",
        ],
        correctAnswer: "Distance light travels in a year",
        explanation: "A light year is the distance light travels in one year, approximately 9.46 trillion kilometers.",
      },
      {
        question: "What is the largest planet in our solar system?",
        options: ["Jupiter", "Saturn", "Neptune", "Uranus"],
        correctAnswer: "Jupiter",
        explanation:
          "Jupiter is the largest planet in our solar system, with a mass more than two and a half times that of all the other planets combined.",
      },
      {
        question: "What causes the phases of the Moon?",
        options: ["Its position relative to Earth and Sun", "Earth's shadow", "Sun's rotation", "Moon's rotation"],
        correctAnswer: "Its position relative to Earth and Sun",
        explanation:
          "The Moon's phases are caused by the changing angle of the Sun-illuminated surface visible from Earth as the Moon orbits our planet.",
      },
      {
        question: "What is a black hole?",
        options: [
          "Region where gravity prevents anything from escaping",
          "A dark star",
          "An empty area of space",
          "The center of a galaxy",
        ],
        correctAnswer: "Region where gravity prevents anything from escaping",
        explanation:
          "A black hole is a region of spacetime where gravitational forces are so strong that nothing, not even light, can escape from it.",
      },
      {
        question: "What is the name of our galaxy?",
        options: ["Milky Way", "Andromeda", "Triangulum", "Centaurus A"],
        correctAnswer: "Milky Way",
        explanation:
          "Our galaxy is called the Milky Way, a spiral galaxy containing an estimated 100-400 billion stars.",
      },
      {
        question: "What causes a solar eclipse?",
        options: [
          "Moon between Sun and Earth",
          "Earth between Sun and Moon",
          "Sun between Earth and Moon",
          "Venus between Sun and Earth",
        ],
        correctAnswer: "Moon between Sun and Earth",
        explanation:
          "A solar eclipse occurs when the Moon passes between the Sun and Earth, fully or partially blocking the Sun's light from reaching Earth.",
      },
      {
        question: "What is a nebula?",
        options: ["Cloud of gas and dust in space", "Type of star", "Small planet", "Asteroid belt"],
        correctAnswer: "Cloud of gas and dust in space",
        explanation: "A nebula is a giant cloud of gas and dust in space, often the birthplace of new stars.",
      },
      {
        question: "What is the study of the origin and evolution of the universe called?",
        options: ["Cosmology", "Astrology", "Meteorology", "Geology"],
        correctAnswer: "Cosmology",
        explanation: "Cosmology is the scientific study of the origin, evolution, and structure of the universe.",
      },
      {
        question: "What is the name of the force that holds planets in orbit?",
        options: ["Gravity", "Magnetism", "Nuclear force", "Electromagnetism"],
        correctAnswer: "Gravity",
        explanation:
          "Gravity is the force of attraction between all masses in the universe and is responsible for keeping planets in orbit around stars.",
      },
    ],
    entertainment: [
      {
        question: "Who played Tony Stark/Iron Man in the Marvel Cinematic Universe?",
        options: ["Robert Downey Jr.", "Chris Evans", "Chris Hemsworth", "Mark Ruffalo"],
        correctAnswer: "Robert Downey Jr.",
        explanation:
          "Robert Downey Jr. portrayed Tony Stark/Iron Man in the Marvel Cinematic Universe from 2008 to 2019.",
      },
      {
        question: "Which TV series features dragons and is based on George R.R. Martin's books?",
        options: ["Game of Thrones", "The Witcher", "Lord of the Rings", "Stranger Things"],
        correctAnswer: "Game of Thrones",
        explanation:
          "Game of Thrones, based on George R.R. Martin's 'A Song of Ice and Fire' series, prominently features dragons.",
      },
      {
        question: "Who is known as the 'King of Pop'?",
        options: ["Michael Jackson", "Elvis Presley", "Prince", "David Bowie"],
        correctAnswer: "Michael Jackson",
        explanation:
          "Michael Jackson is widely referred to as the 'King of Pop' due to his significant influence on popular music.",
      },
      {
        question: "Which film won the Academy Award for Best Picture in 2020?",
        options: ["Parasite", "1917", "Joker", "Once Upon a Time in Hollywood"],
        correctAnswer: "Parasite",
        explanation:
          "Parasite, directed by Bong Joon-ho, won the Academy Award for Best Picture in 2020, becoming the first non-English language film to win this award.",
      },
      {
        question: "Who created the TV series 'The Simpsons'?",
        options: ["Matt Groening", "Seth MacFarlane", "Trey Parker and Matt Stone", "Mike Judge"],
        correctAnswer: "Matt Groening",
        explanation:
          "Matt Groening created The Simpsons, which debuted in 1989 and is the longest-running American animated series.",
      },
      {
        question: "Which band performed the song 'Bohemian Rhapsody'?",
        options: ["Queen", "The Beatles", "Led Zeppelin", "Pink Floyd"],
        correctAnswer: "Queen",
        explanation:
          "Bohemian Rhapsody was written by Freddie Mercury for the British rock band Queen's 1975 album 'A Night at the Opera'.",
      },
      {
        question: "Who played the character of Harry Potter in the film series?",
        options: ["Daniel Radcliffe", "Rupert Grint", "Emma Watson", "Tom Felton"],
        correctAnswer: "Daniel Radcliffe",
        explanation:
          "Daniel Radcliffe portrayed Harry Potter in all eight films of the Harry Potter series from 2001 to 2011.",
      },
      {
        question: "Which streaming service produced 'Stranger Things'?",
        options: ["Netflix", "Hulu", "Amazon Prime", "Disney+"],
        correctAnswer: "Netflix",
        explanation: "Stranger Things is an original series produced by Netflix, first released in 2016.",
      },
      {
        question: "Who is the highest-grossing actor of all time as of 2021?",
        options: ["Samuel L. Jackson", "Robert Downey Jr.", "Scarlett Johansson", "Tom Cruise"],
        correctAnswer: "Samuel L. Jackson",
        explanation:
          "As of 2021, Samuel L. Jackson's films have grossed over $27 billion worldwide, making him the highest-grossing actor.",
      },
      {
        question: "Which animated film features a young lion named Simba?",
        options: ["The Lion King", "Madagascar", "Ice Age", "Finding Nemo"],
        correctAnswer: "The Lion King",
        explanation:
          "The Lion King, released by Disney in 1994, tells the story of Simba, a young lion who is to succeed his father as King of the Pride Lands.",
      },
    ],
    music: [
      {
        question: "Who is often referred to as the 'Queen of Pop'?",
        options: ["Madonna", "Beyoncé", "Lady Gaga", "Britney Spears"],
        correctAnswer: "Madonna",
        explanation:
          "Madonna is often called the 'Queen of Pop' due to her influence on the pop music industry since the 1980s.",
      },
      {
        question: "Which instrument does a pianist play?",
        options: ["Piano", "Guitar", "Drums", "Violin"],
        correctAnswer: "Piano",
        explanation: "A pianist is a musician who plays the piano.",
      },
      {
        question: "Who wrote the opera 'The Marriage of Figaro'?",
        options: ["Mozart", "Beethoven", "Bach", "Tchaikovsky"],
        correctAnswer: "Mozart",
        explanation: "Wolfgang Amadeus Mozart composed 'The Marriage of Figaro' in 1786.",
      },
      {
        question: "Which of these is not a type of guitar?",
        options: ["Oboe", "Acoustic", "Electric", "Bass"],
        correctAnswer: "Oboe",
        explanation: "Oboe is a woodwind instrument, not a type of guitar.",
      },
      {
        question: "Who was the lead singer of the band Queen?",
        options: ["Freddie Mercury", "Mick Jagger", "David Bowie", "Elton John"],
        correctAnswer: "Freddie Mercury",
        explanation:
          "Freddie Mercury was the lead vocalist of the British rock band Queen from 1970 until his death in 1991.",
      },
      {
        question: "What is the national anthem of the United States?",
        options: ["The Star-Spangled Banner", "America the Beautiful", "God Bless America", "My Country, 'Tis of Thee"],
        correctAnswer: "The Star-Spangled Banner",
        explanation: "The Star-Spangled Banner has been the national anthem of the United States since 1931.",
      },
      {
        question: "Which of these is a wind instrument?",
        options: ["Flute", "Violin", "Drum", "Guitar"],
        correctAnswer: "Flute",
        explanation:
          "A flute is a wind instrument that produces sound when a player blows across a hole in the instrument.",
      },
      {
        question: "Who composed the 'Four Seasons'?",
        options: ["Vivaldi", "Bach", "Handel", "Chopin"],
        correctAnswer: "Vivaldi",
        explanation:
          "The Four Seasons is a group of four violin concertos by Italian composer Antonio Vivaldi, composed in 1723.",
      },
      {
        question: "What is the most common time signature in pop music?",
        options: ["4/4", "3/4", "6/8", "2/4"],
        correctAnswer: "4/4",
        explanation: "4/4 time, also known as common time, is the most frequently used time signature in pop music.",
      },
      {
        question: "Which Beatles album features the song 'Here Comes the Sun'?",
        options: ["Abbey Road", "Let It Be", "Sgt. Pepper's Lonely Hearts Club Band", "The White Album"],
        correctAnswer: "Abbey Road",
        explanation:
          "'Here Comes the Sun' was written by George Harrison and appears on the Beatles' 1969 album Abbey Road.",
      },
    ],
    architecture: [
      {
        question: "Who designed the Eiffel Tower?",
        options: ["Gustave Eiffel", "Frank Lloyd Wright", "Le Corbusier", "Antoni Gaudí"],
        correctAnswer: "Gustave Eiffel",
        explanation: "The Eiffel Tower was designed by French engineer Gustave Eiffel and completed in 1889.",
      },
      {
        question: "Which architectural style is characterized by pointed arches and ribbed vaults?",
        options: ["Gothic", "Baroque", "Renaissance", "Art Deco"],
        correctAnswer: "Gothic",
        explanation:
          "Gothic architecture is characterized by features such as pointed arches, ribbed vaults, and large windows.",
      },
      {
        question: "Who designed the Sydney Opera House?",
        options: ["Jørn Utzon", "Frank Gehry", "Zaha Hadid", "Renzo Piano"],
        correctAnswer: "Jørn Utzon",
        explanation: "The Sydney Opera House was designed by Danish architect Jørn Utzon in 1957.",
      },
      {
        question: "What is the tallest building in the world as of 2021?",
        options: ["Burj Khalifa", "Shanghai Tower", "One World Trade Center", "Taipei 101"],
        correctAnswer: "Burj Khalifa",
        explanation:
          "The Burj Khalifa in Dubai, UAE, is currently the world's tallest building at 828 meters (2,717 ft).",
      },
      {
        question: "Which ancient civilization built the Parthenon?",
        options: ["Ancient Greeks", "Ancient Egyptians", "Ancient Romans", "Ancient Chinese"],
        correctAnswer: "Ancient Greeks",
        explanation: "The Parthenon was built by the Ancient Greeks on the Acropolis of Athens in the 5th century BCE.",
      },
      {
        question: "What is the name of the famous leaning tower in Pisa, Italy?",
        options: ["Tower of Pisa", "Leaning Tower of Pisa", "Bell Tower of Pisa", "Campanile of Pisa"],
        correctAnswer: "Leaning Tower of Pisa",
        explanation: "The Leaning Tower of Pisa is a freestanding bell tower known worldwide for its unintended tilt.",
      },
      {
        question: "Which architectural movement is Frank Lloyd Wright associated with?",
        options: ["Prairie School", "Bauhaus", "Art Nouveau", "Brutalism"],
        correctAnswer: "Prairie School",
        explanation:
          "Frank Lloyd Wright is closely associated with the Prairie School movement, which emphasized horizontal lines and integration with the landscape.",
      },
      {
        question: "What is the primary function of a flying buttress in Gothic architecture?",
        options: ["Support", "Decoration", "Ventilation", "Lighting"],
        correctAnswer: "Support",
        explanation:
          "Flying buttresses in Gothic architecture provide external support to allow for taller, thinner walls and larger windows.",
      },
      {
        question: "Which famous architect designed the Fallingwater house?",
        options: ["Frank Lloyd Wright", "Le Corbusier", "Mies van der Rohe", "Walter Gropius"],
        correctAnswer: "Frank Lloyd Wright",
        explanation:
          "Fallingwater, a house built over a waterfall in Pennsylvania, was designed by Frank Lloyd Wright in 1935.",
      },
      {
        question: "What material was primarily used in the construction of ancient Roman aqueducts?",
        options: ["Stone", "Wood", "Brick", "Concrete"],
        correctAnswer: "Stone",
        explanation:
          "Ancient Roman aqueducts were primarily constructed using stone, often in the form of large blocks or arches.",
      },
    ],
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
  const [userData, setUserData] = useState<any>(null)

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
    if (option === selectedAnswer) return '!"!bg-emerald-500 hover:!bg-emerald-600 text-white'
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
                      className={`w-full text-left justify-start ${getButtonClass(
                        option,
                        isAnswered,
                        selectedAnswer,
                        questions[currentQuestion].correctAnswer,
                      )}`}
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

