


import { NextResponse, NextRequest } from 'next/server';
import { auth } from 'utils/auth';

export async function PUT(req: NextRequest) {
    try {
        const session = await auth();
        console.log('ss', session?.accessToken)
        const res = await fetch(
            `https://api.github.com/user/starred/UsmanDev09/nextjs-saas`,
            {
                method: 'PUT', 
                headers: {
                    'Authorization': `Bearer ${session?.accessToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Length': '0', 
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            }
        );
          const jsonRes = await res.json()

          console.log(jsonRes)
      return NextResponse.json(
        { message: 'Successfull' },
        { status: 200 },
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        return NextResponse.json(
          { error: `Failed to send email: ${error.message}` },
          { status: 500 },
        );
      }
  
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 },
      );
    }
  }
  