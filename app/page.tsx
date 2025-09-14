"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Leaf,
  CloudDownload,
  Award,
  Search,
  ExternalLink,
  Users,
  DollarSign,
  Globe,
  Shield,
  Zap,
  Database,
  Eye,
} from "lucide-react"
import dynamic from "next/dynamic"
import { BlockchainProject, calculateEstimatedCO2, formatTimestamp } from "@/lib/blockchain"
import { BlockchainVerification, AuditTrail } from "@/components/blockchain-verification"
import { WalletStatus } from "@/components/wallet-connection"
import { PlantationChart } from "@/components/plantation-chart"

const InteractiveMap = dynamic(() => import("@/components/interactive-map"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200">
      <div className="text-center">
        <MapPin className="h-12 w-12 text-blue-400 mx-auto mb-4 animate-pulse" />
        <p className="text-blue-600 font-medium">Loading Interactive Map...</p>
      </div>
    </div>
  ),
})

const projectsData = {
  projects: [
    {
      id: "proj001",
      name: "Sundarbans Mangrove Revival",
      state: "West Bengal",
      implementing_body: "Sundarbans Coastal Panchayat",
      credits_issued: 1500,
      area_hectares: 150,
      start_date: "2024-01-15",
      project_type: "Mangrove Afforestation",
      geometry: { type: "Point", coordinates: [88.85, 21.95] },
      audit_trail: [
        {
          event: "Project Registered on AquaCred Ledger",
          timestamp: "2024-01-15T10:30:00Z",
          tx_hash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
        },
        {
          event: "Monitoring Report 1 Submitted",
          timestamp: "2024-03-15T14:20:00Z",
          tx_hash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234",
        },
        {
          event: "Report 1 Verified by 0x9876...5432",
          timestamp: "2024-03-20T09:15:00Z",
          tx_hash: "0x3c4d5e6f7890abcdef1234567890abcdef123456",
        },
        {
          event: "1500 Carbon Credits Minted",
          timestamp: "2024-03-25T16:45:00Z",
          tx_hash: "0x4d5e6f7890abcdef1234567890abcdef12345678",
        },
      ],
      plantation_timeline: [
        { month: "Jan 2024", saplings_planted: 5000 },
        { month: "Feb 2024", saplings_planted: 12000 },
        { month: "Mar 2024", saplings_planted: 15000 },
      ],
      carbon_credits: [
        {
          token_id: "AQC-001-001",
          issuance_date: "2024-03-25",
          vintage_year: 2024,
          status: "Available",
          owner_wallet: "0x1234...5678",
        },
        {
          token_id: "AQC-001-002",
          issuance_date: "2024-03-25",
          vintage_year: 2024,
          status: "Listed for Sale",
          owner_wallet: "0x1234...5678",
        },
        {
          token_id: "AQC-001-003",
          issuance_date: "2024-03-25",
          vintage_year: 2024,
          status: "Retired",
          owner_wallet: "0x9876...4321",
        },
      ],
      impact: {
        environmental: { co2_sequestered: 1500, biodiversity_index: "High", erosion_reduction: "Significant" },
        economic: { credits_generated: 1500, estimated_value_inr: 1800000, jobs_supported: 45 },
        social: { community_livelihoods: "Supported", sdg_alignment: ["SDG 13", "SDG 14"] },
      },
    },
    {
      id: "proj002",
      name: "Pichavaram Coastal Shield",
      state: "Tamil Nadu",
      implementing_body: "Cuddalore Coastal Panchayat",
      credits_issued: 850,
      area_hectares: 85,
      start_date: "2024-02-01",
      project_type: "Mangrove Restoration",
      geometry: { type: "Point", coordinates: [79.79, 11.49] },
      plantation_timeline: [
        { month: "Jan 2024", saplings_planted: 3000 },
        { month: "Feb 2024", saplings_planted: 7500 },
        { month: "Mar 2024", saplings_planted: 12000 },
        { month: "Apr 2024", saplings_planted: 15000 },
      ],
    },
    {
      id: "proj003",
      name: "Gujarat Gulf Restoration",
      state: "Gujarat",
      implementing_body: "Kutch District Panchayat",
      credits_issued: 2200,
      area_hectares: 220,
      start_date: "2024-01-20",
      project_type: "Coastal Restoration",
      geometry: { type: "Point", coordinates: [69.85, 23.01] },
      plantation_timeline: [
        { month: "Jan 2024", saplings_planted: 8000 },
        { month: "Feb 2024", saplings_planted: 15000 },
        { month: "Mar 2024", saplings_planted: 25000 },
        { month: "Apr 2024", saplings_planted: 35000 },
        { month: "May 2024", saplings_planted: 45000 },
      ],
    },
    {
      id: "proj004",
      name: "Vembanad Lake Mangrove Conservation",
      state: "Kerala",
      implementing_body: "Kuttanad Development Agency",
      credits_issued: 1850,
      area_hectares: 185,
      start_date: "2024-02-10",
      project_type: "Mangrove Conservation",
      geometry: { type: "Point", coordinates: [76.43, 9.6] },
      audit_trail: [
        {
          event: "Project Registered on AquaCred Ledger",
          timestamp: "2024-02-10T11:15:00Z",
          tx_hash: "0x5e6f7890abcdef1234567890abcdef1234567890",
        },
        {
          event: "Monitoring Report 1 Submitted",
          timestamp: "2024-04-10T13:30:00Z",
          tx_hash: "0x6f7890abcdef1234567890abcdef12345678901a",
        },
        {
          event: "Report 1 Verified by 0x8765...4321",
          timestamp: "2024-04-15T10:45:00Z",
          tx_hash: "0x7890abcdef1234567890abcdef123456789012b",
        },
        {
          event: "1850 Carbon Credits Minted",
          timestamp: "2024-04-20T15:20:00Z",
          tx_hash: "0x890abcdef1234567890abcdef1234567890123c",
        },
      ],
      plantation_timeline: [
        { month: "Jan 2024", saplings_planted: 3500 },
        { month: "Feb 2024", saplings_planted: 8500 },
        { month: "Mar 2024", saplings_planted: 14000 },
        { month: "Apr 2024", saplings_planted: 18500 },
      ],
      carbon_credits: [
        {
          token_id: "AQC-004-001",
          issuance_date: "2024-04-20",
          vintage_year: 2024,
          status: "Available",
          owner_wallet: "0x2345...6789",
        },
        {
          token_id: "AQC-004-002",
          issuance_date: "2024-04-20",
          vintage_year: 2024,
          status: "Available",
          owner_wallet: "0x2345...6789",
        },
        {
          token_id: "AQC-004-003",
          issuance_date: "2024-04-20",
          vintage_year: 2024,
          status: "Listed for Sale",
          owner_wallet: "0x2345...6789",
        },
      ],
      impact: {
        environmental: { co2_sequestered: 1850, biodiversity_index: "Very High", erosion_reduction: "Significant" },
        economic: { credits_generated: 1850, estimated_value_inr: 2220000, jobs_supported: 52 },
        social: { community_livelihoods: "Enhanced", sdg_alignment: ["SDG 13", "SDG 14", "SDG 15"] },
      },
    },
  ],
}

