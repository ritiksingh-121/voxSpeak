import json
import os
from typing import AsyncGenerator

import httpx


class OllamaClient:
    def __init__(self, base_url: str | None = None):
        self.base_url = (base_url or os.environ.get("OLLAMA_URL", "http://localhost:11434")).rstrip("/")
        self._client = httpx.AsyncClient(timeout=httpx.Timeout(300.0, connect=30.0))

    async def close(self):
        await self._client.aclose()

    def _build_url(self, path: str) -> str:
        return f"{self.base_url}/api/{path.lstrip('/')}"

    async def generate(
        self,
        prompt: str,
        system_prompt: str | None = None,
        model: str = "llama3.2",
        stream: bool = False,
        options: dict | None = None,
    ):
        payload = {
            "model": model,
            "prompt": prompt,
            "stream": stream,
        }
        if system_prompt:
            payload["system"] = system_prompt
        if options:
            payload["options"] = options

        if stream:
            return self._stream_generate(payload)

        resp = await self._client.post(self._build_url("generate"), json=payload)
        resp.raise_for_status()
        data = resp.json()
        return data.get("response", "")

    async def _stream_generate(self, payload: dict) -> AsyncGenerator[str, None]:
        async with httpx.AsyncClient(timeout=httpx.Timeout(300.0)) as client:
            async with client.stream("POST", self._build_url("generate"), json=payload) as resp:
                resp.raise_for_status()
                async for line in resp.aiter_lines():
                    if not line.strip():
                        continue
                    try:
                        chunk = json.loads(line)
                    except json.JSONDecodeError:
                        continue
                    if chunk.get("done"):
                        break
                    if "response" in chunk:
                        yield chunk["response"]

    async def chat(
        self,
        messages: list[dict],
        model: str = "llama3.2",
        stream: bool = False,
        options: dict | None = None,
    ):
        payload = {
            "model": model,
            "messages": messages,
            "stream": stream,
        }
        if options:
            payload["options"] = options

        if stream:
            return self._stream_chat(payload)

        resp = await self._client.post(self._build_url("chat"), json=payload)
        resp.raise_for_status()
        data = resp.json()
        return data.get("message", {}).get("content", "")

    async def _stream_chat(self, payload: dict) -> AsyncGenerator[str, None]:
        async with httpx.AsyncClient(timeout=httpx.Timeout(300.0)) as client:
            async with client.stream("POST", self._build_url("chat"), json=payload) as resp:
                resp.raise_for_status()
                async for line in resp.aiter_lines():
                    if not line.strip():
                        continue
                    try:
                        chunk = json.loads(line)
                    except json.JSONDecodeError:
                        continue
                    if chunk.get("done"):
                        break
                    delta = chunk.get("message", {}).get("content", "")
                    if delta:
                        yield delta

    async def get_available_models(self) -> list[dict]:
        resp = await self._client.get(self._build_url("tags"))
        resp.raise_for_status()
        data = resp.json()
        return data.get("models", [])
