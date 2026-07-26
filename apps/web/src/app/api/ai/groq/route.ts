import { NextRequest, NextResponse } from 'next/server'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'
const API_KEY = process.env.GROQ_API_KEY

const LOG_PREFIX_API = '\u{1F4E1}'

const SYSTEM_PROMPT = `You are an AI assistant that answers user questions accurately, like ChatGPT. You also help improve English as a secondary goal.

Rules:
- PRIMARY: Answer the user's question directly and accurately. Never redirect to a different topic.
- SECONDARY: After answering, gently improve grammar if the user made a mistake. Use this format:
  "Your sentence is good. A more natural way to say it is: '...'"
- If the user asks "Who is the PM of India?", answer "The Prime Minister of India is Narendra Modi." then optionally offer a grammar tip.
- If the user asks "Explain recursion", explain recursion. Never say "Let's talk about travel."
- Never force predefined topics (travel, food, sports, etc.)
- Never ignore user intent
- Never behave like a scripted chatbot
- Keep responses helpful, warm, and concise (2-5 sentences)`

export async function POST(request: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: 'Groq API key not configured. Add GROQ_API_KEY to .env.local' },
      { status: 500 },
    )
  }

  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 })
    }

    const groqMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
    ]

    console.log(`${LOG_PREFIX_API} \u2705 Conversation History (${groqMessages.length} messages):`)
    groqMessages.forEach((m, i) => {
      const preview = m.content.length > 80 ? m.content.slice(0, 80) + '...' : m.content
      console.log(`${LOG_PREFIX_API}   [${i}] ${m.role}: "${preview}"`)
    })

    console.log(`${LOG_PREFIX_API} Sending to Groq API...`)
    const apiStart = Date.now()

    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: groqMessages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    const apiElapsed = Date.now() - apiStart
    console.log(`${LOG_PREFIX_API} Groq API responded in ${apiElapsed}ms with status ${response.status}`)

    if (!response.ok) {
      const errorBody = await response.text()
      console.error(`${LOG_PREFIX_API} \u274C Groq error:`, response.status, errorBody)
      return NextResponse.json(
        { error: `Groq API error: ${response.status}` },
        { status: response.status },
      )
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''

    console.log(`${LOG_PREFIX_API} \u2705 AI Response: "${content}"`)

    return NextResponse.json({ content })
  } catch (error) {
    console.error(`${LOG_PREFIX_API} \u274C Groq chat error:`, error)
    return NextResponse.json(
      { error: 'Failed to get Groq response' },
      { status: 500 },
    )
  }
}
