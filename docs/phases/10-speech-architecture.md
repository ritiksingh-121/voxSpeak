# Phase 10 — Speech Architecture

## Speech Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                    SPEECH PIPELINE                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  USER SPEAKS ──────────────────────────────────────────┐    │
│    │                                                    │    │
│    ▼                                                    │    │
│  ┌───────────────────────┐                              │    │
│  │  Browser Capture      │   MediaRecorder API          │    │
│  │  • getUserMedia()     │   • 16kHz sample rate        │    │
│  │  • AudioContext        │   • WebM/Opus or WAV        │    │
│  │  • Worklet for VAD    │   • Chunked streaming        │    │
│  └──────────┬────────────┘                              │    │
│             │                                           │    │
│             ▼                                           │    │
│  ┌───────────────────────┐                              │    │
│  │  Voice Activity       │   • Real-time VAD            │    │
│  │  Detection (VAD)      │   • Silence detection        │    │
│  │  • Silero VAD          │   • Auto-end on pause       │    │
│  │  • WebRTC VAD         │   • Noise gate filtering     │    │
│  └──────────┬────────────┘                              │    │
│             │                                           │    │
│             ▼                                           │    │
│  ┌───────────────────────┐                              │    │
│  │  Audio Preprocessing  │   • Normalize volume         │    │
│  │  • Resample to 16kHz  │   • Noise reduction          │    │
│  │  • Convert to WAV     │   • Format conversion        │    │
│  └──────────┬────────────┘                              │    │
│             │                                           │    │
│            ╔╩══════════════════════════════════════════╗ │    │
│            ║        SPEECH RECOGNITION (STT)          ║ │    │
│            ╠═══════════════════════════════════════════╣ │    │
│            ║  Option A: Web Speech API (Browser)      ║ │    │
│            ║  • Free, instant, no backend             ║ │    │
│            ║  • Limited accuracy, English only        ║ │    │
│            ║  • Best for quick practice               ║ │    │
│            ║                                          ║ │    │
│            ║  Option B: Whisper.cpp (Backend)         ║ │    │
│            ║  • Highest accuracy                      ║ │    │
│            ║  • Multilingual                          ║ │    │
│            ║  • Self-hosted, free                     ║ │    │
│            ║  • Needs GPU for real-time               ║ │    │
│            ║  • tiny, base, small, medium, large      ║ │    │
│            ║                                          ║ │    │
│            ║  Option C: Faster Whisper (Backend)      ║ │    │
│            ║  • 4x faster than Whisper.cpp            ║ │    │
│            ║  • CTranslate2 optimized                 ║ │    │
│            ║  • Lower memory usage                    ║ │    │
│            ║  • Recommended for production            ║ │    │
│            ║                                          ║ │    │
│            ║  Option D: Vosk (Edge/Offline)           ║ │    │
│            ║  • Runs entirely in browser or mobile    ║ │    │
│            ║  • 50MB models                           ║ │    │
│            ║  • Good for offline mode                 ║ │    │
│            ║  • Lower accuracy than Whisper           ║ │    │
│            ╚═══════════════════════════════════════════╝ │    │
│                         │                                │    │
│                         ▼                                │    │
│            ┌───────────────────────┐                     │    │
│            │  Transcript Output    │   Raw text          │    │
│            │  • Final transcript   │   + confidence      │    │
│            │  • Confidence score   │   + word timings    │    │
│            │  • Word-level timing  │                     │    │
│            └──────────┬────────────┘                     │    │
│                       │                                  │    │
│                       ▼                                  │    │
│            ┌───────────────────────┐                     │    │
│            │  Pronunciation Engine │   Phoneme-level     │    │
│            │  • Phoneme alignment  │   comparison        │    │
│            │  • Compare to target  │                     │    │
│            │  • Error heatmap      │                     │    │
│            │  • Score per phoneme  │                     │    │
│            └──────────┬────────────┘                     │    │
│                       │                                  │    │
│                       ▼                                  │    │
│            ╔═══════════════════════════════════════════╗ │    │
│            ║        SPEECH SYNTHESIS (TTS)            ║ │    │
│            ╠═══════════════════════════════════════════╣ │    │
│            ║  Option A: Web Speech API (Browser)      ║ │    │
│            ║  • Free, instant                         ║ │    │
│            ║  • Robot voice, limited control          ║ │    │
│            ║  • Good fallback                         ║ │    │
│            ║                                          ║ │    │
│            ║  Option B: Piper TTS (Backend)           ║ │    │
│            ║  • High quality voices                   ║ │    │
│            ║  • Very fast (runs on CPU)               ║ │    │
│            ║  • Self-hosted, free                     ║ │    │
│            ║  • Multiple English voices               ║ │    │
│            ║  • Recommended                           ║ │    │
│            ║                                          ║ │    │
│            ║  Option C: Coqui TTS (Backend)           ║ │    │
│            ║  • Best quality                          ║ │    │
│            ║  • Needs GPU for real-time               ║ │    │
│            ║  • More voices/languages                 ║ │    │
│            ║  • Future upgrade                        ║ │    │
│            ╚═══════════════════════════════════════════╝ │    │
│                         │                                │    │
│                         ▼                                │    │
│            ┌───────────────────────┐                     │    │
│            │  Audio Output         │   Play on device    │    │
│            │  • Play audio blob    │                     │    │
│            │  • Stream if long     │                     │    │
│            │  • Cache common       │                     │    │
│            └───────────────────────┘                     │    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Voice Recording Strategy

