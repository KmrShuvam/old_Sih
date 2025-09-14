"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Wallet, 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle, 
  Copy,
  LogOut
} from "lucide-react"
import { blockchainService } from "@/lib/blockchain"

interface WalletConnectionProps {
  onWalletConnected?: (address: string) => void
  onWalletDisconnected?: () => void
}

export function WalletConnection({ onWalletConnected, onWalletDisconnected }: WalletConnectionProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [network, setNetwork] = useState<string>("")

  useEffect(() => {
    checkWalletConnection()
    checkNetwork()
  }, [])

  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setWalletAddress(accounts[0])
          setIsConnected(true)
          onWalletConnected?.(accounts[0])
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error)
      }
    }
  }

  const checkNetwork = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' })
        const networkMap: { [key: string]: string } = {
          '0x1': 'Ethereum Mainnet',
          '0xaa36a7': 'Sepolia Testnet',
          '0x89': 'Polygon',
          '0x13881': 'Polygon Mumbai'
        }
        setNetwork(networkMap[chainId] || `Chain ID: ${chainId}`)
      } catch (error) {
        console.error('Error checking network:', error)
      }
    }
  }

  const connectWallet = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      const address = await blockchainService.connectWallet()
      setWalletAddress(address)
      setIsConnected(true)
      onWalletConnected?.(address)
    } catch (error: any) {
      setError(error.message || 'Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setWalletAddress("")
    setIsConnected(false)
    setNetwork("")
    onWalletDisconnected?.()
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getEtherscanUrl = (address: string) => {
    return `https://sepolia.etherscan.io/address/${address}`
  }

  if (!isConnected) {
    return (
      <div className="space-y-4">
        <Button
          onClick={connectWallet}
          disabled={isConnecting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isConnecting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4 mr-2" />
              Connect MetaMask
            </>
          )}
        </Button>

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {typeof window !== 'undefined' && !window.ethereum && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              MetaMask not detected. Please install MetaMask to connect your wallet.
            </AlertDescription>
          </Alert>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm font-medium text-green-900">Wallet Connected</p>
            <p className="text-xs text-green-700 font-mono">{formatAddress(walletAddress)}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={disconnectWallet}
          className="text-green-700 border-green-300 hover:bg-green-100"
        >
          <LogOut className="h-4 w-4 mr-1" />
          Disconnect
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Network:</span>
          <Badge variant="outline" className="text-xs">
            {network}
          </Badge>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyAddress}
            className="flex-1"
          >
            <Copy className="h-4 w-4 mr-1" />
            Copy Address
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(getEtherscanUrl(walletAddress), '_blank')}
            className="flex-1"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            View on Etherscan
          </Button>
        </div>
      </div>
    </div>
  )
}

// Wallet Status Component for displaying in header
export function WalletStatus() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string>("")

  useEffect(() => {
    checkWalletConnection()
    
    // Listen for account changes
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0])
          setIsConnected(true)
        } else {
          setWalletAddress("")
          setIsConnected(false)
        }
      })
    }
  }, [])

  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setWalletAddress(accounts[0])
          setIsConnected(true)
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error)
      }
    }
  }

  if (!isConnected) {
    return null
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      <span className="text-sm text-gray-600 font-mono">
        {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
      </span>
    </div>
  )
}
