import { SearchBar } from "../components/SearchBar"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-[rgb(var(--background))]">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-4 gradient-text">Chronos AI</h1>
        <h2 className="text-2xl md:text-4xl font-semibold text-center mb-8 gradient-text">
          Explore Alternate Timelines
        </h2>
        <p className="text-lg md:text-xl text-center mb-12 text-gray-400">
          Choose a pivotal moment in history and see how the world would evolve
        </p>
        <SearchBar />
      </div>
    </main>
  )
}