// Calculate KPI data dynamically
const calculateKPIData = (projects: any[]) => {
  const totalProjects = projects.length
  const totalHectares = projects.reduce((sum, p) => sum + (p.area_hectares || 0), 0)
  const totalCO2Sequestered = projects.reduce((sum, p) => sum + (p.credits_issued || 0), 0)
  const totalCreditsIssued = totalCO2Sequestered
  
  return {
    totalProjects,
    totalHectares: Math.round(totalHectares),
    totalCO2Sequestered,
    totalCreditsIssued,
  }
}

export default function AquaCredDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentView, setCurrentView] = useState<"dashboard" | "project" | "about" | "methodology" | "admin">(
    "dashboard",
  )
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [blockchainProjects, setBlockchainProjects] = useState<BlockchainProject[]>([])
  const [isLoadingBlockchain, setIsLoadingBlockchain] = useState(false)
  const [blockchainError, setBlockchainError] = useState<string | null>(null)

  // Fetch blockchain projects on component mount
  useEffect(() => {
    const fetchBlockchainProjects = async () => {
      setIsLoadingBlockchain(true)
      setBlockchainError(null)
      
      try {
        const response = await fetch('/api/submit-project')
        const result = await response.json()
        
        if (result.status === 'success') {
          setBlockchainProjects(result.data.projects)
        } else {
          setBlockchainError(result.message)
        }
      } catch (error: any) {
        setBlockchainError('Failed to fetch blockchain data')
        console.error('Error fetching blockchain projects:', error)
      } finally {
        setIsLoadingBlockchain(false)
      }
    }

    fetchBlockchainProjects()
  }, [])

  // Combine blockchain projects with mock data for display
  const allProjects = [
    ...projectsData.projects,
    ...blockchainProjects.map((bp) => ({
      id: `blockchain-${bp.projectId}`,
      name: bp.projectName,
      state: bp.location,
      implementing_body: bp.implementingBody,
      credits_issued: calculateEstimatedCO2(bp.areaHectares, bp.projectType),
      geometry: { type: "Point", coordinates: [78.9629, 20.5937] }, // Default India coordinates
      area_hectares: bp.areaHectares,
      start_date: formatTimestamp(bp.startDate),
      project_type: bp.projectType,
      isBlockchain: true,
      blockchainId: bp.projectId,
    }))
  ]

  const filteredProjects = allProjects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.state.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleProjectClick = (projectId: string) => {
    setSelectedProject(projectId)
    setCurrentView("project")
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard")
    setSelectedProject(null)
  }

  const handleLogin = (username: string, password: string) => {
    // For prototype, any input grants access
    if (username && password) {
      setIsLoggedIn(true)
      setShowLoginModal(false)
      setCurrentView("admin")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
                  <div className="w-5 h-5 text-white">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-blue-900">AquaCred</h1>
                  <p className="text-xs text-blue-600 -mt-1">Your Blue Carbon, Verified.</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => setCurrentView("dashboard")}
                className={`text-sm font-medium transition-colors ${
                  currentView === "dashboard"
                    ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                National Registry
              </button>
              <button
                onClick={() => setCurrentView("about")}
                className={`text-sm font-medium transition-colors ${
                  currentView === "about"
                    ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                About the Project
              </button>
              <button
                onClick={() => setCurrentView("methodology")}
                className={`text-sm font-medium transition-colors ${
                  currentView === "methodology"
                    ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Methodology
              </button>
              <Button
                onClick={() => window.open('/upload', '_blank')}
                variant="outline"
                size="sm"
                className="border-green-200 text-green-700 hover:bg-green-50 mr-2"
              >
                Register Project
              </Button>
              <Button
                onClick={() => setShowLoginModal(true)}
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                Admin Login
              </Button>
              <WalletStatus />
            </nav>
          </div>
        </div>
      </header>

      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Login</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                handleLogin(formData.get("username") as string, formData.get("password") as string)
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <Input name="username" type="text" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <Input name="password" type="password" required />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <Button type="button" variant="outline" onClick={() => setShowLoginModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">Login</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === "dashboard" && (
          <DashboardView
            kpiData={calculateKPIData(allProjects)}
            projects={filteredProjects}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onProjectClick={handleProjectClick}
            isLoadingBlockchain={isLoadingBlockchain}
            blockchainError={blockchainError}
          />
        )}
        {currentView === "project" && <ProjectDetailView projectId={selectedProject!} onBack={handleBackToDashboard} />}
        {currentView === "about" && <AboutView />}
        {currentView === "methodology" && <MethodologyView />}
        {currentView === "admin" && isLoggedIn && <AdminDashboardView />}
      </main>
    </div>
  )
}

function AboutView() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">About AquaCred</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Empowering coastal communities through verified blue carbon projects and transparent blockchain technology.
        </p>
      </div>

      {/* Mission Section */}
      <Card className="bg-white border-blue-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-900 flex items-center">
            <Globe className="h-6 w-6 mr-2" />
            Our Mission
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-gray-700 leading-relaxed">
            AquaCred is India's premier blue carbon registry platform, designed to empower coastal communities while
            supporting the nation's ambitious climate targets. We bridge the gap between environmental conservation and
            economic opportunity by creating a transparent, verifiable marketplace for blue carbon credits generated
            through mangrove restoration and coastal ecosystem protection.
          </p>
        </CardContent>
      </Card>

      {/* How it Works Section */}
      <Card className="bg-white border-green-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-900">How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">1. Plant & Report</h3>
              <p className="text-gray-600">
                Coastal communities use our mobile app to register mangrove plantations and submit regular monitoring
                reports with GPS coordinates and photographic evidence.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">2. Verify & Tokenize</h3>
              <p className="text-gray-600">
                Independent third-party auditors verify the data using satellite imagery and on-ground inspections.
                Verified carbon sequestration is tokenized on the blockchain.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">3. Prosper & Conserve</h3>
              <p className="text-gray-600">
                Communities sell verified carbon credits to corporations and governments, creating sustainable income
                streams while protecting vital coastal ecosystems.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Impact Statistics */}
      <Card className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <CardContent className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">425+</div>
              <div className="text-blue-100">Hectares Restored</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">4,550+</div>
              <div className="text-blue-100">Tonnes CO₂ Sequestered</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">150+</div>
              <div className="text-blue-100">Jobs Created</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">₹54L+</div>
              <div className="text-blue-100">Community Income</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MethodologyView() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">Our Methodology</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Transparent, scientific, and blockchain-verified approach to blue carbon measurement and verification.
        </p>
      </div>

      {/* Technology Stack */}
      <Card className="bg-white border-purple-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-purple-900 flex items-center">
            <Database className="h-6 w-6 mr-2" />
            Technology Stack
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Database className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-purple-900 mb-2">Python</h3>
              <p className="text-sm text-gray-600">Data processing and analysis backend</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-blue-900 mb-2">Flask</h3>
              <p className="text-sm text-gray-600">RESTful API development framework</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-green-900 mb-2">Vyper</h3>
              <p className="text-sm text-gray-600">Smart contract development language</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <ExternalLink className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-yellow-900 mb-2">Blockchain</h3>
              <p className="text-sm text-gray-600">Ethereum-based verification ledger</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Process */}
      <Card className="bg-white border-green-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-900 flex items-center">
            <Eye className="h-6 w-6 mr-2" />
            Verification Process
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-green-900 mb-2">Data Collection</h3>
                <p className="text-gray-700">
                  Project implementers submit regular monitoring reports through our mobile application, including GPS
                  coordinates, photographs, and growth measurements of mangrove plantations.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-green-900 mb-2">Independent Verification</h3>
                <p className="text-gray-700">
                  Accredited third-party auditors cross-reference submitted data with high-resolution satellite imagery
                  and conduct periodic on-ground inspections to verify plantation health and carbon sequestration rates.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-green-900 mb-2">Blockchain Recording</h3>
                <p className="text-gray-700">
                  All verification events, carbon credit issuances, and ownership transfers are permanently recorded on
                  the Ethereum blockchain, ensuring complete transparency and preventing double-counting.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-green-900 mb-2">Continuous Monitoring</h3>
                <p className="text-gray-700">
                  Projects undergo continuous monitoring throughout their lifecycle, with quarterly reports and annual
                  third-party audits to ensure long-term carbon sequestration and ecosystem health.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Standards Compliance */}
      <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <CardContent className="py-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Standards Compliance</h3>
            <p className="text-lg text-green-100 mb-6">
              AquaCred methodology aligns with international standards for blue carbon measurement and verification
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-opacity-20 rounded-lg p-4 bg-teal-700">
                <div className="flex justify-center mb-3">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-12 h-12">
                      <circle cx="50" cy="50" r="45" fill="#1e40af" stroke="#ffffff" strokeWidth="2" />
                      <text x="50" y="35" textAnchor="middle" className="fill-white text-xs font-bold">
                        IPCC
                      </text>
                      <circle cx="30" cy="60" r="8" fill="#10b981" />
                      <circle cx="50" cy="65" r="6" fill="#3b82f6" />
                      <circle cx="70" cy="60" r="8" fill="#06b6d4" />
                    </svg>
                  </div>
                </div>
                <h4 className="font-semibold mb-2">IPCC Guidelines</h4>
                <p className="text-sm text-green-100">2019 Refinement to 2006 IPCC Guidelines</p>
              </div>
              <div className="bg-opacity-20 rounded-lg p-4 bg-teal-700">
                <div className="flex justify-center mb-3">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-12 h-12">
                      <circle cx="50" cy="50" r="45" fill="#059669" stroke="#ffffff" strokeWidth="2" />
                      <text x="50" y="35" textAnchor="middle" className="fill-white text-xs font-bold">
                        VCS
                      </text>
                      <path
                        d="M25 60 L40 75 L75 40"
                        stroke="#ffffff"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <h4 className="font-semibold mb-2">VCS Standards</h4>
                <p className="text-sm text-green-100">Verified Carbon Standard methodology</p>
              </div>
              <div className="bg-opacity-20 rounded-lg p-4 bg-teal-700">
                <div className="flex justify-center mb-3">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-12 h-12">
                      <circle cx="50" cy="50" r="45" fill="#0ea5e9" stroke="#ffffff" strokeWidth="2" />
                      <text x="50" y="30" textAnchor="middle" className="fill-white text-xs font-bold">
                        BCI
                      </text>
                      <path d="M20 60 Q35 45 50 60 Q65 75 80 60" stroke="#ffffff" strokeWidth="3" fill="none" />
                      <circle cx="25" cy="70" r="3" fill="#10b981" />
                      <circle cx="50" cy="75" r="3" fill="#10b981" />
                      <circle cx="75" cy="70" r="3" fill="#10b981" />
                    </svg>
                  </div>
                </div>
                <h4 className="font-semibold mb-2">Blue Carbon Initiative</h4>
                <p className="text-sm text-green-100">International blue carbon protocols</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AdminDashboardView() {
  const pendingVerifications = [
    {
      project_name: "Sundarbans Mangrove Revival",
      submission_date: "2024-04-15",
      data_type: "Quarterly Monitoring Report",
    },
    {
      project_name: "Pichavaram Coastal Shield",
      submission_date: "2024-04-12",
      data_type: "Growth Assessment Data",
    },
  ]

  const accreditedVerifiers = [
    {
      name: "EcoVerify Solutions Pvt Ltd",
      accreditation_id: "NCCR-AV-001",
      status: "Active",
    },
    {
      name: "Green Audit Associates",
      accreditation_id: "NCCR-AV-002",
      status: "Active",
    },
    {
      name: "Coastal Carbon Consultants",
      accreditation_id: "NCCR-AV-003",
      status: "Inactive",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">Welcome, NCCR Administrator</h1>
        <p className="text-xl text-gray-600">National Centre for Coastal Research - Admin Dashboard</p>
      </div>

      {/* Pending Verifications */}
      <Card className="bg-white border-orange-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-orange-900 flex items-center">
            <Eye className="h-6 w-6 mr-2" />
            Pending Verifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Project Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Submission Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Data Submitted</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingVerifications.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-900">{item.project_name}</td>
                    <td className="py-3 px-4 text-gray-600">{item.submission_date}</td>
                    <td className="py-3 px-4">
                      <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                        {item.data_type}
                      </a>
                    </td>
                    <td className="py-3 px-4">
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                        Review & Verify
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Accredited Verifiers */}
      <Card className="bg-white border-purple-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-purple-900 flex items-center">
            <Shield className="h-6 w-6 mr-2" />
            Accredited Verifiers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Verifier Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Accreditation ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {accreditedVerifiers.map((verifier, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-900">{verifier.name}</td>
                    <td className="py-3 px-4 text-gray-600">{verifier.accreditation_id}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={verifier.status === "Active" ? "default" : "secondary"}
                        className={
                          verifier.status === "Active"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-gray-100 text-gray-800 border-gray-200"
                        }
                      >
                        {verifier.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* System Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white border-blue-100">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-900">Credits Issued vs. Retired (Monthly)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-600">Chart.js visualization would be implemented here</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-green-100">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-green-900">Project Growth by State</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-600">Chart.js visualization would be implemented here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DashboardView({
  kpiData,
  projects,
  searchTerm,
  setSearchTerm,
  onProjectClick,
  isLoadingBlockchain,
  blockchainError,
}: {
  kpiData: ReturnType<typeof calculateKPIData>
  projects: any[]
  searchTerm: string
  setSearchTerm: (term: string) => void
  onProjectClick: (id: string) => void
  isLoadingBlockchain: boolean
  blockchainError: string | null
}) {
  return (
    <>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white border-blue-100 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Projects Registered</CardTitle>
            <MapPin className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{kpiData.totalProjects}</div>
            <p className="text-xs text-green-600 mt-1">Across coastal India</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-green-100 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Hectares Under Restoration</CardTitle>
            <Leaf className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{kpiData.totalHectares.toLocaleString()}</div>
            <p className="text-xs text-green-600 mt-1">Mangrove ecosystems</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-teal-100 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total CO₂ Sequestered</CardTitle>
            <CloudDownload className="h-5 w-5 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-teal-900">{kpiData.totalCO2Sequestered.toLocaleString()}</div>
            <p className="text-xs text-teal-600 mt-1">Tonnes captured</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-yellow-100 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Carbon Credits Issued</CardTitle>
            <Award className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-900">{kpiData.totalCreditsIssued.toLocaleString()}</div>
            <p className="text-xs text-yellow-600 mt-1">Verified credits</p>
          </CardContent>
        </Card>
      </div>

      {/* Map and Project List Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-white border-blue-100">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-blue-900">Project Locations</CardTitle>
              <p className="text-sm text-gray-600">Click on markers to view project details</p>
            </CardHeader>
            <CardContent>
              <InteractiveMap projects={projects} onProjectClick={onProjectClick} />
            </CardContent>
          </Card>
        </div>

        {/* Project Registry */}
        <div className="lg:col-span-1">
          <Card className="bg-white border-green-100">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-green-900">Project Registry</CardTitle>
                {isLoadingBlockchain && (
                  <div className="flex items-center text-sm text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Syncing...
                  </div>
                )}
              </div>
              {blockchainError && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                  Blockchain sync error: {blockchainError}
                </div>
              )}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-green-200 focus:border-green-400"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="p-3 border border-gray-100 rounded-lg hover:bg-green-50 cursor-pointer transition-colors"
                    onClick={() => onProjectClick(project.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 text-sm leading-tight">{project.name}</h4>
                      <div className="flex items-center space-x-1">
                        {project.isBlockchain && (
                          <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                            Blockchain
                          </Badge>
                        )}
                        <ExternalLink className="h-3 w-3 text-gray-400 flex-shrink-0" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{project.state}</p>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                        {project.credits_issued} credits
                      </Badge>
                      {project.isBlockchain && (
                        <span className="text-xs text-blue-600">ID: {project.blockchainId}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

function ProjectDetailView({ projectId, onBack }: { projectId: string; onBack: () => void }) {
  const projectDetail = projectsData.projects.find((p) => p.id === projectId) || {
    id: "proj001",
    name: "Sundarbans Mangrove Revival",
    state: "West Bengal",
    implementing_body: "Sundarbans Coastal Panchayat",
    credits_issued: 1500,
    area_hectares: 150,
    start_date: "2024-01-15",
    project_type: "Mangrove Afforestation",
    audit_trail: [
      {
        event: "Project Registered on AquaCred Ledger",
        timestamp: "2024-01-15T10:30:00Z",
        tx_hash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
      },
      {
        event: "Monitoring Report 1 Submitted",
        timestamp: "2024-03-15T14:20:00Z",
        tx_hash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234",
      },
      {
        event: "Report 1 Verified by 0x9876...5432",
        timestamp: "2024-03-20T09:15:00Z",
        tx_hash: "0x3c4d5e6f7890abcdef1234567890abcdef123456",
      },
      {
        event: "1500 Carbon Credits Minted",
        timestamp: "2024-03-25T16:45:00Z",
        tx_hash: "0x4d5e6f7890abcdef1234567890abcdef12345678",
      },
    ],
    plantation_timeline: [
      { month: "Jan 2024", saplings_planted: 5000 },
      { month: "Feb 2024", saplings_planted: 12000 },
      { month: "Mar 2024", saplings_planted: 15000 },
    ],
    carbon_credits: [
      {
        token_id: "AQC-001-001",
        issuance_date: "2024-03-25",
        vintage_year: 2024,
        status: "Available",
        owner_wallet: "0x1234...5678",
      },
      {
        token_id: "AQC-001-002",
        issuance_date: "2024-03-25",
        vintage_year: 2024,
        status: "Listed for Sale",
        owner_wallet: "0x1234...5678",
      },
      {
        token_id: "AQC-001-003",
        issuance_date: "2024-03-25",
        vintage_year: 2024,
        status: "Retired",
        owner_wallet: "0x9876...4321",
      },
    ],
    impact: {
      environmental: { co2_sequestered: 1500, biodiversity_index: "High", erosion_reduction: "Significant" },
      economic: { credits_generated: 1500, estimated_value_inr: 1800000, jobs_supported: 45 },
      social: { community_livelihoods: "Supported", sdg_alignment: ["SDG 13", "SDG 14"] },
    },
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Button
        onClick={onBack}
        variant="outline"
        className="mb-4 border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
      >
        ← Back to Registry
      </Button>

      {/* Project Summary */}
      <Card className="bg-white border-blue-100">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold text-blue-900 mb-2">{projectDetail.name}</CardTitle>
              <p className="text-lg text-gray-600 mb-4">
                {projectDetail.state} | {projectDetail.implementing_body}
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-200">Active Project</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Area</p>
              <p className="text-lg font-semibold text-gray-900">{projectDetail.area_hectares || 150} hectares</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Start Date</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(projectDetail.start_date || "2024-01-15").toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Project Type</p>
              <p className="text-lg font-semibold text-gray-900">
                {projectDetail.project_type || "Mangrove Afforestation"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {projectDetail.plantation_timeline && (
        <Card className="bg-white border-green-100">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-green-900">Plantation & Impact Growth</CardTitle>
            <p className="text-sm text-gray-600">Monthly sapling plantation progress</p>
          </CardHeader>
          <CardContent>
            <PlantationChart data={projectDetail.plantation_timeline} />
          </CardContent>
        </Card>
      )}

      {/* Blockchain Verification */}
      {projectDetail.isBlockchain && (
        <BlockchainVerification 
          transactionHash={projectDetail.audit_trail?.[0]?.tx_hash || ""}
          projectId={projectDetail.blockchainId}
        />
      )}

      {/* Audit Trail */}
      {projectDetail.isBlockchain ? (
        <AuditTrail projectId={projectDetail.blockchainId} />
      ) : (
        <Card className="bg-white border-purple-100">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-purple-900 flex items-center">
              <ExternalLink className="h-5 w-5 mr-2" />
              Verifiable Project History
            </CardTitle>
            <p className="text-sm text-gray-600">All project events are recorded on-chain for transparency</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(projectDetail.audit_trail || []).map((event, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium text-gray-900">{event.event}</p>
                    <p className="text-sm text-gray-600 mb-2">{new Date(event.timestamp).toLocaleString()}</p>
                    <a
                      href={`https://sepolia.etherscan.io/tx/${event.tx_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 font-medium"
                    >
                      Transaction Hash: {event.tx_hash.slice(0, 10)}...{event.tx_hash.slice(-8)}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {projectDetail.carbon_credits && (
        <Card className="bg-white border-yellow-100">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-yellow-900 flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Carbon Credit Ledger
            </CardTitle>
            <p className="text-sm text-gray-600">Detailed tracking of all issued carbon credits</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Token ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Issuance Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Vintage Year</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Current Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Owner's Wallet</th>
                  </tr>
                </thead>
                <tbody>
                  {projectDetail.carbon_credits.map((credit, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-mono text-sm text-gray-900">{credit.token_id}</td>
                      <td className="py-3 px-4 text-gray-600">{credit.issuance_date}</td>
                      <td className="py-3 px-4 text-gray-600">{credit.vintage_year}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant="outline"
                          className={
                            credit.status === "Available"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : credit.status === "Listed for Sale"
                                ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                : "bg-gray-100 text-gray-800 border-gray-200"
                          }
                        >
                          {credit.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-mono text-sm text-gray-600">{credit.owner_wallet}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project Impact */}
      <Card className="bg-white border-green-100">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-green-900">Verified Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Environmental Benefits */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-900 mb-4">Environmental Benefits</h3>
              <div className="space-y-3 text-left">
                <div>
                  <p className="text-sm font-medium text-gray-600">CO₂ Sequestered</p>
                  <p className="text-lg font-bold text-green-800">
                    {projectDetail.impact?.environmental?.co2_sequestered || 1500} Tonnes
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Biodiversity Index</p>
                  <p className="text-lg font-bold text-green-800">
                    {projectDetail.impact?.environmental?.biodiversity_index || "High"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Coastal Erosion Reduction</p>
                  <p className="text-lg font-bold text-green-800">
                    {projectDetail.impact?.environmental?.erosion_reduction || "Significant"}
                  </p>
                </div>
              </div>
            </div>

            {/* Economic Benefits */}
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-yellow-900 mb-4">Economic Benefits</h3>
              <div className="space-y-3 text-left">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Credits Generated</p>
                  <p className="text-lg font-bold text-yellow-800">
                    {projectDetail.impact?.economic?.credits_generated || 1500}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Estimated Value</p>
                  <p className="text-lg font-bold text-yellow-800">
                    ₹{(projectDetail.impact?.economic?.estimated_value_inr || 1800000).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Local Jobs Supported</p>
                  <p className="text-lg font-bold text-yellow-800">
                    {projectDetail.impact?.economic?.jobs_supported || 45}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Benefits */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Social Benefits</h3>
              <div className="space-y-3 text-left">
                <div>
                  <p className="text-sm font-medium text-gray-600">Community Impact</p>
                  <p className="text-lg font-bold text-blue-800">
                    {projectDetail.impact?.social?.community_livelihoods || "Supported"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">UN SDG Alignment</p>
                  <div className="flex space-x-2 mt-2">
                    {(projectDetail.impact?.social?.sdg_alignment || ["SDG 13", "SDG 14"]).map((sdg) => (
                      <Badge key={sdg} variant="outline" className="border-blue-300 text-blue-700">
                        {sdg}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
