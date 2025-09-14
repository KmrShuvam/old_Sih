import { ethers } from 'ethers';

// Smart Contract ABI for AquaCred Registry
export const AQUACRED_CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "projectId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "projectName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "implementingBody",
        "type": "string"
      }
    ],
    "name": "ProjectRegistered",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_projectName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_location",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_implementingBody",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_areaHectares",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_startDate",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_projectType",
        "type": "string"
      }
    ],
    "name": "registerProject",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "projectId",
        "type": "uint256"
      }
    ],
    "name": "getProject",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "projectId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "projectName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "location",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "implementingBody",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "areaHectares",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "startDate",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "projectType",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "isInitialized",
            "type": "bool"
          }
        ],
        "internalType": "struct AquaCredRegistry.Project",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getProjectCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "projectCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "projects",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "projectId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "projectName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "location",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "implementingBody",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "areaHectares",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "startDate",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "projectType",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "isInitialized",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Project interface matching the smart contract structure
export interface BlockchainProject {
  projectId: number;
  projectName: string;
  location: string;
  implementingBody: string;
  areaHectares: number;
  startDate: number;
  projectType: string;
  isInitialized: boolean;
}

// Project registration data interface
export interface ProjectRegistrationData {
  projectName: string;
  location: string;
  implementingBody: string;
  areaHectares: number;
  startDate: string;
  projectType: string;
}

// Blockchain service class
export class BlockchainService {
  private provider: ethers.JsonRpcProvider | ethers.BrowserProvider | null = null;
  private contract: ethers.Contract | null = null;
  private wallet: ethers.Wallet | null = null;

  constructor() {
    this.initializeProvider();
  }

  private initializeProvider() {
    try {
      // Check if we're in a browser environment with MetaMask
      if (typeof window !== 'undefined' && window.ethereum) {
        this.provider = new ethers.BrowserProvider(window.ethereum);
      } else if (process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL) {
        // Fallback to RPC provider for server-side operations
        this.provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL);
      }
    } catch (error) {
      console.error('Failed to initialize blockchain provider:', error);
    }
  }

  // Initialize contract with provider
  private async initializeContract() {
    if (!this.provider) {
      throw new Error('Blockchain provider not initialized');
    }

    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    if (!contractAddress) {
      throw new Error('Contract address not configured');
    }

    this.contract = new ethers.Contract(contractAddress, AQUACRED_CONTRACT_ABI, this.provider);
  }

  // Initialize wallet for write operations
  private async initializeWallet() {
    if (!this.provider) {
      throw new Error('Blockchain provider not initialized');
    }

    const privateKey = process.env.OWNER_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('Owner private key not configured');
    }

    this.wallet = new ethers.Wallet(privateKey, this.provider);
    this.contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
      AQUACRED_CONTRACT_ABI,
      this.wallet
    );
  }

  // Connect to MetaMask
  async connectWallet(): Promise<string> {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask not detected');
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      this.provider = new ethers.BrowserProvider(window.ethereum);
      await this.initializeContract();

      return accounts[0];
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  // Get all projects from blockchain
  async getAllProjects(): Promise<BlockchainProject[]> {
    if (!this.contract) {
      await this.initializeContract();
    }

    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const projectCountBigInt = await this.contract.getProjectCount();
      const projectCount = Number(projectCountBigInt);
      
      const projects: BlockchainProject[] = [];

      for (let i = 1; i <= projectCount; i++) {
        const project = await this.contract.getProject(i);
        projects.push({
          projectId: Number(project.projectId),
          projectName: project.projectName,
          location: project.location,
          implementingBody: project.implementingBody,
          areaHectares: Number(project.areaHectares),
          startDate: Number(project.startDate),
          projectType: project.projectType,
          isInitialized: project.isInitialized,
        });
      }

      return projects;
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      throw error;
    }
  }

  // Get project count
  async getProjectCount(): Promise<number> {
    if (!this.contract) {
      await this.initializeContract();
    }

    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const projectCountBigInt = await this.contract.getProjectCount();
      return Number(projectCountBigInt);
    } catch (error) {
      console.error('Failed to get project count:', error);
      throw error;
    }
  }

  // Register a new project
  async registerProject(projectData: ProjectRegistrationData): Promise<string> {
    if (!this.contract) {
      await this.initializeWallet();
    }

    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      // Convert date to Unix timestamp
      const startDateTimestamp = Math.floor(new Date(projectData.startDate).getTime() / 1000);

      const tx = await this.contract.registerProject(
        projectData.projectName,
        projectData.location,
        projectData.implementingBody,
        projectData.areaHectares,
        startDateTimestamp,
        projectData.projectType
      );

      // Wait for transaction confirmation
      await tx.wait();

      return tx.hash;
    } catch (error) {
      console.error('Failed to register project:', error);
      throw error;
    }
  }

  // Get project by ID
  async getProject(projectId: number): Promise<BlockchainProject> {
    if (!this.contract) {
      await this.initializeContract();
    }

    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const project = await this.contract.getProject(projectId);
      return {
        projectId: Number(project.projectId),
        projectName: project.projectName,
        location: project.location,
        implementingBody: project.implementingBody,
        areaHectares: Number(project.areaHectares),
        startDate: Number(project.startDate),
        projectType: project.projectType,
        isInitialized: project.isInitialized,
      };
    } catch (error) {
      console.error('Failed to get project:', error);
      throw error;
    }
  }

  // Listen for project registration events
  async listenForProjectRegistrations(callback: (project: BlockchainProject) => void) {
    if (!this.contract) {
      await this.initializeContract();
    }

    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    this.contract.on('ProjectRegistered', async (projectId, projectName, implementingBody) => {
      try {
        const project = await this.getProject(Number(projectId));
        callback(project);
      } catch (error) {
        console.error('Failed to fetch project details after registration:', error);
      }
    });
  }

  // Stop listening for events
  removeAllListeners() {
    if (this.contract) {
      this.contract.removeAllListeners();
    }
  }
}

// Utility functions
export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString();
};

export const calculateEstimatedCO2 = (hectares: number, projectType: string): number => {
  // Rough estimates for CO2 sequestration per hectare per year
  const sequestrationRates: { [key: string]: number } = {
    'Mangrove Afforestation': 12,
    'Mangrove Restoration': 10,
    'Seagrass Restoration': 8,
    'Salt Marsh Restoration': 6,
    'Coastal Wetland Restoration': 7,
    'Marine Protected Area': 5,
    'Other Blue Carbon Project': 8,
  };

  const rate = sequestrationRates[projectType] || 8;
  return Math.floor(hectares * rate);
};

export const getEtherscanUrl = (txHash: string, network: string = 'sepolia'): string => {
  return `https://${network}.etherscan.io/tx/${txHash}`;
};

// Global blockchain service instance
export const blockchainService = new BlockchainService();
