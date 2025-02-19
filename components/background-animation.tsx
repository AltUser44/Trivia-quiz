"use client"

export function BackgroundAnimation() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-radial-animated" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      {/* Floating shapes */}
      <div className="absolute inset-0">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`floating-shape shape-${i % 3}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

