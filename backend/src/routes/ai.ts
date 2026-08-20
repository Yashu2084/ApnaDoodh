import { Router } from "express";
import { ProductRepository } from "../lib/repositories/product.repository";
import { isRateLimited, sanitizeInput } from "../lib/security";

type Action = "VIEW_PRODUCTS" | "EXPLORE_MILK" | "BROWSE_PANEER" | "FIND_NEARBY_FARMERS" | "CHANGE_LOCATION" | "TRACK_ORDER" | "GO_TO_LOGIN" | "GO_TO_SIGNUP" | "OPEN_WHATSAPP";
type ChatResult = { message: string; action?: Action; actionLabel?: string };
const router = Router();
const products = new ProductRepository();
const supportedActions = new Set<Action>(["VIEW_PRODUCTS", "EXPLORE_MILK", "BROWSE_PANEER", "FIND_NEARBY_FARMERS", "CHANGE_LOCATION", "TRACK_ORDER", "GO_TO_LOGIN", "GO_TO_SIGNUP", "OPEN_WHATSAPP"]);

const systemPrompt = `You are the ApnaDoodh AI Dairy Assistant: a warm, concise dairy and website guide.
Educate about dairy in general terms, suggest relevant ApnaDoodh pages naturally, and never invent product availability, prices, delivery times, farmers, locations, or features. Never diagnose, prescribe, or claim dairy cures illness; recommend a qualified healthcare professional for medical or allergy questions.
Return ONLY JSON matching {"message":"...","action":"OPTIONAL_ACTION","actionLabel":"OPTIONAL_LABEL"}. Supported actions: VIEW_PRODUCTS, EXPLORE_MILK, BROWSE_PANEER, FIND_NEARBY_FARMERS, CHANGE_LOCATION, TRACK_ORDER, GO_TO_LOGIN, GO_TO_SIGNUP, OPEN_WHATSAPP.`;

function localReply(message: string): ChatResult {
  const text = message.toLowerCase();
  if (/track|delivery status|where.*order/.test(text)) return { message: "You can check the status of an active order in Live Order Tracking.", action: "TRACK_ORDER", actionLabel: "Track My Order" };
  if (/nearby|farmer|location|deliver.*area/.test(text)) return { message: "You can browse nearby farmers, or set your delivery location to see options relevant to you.", action: "FIND_NEARBY_FARMERS", actionLabel: "Find Nearby Farmers" };
  if (/paneer/.test(text)) return { message: "Paneer is a versatile dairy option for curries, snacks and balanced meals. Explore currently listed paneer products to check availability near you.", action: "BROWSE_PANEER", actionLabel: "View Paneer" };
  if (/milk|tea|coffee|family|breakfast/.test(text)) return { message: "Fresh milk can fit well into tea, coffee, breakfast and cooking. The best choice depends on your household's taste and use—explore the available milk options for details.", action: "EXPLORE_MILK", actionLabel: "Explore Milk" };
  if (/ghee|butter|curd|dairy product|product/.test(text)) return { message: "ApnaDoodh lists dairy products based on availability. You can explore the Products section to see current options and details.", action: "VIEW_PRODUCTS", actionLabel: "View Products" };
  if (/login|sign in|account/.test(text)) return { message: "You can sign in to manage your account and orders. If you are new, you can create an account first.", action: "GO_TO_LOGIN", actionLabel: "Go to Login" };
  if (/allergy|pregnan|disease|medical|cure|health condition/.test(text)) return { message: "I can share general product information, but I can't provide medical advice. For allergies, dietary restrictions, or health conditions, please consult a qualified healthcare professional." };
  return { message: "I can help you explore dairy products, find nearby farmers, navigate ApnaDoodh, or track an order. What are you looking for today?", action: "VIEW_PRODUCTS", actionLabel: "View Products" };
}

router.post("/chat", async (req, res) => {
  const ip = req.ip || "unknown";
  if (await isRateLimited(ip, "ai-chat", 12, 60)) return res.status(429).json({ error: "Please wait a moment before sending another message." });
  const body = sanitizeInput(req.body) as { message?: string };
  const message = body.message?.slice(0, 600);
  if (!message) return res.status(400).json({ error: "A message is required." });

  try {
    // Product data is read at request time so the assistant never invents catalog items.
    const { products: catalog } = await products.getAll({ limit: 25, status: "Active" });
    const apiKey = process.env.AI_API_KEY;
    if (apiKey) {
      const catalogSummary = catalog.map((product) => `${product.name} (${product.category})`).join(", ") || "No products currently listed";
      const providerResponse = await fetch(process.env.AI_API_URL || "https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: process.env.AI_MODEL || "gpt-4o-mini",
          temperature: 0.35,
          response_format: { type: "json_object" },
          messages: [{ role: "system", content: `${systemPrompt}\nCurrent catalog: ${catalogSummary}` }, { role: "user", content: message }],
        }),
      });
      if (providerResponse.ok) {
        const payload = await providerResponse.json() as { choices?: Array<{ message?: { content?: string } }> };
        const content = payload.choices?.[0]?.message?.content;
        if (content) {
          const result = JSON.parse(content) as ChatResult;
          if (typeof result.message === "string" && result.message.trim()) {
            return res.json({
              message: result.message.slice(0, 1600),
              ...(result.action && supportedActions.has(result.action) ? { action: result.action, actionLabel: result.actionLabel?.slice(0, 60) } : {}),
            });
          }
        }
      }
    }
    return res.json(localReply(message));
  } catch (error) {
    console.error("AI assistant request failed", error);
    // The assistant remains useful during a database or AI-provider outage.
    return res.json(localReply(message));
  }
});

export default router;
