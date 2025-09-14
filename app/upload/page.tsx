"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, ExternalLink, Upload, MapPin, Calendar, Users, Leaf } from "lucide-react"
import { WalletConnection } from "@/components/wallet-connection"
import Link from "next/link"

export default function UploadPage() {
  const [status, setStatus] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    projectName: "",
    location: "",
    implementingBody: "",
    areaHectares: "",
    startDate: "",
    projectType: "",
    expectedCO2Sequestration: "",
    projectDuration: "",
    description: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setStatus("Submitting to the blockchain... Please wait.")

    try {
      const response = await fetch('/api/submit-project', {
        method: 'POST',
        body: new FormData(event.currentTarget),
      })

      const result = await response.json()

      if (result.status === 'success') {
        const etherscanLink = `https://sepolia.etherscan.io/tx/${result.transactionHash}`
        setStatus(`Success! Project registered on blockchain. Transaction: ${result.transactionHash}`)
        
        // Reset form
        setFormData({
          projectName: "",
          location: "",
          implementingBody: "",
          areaHectares: "",
          startDate: "",
          projectType: "",
          expectedCO2Sequestration: "",
          projectDuration: "",
          description: "",
        })
      } else {
        setStatus(`Error: ${result.message}`)
      }
    } catch (error: any) {
      setStatus(`Submission failed: ${error.message}`)
    } finally {
      setIsLoading(false)
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
              <Link href="/" className="flex items-center space-x-2">
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
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-4">
              <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
                Dashboard
              </Link>
              <Link href="/admin" className="text-blue-600 hover:text-blue-800 font-medium">
                Admin Tools
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-white border-blue-100 shadow-lg">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
                <Upload className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-blue-900 mb-2">
              Register Blue Carbon Project
            </CardTitle>
            <p className="text-gray-600">
              Submit your coastal ecosystem restoration project for blockchain verification
            </p>
          </CardHeader>

          <CardContent>
            {/* Wallet Connection Section */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Connect Your Wallet</h3>
              <p className="text-sm text-blue-700 mb-4">
                Connect your MetaMask wallet to register projects on the blockchain
              </p>
              <WalletConnection />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Project Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                  Project Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="projectName">Project Name *</Label>
                    <Input
                      id="projectName"
                      name="projectName"
                      value={formData.projectName}
                      onChange={(e) => handleInputChange("projectName", e.target.value)}
                      placeholder="e.g., Sundarbans Mangrove Restoration"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location (State) *</Label>
                    <Select
                      value={formData.location}
                      onValueChange={(value) => handleInputChange("location", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="West Bengal">West Bengal</SelectItem>
                        <SelectItem value="Odisha">Odisha</SelectItem>
                        <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
                        <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                        <SelectItem value="Kerala">Kerala</SelectItem>
                        <SelectItem value="Karnataka">Karnataka</SelectItem>
                        <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="Gujarat">Gujarat</SelectItem>
                        <SelectItem value="Goa">Goa</SelectItem>
                        <SelectItem value="Andaman & Nicobar">Andaman & Nicobar</SelectItem>
                        <SelectItem value="Lakshadweep">Lakshadweep</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="implementingBody">Implementing Body *</Label>
                  <Input
                    id="implementingBody"
                    name="implementingBody"
                    value={formData.implementingBody}
                    onChange={(e) => handleInputChange("implementingBody", e.target.value)}
                    placeholder="e.g., Coastal Forest Department, NGO Name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe the project objectives, methodology, and expected outcomes..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-green-600" />
                  Project Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="areaHectares">Area (Hectares) *</Label>
                    <Input
                      id="areaHectares"
                      name="areaHectares"
                      type="number"
                      value={formData.areaHectares}
                      onChange={(e) => handleInputChange("areaHectares", e.target.value)}
                      min="0.1"
                      step="0.1"
                      placeholder="e.g., 25.5"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Project Start Date *</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange("startDate", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectType">Project Type *</Label>
                  <Select
                    value={formData.projectType}
                    onValueChange={(value) => handleInputChange("projectType", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Project Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mangrove Afforestation">Mangrove Afforestation</SelectItem>
                      <SelectItem value="Mangrove Restoration">Mangrove Restoration</SelectItem>
                      <SelectItem value="Seagrass Restoration">Seagrass Restoration</SelectItem>
                      <SelectItem value="Salt Marsh Restoration">Salt Marsh Restoration</SelectItem>
                      <SelectItem value="Coastal Wetland Restoration">Coastal Wetland Restoration</SelectItem>
                      <SelectItem value="Marine Protected Area">Marine Protected Area</SelectItem>
                      <SelectItem value="Other Blue Carbon Project">Other Blue Carbon Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Leaf className="h-5 w-5 mr-2 text-teal-600" />
                  Additional Project Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="expectedCO2Sequestration">Expected CO₂ Sequestration (tons/year)</Label>
                    <Input
                      id="expectedCO2Sequestration"
                      name="expectedCO2Sequestration"
                      type="number"
                      value={formData.expectedCO2Sequestration}
                      onChange={(e) => handleInputChange("expectedCO2Sequestration", e.target.value)}
                      min="0"
                      step="0.1"
                      placeholder="e.g., 125.5"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="projectDuration">Project Duration (years)</Label>
                    <Input
                      id="projectDuration"
                      name="projectDuration"
                      type="number"
                      value={formData.projectDuration}
                      onChange={(e) => handleInputChange("projectDuration", e.target.value)}
                      min="1"
                      max="100"
                      placeholder="e.g., 10"
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 text-white font-semibold py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting to Blockchain...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5" />
                    Submit to Blockchain Registry
                  </>
                )}
              </Button>
            </form>

            {/* Status Message */}
            {status && (
              <Alert className={`mt-6 ${status.includes('Success') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <div className="flex items-center">
                  {status.includes('Success') ? (
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  ) : (
                    <ExternalLink className="h-4 w-4 text-red-600 mr-2" />
                  )}
                  <AlertDescription className={status.includes('Success') ? 'text-green-800' : 'text-red-800'}>
                    {status}
                  </AlertDescription>
                </div>
              </Alert>
            )}

            {/* Information Box */}
            <Card className="mt-8 bg-gray-50 border-gray-200">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  About Blue Carbon MRV
                </h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• All project data is stored immutably on the blockchain</li>
                  <li>• Smart contracts automatically calculate carbon credits</li>
                  <li>• Field verification through mobile apps and drone data</li>
                  <li>• Transparent and auditable carbon credit generation</li>
                  <li>• Integration with National Carbon Credit Registry (NCCR)</li>
                </ul>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
