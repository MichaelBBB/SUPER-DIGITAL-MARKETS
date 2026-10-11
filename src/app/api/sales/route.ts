import { NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';

const SALES_FILE = path.join(process.cwd(), 'data', 'sales.json');

export async function POST(request: Request) {
  try {
    const sale = await request.json();
    
    // Ensure data directory exists
    const { mkdir } = await import('fs/promises');
    await mkdir(path.dirname(SALES_FILE), { recursive: true });
    
    // Read existing sales
    let sales: any[] = [];
    try {
      const data = await readFile(SALES_FILE, 'utf8');
      sales = JSON.parse(data);
    } catch {
      // File doesn't exist yet
    }
    
    // Add new sale
    sales.push({
      ...sale,
      timestamp: new Date().toISOString()
    });
    
    // Write back
    await writeFile(SALES_FILE, JSON.stringify(sales, null, 2));
    
    return NextResponse.json({ success: true, totalSales: sales.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    let sales: any[] = [];
    try {
      const data = await readFile(SALES_FILE, 'utf8');
      sales = JSON.parse(data);
    } catch {
      // File doesn't exist
    }
    
    return NextResponse.json({ sales, totalSales: sales.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
