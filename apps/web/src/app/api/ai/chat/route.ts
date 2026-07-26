import { NextRequest, NextResponse } from 'next/server'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = process.env.OPENROUTER_MODEL || 'gpt-4o-mini'
const API_KEY = process.env.OPENROUTER_API_KEY

const SYSTEM_PROMPT = `You are a helpful, concise English conversation coach. Rules:
- Answer the user's question directly and naturally — if they ask "what is your name", just say your name
- Only ask a follow-up question if the user's message is vague or short; otherwise just respond naturally
- Keep responses 1-3 sentences — don't ramble
- If the user makes grammar mistakes, gently model correct usage in your response
- Stay on topic unless the user changes it
- Never correct the user directly — rephrase naturally instead
- Be warm but brief`

export async function POST(request: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: 'OpenRouter API key not configured. Add OPENROUTER_API_KEY to .env.local' },
      { status: 500 },
    )
  }

  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 })
    }

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'VoxSpeak',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('OpenRouter error:', response.status, errorBody)
      return NextResponse.json(
        { error: `OpenRouter API error: ${response.status}` },
        { status: response.status },
      )
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''

    return NextResponse.json({ content })
  } catch (error) {
    console.error('OpenRouter chat error:', error)
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 },
    )
  }
}
