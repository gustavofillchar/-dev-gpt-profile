import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function extractRelevantContent(html: string): string {
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : '';

  const descriptionMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i);
  const description = descriptionMatch ? descriptionMatch[1] : '';

  const mainContentMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i) ||
                          html.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ||
                          html.match(/<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
                          html.match(/<div[^>]*id="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i);

  const navMatch = html.match(/<nav[^>]*>([\s\S]*?)<\/nav>/i);

  const footerMatch = html.match(/<footer[^>]*>([\s\S]*?)<\/footer>/i);

  const relevantContent = [
    title,
    description,
    mainContentMatch ? mainContentMatch[1] : '',
    navMatch ? navMatch[1] : '',
    footerMatch ? footerMatch[1] : ''
  ].filter(Boolean).join('\n');

  const cleanContent = relevantContent
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();

  return cleanContent.slice(0, 32000);
}

export async function POST(request: Request) {
  try {
    const { html } = await request.json();

    if (!html) {
      return NextResponse.json(
        { error: 'HTML content is required' },
        { status: 400 }
      );
    }
    
    const relevantContent = extractRelevantContent(html);
    console.log('Extracted content length:', relevantContent.length);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that analyzes website content and creates company profiles. 
          Extract information and return it in the following JSON structure:
          {
            "company_name": string,
            "service_lines": string[],
            "company_description": string,
            "tier1_keywords": string[],
            "tier2_keywords": string[]
          }
          
          Guidelines:
          - company_name: Extract the official company name
          - service_lines: List of main business areas/services (e.g., ["Cybersecurity", "Software Development","Cloud Services","Consulting","Training","IT Services"])
          - company_description: Brief, clear description of the company's main business
          - tier1_keywords: Primary keywords the company would use for government opportunities
          - tier2_keywords: Secondary keywords that might be relevant for government opportunities
          - All text should be in English
          
          Make sure to analyze the content thoroughly and provide accurate, relevant information.`
        },
        {
          role: "user",
          content: `Please analyze this website content and create a company profile: ${relevantContent}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    console.log('OpenAI response received:', completion.choices[0].message.content);

    const analysis = JSON.parse(completion.choices[0].message.content || '{}');
    
    if (!analysis.company_name || !analysis.service_lines || !analysis.company_description) {
      throw new Error('Invalid response structure from OpenAI');
    }

    return NextResponse.json({
      analysis,
    });
  } catch (error) {
    console.error('Detailed error in analyze route:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze content',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 