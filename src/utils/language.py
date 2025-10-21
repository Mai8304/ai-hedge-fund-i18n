"""Utilities for handling language preferences in prompts."""

from typing import Any


def get_language_code(state: Any, default: str = "EN") -> str:
    """Extract the preferred language code from the state metadata."""
    if not state:
        return default
    try:
        language = state.get("metadata", {}).get("language", default)
    except AttributeError:
        return default
    if not isinstance(language, str):
        return default
    return language.upper() or default


def get_language_instruction(state: Any, default: str = "EN") -> str:
    """Return an instruction snippet guiding the LLM on response language."""
    language = get_language_code(state, default=default)
    language_prompts = {
        "CN": "请使用中文回答。",
        "JA": "日本語で回答してください。",
        "KO": "한국어로 답변해 주세요.",
        "AR": "يرجى الإجابة باللغة العربية.",
        "FR": "Veuillez répondre en français.",
        "DE": "Bitte auf Deutsch antworten.",
    }

    if language in language_prompts:
        return language_prompts[language]

    # For English we explicitly remind the model to keep using English to avoid prior overrides.
    return "Respond in English."
