
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const contentType =
      request.headers.get('content-type') || '';

    let fields: Record<string, string> = {};

    if (contentType.includes('application/json')) {
      const body = await request.json();

      if (body && typeof body === 'object') {
        fields = Object.fromEntries(
          Object.entries(body).map(([key, value]) => [
            key,
            String(value ?? ''),
          ])
        );
      }
    } else {
      const rawBody = await request.text();
      fields = Object.fromEntries(
        new URLSearchParams(rawBody).entries()
      );
    }

    const checkoutId = fields.checkoutId || '';

    // A checkout ID is used only to look up the payment.
    // This redirect does not confirm that payment succeeded.
    if (!/^[a-zA-Z0-9_-]{1,128}$/.test(checkoutId)) {
      return NextResponse.redirect(
        new URL('/payment', request.url),
        303
      );
    }

    const destination = new URL('/payment', request.url);
    destination.searchParams.set('session_id', checkoutId);
    destination.searchParams.set('return', 'received');

    return NextResponse.redirect(destination, 303);
  } catch (error) {
    console.error(
      'Peach return handler error:',
      error instanceof Error ? error.message : 'Unknown error'
    );

    return NextResponse.redirect(
      new URL('/payment', request.url),
      303
    );
  }
}