### Browser-Side (Client)
```typescript
// Audio capture configuration
const audioConfig = {
  sampleRate: 16000,        // Whisper optimal
  channelCount: 1,          // Mono
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
};

// MediaRecorder with audio worklet for VAD
// Chunked upload via WebSocket for real-time transcription
```

### Server-Side (Backend)
```typescript
// STT Queue Configuration
{
  queue: 'stt-queue',
  concurrency: 2,            // Based on GPU memory
  model: 'base',             // Whisper model size
  computeType: 'int8',       // Quantization for speed
  language: 'en',
}

// TTS Queue Configuration
{
  queue: 'tts-queue',
  concurrency: 4,            // Piper is fast on CPU
  model: 'en_US-lessac-medium',
  speed: 1.0,
}
```

## Pronunciation Analysis

### Phoneme Comparison
```
Target: "thought"  /θɔːt/
User: "taught"    /tɔːt/

Phoneme-level analysis:
  /θ/ → /t/  ❌ (voiceless dental fricative → voiceless alveolar plosive)
  /ɔː/ → /ɔː/ ✅
  /t/ → /t/   ✅

Score: 66.7%
Action: Recommend "th" sound practice
```

### Scoring Dimensions
| Dimension | Weight | Method |
|---|---|---|
| Phoneme accuracy | 40% | Phoneme error rate |
| Word stress | 20% | Stress pattern comparison |
| Intonation | 15% | Pitch contour analysis |
| Fluency | 15% | Pauses, hesitations, speech rate |
| Rhythm | 10% | Syllable timing |

## Speech Pipeline Comparison

| Stage | Option A (Browser) | Option B (Self-hosted) | Recommendation |
|---|---|---|---|
| STT | Web Speech API | Faster Whisper | **Both** — browser for speed, Whisper for accuracy |
| VAD | WebRTC VAD | Silero VAD | WebRTC VAD in browser |
| TTS | SpeechSynthesis | Piper TTS | **Piper TTS** for quality |
| Pronunciation | N/A | Phoneme comparator | Custom engine built on phoneme alignment |
| Noise reduction | N/A | RNNoise | RNNoise on server |

## Real-Time Streaming Architecture

```
Client                    Server                    STT Worker
  │                         │                         │
  │── Audio Chunk (WS) ────>│                         │
  │                         │── STT Job ──────────────>│
  │                         │                         │── Process chunk
  │<── Interim Transcript ──│<─────── Partial ─────────│
  │                         │                         │
  │── Audio Chunk (WS) ────>│                         │
  │                         │                         │── Process chunk
  │<── Final Segment ───────│<─────── Complete ────────│
  │                         │                         │
  │                         │── AI Job ───────────────>│
  │                         │                         │── LLM inference
  │<── AI Response Stream ──│<─────── Tokens ──────────│
  │                         │                         │
  │                         │── TTS Job ──────────────>│
  │<── Audio Response ──────│<─────── Audio ───────────│
```

## Recommended Default Configuration

| Component | Technology | Model | Quality | Latency |
|---|---|---|---|---|
| Speech capture | MediaRecorder + AudioWorklet | — | — | — |
| STT (primary) | Faster Whisper | base.en | Good | ~500ms |
| STT (fallback) | Web Speech API | — | Fair | ~200ms |
| STT (offline) | Vosk | vosk-model-small-en-us-0.15 | Fair | — |
| TTS (primary) | Piper TTS | en_US-lessac-medium | Very Good | ~100ms |
| TTS (fallback) | Web Speech API | — | OK | Instant |
| VAD | Silero VAD | — | Excellent | ~20ms |
| Pronunciation | Custom (phoneme alignment) | — | — | ~100ms |
