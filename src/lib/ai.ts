// ============================================================================
// AI Health Assistant
// Client helper that talks to our Next.js API route, which proxies to Gemini.
// The route falls back to a local knowledge base when GEMINI_API_KEY is missing.
// ============================================================================

export interface AiMessage {
  role: "user" | "assistant";
  content: string;
}

export const GEMINI_SYSTEM_PROMPT = `You are "Health Care AI", a friendly and cautious AI health assistant.
- Answer health-related questions with clear, simple, helpful language.
- When explaining symptoms, list possible common causes but ALWAYS emphasize that this is general information and not a diagnosis.
- Suggest relevant specialist doctors when appropriate.
- Explain medical report terms in plain language.
- Give preventive healthcare tips.
- ALWAYS include a clear disclaimer that you are NOT a replacement for professional medical advice and that in case of emergency the user should contact emergency services (e.g. call 112 / local emergency number) immediately.
- Be concise (under ~180 words). Use short paragraphs or bullet points.
- Never invent specific lab reference ranges as definitive; tell users to follow their doctor's advice.`;

/** Ask the AI assistant via the Next.js API route. */
export async function askHealthAI(messages: AiMessage[], options?: { action?: string }): Promise<string> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: messages.slice(-10),
      action: options?.action ?? "general",
    }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.content) {
    throw new Error(data?.error ?? "The AI assistant is unavailable right now. Please try again.");
  }
  return data.content as string;
}

// ============================================================================
// Local fallback knowledge base (used when no Gemini key is configured)
// ============================================================================

export function localHealthAnswer(question: string): string {
  const q = question.toLowerCase();

  const match = (keywords: string[], answer: string) =>
    keywords.some((k) => q.includes(k)) ? answer : null;

  const answers = [
    match(
      ["headache", "head pain", "migraine"],
      `Here are a few common causes of headaches:\n\n- **Tension headaches** — often from stress, screen time or poor posture.\n- **Migraine** — throbbing pain, sometimes with nausea and light sensitivity.\n- **Dehydration or skipped meals**.\n- **Sinus issues** — pressure around eyes and forehead.\n\n> Rest in a quiet, dark room, stay hydrated and use a warm/cold compress. If the headache is sudden and severe, follows a head injury, or comes with vision loss or confusion, seek emergency care immediately. This is general information — please consult a doctor for a proper diagnosis.`
    ),
    match(
      ["fever", "temperature", "feverish"],
      `A mild fever is often the body fighting an infection. What you can do:\n\n- Stay hydrated and rest.\n- Use paracetamol as directed (never exceed the dose).\n- Monitor temperature and symptoms.\n\n> See a doctor if the fever is above 39°C, lasts more than 3 days, or is accompanied by a stiff neck, rash or difficulty breathing. For infants under 3 months with fever, seek medical care promptly. This is general guidance, not a diagnosis.`
    ),
    match(
      ["blood pressure", "bp", "hypertension"],
      `For managing blood pressure:\n\n- Reduce salt, caffeine and processed foods.\n- Exercise 30 min most days (walking is great).\n- Manage stress with breathing exercises and good sleep.\n- Take prescribed medicines consistently — never stop without your doctor.\n\n> Home monitoring is helpful. If you get readings of 180/120 or higher, or experience chest pain or severe headache, seek emergency care. Always follow your doctor's advice.`
    ),
    match(
      ["diabetes", "blood sugar", "sugar"],
      `Preventive tips for diabetes:\n\n- Choose whole grains, fibre-rich foods and lean protein.\n- Limit sugary drinks and refined carbs.\n- Stay active — 30 minutes of walking daily helps.\n- Get periodic HbA1c checks, especially if you have family history.\n\n> This is general advice. If you have diabetes, follow your endocrinologist's plan and monitor your blood sugar regularly.`
    ),
    match(
      ["joint pain", "knee pain", "arthritis", "back pain"],
      `For joint pain:\n\n- Apply ice for the first 48h, then gentle heat.\n- Low-impact exercise (swimming, cycling) keeps joints mobile.\n- Maintain a healthy weight to reduce joint load.\n- Over-the-counter pain relief can help short-term.\n\n> If there is swelling, redness, locking, or pain lasting more than 2 weeks, an **orthopedic** specialist should evaluate you. Persistent back pain with leg weakness or bladder changes needs urgent review.`
    ),
    match(
      ["specialist", "suggest", "which doctor", "which speciali"],
      `Based on common complaints:\n\n- Chest pain, palpitations, breathlessness → **Cardiologist**\n- Persistent headaches, seizures, tingling → **Neurologist**\n- Joint pain, fractures, sports injuries → **Orthopedic surgeon**\n- Stomach pain, acidity, liver issues → **Gastroenterologist**\n- Skin rashes, acne, hair loss → **Dermatologist**\n- Diabetes, thyroid → **Endocrinologist**\n- Pregnancy, menstrual issues → **Gynecologist**\n\n> This is a general guide. A primary care doctor can help confirm the right referral for your specific symptoms.`
    ),
    match(
      ["water", "hydration", "drink"],
      `Hydration basics:\n\n- The often-quoted goal is ~2–3 litres a day, but needs vary with body size, activity, climate and health.\n- A simple check: pale-yellow urine usually means good hydration.\n- Drink more in hot weather and during exercise.\n- Caffeinated and sugary drinks count less than water.\n\n> People with heart or kidney conditions should follow their doctor's fluid guidance.`
    ),
    match(
      ["medicine", "medication", "dosage"],
      `About medicines:\n\n- Always take the exact dose and timing your doctor/pharmacist prescribed.\n- Don't double up on a missed dose — skip it unless the label says otherwise.\n- Keep a list of all medicines (including OTC and supplements) to show your doctor.\n- Store medicines away from heat and moisture, and check expiry dates.\n\n> Never start, stop or change medication doses on your own. If you suspect an allergic reaction, seek urgent medical care.`
    ),
    match(
      ["blood report", "report", "hb", "hemoglobin"],
      `To understand a blood report:\n\n- Focus on values flagged outside the reference range, but know that "normal" varies by age, sex and lab.\n- **Hemoglobin (Hb)**: low levels often suggest anemia — usually investigated with iron studies.\n- **WBC**: high values can indicate infection/inflammation; low values need review.\n- **Platelets**: important for clotting.\n- **LFT/KFT**: reflect liver and kidney function.\n\n> A single out-of-range value is not a diagnosis. Please share the report with your doctor, or upload it to your Health Records and ask the AI to explain it in context.`
    ),
    match(
      ["emergency", "chest pain", "heart attack", "stroke", "can't breathe", "unconscious"],
      `⚠️ **This sounds like a medical emergency.**\n\nPlease do the following **right now**:\n1. Call your local emergency number immediately (e.g. 112/911/108 depending on your country).\n2. Stay calm and keep the person seated or lying down.\n3. Do not give food or water if unconscious.\n4. If trained, begin CPR.\n\n> Do not wait for online advice. Reach the nearest emergency room as quickly as possible.`
    ),
  ];

  const fallback =
    `Thank you for your question. I can help with general health information, symptom overviews, report explanations and specialist suggestions.\n\nFor a more accurate response, please rephrase with a bit more detail (e.g. symptoms, how long they last, any existing conditions).\n\n> **Important:** I'm an AI assistant and not a doctor. This information is general and not a diagnosis. For persistent or serious symptoms, please consult a qualified healthcare professional. In an emergency, call your local emergency number.`;

  return answers.find(Boolean) ?? fallback;
}
