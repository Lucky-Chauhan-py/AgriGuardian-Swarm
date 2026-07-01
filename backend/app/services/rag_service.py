import os
import json
import numpy as np
from app.config import settings

# Attempt to import faiss and sentence_transformers
try:
    import faiss
    from sentence_transformers import SentenceTransformer
    HAS_ML = True
except ImportError:
    HAS_ML = False

class RAGService:
    def __init__(self):
        self.schemes = []
        self.index = None
        self.model = None
        self.dimension = 384  # Default for all-MiniLM-L6-v2
        
        # Load sample schemes
        self.load_sample_schemes()
        
        if HAS_ML and not settings.MOCK_AI:
            try:
                self.model = SentenceTransformer('all-MiniLM-L6-v2')
                self.init_faiss()
            except Exception as e:
                print(f"Error initializing ML RAG: {e}. Falling back to keyword search.")
                self.model = None

    def load_sample_schemes(self):
        self.schemes = [
            {
                "id": 1,
                "title": "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
                "description": "An initiative by the Government of India that provides up to ₹6,000 per year in three equal installments to all small and marginal farmers.",
                "benefits": "₹6,000 per year direct income support in 3 installments of ₹2,000.",
                "eligibility_criteria": "All landholding farmer families with cultivable landholding in their names. Excludes institutional landholders, high-income taxpayers, and government employees.",
                "application_process": "Apply online through the PM-Kisan portal or via Common Service Centres (CSCs). Requires Aadhaar card, land ownership documents, and bank account details.",
                "category": "Direct Benefit Transfer / Income Support"
            },
            {
                "id": 2,
                "title": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
                "description": "A government-sponsored crop insurance scheme that integrates multiple stakeholders and provides insurance coverage against crop damage.",
                "benefits": "Financial support to farmers suffering crop loss/damage arising out of unforeseen events. Low premium rates: 2% for Kharif, 1.5% for Rabi, and 5% for commercial/horticultural crops.",
                "eligibility_criteria": "All farmers including sharecroppers and tenant farmers growing notified crops in notified areas. Compulsory for farmers who have availed seasonal agricultural operations (SAO) loans.",
                "application_process": "Enroll through local banks, cooperative societies, insurance agents, or directly online on the PMFBY portal. Must submit sowing certificate, land records, and bank details.",
                "category": "Crop Insurance"
            },
            {
                "id": 3,
                "title": "Kisan Credit Card (KCC) Scheme",
                "description": "Provides farmers with timely access to credit for their cultivation and other needs, including crop production, working capital, and post-harvest expenses.",
                "benefits": "Short-term credit loans up to ₹3 Lakhs at low interest rates (typically 4% after subvention). Covers crop cultivation, household consumption, and investment credit for allied activities.",
                "eligibility_criteria": "All farmers - individuals/joint borrowers, owner-cultivators, tenant farmers, oral lessees, sharecroppers, and self-help groups (SHGs).",
                "application_process": "Visit any commercial, cooperative, or regional rural bank. Fill out the KCC application form. Provide ID proof, address proof, land records, and crop sowing details.",
                "category": "Agricultural Credit / Loan"
            },
            {
                "id": 4,
                "title": "Sub-Mission on Agricultural Mechanization (SMAM)",
                "description": "Promotes agricultural mechanization to increase reach of farm power to small and marginal farmers and in regions with low farm power availability.",
                "benefits": "Subsidies ranging from 40% to 50% for purchasing agricultural machinery like tractors, power tillers, rotavators, seed drills, and drone technology.",
                "eligibility_criteria": "Individual farmers, cooperative societies, self-help groups, and farmer producer organizations (FPOs). Priority given to small/marginal, SC/ST, and women farmers.",
                "application_process": "Register on the SMAM portal (agrimachinery.nic.in). Upload Aadhaar, land details, bank passbook, and select the machinery to buy from authorized dealers.",
                "category": "Subsidy / Mechanization"
            },
            {
                "id": 5,
                "title": "Per Drop More Crop (PDMC) - PMKSY",
                "description": "Focuses on water use efficiency at the farm level through micro-irrigation technologies like drip and sprinkler irrigation systems.",
                "benefits": "Financial assistance/subsidy up to 55% for small and marginal farmers, and 45% for other farmers to install drip and sprinkler irrigation systems.",
                "eligibility_criteria": "Farmers owning agricultural land. Members of cooperative societies and water user associations are also eligible.",
                "application_process": "Apply through the state horticulture or agriculture department portal. Requires soil/water test reports, land map, Aadhaar, and bank details.",
                "category": "Irrigation / Subsidy"
            }
        ]

    def init_faiss(self):
        if not self.model:
            return
        
        texts = [f"{s['title']}. {s['description']}. Eligibility: {s['eligibility_criteria']}" for s in self.schemes]
        embeddings = self.model.encode(texts, convert_to_numpy=True)
        
        self.index = faiss.IndexFlatL2(self.dimension)
        self.index.add(embeddings.astype('float32'))

    def search(self, query: str, top_k: int = 2):
        if self.model and self.index:
            try:
                query_vector = self.model.encode([query], convert_to_numpy=True)
                distances, indices = self.index.search(query_vector.astype('float32'), top_k)
                
                results = []
                for idx in indices[0]:
                    if idx != -1 and idx < len(self.schemes):
                        results.append(self.schemes[idx])
                return results
            except Exception as e:
                print(f"FAISS search failed: {e}. Falling back to keyword match.")
        
        # Keyword-based fallback
        query_words = query.lower().split()
        scored_schemes = []
        for scheme in self.schemes:
            score = 0
            text = f"{scheme['title']} {scheme['description']} {scheme['eligibility_criteria']} {scheme['category']}".lower()
            for word in query_words:
                if len(word) > 2 and word in text:
                    score += 1
            scored_schemes.append((score, scheme))
        
        # Sort by score descending
        scored_schemes.sort(key=lambda x: x[0], reverse=True)
        return [scheme for score, scheme in scored_schemes[:top_k] if score > 0] or self.schemes[:top_k]

rag_service = RAGService()
