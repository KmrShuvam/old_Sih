"use client"

import { useEffect, useRef } from "react"

// Define types for our project data
interface Project {
  id: string
  name: string
  state: string
  implementing_body: string
  credits_issued: number
  geometry: {
    type: string
    coordinates: [number, number]
  }
}

interface InteractiveMapProps {
  projects: Project[]
  onProjectClick: (projectId: string) => void
}

export default function InteractiveMap({ projects, onProjectClick }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    // Dynamically import Leaflet to avoid SSR issues
    const initMap = async () => {
      const L = (await import("leaflet")).default

      // Fix for default markers in Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      })

      if (mapRef.current && !mapInstanceRef.current) {
        // Initialize map centered on India
        const map = L.map(mapRef.current).setView([20.5937, 78.9629], 5)

        // Add OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(map)

        // Custom icon for blue carbon projects
        const blueIcon = L.divIcon({
          html: `
            <div style="
              background: linear-gradient(135deg, #1e40af, #0891b2);
              width: 24px;
              height: 24px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="
                width: 8px;
                height: 8px;
                background: white;
                border-radius: 50%;
              "></div>
            </div>
          `,
          className: "custom-div-icon",
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        })

        // Add markers for each project
        projects.forEach((project) => {
          const [lng, lat] = project.geometry.coordinates

          const marker = L.marker([lat, lng], { icon: blueIcon })
            .addTo(map)
            .bindPopup(`
              <div style="min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; color: #1e40af; font-weight: 600; font-size: 14px;">
                  ${project.name}
                </h3>
                <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px;">
                  📍 ${project.state}
                </p>
                <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px;">
                  🏛️ ${project.implementing_body}
                </p>
                <div style="
                  background: #dbeafe;
                  color: #1e40af;
                  padding: 4px 8px;
                  border-radius: 12px;
                  font-size: 11px;
                  font-weight: 600;
                  display: inline-block;
                  margin-bottom: 8px;
                ">
                  ${project.credits_issued.toLocaleString()} Credits Issued
                </div>
                <br>
                <button 
                  onclick="window.handleProjectClick('${project.id}')"
                  style="
                    background: #1e40af;
                    color: white;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 6px;
                    font-size: 11px;
                    cursor: pointer;
                    font-weight: 500;
                  "
                >
                  View Details →
                </button>
              </div>
            `)

          // Add click handler for marker
          marker.on("click", () => {
            onProjectClick(project.id)
          })
        })

        mapInstanceRef.current = map

        // Make the project click handler available globally for popup buttons
        ;(window as any).handleProjectClick = onProjectClick
      }
    }

    initMap()

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [projects, onProjectClick])

  return (
    <>
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossOrigin=""
      />

      <div
        ref={mapRef}
        className="h-96 w-full rounded-lg border-2 border-blue-100 shadow-sm"
        style={{ minHeight: "384px" }}
      />
    </>
  )
}
