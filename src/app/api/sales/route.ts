// src/app/api/sales/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const salesFilePath = path.join(process.cwd(), 'data', 'sales.json');
    
    let sales = [];
    try {
      const data = await fs.readFile(salesFilePath, 'utf8');
      sales = JSON.parse(data);
    } catch (e) {
      sales = []; // Return empty array if file doesn't exist yet
    }

    return NextResponse.json({ sales });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load sales' }, { status: 500 });
  }
}
