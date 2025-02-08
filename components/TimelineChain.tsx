"use client"

import { useRef, useEffect, useState } from "react"
import * as THREE from "three"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, ChevronDown } from "lucide-react"

interface Timeline {
  year: number
  query: string
}

interface TimelineChainProps {
  currentTimeline: Timeline
  previousTimelines: Timeline[]
  onSelectTimeline: (index: number) => void
}

export function TimelineChain({ currentTimeline, previousTimelines, onSelectTimeline }: TimelineChainProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / 100, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      canvas: containerRef.current,
    })

    renderer.setSize(containerRef.current.clientWidth, 100)
    renderer.setClearColor(0x000000, 0)

    sceneRef.current = scene
    cameraRef.current = camera
    rendererRef.current = renderer

    camera.position.z = 5

    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return
      camera.aspect = containerRef.current.clientWidth / 100
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, 100)
    }

    window.addEventListener("resize", handleResize)

    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return
      requestAnimationFrame(animate)

      // Add subtle floating animation to spheres
      sceneRef.current.children.forEach((child) => {
        if (child instanceof THREE.Group) {
          child.children.forEach((mesh, index) => {
            if (mesh instanceof THREE.Mesh && mesh.geometry instanceof THREE.SphereGeometry) {
              mesh.position.y = Math.sin(Date.now() * 0.002 + index * 0.5) * 0.05
            }
          })
        }
      })

      rendererRef.current.render(sceneRef.current, cameraRef.current)
    }

    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      renderer.dispose()
    }
  }, [])

  useEffect(() => {
    if (!sceneRef.current) return

    sceneRef.current.clear()
    const timelines = [...previousTimelines, currentTimeline]
    const chainGroup = new THREE.Group()

    timelines.forEach((timeline, index) => {
      const sphereGeometry = new THREE.SphereGeometry(0.15, 32, 32)
      const sphereMaterial = new THREE.MeshBasicMaterial({
        color: index === timelines.length - 1 ? 0x3b82f6 : 0x666666,
      })
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
      sphere.position.x = index - (timelines.length - 1) / 2

      const glowGeometry = new THREE.SphereGeometry(0.2, 32, 32)
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: index === timelines.length - 1 ? 0x3b82f6 : 0x666666,
        transparent: true,
        opacity: 0.2,
      })
      const glow = new THREE.Mesh(glowGeometry, glowMaterial)
      glow.position.copy(sphere.position)

      chainGroup.add(sphere)
      chainGroup.add(glow)

      if (index < timelines.length - 1) {
        const lineGeometry = new THREE.BoxGeometry(0.8, 0.02, 0.02)
        const lineMaterial = new THREE.MeshBasicMaterial({ color: 0x444444 })
        const line = new THREE.Mesh(lineGeometry, lineMaterial)
        line.position.x = index + 0.5 - (timelines.length - 1) / 2
        chainGroup.add(line)
      }
    })

    sceneRef.current.add(chainGroup)
  }, [currentTimeline, previousTimelines])

  return (
    <div className="relative w-full bg-black/50 backdrop-blur-sm border-b border-white/10">
      <motion.button
        className="absolute left-1/2 -bottom-4 z-50 flex items-center justify-center w-8 h-8 rounded-full bg-black/80 backdrop-blur-sm border border-white/20 transform -translate-x-1/2 hover:bg-white/10 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 180 : 0 }}
      >
        <ChevronDown className="w-4 h-4 text-white/60" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="max-w-7xl mx-auto px-4 py-2">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-white/80" />
                <span className="text-xl font-medium text-white/80">Timeline Chain</span>
              </div>

              <div className="relative h-[100px]">
                <canvas ref={containerRef} className="absolute inset-0 w-full cursor-pointer" />

                <motion.div
                  className="absolute inset-x-0 bottom-0 flex justify-center items-center gap-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {[...previousTimelines, currentTimeline].map((timeline, index) => (
                    <motion.button
                      key={index}
                      onClick={() => index < previousTimelines.length && onSelectTimeline(index)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        index === previousTimelines.length
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-white/5 hover:bg-white/10 text-white/60"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {timeline.year}
                    </motion.button>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

