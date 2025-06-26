import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // 既にCookieがある場合はスキップ
  if (request.cookies.get('i18next')) {
    return response;
  }

  try {
    // IPアドレスを取得
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded ? forwarded.split(',')[0] : realIp || '127.0.0.1';
    
    // ローカル開発環境の場合は日本語をデフォルト
    if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.')) {
      response.cookies.set('i18next', 'ja', { 
        path: '/', 
        maxAge: 60 * 60 * 24 * 365 // 1年
      });
      return response;
    }

    // IPジオロケーションAPIで国を判定
    const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: {
        'User-Agent': 'LinClone/1.0'
      }
    });
    
    if (geoResponse.ok) {
      const geoData = await geoResponse.json();
      const country = geoData.country_code;
      const language = country === 'JP' ? 'ja' : 'en';
      
      response.cookies.set('i18next', language, { 
        path: '/', 
        maxAge: 60 * 60 * 24 * 365 // 1年
      });
    } else {
      // API失敗時は日本語をデフォルト
      response.cookies.set('i18next', 'ja', { 
        path: '/', 
        maxAge: 60 * 60 * 24 * 365 
      });
    }
  } catch (error) {
    // エラー時は日本語をデフォルト
    response.cookies.set('i18next', 'ja', { 
      path: '/', 
      maxAge: 60 * 60 * 24 * 365 
    });
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 