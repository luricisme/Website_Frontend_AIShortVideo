import { NextRequest, NextResponse } from 'next/server';
import { getRenderProgress } from '@remotion/lambda/client';

const FUNCTION_NAME = 'remotion-render-4-0-xxx';
const REGION = 'us-east-1';

export async function POST(req: NextRequest) {
    const { renderId } = await req.json();

    const progress = await getRenderProgress({
        functionName: FUNCTION_NAME,
        region: REGION,
        renderId,
    });

    if (progress.done && progress.outKey && progress.bucketName) {
        const url = `https://${progress.bucketName}.s3.${REGION}.amazonaws.com/${progress.outKey}`;
        return NextResponse.json({ done: true, url });
    }

    return NextResponse.json({ done: false, progress });
}
