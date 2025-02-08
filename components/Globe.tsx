"use client"

import { useEffect, useRef, useState } from "react"
import Globe from "react-globe.gl"
import { Button } from "@/components/ui/button"
import { Cross1Icon } from "@radix-ui/react-icons"

interface GlobeProps {
  selectedRegion: string | null
  onRegionSelect: (region: string) => void
}

const REGIONS = {
  "Asia": { lat: 45, lng: 90, color: "#4CAF50" },
  "North America": { lat: 40, lng: -100, color: "#2196F3" },
  "Europe": { lat: -15, lng: -60, color: "#FFC107" },
  "Africa": { lat: 0, lng: 25, color: "#FF5722" },
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

  console.log(polygons)

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {selectedRegion && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 z-10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white"
          onClick={() => onRegionSelect(null)}
        >
          <Cross1Icon className="mr-2" />
          Exit Region View
        </Button>
      )}
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
    "Asia": [
      [
        [30, 60],   // Northwest Asia
        [180, 60],  // Northeast Asia
        [180, -10], // Southeast Asia
        [30, -10],  // Southwest Asia
        [30, 60]    // Close the polygon
      ]
    ],
    "North America": [
      [
        [-170, 80], // Northern Alaska
        [-50, 80],  // Northern Canada
        [-50, 15],  // Southern Mexico
        [-170, 15], // Pacific Coast
        [-170, 80]  // Close the polygon
      ]
    ],
    "Europe": [
      [
        [-25, 70],  // Northern Scandinavia
        [60, 70],   // Northern Russia
        [60, 35],   // Southern Black Sea
        [-25, 35],  // Southern Spain
        [-25, 70]   // Close the polygon
      ]
    ],
    "Africa": [
      [
        [-20, 35],  // Northern Africa
        [50, 35],   // Middle East
        [50, -35],  // Southern Africa
        [-20, -35], // Southern Atlantic Coast
        [-20, 35]   // Close the polygon
      ]
    ]
  }

  return coordinates[region as keyof typeof coordinates] || []
}

