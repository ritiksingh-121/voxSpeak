from pydantic import BaseModel, Field


class STTRequest(BaseModel):
    language: str | None = None
    task: str = "transcribe"


class STTSegment(BaseModel):
    start: float
    end: float
    text: str
    confidence: float | None = None


class STTResponse(BaseModel):
    text: str
    segments: list[STTSegment]
    language: str
    duration: float | None = None


class TTSRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)
    voice: str = "en_US-lessac-medium"


class TTSResponse(BaseModel):
    audio_bytes: bytes | None = None
    content_type: str = "audio/wav"


class LLMRequest(BaseModel):
    prompt: str = Field(..., min_length=1)
    system_prompt: str | None = None
    model: str = "llama3.2"
    stream: bool = False


class LLMResponse(BaseModel):
    response: str
    model: str


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    model: str = "llama3.2"
    stream: bool = False


class ChatResponse(BaseModel):
    response: str
    model: str


class EmbeddingRequest(BaseModel):
    text: str = Field(..., min_length=1)
    batch: list[str] | None = None


class EmbeddingResponse(BaseModel):
    embedding: list[float] | None = None
    embeddings: list[list[float]] | None = None
    dimension: int = 384


class PronunciationRequest(BaseModel):
    user_transcript: str
    expected_text: str = Field(..., min_length=1)


class PronunciationError(BaseModel):
    word: str
    user_said: str | None = None
    type: str
    suggestion: str | None = None
    confidence: float | None = None


class PronunciationResponse(BaseModel):
    score: int
    word_count: int
    errors: list[PronunciationError]
    recommendations: list[str]


class GrammarRequest(BaseModel):
    text: str = Field(..., min_length=1)


class GrammarError(BaseModel):
    original: str
    correction: str
    rule: str
    category: str
    difficulty: str


class GrammarResponse(BaseModel):
    has_errors: bool
    errors: list[GrammarError]
    overall_score: int


class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "voxspeak-ai-service"
    version: str = "1.0.0"
