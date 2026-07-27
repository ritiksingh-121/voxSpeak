import io
import json
import logging
import os
import tempfile
from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import Response, StreamingResponse
from sse_starlette.sse import EventSourceResponse

from src.api.schemas import (
    ChatRequest,
    EmbeddingRequest,
    EmbeddingResponse,
    GrammarRequest,
    GrammarResponse,
    HealthResponse,
    LLMRequest,
    LLMResponse,
    PronunciationRequest,
    PronunciationResponse,
    STTResponse,
    TTSRequest,
)
from src.embeddings.embed_service import EmbeddingService
from src.grammar.checker import GrammarChecker
from src.llm.ollama_client import OllamaClient
from src.pronunciation.analyzer import PronunciationAnalyzer
from src.stt.whisper_service import WhisperService
from src.tts.piper_service import PiperTTSService

logger = logging.getLogger(__name__)

router = APIRouter()

_whisper = None
_tts = None
_ollama = None
_embeddings = None
_pronunciation = None
_grammar = None


def get_whisper() -> WhisperService:
    global _whisper
    if _whisper is None:
        _whisper = WhisperService()
    return _whisper


def get_tts() -> PiperTTSService:
    global _tts
    if _tts is None:
        _tts = PiperTTSService()
    return _tts


def get_ollama() -> OllamaClient:
    global _ollama
    if _ollama is None:
        _ollama = OllamaClient()
    return _ollama


def get_embeddings() -> EmbeddingService:
    global _embeddings
    if _embeddings is None:
        _embeddings = EmbeddingService()
    return _embeddings


def get_pronunciation() -> PronunciationAnalyzer:
    global _pronunciation
    if _pronunciation is None:
        _pronunciation = PronunciationAnalyzer()
    return _pronunciation


def get_grammar() -> GrammarChecker:
    global _grammar
    if _grammar is None:
        _grammar = GrammarChecker(get_ollama())
    return _grammar


@router.post("/stt/transcribe", response_model=STTResponse)
async def transcribe_audio(
    file: UploadFile = File(...),
    language: str | None = Form(None),
):
    if not file.filename:
        raise HTTPException(400, "No file provided")

    ext = Path(file.filename).suffix.lower()
    allowed = {".wav", ".mp3", ".ogg", ".m4a", ".webm", ".flac"}
    if ext not in allowed:
        raise HTTPException(400, f"Unsupported format: {ext}. Use: {allowed}")

    with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        result = get_whisper().transcribe(tmp_path, language=language)
        return STTResponse(**result)
    except Exception as e:
        logger.error(f"Transcription failed: {e}")
        raise HTTPException(500, f"Transcription failed: {str(e)}")
    finally:
        try:
            os.unlink(tmp_path)
        except Exception:
            pass


@router.post("/tts/synthesize")
async def synthesize_speech(request: TTSRequest):
    try:
        audio_data = get_tts().synthesize(request.text, request.voice)
        return Response(
            content=audio_data,
            media_type="audio/wav",
            headers={"Content-Disposition": f"attachment; filename=speech.wav"},
        )
    except FileNotFoundError as e:
        raise HTTPException(400, str(e))
    except Exception as e:
        logger.error(f"TTS failed: {e}")
        raise HTTPException(500, f"TTS failed: {str(e)}")


@router.get("/tts/voices")
async def list_voices():
    return {"voices": get_tts().get_available_voices()}


@router.post("/llm/generate", response_model=LLMResponse)
async def llm_generate(request: LLMRequest):
    try:
        response = await get_ollama().generate(
            prompt=request.prompt,
            system_prompt=request.system_prompt,
            model=request.model,
        )
        return LLMResponse(response=response, model=request.model)
    except Exception as e:
        logger.error(f"LLM generate failed: {e}")
        raise HTTPException(500, f"LLM generation failed: {str(e)}")


@router.post("/llm/chat", response_model=LLMResponse)
async def llm_chat(request: ChatRequest):
    try:
        messages = [m.model_dump() for m in request.messages]
        response = await get_ollama().chat(
            messages=messages,
            model=request.model,
        )
        return LLMResponse(response=response, model=request.model)
    except Exception as e:
        logger.error(f"LLM chat failed: {e}")
        raise HTTPException(500, f"LLM chat failed: {str(e)}")


@router.post("/llm/stream")
async def llm_stream(request: LLMRequest):
    try:
        generator = await get_ollama().generate(
            prompt=request.prompt,
            system_prompt=request.system_prompt,
            model=request.model,
            stream=True,
        )

        async def event_generator():
            async for chunk in generator:
                yield {"event": "token", "data": json.dumps({"token": chunk})}
            yield {"event": "done", "data": json.dumps({"done": True})}

        return EventSourceResponse(event_generator())
    except Exception as e:
        logger.error(f"LLM stream failed: {e}")
        raise HTTPException(500, f"LLM streaming failed: {str(e)}")


@router.get("/llm/models")
async def list_models():
    try:
        models = await get_ollama().get_available_models()
        return {"models": models}
    except Exception as e:
        logger.error(f"Failed to list models: {e}")
        raise HTTPException(503, f"Cannot reach Ollama: {str(e)}")


@router.post("/embeddings", response_model=EmbeddingResponse)
async def create_embeddings(request: EmbeddingRequest):
    try:
        if request.batch:
            result = get_embeddings().embed_batch(request.batch)
            return EmbeddingResponse(embeddings=result)
        result = get_embeddings().embed(request.text)
        return EmbeddingResponse(embedding=result)
    except Exception as e:
        logger.error(f"Embedding failed: {e}")
        raise HTTPException(500, f"Embedding failed: {str(e)}")


@router.post("/pronunciation/analyze", response_model=PronunciationResponse)
async def analyze_pronunciation(request: PronunciationRequest):
    try:
        result = get_pronunciation().compare(
            request.user_transcript,
            request.expected_text,
        )
        return PronunciationResponse(**result)
    except Exception as e:
        logger.error(f"Pronunciation analysis failed: {e}")
        raise HTTPException(500, f"Pronunciation analysis failed: {str(e)}")


@router.post("/grammar/check", response_model=GrammarResponse)
async def check_grammar(request: GrammarRequest):
    try:
        result = await get_grammar().check(request.text)
        return GrammarResponse(**result)
    except Exception as e:
        logger.error(f"Grammar check failed: {e}")
        raise HTTPException(500, f"Grammar check failed: {str(e)}")


@router.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse()
