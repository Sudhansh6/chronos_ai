"use client"

import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(({ className, value, ...props }, ref) => (
  <div ref={ref} className={cn("relative h-2 w-full overflow-hidden rounded-full bg-white/10", className)} {...props}>
    <motion.div
      className="h-full w-full origin-left bg-gradient-to-r from-blue-600 to-blue-400"
      style={{ scaleX: value / 100 }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: value / 100 }}
      transition={{ type: "spring", stiffness: 100, damping: 30 }}
    />
  </div>
))
Progress.displayName = "Progress"

export { Progress }

