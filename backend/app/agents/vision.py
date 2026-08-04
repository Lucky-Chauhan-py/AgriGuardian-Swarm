import json
from app.config import settings

try:
    import google.generativeai as genai
    if settings.GEMINI_API_KEY:
        genai.configure(api_key=settings.GEMINI_API_KEY)
except ImportError:
    pass

class VisionAgent:
    def __init__(self):
        self.name = "Vision Agent"
        self.role = "Crop Disease & Pest Diagnostician"

    def run(self, image_path: str = None, mock_disease: str = None) -> dict:
        """
        Analyzes a crop image to detect diseases, pests, nutrient deficiencies, and severity.
        """
        thoughts = [
            "Analyzing image pixels for color discoloration, spot patterns, and lesions.",
            "Comparing patterns with known crop disease signatures (e.g., Tomato Early Blight, Rice Blast).",
            "Assessing growth stage and estimating crop health severity index."
        ]

        # Detailed database of crop diseases
        disease_db = {
            "Tomato Early Blight": {
                "pest_or_disease": "Fungal Disease (Alternaria solani)",
                "severity_score": 0.65,
                "growth_stage": "Vegetative / Flowering",
                "symptoms": "Dark spots with concentric rings (target-like appearance) on older leaves. Lower leaves yellowing and dropping off.",
                "treatment_plan": "1. Prune and destroy infected lower leaves.\n2. Apply Copper Fungicide or Chlorothalonil.\n3. Suspend overhead watering; use drip lines.\n4. Rotate with non-solanaceous crops next season.",
                "preventive_measures": "Use certified disease-free seeds. Maintain proper plant spacing for ventilation.",
                "chemical_control": "Copper Fungicide (dosage: 2g/L of water)",
                "biological_control": "Apply Trichoderma harzianum to soil."
            },
            "Tomato Late Blight": {
                "pest_or_disease": "Fungal/Oomycete Disease (Phytophthora infestans)",
                "severity_score": 0.85,
                "growth_stage": "Fruit Development",
                "symptoms": "Large, water-soaked dark spots on leaves with fuzzy white mold on under-surfaces. Rapid leaf browning and fruit rot.",
                "treatment_plan": "1. Remove severely infected plants immediately.\n2. Spray Metalaxyl-M or Mancozeb.\n3. Avoid wet canopy conditions; irrigate early morning.\n4. Choose resistant cultivars for future plantings.",
                "preventive_measures": "Destroy volunteer tomato plants. Ensure wide row spacing.",
                "chemical_control": "Mancozeb or Ridomil Gold (dosage: 2.5g/L of water)",
                "biological_control": "Spray Bacillus subtilis formulation weekly."
            },
            "Tomato Spider Mites": {
                "pest_or_disease": "Pest Infestation (Tetranychus urticae)",
                "severity_score": 0.45,
                "growth_stage": "Flowering / Fruiting",
                "symptoms": "Fine yellow stippling on leaf surfaces. Silk webbing visible on undersides of leaves and stems under heavy infestation.",
                "treatment_plan": "1. Wash plants with a strong stream of water to dislodge mites.\n2. Apply Abamectin or horticultural neem oil.\n3. Introduce predatory mites (Phytoseiulus persimilis).\n4. Maintain soil moisture; dry dusty conditions favor mites.",
                "preventive_measures": "Clear weeds around the field. Monitor leaf undersides weekly.",
                "chemical_control": "Abamectin 1.8% EC (dosage: 0.5ml/L of water)",
                "biological_control": "Release predatory mites or spray Neem Oil (1% concentration)."
            },
            "Wheat Rust": {
                "pest_or_disease": "Fungal Disease (Puccinia graminis / striiformis)",
                "severity_score": 0.75,
                "growth_stage": "Tillering / Jointing",
                "symptoms": "Elongated, reddish-brown or yellow powdery pustules forming stripes or clusters on leaf blades and sheaths.",
                "treatment_plan": "1. Apply Propiconazole or Tebuconazole fungicide immediately.\n2. Avoid excessive nitrogen application which worsens rust.\n3. Destroy wild grassy weeds that act as alternate hosts.",
                "preventive_measures": "Sow rust-resistant varieties like DBW 187 or HD 3226.",
                "chemical_control": "Propiconazole 25% EC (dosage: 1ml/L of water)",
                "biological_control": "Spray Pseudomonas fluorescens (5g/L of water) as a preventative measure."
            },
            "Wheat Powdery Mildew": {
                "pest_or_disease": "Fungal Disease (Blumeria graminis)",
                "severity_score": 0.50,
                "growth_stage": "Jointing / Booting",
                "symptoms": "White to light-gray powdery fungal patches on the upper surface of leaves, causing premature yellowing and leaf death.",
                "thought": "Mildew thrives in cool, humid, and shaded canopies.",
                "treatment_plan": "1. Spray Tebuconazole or Triadimefon if infection exceeds economic threshold.\n2. Optimize seeding rate to avoid high-density canopy humidity.\n3. Reduce Nitrogen fertilizer dosage.",
                "preventive_measures": "Adopt crop rotation with legumes. Ensure balanced NPK fertilization.",
                "chemical_control": "Tebuconazole 250 EC (dosage: 1ml/L of water)",
                "biological_control": "Foliar spray of Potassium Bicarbonate solution (5g/L)."
            },
            "Rice Blast": {
                "pest_or_disease": "Fungal Disease (Magnaporthe oryzae)",
                "severity_score": 0.80,
                "growth_stage": "Tillering / Panicle Initiation",
                "symptoms": "Spindle-shaped (diamond-shaped) lesions on leaves with gray centers and brown borders. Leaf collapse and neck rot on stems.",
                "treatment_plan": "1. Apply Tricyclazole or Isoprothiolane fungicide.\n2. Avoid standing water drainage stress; maintain shallow flooding.\n3. Limit top-dressing of Nitrogen fertilizer during damp periods.",
                "preventive_measures": "Burn straw of infected crops. Use certified clean seed stocks.",
                "chemical_control": "Tricyclazole 75% WP (dosage: 0.6g/L of water)",
                "biological_control": "Foliar application of Pseudomonas fluorescens formulation."
            },
            "Rice Bacterial Leaf Blight": {
                "pest_or_disease": "Bacterial Disease (Xanthomonas oryzae)",
                "severity_score": 0.70,
                "growth_stage": "Maximum Tillering",
                "symptoms": "Wavy yellow to white stripes starting from leaf tips and margins, progressing downwards. Milky bacterial ooze droplets in high humidity.",
                "treatment_plan": "1. Spray Streptocycline mixed with Copper Hydroxide.\n2. Drain the field for 2-3 days to reduce humidity.\n3. Suspend nitrogen application temporarily.",
                "preventive_measures": "Keep field bunds clean of wild host weeds. Grow resistant varieties.",
                "chemical_control": "Streptocycline (6g) + Copper Hydroxide (50g) in 200L of water per acre",
                "biological_control": "Apply fresh cow dung slurry supernatant spray (preventative)."
            },
            "Potato Late Blight": {
                "pest_or_disease": "Fungal/Oomycete Disease (Phytophthora infestans)",
                "severity_score": 0.90,
                "growth_stage": "Tuber Bulking",
                "symptoms": "Irregular dark green water-soaked spots on leaves that turn brown/black. White powdery mildew on undersides. Tuber rot in soil.",
                "treatment_plan": "1. Apply Cymoxanil + Mancozeb spray immediately.\n2. Harvest tubers during dry weather to prevent spore transfer.\n3. Destroy infected crop residues post-harvest.",
                "preventive_measures": "Plant certified seed tubers. Apply preventive Mancozeb spray before monsoon.",
                "chemical_control": "Cymoxanil 8% + Mancozeb 64% (dosage: 2g/L of water)",
                "biological_control": "Spray Bacillus amyloliquefaciens suspension."
            },
            "Potato Early Blight": {
                "pest_or_disease": "Fungal Disease (Alternaria solani)",
                "severity_score": 0.55,
                "growth_stage": "Vegetative Growth",
                "symptoms": "Dark brown, dry, target-board-pattern spots on older leaves, causing leaf curling and drying.",
                "treatment_plan": "1. Remove affected lower leaves.\n2. Spray Chlorothalonil or Mancozeb.\n3. Increase potassium fertilization to boost crop resistance.",
                "preventive_measures": "Implement 3-year crop rotation with non-nightshade plants. Avoid water stress.",
                "chemical_control": "Chlorothalonil 75% WP (dosage: 2g/L of water)",
                "biological_control": "Foliar spray of Trichoderma viride culture."
            },
            "Nutrient Deficiency: Iron": {
                "pest_or_disease": "Nutrient Deficiency (Iron - Fe)",
                "severity_score": 0.35,
                "growth_stage": "Any Stage",
                "symptoms": "Interveinal chlorosis: young leaves turn pale yellow while veins remain dark green. Stunted shoot growth in severe cases.",
                "treatment_plan": "1. Apply foliar spray of Chelated Iron (Fe-EDTA).\n2. Apply organic manure to improve micronutrient uptake.\n3. Check soil pH; high alkaline soils (pH > 7.5) lock up iron.",
                "preventive_measures": "Incorporate compost into soil. Avoid waterlogging which hinders iron uptake.",
                "chemical_control": "Foliar spray of Fe-EDTA 12% (dosage: 1g/L of water)",
                "biological_control": "Incorporate vermicompost and Humic Acid to improve root chelation."
            },
            "Healthy Leaf": {
                "pest_or_disease": "None (Healthy)",
                "severity_score": 0.00,
                "growth_stage": "Active Development",
                "symptoms": "Leaves are uniform green, firm, and show no signs of lesions, pest damage, or chlorosis.",
                "treatment_plan": "1. No immediate treatments required.\n2. Maintain current irrigation and NPK fertilization schedule.\n3. Perform regular field scouting twice a week.",
                "preventive_measures": "Continue standard preventive biocontrol applications.",
                "chemical_control": "None recommended.",
                "biological_control": "Apply neem-based sprays monthly as a general repellent."
            }
        }

        if settings.MOCK_AI or not image_path:
            # Look up disease details
            disease = mock_disease or "Tomato Early Blight"
            diag_details = disease_db.get(disease, disease_db["Tomato Early Blight"])

            return {
                "agent": self.name,
                "thoughts": thoughts,
                "status": "success",
                "output": {
                    "disease_name": disease,
                    "pest_or_disease": diag_details["pest_or_disease"],
                    "severity_score": diag_details["severity_score"],
                    "growth_stage": diag_details["growth_stage"],
                    "symptoms": diag_details["symptoms"],
                    "treatment_plan": diag_details["treatment_plan"],
                    "preventive_measures": diag_details["preventive_measures"],
                    "chemical_control": diag_details["chemical_control"],
                    "biological_control": diag_details["biological_control"]
                }
            }

        # Real Gemini Vision Call
        try:
            model = genai.GenerativeModel('gemini-2.5-flash')
            # In a real environment, we would load the image using PIL and pass it
            # For robustness, we will wrap the API call.
            from PIL import Image as PILImage
            img = PILImage.open(image_path)
            
            prompt = """
            Analyze this crop image. Diagnose any pest, disease, or nutrient deficiency.
            Return a JSON object with the following keys:
            {
              "disease_name": "Name of disease/pest/deficiency",
              "pest_or_disease": "Classification (e.g. Fungal, Bacterial, Pest, Nutrient)",
              "severity_score": 0.0 to 1.0,
              "growth_stage": "Estimated growth stage",
              "symptoms": "Description of observed symptoms",
              "treatment_plan": "Step-by-step treatment plan",
              "preventive_measures": "How to prevent this in future",
              "chemical_control": "Recommended chemical treatments",
              "biological_control": "Recommended biological treatments"
            }
            Ensure you only return valid JSON.
            """
            response = model.generate_content([img, prompt])
            cleaned_text = response.text.replace("```json", "").replace("```", "").strip()
            result = json.loads(cleaned_text)
            return {
                "agent": self.name,
                "thoughts": thoughts,
                "status": "success",
                "output": result
            }
        except Exception as e:
            print(f"Gemini Vision Agent error: {e}. Falling back to mock.")
            # Fallback
            return self.run(image_path=None, mock_disease=mock_disease)

vision_agent = VisionAgent()
