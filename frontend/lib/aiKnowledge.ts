export type AssistantAction =
  | "VIEW_PRODUCTS"
  | "EXPLORE_MILK"
  | "BROWSE_PANEER"
  | "FIND_NEARBY_FARMERS"
  | "CHANGE_LOCATION"
  | "TRACK_ORDER"
  | "GO_TO_LOGIN"
  | "GO_TO_SIGNUP"
  | "CONTACT_SUPPORT"
  | "OPEN_WHATSAPP";

export type AssistantResponse = {
  message: string;
  action?: AssistantAction;
  actionLabel?: string;
};

export const assistantQuickActions: Array<{ label: string; prompt: string }> = [
  { label: "Explore Milk", prompt: "Show me milk products" },
  { label: "Dairy Products", prompt: "What dairy products can I explore?" },
  { label: "Find Near Me", prompt: "Help me find nearby farmers" },
  { label: "Track Order", prompt: "How do I track my order?" },
  { label: "How it works", prompt: "How does ApnaDoodh work?" },
];

export const assistantWelcomeMessage = "Hi! Welcome to ApnaDoodh. I'm your personal Dairy Assistant. I can help you find dairy products, learn about milk, paneer and ghee, explore nearby options, and navigate the website. What would you like help with today?";

export const pageGreeting = (path: string): string | null => {
  if (path === "/products") return "Need help choosing a product? Tell me what you're looking for and I'll help you find it.";
  if (path === "/order-tracking") return "Need help understanding your order status? I can guide you through tracking.";
  if (path === "/login") return "Having trouble accessing your account? I can help guide you.";
  return null;
};

export const actionPaths: Record<AssistantAction, string | null> = {
  VIEW_PRODUCTS: "/products",
  EXPLORE_MILK: "/products?category=Milk",
  BROWSE_PANEER: "/products?category=Paneer",
  FIND_NEARBY_FARMERS: "/farmers/nearby",
  CHANGE_LOCATION: null,
  TRACK_ORDER: "/order-tracking",
  GO_TO_LOGIN: "/login",
  GO_TO_SIGNUP: "/signup",
  CONTACT_SUPPORT: null,
  OPEN_WHATSAPP: null,
};
