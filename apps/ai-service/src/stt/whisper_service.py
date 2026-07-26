import os
import tempfile
import numpy as np
from faster_whisper import WhisperModel


class WhisperService:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self, model_size: str = "base", device: str = "cpu", compute_type: str = "int8"):
        if self._initialized:
            return
        self.model_size = model_size
        self.device = self._detect_device() if device == "auto" else device
        self.compute_type = compute_type
        if self.device == "cuda":
            self.compute_type = "float16"
        self._model = None
        self._initialized = True

    def _detect_device(self) -> str:
        import torch
        if torch.cuda.is_available():
            return "cuda"
        return "cpu"

    @property
    def model(self) -> WhisperModel:
        if self._model is None:
            self._model = WhisperModel(
                self.model_size,
                device=self.device,
                compute_type=self.compute_type,
            )
        return self._model

    def transcribe(self, audio_path: str, language: str | None = None, task: str = "transcribe"):
        segments, info = self.model.transcribe(audio_path, language=language, task=task)
        text_parts = []
        segment_list = []
        for seg in segments:
            text_parts.append(seg.text)
            segment_list.append({
                "start": round(seg.start, 2),
                "end": round(seg.end, 2),
                "text": seg.text,
                "confidence": round(seg.avg_logprob, 4) if hasattr(seg, "avg_logprob") else None,
            })
        return {
            "text": " ".join(text_parts).strip(),
            "segments": segment_list,
            "language": info.language,
            "duration": round(info.duration, 2) if hasattr(info, "duration") else None,
        }

    def transcribe_stream(self, audio_buffer: bytes, language: str | None = None):
        import soundfile as sf
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            tmp.write(audio_buffer)
            tmp_path = tmp.name
        try:
            segments, info = self.model.transcribe(tmp_path, language=language)
            for seg in segments:
                yield {
                    "start": round(seg.start, 2),
                    "end": round(seg.end, 2),
                    "text": seg.text,
                    "is_final": False,
                }
            yield {"is_final": True, "language": info.language}
        finally:
            try:
                os.unlink(tmp_path)
            except Exception:
                pass

    def transcribe_from_bytes(self, audio_bytes: bytes, language: str | None = None):
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            tmp.write(audio_bytes)
            tmp_path = tmp.name
        try:
            return self.transcribe(tmp_path, language=language)
        finally:
            try:
                os.unlink(tmp_path)
            except Exception:
                pass
