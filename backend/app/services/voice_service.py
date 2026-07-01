class VoiceService:
    def __init__(self):
        # Dictionary mapping for common phrases in Hindi (hi) and Punjabi (pa) to English
        self.translation_to_english = {
            "hi": {
                "मेरी फसल कैसी है": "how is my crop",
                "आज का मौसम कैसा है": "how is the weather today",
                "मंडी का भाव क्या है": "what is the market price",
                "मुझे क्या करना चाहिए": "what should i do",
                "खाद कब डालना है": "when to apply fertilizer",
                "कीड़ा लगा है": "crop has pests",
                "पानी कब देना है": "when to water the crop"
            },
            "pa": {
                "ਮੇਰੀ ਫਸਲ ਕਿਵੇਂ ਹੈ": "how is my crop",
                "ਅੱਜ ਦਾ ਮੌਸਮ ਕਿਵੇਂ ਹੈ": "how is the weather today",
                "ਮੰਡੀ ਦਾ ਭਾਅ ਕੀ ਹੈ": "what is the market price",
                "ਮੈਨੂੰ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ": "what should i do",
                "ਖਾਦ ਕਦੋਂ ਪਾਉਣੀ ਹੈ": "when to apply fertilizer",
                "ਕੀੜਾ ਲੱਗ ਗਿਆ ਹੈ": "crop has pests",
                "ਪਾਣੀ ਕਦੋਂ ਦੇਣਾ ਹੈ": "when to water the crop"
            }
        }

        self.translation_from_english = {
            "hi": {
                "Your crop is healthy.": "आपकी फसल स्वस्थ है।",
                "No diseases detected.": "कोई बीमारी नहीं पाई गई।",
                "Apply fertilizer tomorrow.": "कल खाद डालें।",
                "Irrigate the field in the evening.": "शाम को खेत की सिंचाई करें।",
                "Market prices are high. It's a good time to sell.": "मंडी के भाव ऊंचे हैं। बेचने का यह अच्छा समय है।"
            },
            "pa": {
                "Your crop is healthy.": "ਤੁਹਾਡੀ ਫਸਲ ਤੰਦਰੁਸਤ ਹੈ।",
                "No diseases detected.": "ਕੋਈ ਬਿਮਾਰੀ ਨਹੀਂ ਲੱਭੀ।",
                "Apply fertilizer tomorrow.": "ਕੱਲ੍ਹ ਖਾਦ ਪਾਓ।",
                "Irrigate the field in the evening.": "ਸ਼ਾਮ ਨੂੰ ਖੇਤ ਦੀ ਸਿੰਚਾਈ ਕਰੋ।",
                "Market prices are high. It's a good time to sell.": "ਮੰਡੀ ਦੇ ਭਾਅ ਉੱਚੇ ਹਨ। ਵੇਚਣ ਦਾ ਇਹ ਵਧੀਆ ਸਮਾਂ ਹੈ।"
            }
        }

    def translate_to_english(self, text: str, lang: str) -> str:
        if lang == "en":
            return text
        
        # Exact match lookup
        lang_dict = self.translation_to_english.get(lang, {})
        for key, val in lang_dict.items():
            if key in text or text in key:
                return val
                
        # Simple keyword fallback mapping
        keywords = {
            "hi": {
                "फसल": "crop",
                "मौसम": "weather",
                "मंडी": "market",
                "भाव": "price",
                "पानी": "water",
                "खाद": "fertilizer",
                "बीमारी": "disease",
                "कीड़ा": "pest"
            },
            "pa": {
                "ਫਸਲ": "crop",
                "ਮੌਸਮ": "weather",
                "ਮੰਡੀ": "market",
                "ਭਾਅ": "price",
                "ਪਾਣੀ": "water",
                "ਖਾਦ": "fertilizer",
                "ਬਿਮਾਰੀ": "disease",
                "ਕੀੜਾ": "pest"
            }
        }
        
        mapped_words = []
        lang_keywords = keywords.get(lang, {})
        for native, eng in lang_keywords.items():
            if native in text:
                mapped_words.append(eng)
                
        if mapped_words:
            return " ".join(mapped_words)
            
        return text  # Return original if no translation found

    def translate_from_english(self, text: str, lang: str) -> str:
        if lang == "en":
            return text
            
        lang_dict = self.translation_from_english.get(lang, {})
        # Try exact match
        if text in lang_dict:
            return lang_dict[text]
            
        # Try substring translation
        for eng_phrase, native_phrase in lang_dict.items():
            if eng_phrase in text:
                text = text.replace(eng_phrase, native_phrase)
                
        return text

voice_service = VoiceService()
