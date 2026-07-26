from typing import List

import numpy as np
from sentence_transformers import SentenceTransformer


class EmbeddingService:
    _instance = None
    _model = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        if hasattr(self, "_initialized") and self._initialized:
            return
        self.model_name = model_name
        self._initialized = True

    def _get_model(self) -> SentenceTransformer:
        if EmbeddingService._model is None:
            EmbeddingService._model = SentenceTransformer(self.model_name)
        return EmbeddingService._model

    def embed(self, text: str) -> List[float]:
        model = self._get_model()
        embedding = model.encode(text, normalize_embeddings=True)
        return embedding.tolist()

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        if not texts:
            return []
        model = self._get_model()
        embeddings = model.encode(texts, normalize_embeddings=True)
        return [emb.tolist() for emb in embeddings]

    def similarity(self, text1: str, text2: str) -> float:
        emb1 = np.array(self.embed(text1))
        emb2 = np.array(self.embed(text2))
        return float(np.dot(emb1, emb2))

    @property
    def dimension(self) -> int:
        return 384
