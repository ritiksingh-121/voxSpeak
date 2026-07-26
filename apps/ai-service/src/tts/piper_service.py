import asyncio
import io
import json
import logging
import os
import subprocess
from pathlib import Path

logger = logging.getLogger(__name__)

_VOICE_MAP = {
    "en_US-lessac-medium": "en_US-lessac-medium",
    "en_US-amy-medium": "en_US-amy-medium",
    "en_US-ryan-medium": "en_US-ryan-medium",
    "en_GB-alan-medium": "en_GB-alan-medium",
    "en_GB-southern_english_female-medium": "en_GB-southern_english_female-medium",
}


class PiperTTSService:
    def __init__(self, piper_path: str | None = None, voices_dir: str | None = None):
        self.piper_path = piper_path or self._find_piper()
        self.voices_dir = voices_dir or os.environ.get(
            "PIPER_VOICES_DIR",
            str(Path.home() / ".piper" / "voices"),
        )
        os.makedirs(self.voices_dir, exist_ok=True)

    def _find_piper(self) -> str:
        candidates = ["piper", "piper-tts"]
        for cmd in candidates:
            try:
                subprocess.run([cmd, "--help"], capture_output=True, check=False)
                return cmd
            except FileNotFoundError:
                continue
        return "piper"

    def _ensure_voice_model(self, voice: str) -> str:
        voice_file = voice if voice.endswith(".onnx") else f"{voice}.onnx"
        voice_path = os.path.join(self.voices_dir, voice_file)
        if not os.path.exists(voice_path):
            raise FileNotFoundError(
                f"Voice model not found at {voice_path}. "
                f"Download from https://huggingface.co/rhasspy/piper-voices"
            )
        return voice_path

    def synthesize(self, text: str, voice: str = "en_US-lessac-medium") -> bytes:
        voice_path = self._ensure_voice_model(voice)
        config_path = voice_path.replace(".onnx", ".json")

        args = [
            self.piper_path,
            "--model", voice_path,
            "--output-raw",
        ]
        if os.path.exists(config_path):
            args.extend(["--config", config_path])

        proc = subprocess.run(
            args,
            input=text.encode("utf-8"),
            capture_output=True,
            timeout=60,
        )
        if proc.returncode != 0:
            raise RuntimeError(f"Piper TTS failed: {proc.stderr.decode(errors='replace')}")

        raw_audio = proc.stdout
        sample_rate = 22050
        import struct
        import wave
        buf = io.BytesIO()
        with wave.open(buf, "wb") as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(sample_rate)
            wf.writeframes(raw_audio)
        return buf.getvalue()

    async def synthesize_async(self, text: str, voice: str = "en_US-lessac-medium") -> bytes:
        return await asyncio.to_thread(self.synthesize, text, voice)

    def get_available_voices(self) -> list[dict]:
        voices = []
        if os.path.isdir(self.voices_dir):
            for f in os.listdir(self.voices_dir):
                if f.endswith(".onnx"):
                    voice_name = f.replace(".onnx", "")
                    voices.append({
                        "id": voice_name,
                        "name": voice_name,
                        "language": voice_name.split("_")[0] if "_" in voice_name else "en",
                    })
        if not voices:
            voices = [
                {"id": k, "name": v, "language": k.split("_")[0]}
                for k, v in _VOICE_MAP.items()
            ]
        return voices
