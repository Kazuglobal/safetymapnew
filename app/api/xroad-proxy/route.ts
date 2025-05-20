import { NextResponse } from 'next/server';

const XROAD_API_BASE_URL = 'https://api.jartic-open-traffic.org/geoserver';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const externalApiUrl = new URL(XROAD_API_BASE_URL);

    // クライアントからのクエリパラメータを外部APIのURLに追加
    searchParams.forEach((value, key) => {
      externalApiUrl.searchParams.append(key, value);
    });

    console.log(`[XRoad Proxy] Requesting to: ${externalApiUrl.toString()}`); // 送信するURLをログに出力

    const response = await fetch(externalApiUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 必要に応じて他のヘッダーを追加
      },
    });

    if (!response.ok) {
      const errorText = await response.text(); // エラーレスポンスの本文も取得してみる
      console.error(`[XRoad Proxy] Error from external API (${response.status} ${response.statusText}): ${errorText}`);
      return NextResponse.json(
        { error: `External API Error: ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('[XRoad Proxy] Internal proxy error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 