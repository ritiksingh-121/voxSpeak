# Phase 9 — AI Architecture

## AI Stack
- **LLM**: Ollama (Llama 3.1 8B, Mistral 7B, DeepSeek Coder, Qwen 2.5 7B)
- **Embeddings**: BGE Small / Nomic Embed Text / Sentence Transformers (all-MiniLM-L6-v2)
- **Vector DB**: Qdrant
- **RAG Framework**: LangChain / LlamaIndex (minimal usage — prefer direct API)
- **Prompt Management**: LangChain Hub or custom templates

## Why Local LLMs Over Cloud APIs?

| Factor | Cloud API (GPT-4) | Local LLM (Ollama) |
|---|---|---|
| Cost per million tokens | \$10–\$30 | \$0 (electricity only) |
| Privacy | Data leaves device | Fully private |
| Latency | 200ms–2s + network | 50ms–500ms (GPU) |
| Rate limits | Yes | None |
| Customization | Fine-tuning expensive | Can fine-tune for free |
| Offline | No | Yes |
| Scaling | Pay per use | Pay once for hardware |

**Verdict**: Local LLMs via Ollama are the clear winner for zero-budget, privacy-first, scalable deployment.

## LLM Selection Guide

| Model | Size | RAM | Quality | Use Case |
|---|---|---|---|---|
| Llama 3.1 8B | 8B | 16GB | Excellent | General conversation, grammar |
| Mistral 7B | 7B | 16GB | Very Good | Conversation, faster |
| Qwen 2.5 7B | 7B | 16GB | Excellent | English teaching specialized |
| DeepSeek Coder 7B | 7B | 16GB | Good | Technical English, interview |
| Phi-3 Mini 3.8B | 3.8B | 8GB | Good | Mobile/edge deployment |
| Gemma 2 9B | 9B | 16GB | Very Good | General purpose |

**Recommended default**: Llama 3.1 8B (best quality/resource ratio)

## AI Workflow

```
                    ┌─────────────────────────┐
                    │   User Input (Voice)     │
                    └──────────┬──────────────┘
                               │
                               ▼
                    ┌─────────────────────────┐
                    │   Speech → Text (STT)    │
                    │   Whisper.cpp            │
                    └──────────┬──────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Pre-processing     │
                    │   • Normalize text   │
                    │   • Detect language  │
                    │   • Extract intent   │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
    ┌───────────────┐ ┌──────────────┐ ┌──────────────┐
    │  Grammar      │ │Pronunciation │ │ Vocabulary   │
    │  Engine       │ │ Engine       │ │ Extractor    │
    │  • Check      │ │ • Phoneme    │ │ • New words  │
    │  • Correct    │ │   analysis   │ │ • Context    │
    │  • Explain    │ │ • Error map  │ │ • Difficulty │
    └───────┬───────┘ └──────┬───────┘ └──────┬───────┘
            └────────────────┼────────────────┘
                             ▼
                    ┌─────────────────────────┐
                    │   Memory Retrieval       │
                    │   (RAG from Qdrant)      │
                    │   • Past conversations   │
                    │   • User mistakes        │
                    │   • Weak areas           │
                    │   • Learning goals       │
                    │   • Vocabulary           │
                    └──────────┬──────────────┘
                               │
                               ▼
                    ┌─────────────────────────┐
                    │   Prompt Assembly        │
                    │   • System prompt        │
                    │   • Conversation history │
                    │   • Retrieved context    │
                    │   • User input           │
                    │   • Correction data      │
                    └──────────┬──────────────┘
                               │
                               ▼
                    ┌─────────────────────────┐
                    │   LLM Inference          │
                    │   (Ollama)              │
                    │   • Streaming response   │
                    │   • Structured output    │
                    └──────────┬──────────────┘
                               │
                               ▼
                    ┌─────────────────────────┐
                    │   Post-processing        │
                    │   • Extract corrections  │
                    │   • Calculate scores     │
                    │   • Format feedback      │
                    │   • Generate exercises   │
                    └──────────┬──────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Text → Speech     │
                    │   (Piper/Coqui TTS) │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────────┐
                    │   Response → User        │
                    │   + Audio + Feedback     │
                    │   + XP + Progress        │
                    └─────────────────────────┘
```

## Prompt Engineering

### System Prompt (Conversation Mode)
```
You are VoxSpeak, an AI English speaking coach.
You are friendly, patient, and encouraging.
Your primary goal is to help the user improve their spoken English.

Rules:
1. Always respond in English
2. Adapt your vocabulary to the user's level ({{level}})
3. If the user makes a grammar mistake, naturally model the correct usage in your response
4. Keep responses conversational and natural
5. Ask follow-up questions to keep the conversation flowing
6. Track the conversation topic and steer towards the user's interests ({{interests}})
7. The user's goal is {{goal}}
8. Do NOT over-correct — focus on the most important errors
9. Use simple language for beginners, natural language for advanced
10. Be culturally aware and inclusive

User Profile:
- Level: {{level}}
- Native Language: {{nativeLanguage}}
- Weak Areas: {{weakAreas}}
- Goals: {{goals}}
- Recently Learned: {{vocabulary}}
```

### Grammar Correction Prompt
```
Analyze this English sentence for grammar errors.
For each error found, provide:
1. The incorrect segment
2. The corrected version
3. The grammar rule explanation
4. Difficulty level (easy/medium/hard)

Input: "{{userSentence}}"

Respond in JSON format:
{
  "hasErrors": boolean,
  "errors": [
    {
      "original": "incorrect text",
      "correction": "corrected text",
      "rule": "grammar rule explanation",
      "category": "tense|preposition|article|plural|word_order|other",
      "difficulty": "easy|medium|hard"
    }
  ],
  "overallScore": number (0-100)
}
```

### Pronunciation Feedback Prompt
```
Analyze the pronunciation of this English text.
The user's attempt was transcribed as: "{{userTranscript}}"
The expected text was: "{{expectedText}}"

Identify specific phonemes or words that were mispronounced.
Provide:
1. Words with errors
2. Correct pronunciation (IPA)
3. User's pronunciation (IPA approximation)
4. Improvement tips

Respond in JSON format.
```

### Feedback Generation
```
Based on this conversation, generate learning feedback.
Conversation: {{conversationText}}

Provide:
1. Overall speaking score (0-100)
2. Grammar score
3. Vocabulary score
4. Fluency score
5. Top 3 strengths
6. Top 3 areas for improvement
7. Recommended next topic
8. Vocabulary words to review
```

## RAG Pipeline (Memory)

### Data Indexed Per User
- Conversation messages (last 100 per user)
- Mistake history
- Vocabulary items
- Weak area targets
- Learning goals

### Retrieval Strategy
```
Query → Embed → Qdrant Search (top 5-10)
├── Similar conversations
├── Related mistakes
├── Relevant vocabulary
└── Contextual goals

Results → Rerank (MMR) → Top 3 → LLM context
```

### Embedding Model
- **Primary**: BGE Small (384d) — fast, good quality
- **Alternative**: all-MiniLM-L6-v2 (384d) — slightly faster
- **Dimensions**: 384 (sufficient for this use case)
- **Distance**: Cosine similarity

## Fine-Tuning Strategy (Future)
- Collect conversation data (with user permission)
- Create instruction dataset for English teaching
- Fine-tune Llama 3.1 8B using LoRA
- Deploy fine-tuned model via Ollama
- Expected improvement: +20% on teaching quality

## AI Safety
- Content filtering on inputs/outputs
- Rate limiting per user
- No persistent storage of sensitive data
- Opt-out for AI memory
- Age verification for kids mode
