"use client"

import { useEffect, useRef, useState } from "react"
import { Viewer, CameraFlyTo, Entity, ImageryLayer, createWorldTerrain, Cartesian3, Rectangle } from "cesium"
import "cesium/Build/Cesium/Widgets/widgets.css"
import { Button } from "@/components/ui/button"
import { Cross1Icon } from "@radix-ui/react-icons"

interface GlobeProps {
  selectedRegion: string | null
  onRegionSelect: (region: string) => void
}

const REGION_BOUNDS = {
  "Asia": { west: 30, east: 180, south: -10, north: 60 },
  "North America": { west: -170, east: -50, south: 15, north: 80 },
  "Europe": { west: -25, east: 60, south: 35, north: 70 },
  "Africa": { west: -20, east: 50, south: -35, north: 35 }
}

export default function GlobeComponent({ selectedRegion, onRegionSelect }: GlobeProps) {
  const cesiumContainer = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<Viewer>()
  const [resolution, setResolution] = useState(0.5)

  useEffect(() => {
    if (cesiumContainer.current && !viewerRef.current) {
      viewerRef.current = new Viewer(cesiumContainer.current, {
        animation: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        timeline: false,
        navigationHelpButton: false,
        terrain: createWorldTerrain(),
        imageryProvider: new IonImageryProvider({ assetId: 2 })
      })

      // Configure initial view
      viewerRef.current.camera.flyTo({
        destination: Cartesian3.fromDegrees(0, 30, 10000000),
        orientation: {
          heading: 0,
          pitch: -Math.PI/4,
          roll: 0
        }
      })
    }

    return () => {
      viewerRef.current?.destroy()
    }
  }, [])

  useEffect(() => {
    if (selectedRegion && viewerRef.current) {
      const bounds = REGION_BOUNDS[selectedRegion]
      viewerRef.current.camera.flyTo({
        destination: Rectangle.fromDegrees(
          bounds.west,
          bounds.south,
          bounds.east,
          bounds.north
        )
      })
    }
  }, [selectedRegion])

  const handleGlobeClick = (coords: { lat: number; lng: number }) => {
    const clickedRegion = Object.entries(REGION_BOUNDS).find(([_, region]) => 
      coords.lng >= region.west && coords.lng <= region.east &&
      coords.lat >= region.south && coords.lat <= region.north
    )?.[0];

    if (clickedRegion) {
      onRegionSelect(clickedRegion);
    }
  }

  return (
    <div 
      ref={cesiumContainer} 
      className="w-full h-[calc(100vh-160px)] md:h-full relative"
    >
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
    </div>
  )
}

