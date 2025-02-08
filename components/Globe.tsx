"use client"

import { useEffect, useRef, useState } from "react"
import Globe from "react-globe.gl"

interface GlobeProps {
  selectedRegion: string | null
  onRegionSelect: (region: string) => void
}

const REGIONS = {
  Eurasia: { lat: 45, lng: 90, color: "#4CAF50" },
  "North America": { lat: 40, lng: -100, color: "#2196F3" },
  "South America": { lat: -15, lng: -60, color: "#FFC107" },
  "Africa/Oceania": { lat: 0, lng: 25, color: "#FF5722" },
}

export default function GlobeComponent({ selectedRegion, onRegionSelect }: GlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const globeRef = useRef<any>()
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }

    window.addEventListener("resize", updateDimensions)
    updateDimensions()

    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  const handleGlobeClick = (coords: { lat: number; lng: number }) => {
    let closestRegion = ""
    let minDistance = Number.POSITIVE_INFINITY

    Object.entries(REGIONS).forEach(([region, pos]) => {
      const distance = Math.sqrt(Math.pow(coords.lat - pos.lat, 2) + Math.pow(coords.lng - pos.lng, 2))
      if (distance < minDistance) {
        minDistance = distance
        closestRegion = region
      }
    })

    onRegionSelect(closestRegion)
  }

  const polygons = selectedRegion
    ? [
        {
          coordinates: getRegionCoordinates(selectedRegion),
          color: REGIONS[selectedRegion as keyof typeof REGIONS].color,
        },
      ]
    : []

  return (
    <div ref={containerRef} className="w-full h-full">
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        polygonsData={polygons}
        polygonCapColor={(d) => d.color}
        polygonSideColor={() => "rgba(0, 100, 0, 0.15)"}
        polygonStrokeColor={() => "#111"}
        polygonAltitude={0.01}
        onGlobeClick={handleGlobeClick}
        atmosphereColor="white"
        atmosphereAltitude={0.15}
      />
    </div>
  )
}

function getRegionCoordinates(region: string) {
  const coordinates = {
    Eurasia: [
      [
        [30, 60],
        [180, 60],
        [180, 0],
        [30, 0],
      ],
    ],
    "North America": [
      [
        [-180, 80],
        [-50, 80],
        [-50, 15],
        [-180, 15],
      ],
    ],
    "South America": [
      [
        [-80, 15],
        [-35, 15],
        [-35, -60],
        [-80, -60],
      ],
    ],
    "Africa/Oceania": [
      [
        [-20, 35],
        [180, 35],
        [180, -60],
        [-20, -60],
      ],
    ],
  }

  return coordinates[region as keyof typeof coordinates] || []
}

