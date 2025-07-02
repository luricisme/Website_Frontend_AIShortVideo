import { NextRequest, NextResponse } from 'next/server';
import { renderMediaOnLambda } from '@remotion/lambda/client';
import { v4 as uuidv4 } from 'uuid';

const FUNCTION_NAME = 'remotion-render-4-0-321-mem2048mb-disk2048mb-120sec'; // Thay bằng tên function bạn deploy
const REGION = 'us-east-1';
const SITE_ID = 'xyz789';
const BUCKET_NAME = 'remotionlambda-useast1-abc123';

export async function POST(req: NextRequest) {
    const { videoData } = await req.json();

    const { renderId } = await renderMediaOnLambda({
        functionName: FUNCTION_NAME,
        serveUrl: `s3://${BUCKET_NAME}/sites/${SITE_ID}`,
        region: REGION,
        composition: 'VideoComposition',
        inputProps: videoData,
        codec: 'h264',
        outName: `video-${uuidv4()}.mp4`,
        privacy: 'public',
    });

    return NextResponse.json({ renderId });
}
