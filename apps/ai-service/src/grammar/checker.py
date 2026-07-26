import json
import logging

from src.llm.ollama_client import OllamaClient
from src.llm.prompts import SYSTEM_GRAMMAR

logger = logging.getLogger(__name__)


class GrammarChecker:
    def __init__(self, ollama_client: OllamaClient | None = None):
        self.ollama = ollama_client or OllamaClient()

    async def check(self, text: str, model: str = "llama3.2") -> dict:
        if not text or not text.strip():
            return {
                "has_errors": False,
                "errors": [],
                "overall_score": 100,
            }

        prompt = SYSTEM_GRAMMAR.format(text=text)

        try:
            response = await self.ollama.generate(
                prompt="Analyze the following text for grammar errors:\n\n" + text,
                system_prompt=prompt,
                model=model,
                stream=False,
                options={"temperature": 0.1},
            )

            result = self._parse_response(response)
            return result

        except Exception as e:
            logger.error(f"Grammar check failed: {e}")
            return {
                "has_errors": False,
                "errors": [],
                "overall_score": 100,
                "error": str(e),
            }

    async def check_batch(self, texts: list[str], model: str = "llama3.2") -> list[dict]:
        results = []
        for text in texts:
            result = await self.check(text, model)
            results.append(result)
        return results

    def _parse_response(self, response: str) -> dict:
        json_start = response.find("{")
        json_end = response.rfind("}")
        if json_start == -1 or json_end == -1 or json_end <= json_start:
            return {
                "has_errors": False,
                "errors": [],
                "overall_score": 100,
            }

        json_str = response[json_start : json_end + 1]
        try:
            data = json.loads(json_str)
            return {
                "has_errors": data.get("has_errors", False),
                "errors": data.get("errors", []),
                "overall_score": data.get("overall_score", 100),
            }
        except json.JSONDecodeError:
            return {
                "has_errors": False,
                "errors": [],
                "overall_score": 100,
            }
