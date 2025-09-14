import { NextRequest, NextResponse } from 'next/server';
import { blockchainService, ProjectRegistrationData } from '@/lib/blockchain';

export async function POST(request: NextRequest) {
  try {
    // Get the data from the form
    const data = await request.formData();
    const projectName = data.get('projectName') as string;
    const location = data.get('location') as string;
    const implementingBody = data.get('implementingBody') as string;
    const areaHectares = Number(data.get('areaHectares'));
    const startDate = data.get('startDate') as string;
    const projectType = data.get('projectType') as string;

    // Validate required fields
    if (!projectName || !location || !implementingBody || !areaHectares || !startDate || !projectType) {
      return NextResponse.json(
        { status: 'error', message: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Prepare project data
    const projectData: ProjectRegistrationData = {
      projectName,
      location,
      implementingBody,
      areaHectares,
      startDate,
      projectType,
    };

    // Register project on blockchain
    const transactionHash = await blockchainService.registerProject(projectData);

    // Return success response
    return NextResponse.json({
      status: 'success',
      message: 'Project registered successfully on the blockchain!',
      transactionHash,
      projectData: {
        ...projectData,
        areaHectares: areaHectares.toString(),
      },
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: error.message || 'Failed to register project on blockchain' 
      },
      { status: 500 }
    );
  }
}

// Handle GET requests to fetch project data
export async function GET() {
  try {
    const projects = await blockchainService.getAllProjects();
    const projectCount = await blockchainService.getProjectCount();

    return NextResponse.json({
      status: 'success',
      data: {
        projects,
        totalCount: projectCount,
      },
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: error.message || 'Failed to fetch projects from blockchain' 
      },
      { status: 500 }
    );
  }
}
