import { NextRequest, NextResponse } from 'next/server';

const SHOTSTACK_API_URL = 'https://api.shotstack.io/stage/render/';
const API_KEY = process.env.SHOTSTACK_API_KEY!;

export async function POST(req: NextRequest) {
    const { renderId } = await req.json();

    const res = await fetch(`${SHOTSTACK_API_URL}${renderId}`, {
        headers: { 'x-api-key': API_KEY },
    });

    const data = await res.json();
    return NextResponse.json(data);
}
