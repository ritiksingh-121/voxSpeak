import { NextRequest, NextResponse } from 'next/server'

const GROQ_STT_URL = 'https://api.groq.com/openai/v1/audio/transcriptions'
const MODEL = 'whisper-large-v3'
const API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: 'Groq API key not configured. Add GROQ_API_KEY to .env.local' },
      { status: 500 },
    )
  }

  try {
    const formData = await request.formData()
    const audioFile = formData.get('file')

    if (!audioFile || !(audioFile instanceof Blob)) {
      return NextResponse.json({ error: 'Audio file is required' }, { status: 400 })
    }

    const groqForm = new FormData()
    groqForm.append('model', MODEL)
    groqForm.append('file', audioFile, 'recording.webm')
    groqForm.append('response_format', 'json')

    const response = await fetch(GROQ_STT_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: groqForm,
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('Groq STT error:', response.status, errorBody)
      return NextResponse.json(
        { error: `Groq STT error: ${response.status}` },
        { status: response.status },
      )
    }

    const data = await response.json()
    const transcript = data.text || ''

    const durationInSeconds = 0

    return NextResponse.json({ transcript, audioUrl: '', duration: durationInSeconds })
  } catch (error) {
    console.error('Groq STT error:', error)
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 },
    )
  }
}
