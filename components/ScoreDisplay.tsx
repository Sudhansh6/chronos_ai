"use client"

import { motion } from "framer-motion"
import { Trophy } from "lucide-react"

interface ScoreDisplayProps {
  score: number
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <motion.div
      className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-blue-400/10 rounded-full border border-white/10"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Trophy className="w-4 h-4 text-blue-400" />
      <div className="flex items-baseline gap-2">
        <span className="text-sm text-white/60">Timeline Score</span>
        <motion.span
          key={score}
          className="text-lg font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {score}%
        </motion.span>
      </div>
    </motion.div>
  )
}

