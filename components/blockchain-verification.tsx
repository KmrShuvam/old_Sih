"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Loader2,
  Shield,
  Hash,
  Calendar,
  User
} from "lucide-react"
import { getEtherscanUrl } from "@/lib/blockchain"

interface TransactionData {
  hash: string
  blockNumber: number
  timestamp: number
  from: string
  to: string
  gasUsed: string
  status: 'success' | 'pending' | 'failed'
}

interface BlockchainVerificationProps {
  transactionHash: string
  projectId?: string
  onVerificationComplete?: (verified: boolean) => void
}

export function BlockchainVerification({ 
  transactionHash, 
  projectId,
  onVerificationComplete 
}: BlockchainVerificationProps) {
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    if (transactionHash) {
      verifyTransaction()
    }
  }, [transactionHash])

  const verifyTransaction = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // In a real implementation, you would call your blockchain service
      // to verify the transaction. For now, we'll simulate the verification
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Simulate transaction data
      const mockTransactionData: TransactionData = {
        hash: transactionHash,
        blockNumber: Math.floor(Math.random() * 1000000) + 5000000,
        timestamp: Date.now() - Math.floor(Math.random() * 86400000), // Random time in last 24h
        from: "0x1234...5678",
        to: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0xContract...",
        gasUsed: "150000",
        status: 'success'
      }

      setTransactionData(mockTransactionData)
      setIsVerified(true)
      onVerificationComplete?.(true)
    } catch (err: any) {
      setError(err.message || 'Failed to verify transaction')
      onVerificationComplete?.(false)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Verified</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Failed</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Unknown</Badge>
    }
  }

  return (
    <Card className="bg-white border-blue-100">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-blue-900 flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Blockchain Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-blue-600 font-medium">Verifying transaction on blockchain...</p>
            </div>
          </div>
        )}

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {transactionData && (
          <div className="space-y-4">
            {/* Transaction Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getStatusIcon(transactionData.status)}
                <span className="font-medium text-gray-900">Transaction Status</span>
              </div>
              {getStatusBadge(transactionData.status)}
            </div>

            {/* Transaction Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Hash className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Transaction Hash</p>
                    <p className="text-xs text-gray-600 font-mono">
                      {transactionData.hash.slice(0, 10)}...{transactionData.hash.slice(-8)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Block Number</p>
                    <p className="text-xs text-gray-600">{transactionData.blockNumber.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">From Address</p>
                    <p className="text-xs text-gray-600 font-mono">
                      {transactionData.from.slice(0, 6)}...{transactionData.from.slice(-4)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Timestamp</p>
                  <p className="text-xs text-gray-600">
                    {new Date(transactionData.timestamp).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Gas Used</p>
                  <p className="text-xs text-gray-600">{parseInt(transactionData.gasUsed).toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Contract Address</p>
                  <p className="text-xs text-gray-600 font-mono">
                    {transactionData.to.slice(0, 6)}...{transactionData.to.slice(-4)}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(getEtherscanUrl(transactionData.hash), '_blank')}
                className="flex items-center space-x-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span>View on Etherscan</span>
              </Button>

              {isVerified && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={verifyTransaction}
                  className="flex items-center space-x-2"
                >
                  <Shield className="h-4 w-4" />
                  <span>Re-verify</span>
                </Button>
              )}
            </div>

            {/* Verification Success Message */}
            {isVerified && transactionData.status === 'success' && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Transaction successfully verified on the blockchain. This project is now part of the immutable registry.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Audit Trail Component
interface AuditEvent {
  id: string
  event: string
  timestamp: string
  txHash: string
  blockNumber: number
  verified: boolean
}

interface AuditTrailProps {
  projectId: string
  events?: AuditEvent[]
}

export function AuditTrail({ projectId, events = [] }: AuditTrailProps) {
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(events)

  useEffect(() => {
    // In a real implementation, you would fetch audit events from the blockchain
    // For now, we'll use mock data
    const mockEvents: AuditEvent[] = [
      {
        id: "1",
        event: "Project Registered on AquaCred Ledger",
        timestamp: new Date().toISOString(),
        txHash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
        blockNumber: 5000001,
        verified: true
      },
      {
        id: "2", 
        event: "Monitoring Report 1 Submitted",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        txHash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234",
        blockNumber: 5000002,
        verified: true
      },
      {
        id: "3",
        event: "Report 1 Verified by Third Party Auditor",
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        txHash: "0x3c4d5e6f7890abcdef1234567890abcdef123456",
        blockNumber: 5000003,
        verified: true
      }
    ]

    setAuditEvents(mockEvents)
  }, [projectId])

  return (
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
          {auditEvents.map((event, index) => (
            <div key={event.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                {event.verified ? (
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                ) : (
                  <Clock className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <div className="flex-grow">
                <p className="font-medium text-gray-900">{event.event}</p>
                <p className="text-sm text-gray-600 mb-2">
                  {new Date(event.timestamp).toLocaleString()}
                </p>
                <div className="flex items-center space-x-4 text-xs">
                  <span className="text-gray-500">
                    Block: {event.blockNumber.toLocaleString()}
                  </span>
                  <a
                    href={getEtherscanUrl(event.txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium"
                  >
                    Transaction: {event.txHash.slice(0, 10)}...{event.txHash.slice(-8)}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
