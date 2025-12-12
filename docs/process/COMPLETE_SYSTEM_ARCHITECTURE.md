# Complete System Architecture: RAG + MCP + Vector Search

## Overview: How Everything Works Together

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER CREATES HEALTH RECORD                   │
│  "Sharp pain in left upper abdomen after eating raw garlic"         │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    DUAL STORAGE SYSTEM                               │
│                                                                      │
│  PostgreSQL (Neon)              MongoDB Atlas                       │
│  ├─ Structured data             ├─ Text content                     │
│  ├─ CRUD operations             ├─ Vector embeddings (1024-dim)     │
│  ├─ User authentication         ├─ Similarity search                │
│  └─ Analysis results            └─ RAG context retrieval            │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│              USER CLICKS "AI ANALYSIS" BUTTON                        │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 1: AI-POWERED SYMPTOM EXTRACTION                               │
│                                                                      │
│ Input: "Sharp LUQ pain, sudden onset, after raw garlic"             │
│   ↓                                                                  │
│ AI Model (Llama 3.3 70B):                                            │
│ "Extract medical search terms from this presentation"               │
│   ↓                                                                  │
│ Output: ["left upper quadrant pain", "gastric pain",                │
│          "abdominal pain", "gastritis", "dietary trigger"]          │
│                                                                      │
│ ⏱️ Time: ~1-2 seconds                                                │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 2: PARALLEL MULTI-SOURCE DATA RETRIEVAL                        │
│                                                                      │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │ A. PATIENT HISTORY (MongoDB Vector Search)                   │   │
│ │                                                               │   │
│ │ Query: "Sharp LUQ pain after raw garlic"                     │   │
│ │   ↓ (Convert to 1024-dim vector via Voyage AI)               │   │
│ │ MongoDB: db.health_records.aggregate([                       │   │
│ │   {$vectorSearch: {                                          │   │
│ │     queryVector: [0.123, -0.456, ...],                       │   │
│ │     path: "embedding",                                       │   │
│ │     numCandidates: 100,                                      │   │
│ │     limit: 10                                                │   │
│ │   }}                                                          │   │
│ │ ])                                                            │   │
│ │   ↓                                                           │   │
│ │ Results (Top 5 similar records):                             │   │
│ │ 1. [2024-01-15] "Stomach pain after spicy food" (0.85)       │   │
│ │ 2. [2023-12-20] "Gastric discomfort, skipped meals" (0.78)   │   │
│ │ 3. [2023-11-10] "Abdominal pain, left side" (0.72)           │   │
│ │ 4. [2023-10-05] "Nausea after eating" (0.68)                 │   │
│ │ 5. [2023-09-12] "Upper abdomen fullness" (0.65)              │   │
│ │                                                               │   │
│ │ Pattern Detected: Recurring gastric issues, food-triggered   │   │
│ │ ⏱️ Time: ~500ms                                               │   │
│ └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │ B. MCP: PUBMED RESEARCH (External API)                       │   │
│ │                                                               │   │
│ │ API: https://eutils.ncbi.nlm.nih.gov/entrez/eutils/          │   │
│ │ Query: "gastric pain gastritis diagnosis treatment"          │   │
│ │   ↓                                                           │   │
│ │ Search PubMed database (30M+ articles)                       │   │
│ │   ↓                                                           │   │
│ │ Results (Top 3 relevant):                                    │   │
│ │ 1. "Acute Gastritis: Clinical Presentation" (2023)           │   │
│ │    - Journal: Gastroenterology                               │   │
│ │    - PMID: 37123456                                          │   │
│ │    - Abstract: "LUQ pain with food triggers..."              │   │
│ │                                                               │   │
│ │ 2. "Dietary Triggers in Gastric Disorders" (2022)            │   │
│ │    - Journal: Am J Gastroenterol                             │   │
│ │    - PMID: 36789012                                          │   │
│ │    - Abstract: "Garlic, spices cause irritation..."          │   │
│ │                                                               │   │
│ │ 3. "Management of Acute Gastritis" (2023)                    │   │
│ │    - Journal: NEJM                                           │   │
│ │    - PMID: 37456789                                          │   │
│ │    - Abstract: "H2 blockers effective for..."                │   │
│ │                                                               │   │
│ │ Evidence: Peer-reviewed research supports diagnosis          │   │
│ │ ⏱️ Time: ~2-3 seconds                                         │   │
│ └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │ C. MCP: NIH CLINICAL GUIDELINES (Semantic Search)            │   │
│ │                                                               │   │
│ │ Query: "abdominal pain gastritis"                            │   │
│ │   ↓                                                           │   │
│ │ Semantic matching against NIH database                       │   │
│ │   ↓                                                           │   │
│ │ Results (Top 2 relevant):                                    │   │
│ │ 1. NIH/NIDDK: "Gastritis and Gastropathy"                    │   │
│ │    - URL: niddk.nih.gov/health-information/gastritis         │   │
│ │    - Content: "Symptoms include upper abdominal pain..."     │   │
│ │    - Relevance: 0.72                                         │   │
│ │                                                               │   │
│ │ 2. NIH/NHLBI: "Digestive System Disorders"                   │   │
│ │    - URL: nhlbi.nih.gov/health/digestive                     │   │
│ │    - Content: "Acute gastritis management..."                │   │
│ │    - Relevance: 0.65                                         │   │
│ │                                                               │   │
│ │ Evidence: Official government clinical guidelines            │   │
│ │ ⏱️ Time: ~1 second                                            │   │
│ └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │ D. LOCAL GUIDELINES (Semantic Scoring)                       │   │
│ │                                                               │   │
│ │ Query: "left upper quadrant pain gastric dietary trigger"    │   │
│ │   ↓                                                           │   │
│ │ Score ALL guidelines by semantic relevance                   │   │
│ │   ↓                                                           │   │
│ │ Results (Top 5 by score):                                    │   │
│ │ 1. ACG: "LUQ pain: gastric, splenic causes" (0.45)           │   │
│ │ 2. NICE: "Gastritis: triggers, management" (0.38)            │   │
│ │ 3. Mayo: "Acute abdomen red flags" (0.32)                    │   │
│ │ 4. WHO: "GI disorders diagnosis" (0.28)                      │   │
│ │ 5. CDC: "Food-related illness" (0.22)                        │   │
│ │                                                               │   │
│ │ Evidence: Curated clinical practice guidelines               │   │
│ │ ⏱️ Time: ~100ms                                               │   │
│ └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│ Total Retrieval Time: ~3-4 seconds (parallel execution)             │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 3: CONTEXT ASSEMBLY & TOKEN BUDGET MANAGEMENT                  │
│                                                                      │
│ Input Sources:                                                       │
│ - Patient history: 5 similar records (~800 tokens)                  │
│ - PubMed research: 3 articles (~600 tokens)                         │
│ - NIH guidelines: 2 guidelines (~400 tokens)                        │
│ - Local guidelines: 5 guidelines (~500 tokens)                      │
│ - Prompt template: (~300 tokens)                                    │
│                                                                      │
│ Token Budget: 8000 tokens (Llama 3.3 70B context window)            │
│   ↓                                                                  │
│ Context Manager:                                                     │
│ - Prioritize by relevance score                                     │
│ - Truncate low-priority content                                     │
│ - Ensure critical info included                                     │
│   ↓                                                                  │
│ Final Context (~2600 tokens, 32.5% of budget):                      │
│                                                                      │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │ PATIENT HISTORY CONTEXT:                                     │   │
│ │ - 3 similar episodes in past 6 months                        │   │
│ │ - All food-triggered (spicy, garlic, alcohol)                │   │
│ │ - Consistent LUQ location                                    │   │
│ │ - Severity range: 4-6/10                                     │   │
│ │                                                               │   │
│ │ MEDICAL EVIDENCE (MCP):                                      │   │
│ │ - PubMed: "Gastritis presents with LUQ pain, food triggers"  │   │
│ │ - NIH: "Acute gastritis common, usually self-limiting"       │   │
│ │ - ACG: "Sharp pain + irritant = gastric mucosal damage"      │   │
│ │ - NICE: "Avoid irritants, H2 blockers first-line"            │   │
│ │ - Mayo: "Red flags: hematemesis, severe pain >8/10"          │   │
│ └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│ ⏱️ Time: ~200ms                                                      │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 4: AI ANALYSIS (Llama 3.3 70B via Groq)                        │
│                                                                      │
│ Model: llama-3.3-70b-versatile                                      │
│ Provider: Groq (ultra-fast inference)                               │
│ Max Tokens: 1500                                                     │
│ Temperature: 0.7                                                     │
│                                                                      │
│ Input Prompt:                                                        │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │ You are a clinical decision support AI.                      │   │
│ │                                                               │   │
│ │ Health History Context:                                      │   │
│ │ [Patient's 5 similar past episodes]                          │   │
│ │ [PubMed research on gastritis]                               │   │
│ │ [NIH guidelines on GI disorders]                             │   │
│ │ [ACG/NICE/Mayo clinical guidelines]                          │   │
│ │                                                               │   │
│ │ Current Presentation:                                        │   │
│ │ Sharp LUQ pain, sudden onset, after raw garlic,              │   │
│ │ severity 5/10, palliated by water                            │   │
│ │                                                               │   │
│ │ Provide comprehensive clinical analysis with:                │   │
│ │ - Differential diagnosis (with probabilities)                │   │
│ │ - Clinical reasoning (anatomical + pathophysiological)       │   │
│ │ - Evidence-based recommendations                             │   │
│ │ - Red flags and safety information                           │   │
│ └──────────────────────────────────────────────────────────────┘   │
│   ↓                                                                  │
│ AI Processing:                                                       │
│ - Analyzes patient history pattern                                  │
│ - Integrates medical evidence from MCP                              │
│ - Applies clinical reasoning framework                              │
│ - Generates structured differential diagnosis                       │
│   ↓                                                                  │
│ Output:                                                              │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │ DIFFERENTIAL DIAGNOSIS:                                      │   │
│ │ 1. MOST LIKELY: Acute Gastritis (70-80%)                     │   │
│ │    - Raw garlic = known gastric irritant (ACG guidelines)    │   │
│ │    - Skipping meals = empty stomach acid exposure            │   │
│ │    - LUQ location = stomach anatomical position              │   │
│ │    - Patient history: 3 similar food-triggered episodes      │   │
│ │    - PubMed evidence: Classic presentation                   │   │
│ │                                                               │   │
│ │ 2. CONSIDER: Splenic Flexure Syndrome (15-20%)               │   │
│ │    - "Fullness" suggests gas/bloating                        │   │
│ │    - Posture change helps = gas movement                     │   │
│ │    - Less likely: pain too sharp for gas                     │   │
│ │                                                               │   │
│ │ 3. RULE OUT: Pancreatitis (<5%)                              │   │
│ │    - Location matches (pancreas tail in LUQ)                 │   │
│ │    - Against: severity only 5/10 (pancreatitis 8-10/10)     │   │
│ │    - Against: no radiation to back                           │   │
│ │                                                               │   │
│ │ CLINICAL REASONING:                                          │   │
│ │ - Anatomical: LUQ = stomach, spleen, pancreas tail           │   │
│ │ - Mechanism: Garlic → mucosal irritation → inflammation      │   │
│ │ - Pattern: Food-triggered + meal-related = gastric origin    │   │
│ │ - History: Recurring pattern confirms chronic gastritis      │   │
│ │ - Risk: Low urgency (no red flags, moderate pain)            │   │
│ │                                                               │   │
│ │ RECOMMENDATIONS (Evidence-based):                            │   │
│ │ - Immediate: Avoid gastric irritants (garlic, spicy, NSAIDs) │   │
│ │ - Immediate: Eat regular small meals, don't skip             │   │
│ │ - OTC: H2 blockers (famotidine 20mg) per NICE guidelines     │   │
│ │ - Follow-up: See provider if persists >3 days                │   │
│ │                                                               │   │
│ │ RED FLAGS (Seek ER immediately if):                          │   │
│ │ - Vomiting blood or coffee-ground material                   │   │
│ │ - Black, tarry stools                                        │   │
│ │ - Severe pain >8/10                                          │   │
│ │ - Fever >101.5°F                                             │   │
│ └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│ ⏱️ Time: ~3-5 seconds                                                │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 5: SAVE ANALYSIS TO POSTGRESQL                                 │
│                                                                      │
│ UPDATE health_records                                                │
│ SET ai_analysis = {                                                  │
│   "differential_diagnosis": [...],                                   │
│   "clinical_reasoning": [...],                                       │
│   "recommendations": [...],                                          │
│   "red_flags": [...]                                                 │
│ }                                                                    │
│ WHERE id = record_id                                                 │
│                                                                      │
│ ⏱️ Time: ~100ms                                                      │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 6: DISPLAY TO USER                                             │
│                                                                      │
│ Frontend receives analysis and displays:                             │
│ - Differential diagnosis (prominent blue card)                       │
│ - Clinical assessment                                                │
│ - Recommended actions                                                │
│ - Safety information (red highlighted)                               │
│                                                                      │
│ Total Time: ~8-12 seconds                                            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Key Insights

### 1. Similarity Search Purpose
**Finds patterns in patient's own history:**
- "You've had this 3 times before, all food-triggered"
- "Your pain location is always the same"
- "Severity is increasing over time"

### 2. MCP Contribution
**Provides external medical evidence:**
- **PubMed:** Peer-reviewed research validates diagnosis
- **NIH:** Official government guidelines support treatment
- **Local:** Curated best practices from ACG, NICE, Mayo

### 3. Why Both Are Needed

| Data Source | Purpose | Example |
|-------------|---------|---------|
| **Patient History** | Personalization | "You have recurring gastric issues" |
| **MCP Evidence** | Validation | "Research confirms gastritis presents this way" |
| **Combined** | Confidence | "Your pattern + medical evidence = 80% confident" |

---

## Performance Metrics

| Step | Time | Bottleneck |
|------|------|------------|
| Symptom Extraction | 1-2s | AI model call |
| Vector Search | 500ms | MongoDB query |
| PubMed API | 2-3s | External API |
| NIH Search | 1s | Semantic matching |
| Local Guidelines | 100ms | In-memory |
| Context Assembly | 200ms | Token counting |
| AI Analysis | 3-5s | Groq inference |
| Save to DB | 100ms | PostgreSQL write |
| **Total** | **8-12s** | **Acceptable** |

---

## Current Analysis Issues

### ✅ What's Good:
1. Correct diagnosis (Acute Gastritis)
2. Considers alternatives
3. Specific recommendations

### ❌ What's Missing:
1. **Duplicate entry** (Pancreatitis listed twice)
2. **No mention of triggers** (raw garlic, skipping meals)
3. **No probability percentages** (should say 70-80%)
4. **Weak reasoning** ("No immediate risks" too vague)
5. **Missing red flags section**

### 🔧 Fix Applied:
Enhanced prompt to require:
- Explicit trigger analysis
- Probability percentages
- Step-by-step pathophysiological reasoning
- Specific red flag criteria

---

## Summary

**Similarity Search:** Finds patterns in YOUR past health records  
**MCP Servers:** Provides external medical evidence (PubMed, NIH, guidelines)  
**Combined:** AI gets both personal history + medical evidence = better diagnosis

**Restart AI service to test improved prompt!** 🚀
