import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Here you would typically use a scraping library like cheerio or puppeteer
    // For now, we'll simulate a response with some basic data
    const response = await fetch(url);
    const html = await response.text();
    
    // Basic metadata extraction (you can enhance this based on your needs)
    const title = html.match(/<title>(.*?)<\/title>/i)?.[1] || 'No title found';
    const description = html.match(/<meta name="description" content="(.*?)"/i)?.[1] || 'No description found';
    
    return NextResponse.json({
      url,
      title,
      description,
      status: response.status,
      contentType: response.headers.get('content-type'),
      rawHtml: html,
    });
  } catch (error) {
    console.error('Error scraping website:', error);
    return NextResponse.json(
      { error: 'Failed to scrape website' },
      { status: 500 }
    );
  }
} 