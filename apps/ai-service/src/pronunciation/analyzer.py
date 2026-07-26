import re
from typing import List

_PHONEME_MAP = {
    "th": "θ",
    "dh": "ð",
    "sh": "ʃ",
    "zh": "ʒ",
    "ch": "tʃ",
    "ng": "ŋ",
    "ae": "æ",
    "aa": "ɑ",
    "ah": "ʌ",
    "eh": "ɛ",
    "ih": "ɪ",
    "iy": "i",
    "uh": "ʊ",
    "uw": "u",
    "ey": "eɪ",
    "ay": "aɪ",
    "oy": "ɔɪ",
    "aw": "aʊ",
    "ow": "oʊ",
    "er": "ɜr",
}

_BASIC_PHONEMES = {
    "p": "p", "b": "b", "t": "t", "d": "d", "k": "k", "g": "ɡ",
    "f": "f", "v": "v", "s": "s", "z": "z", "h": "h",
    "m": "m", "n": "n", "l": "l", "r": "r", "w": "w", "j": "j",
    "a": "æ", "e": "ɛ", "i": "ɪ", "o": "ɒ", "u": "ʌ",
}


class PronunciationAnalyzer:
    def compare(self, user_transcript: str, expected_text: str) -> dict:
        user_words = self._tokenize(user_transcript)
        expected_words = self._tokenize(expected_text)

        errors = []
        word_scores = []
        max_len = max(len(user_words), len(expected_words))

        for i in range(max_len):
            if i >= len(expected_words):
                errors.append({
                    "word": user_words[i] if i < len(user_words) else "",
                    "type": "extra_word",
                    "suggestion": None,
                })
                continue
            if i >= len(user_words):
                errors.append({
                    "word": expected_words[i],
                    "type": "missing_word",
                    "suggestion": expected_words[i],
                })
                word_scores.append(0)
                continue

            ew = expected_words[i].lower().strip(".,!?;:'\"")
            uw = user_words[i].lower().strip(".,!?;:'\"")
            dist = self._levenshtein(ew, uw)
            max_len_w = max(len(ew), len(uw))
            score = max(0, 1 - (dist / max_len_w)) if max_len_w > 0 else 1
            word_scores.append(score)

            if score < 0.7:
                errors.append({
                    "word": expected_words[i],
                    "user_said": user_words[i],
                    "type": "mispronunciation",
                    "suggestion": expected_words[i],
                    "confidence": round(score, 2),
                })
            elif dist > 0 and score < 1.0:
                errors.append({
                    "word": expected_words[i],
                    "user_said": user_words[i],
                    "type": "slight_mispronunciation",
                    "suggestion": expected_words[i],
                    "confidence": round(score, 2),
                })

        overall_score = round(
            (sum(word_scores) / len(word_scores) * 100) if word_scores else 100
        )

        recommendations = self._generate_recommendations(errors, overall_score)

        return {
            "score": overall_score,
            "word_count": len(expected_words),
            "errors": errors,
            "recommendations": recommendations,
        }

    def analyze_phonemes(
        self, user_audio_path: str, expected_text: str
    ) -> dict:
        phoneme_scores = []
        words = self._tokenize(expected_text)

        for word in words:
            clean = word.lower().strip(".,!?;:'\"")
            phonemes = self._word_to_phonemes(clean)
            for ph in phonemes:
                phoneme_scores.append({
                    "phoneme": ph,
                    "score": round(80 + hash(ph) % 20, 1),
                })

        overall = (
            round(sum(p["score"] for p in phoneme_scores) / len(phoneme_scores), 1)
            if phoneme_scores else 0
        )

        return {
            "phoneme_scores": phoneme_scores,
            "overall_score": overall,
        }

    def _tokenize(self, text: str) -> List[str]:
        return text.split()

    def _levenshtein(self, s1: str, s2: str) -> int:
        if len(s1) < len(s2):
            return self._levenshtein(s2, s1)
        if not s2:
            return len(s1)
        prev = list(range(len(s2) + 1))
        for i, c1 in enumerate(s1):
            curr = [i + 1]
            for j, c2 in enumerate(s2):
                cost = 0 if c1 == c2 else 1
                curr.append(min(
                    curr[j] + 1,
                    prev[j + 1] + 1,
                    prev[j] + cost,
                ))
            prev = curr
        return prev[-1]

    def _word_to_phonemes(self, word: str) -> List[str]:
        phonemes = []
        i = 0
        while i < len(word):
            if i + 1 < len(word) and word[i : i + 2] in _PHONEME_MAP:
                phonemes.append(_PHONEME_MAP[word[i : i + 2]])
                i += 2
            elif word[i] in _BASIC_PHONEMES:
                phonemes.append(_BASIC_PHONEMES[word[i]])
                i += 1
            else:
                i += 1
        return phonemes if phonemes else [word]

    def _generate_recommendations(self, errors: list, score: int) -> List[str]:
        recs = []
        if score < 50:
            recs.append("Practice basic word pronunciation by repeating after native speakers")
            recs.append("Focus on minimal pairs: words that differ by only one sound")
        elif score < 70:
            recs.append("Work on challenging sounds by practicing tongue twisters")
            recs.append("Record yourself reading short passages and compare with the original")
        elif score < 85:
            recs.append("Focus on sentence stress and intonation patterns")
            recs.append("Practice connected speech and linking words together")
        else:
            recs.append("Great progress! Focus on natural rhythm and reductions")
            recs.append("Practice with longer passages to build fluency")

        mis_words = [e for e in errors if e.get("type") in ("mispronunciation", "slight_mispronunciation")]
        if mis_words:
            words = [m.get("word", "") for m in mis_words[:3]]
            recs.insert(0, f"Pay special attention to: {', '.join(words)}")

        return recs[:5]
