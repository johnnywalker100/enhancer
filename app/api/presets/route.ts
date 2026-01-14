import { NextResponse } from 'next/server';
import { getAllPresets } from '@/lib/presets';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const presets = getAllPresets();
    return NextResponse.json({ presets });
  } catch (error: any) {
    console.error('Presets API error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: error.message,
    }, { status: 500 });
  }
}
