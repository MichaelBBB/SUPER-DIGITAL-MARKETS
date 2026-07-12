export interface ProductDelivery {
  name: string;
  license: string;
  link: string;
  instructions: string;
}

export function getProductDelivery(productId: number, orderRef: string): ProductDelivery {
  // 🔹 REPLACE THESE WITH YOUR REAL LICENSES/ACTIVATION LINKS
  const products: Record<number, ProductDelivery> = {
    1: { name: "ChatGPT Plus", license: `GPT-PRO-${Math.random().toString(36).substring(2, 12).toUpperCase()}`, link: "https://chat.openai.com", instructions: "Log in with the provided credentials or redeem this code at OpenAI's portal. Access activates immediately." },
    2: { name: "Adobe Creative Cloud", license: `ADOBE-${Math.random().toString(36).substring(2, 12).toUpperCase()}`, link: "https://account.adobe.com", instructions: "Use this license to activate your Adobe subscription. Full suite access is granted instantly." },
    3: { name: "Netflix Premium", license: `NF-${Math.random().toString(36).substring(2, 12).toUpperCase()}`, link: "https://netflix.com", instructions: "Log in with the credentials provided. 4K streaming & 4 screens are active immediately." },
    4: { name: "Microsoft 365 Business", license: `MS-${Math.random().toString(36).substring(2, 12).toUpperCase()}`, link: "https://www.office.com", instructions: "Activate your Microsoft 365 license here. Includes 1TB OneDrive & full Office suite." },
    5: { name: "Spotify Premium", license: `SPOT-${Math.random().toString(36).substring(2, 12).toUpperCase()}`, link: "https://spotify.com", instructions: "Redeem this code for ad-free music, offline downloads, and unlimited skips." },
    6: { name: "NordVPN", license: `NORD-${Math.random().toString(36).substring(2, 12).toUpperCase()}`, link: "https://nordvpn.com", instructions: "Use this license to activate your subscription. 5,500+ servers are ready instantly." },
    7: { name: "Notion Plus", license: `NOTION-${Math.random().toString(36).substring(2, 12).toUpperCase()}`, link: "https://notion.so", instructions: "Apply this code to upgrade your workspace. Unlimited blocks & file uploads are active." },
    8: { name: "Figma Professional", license: `FIG-${Math.random().toString(36).substring(2, 12).toUpperCase()}`, link: "https://figma.com", instructions: "Redeem for professional plan access. Unlimited files, versions, and team libraries included." },
  };

  return products[productId] || {
    name: "Digital Product",
    license: `LIC-${orderRef}`,
    link: "https://superdigital.store/activate",
    instructions: "Your access details have been generated. Check your inbox for setup instructions."
  };
}
