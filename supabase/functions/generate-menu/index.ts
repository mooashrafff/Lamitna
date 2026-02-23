// Supabase Edge Function: AI Chef – generates menu + grocery list
// Use either GEMINI_API_KEY or OPENAI_API_KEY in Supabase: Dashboard → Project Settings → Edge Functions → Secrets

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

const CATEGORIES = ["Appetizers", "Mains", "Sides", "Drinks", "Desserts"] as const;

function buildPrompt(body: {
  guestCount: number;
  cuisine: string;
  mood: string | null;
  cookingEffort: string | null;
  dietary: string | null;
  mealType?: string;
  variation?: string | null;
}) {
  const { guestCount, cuisine, mood, cookingEffort, dietary, mealType = "iftar", variation } = body;
  const cuisineName = cuisine === "mixed" ? "a mix of Middle Eastern and South Asian" : cuisine;
  const extras = [mood, cookingEffort, dietary !== "no_restrictions" && dietary].filter(Boolean).map((x) => String(x).replace(/_/g, " "));
  return `Ramadan menu + grocery. Guests: ${guestCount}. Cuisine: ${cuisineName}. Meal: ${mealType}.${extras.length ? " " + extras.join(". ") : ""}${variation ? ` Variation seed: ${variation}. Make it meaningfully different from typical outputs; avoid repeating the same common dishes.` : ""}

Reply ONLY with this JSON (no markdown):
{"menuItems":[{"category":"Appetizers|Mains|Sides|Drinks|Desserts","name":"dish","quantity":"for N"}],"groceryItems":[{"category":"PRODUCE|PROTEIN|DAIRY|PANTRY|OTHER","name":"amount item"}]}
Rules: 2 appetizers, 1 main, 1 side, 1 drink, 1 dessert. 5-8 grocery items. Quantities for ${guestCount} people. Short names.`;
}

const GEMINI_TIMEOUT_MS = 12_000;

async function callGemini(prompt: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${encodeURIComponent(GEMINI_API_KEY!)}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `Reply only with valid JSON. ${prompt}` }] }],
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 800,
      },
    }),
    signal: controller.signal,
  });
  clearTimeout(timeoutId);

  const responseText = await res.text();
  if (!res.ok) {
    throw new Error(`Gemini API error (${res.status}): ${responseText.slice(0, 300)}`);
  }

  let data: { candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[]; promptFeedback?: { blockReason?: string } };
  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(`Gemini returned non-JSON: ${responseText.slice(0, 200)}`);
  }

  const blockReason = data.promptFeedback?.blockReason;
  if (blockReason) {
    throw new Error(`Gemini blocked: ${blockReason}`);
  }

  const candidate = data.candidates?.[0];
  if (!candidate?.content?.parts?.length) {
    const reason = candidate?.finishReason ?? "no content";
    throw new Error(`Gemini no content (finishReason: ${reason})`);
  }

  const raw = candidate.content.parts.map((p) => p.text).filter(Boolean).join("").trim();
  return raw;
}

async function callGeminiWithTimeout(prompt: string): Promise<string> {
  try {
    return await callGemini(prompt);
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      throw new Error("Request timed out after 12s");
    }
    throw e;
  }
}

const OPENAI_TIMEOUT_MS = 12_000;

async function callOpenAI(prompt: string): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Reply only with valid JSON. Ramadan menu chef." },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
      max_tokens: 800,
    }),
    signal: controller.signal,
  });
  clearTimeout(timeoutId);

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error: ${err.slice(0, 200)}`);
  }

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const raw = data.choices?.[0]?.message?.content?.trim() ?? "";
  return raw;
}

async function callOpenAIWithTimeout(prompt: string): Promise<string> {
  try {
    return await callOpenAI(prompt);
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      throw new Error("Request timed out after 12s");
    }
    throw e;
  }
}

export async function POST(req: Request) {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  if (!GEMINI_API_KEY && !OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({
        error: "Set GEMINI_API_KEY or OPENAI_API_KEY in Supabase Dashboard → Project Settings → Edge Functions → Secrets.",
      }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const guestCount = Number(body.guestCount) || 4;
  const cuisine = String(body.cuisine || "mixed");
  const mood = body.mood != null ? String(body.mood) : null;
  const cookingEffort = body.cookingEffort != null ? String(body.cookingEffort) : null;
  const dietary = body.dietary != null ? String(body.dietary) : null;
  const mealType = body.mealType != null ? String(body.mealType) : "iftar";
  const variation = body.variation != null ? String(body.variation) : null;

  const prompt = buildPrompt({ guestCount, cuisine, mood, cookingEffort, dietary, mealType, variation });

  // Prefer OpenAI when both keys exist (usually faster); otherwise use Gemini
  let raw: string;
  try {
    if (OPENAI_API_KEY) {
      raw = await callOpenAIWithTimeout(prompt);
    } else if (GEMINI_API_KEY) {
      raw = await callGeminiWithTimeout(prompt);
    } else {
      throw new Error("No API key set");
    }
  } catch (e) {
    const details = e instanceof Error ? e.message : String(e);
    return new Response(
      JSON.stringify({ error: "AI request failed", details }),
      { status: 502, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }

  if (!raw || raw.length < 10) {
    return new Response(
      JSON.stringify({ error: "AI returned empty response", details: raw || "(empty)" }),
      { status: 502, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }

  let parsed: { menuItems?: { category: string; name: string; quantity: string }[]; groceryItems?: { category: string; name: string }[] };
  try {
    const cleaned = raw.replace(/^```json?\s*|\s*```$/g, "").trim();
    parsed = JSON.parse(cleaned);
  } catch {
    return new Response(
      JSON.stringify({ error: "AI returned invalid JSON", raw: raw.slice(0, 500) }),
      { status: 502, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }

  const menuItems = (parsed.menuItems ?? []).map((item, i) => ({
    id: `ai-${Date.now()}-${i}`,
    category: CATEGORIES.includes(item.category as (typeof CATEGORIES)[number]) ? item.category : "Mains",
    name: item.name || "Dish",
    quantity: item.quantity || "1 serving",
  }));

  const groceryItems = (parsed.groceryItems ?? []).map((item, i) => ({
    id: `ai-g-${Date.now()}-${i}`,
    category: item.category || "OTHER",
    name: item.name || "Item",
    checked: false,
  }));

  return new Response(
    JSON.stringify({ menuItems, groceryItems }),
    { headers: { ...cors, "Content-Type": "application/json" } }
  );
}
