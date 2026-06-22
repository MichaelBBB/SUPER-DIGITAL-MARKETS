export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  image: string;
  imageAlt: string;
  badge: 'HOT' | 'NEW' | 'POPULAR';
  markets: string[];
  rank: number;
}

export const DIGITAL_PRODUCTS: Product[] = [
{
  id: 'chatgpt-plus',
  name: 'ChatGPT Plus',
  category: 'AI Tools',
  price: '20.00',
  description: 'OpenAI\'s GPT-4 powered assistant. Advanced reasoning, image generation, and browsing included.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1b29dccf5-1772593978671.png",
  imageAlt: 'Futuristic AI interface with glowing blue neural network on dark background',
  badge: 'HOT',
  markets: ['USA', 'India', 'China'],
  rank: 1
},
{
  id: 'adobe-creative-cloud',
  name: 'Adobe Creative Cloud',
  category: 'Creative',
  price: '54.99',
  description: 'Full suite of Adobe apps — Photoshop, Illustrator, Premiere Pro, and 20+ more.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_11ba60dc7-1772888679548.png",
  imageAlt: 'Creative digital design workspace with colorful abstract art on dark background',
  badge: 'POPULAR',
  markets: ['USA', 'India', 'China'],
  rank: 2
},
{
  id: 'netflix-premium',
  name: 'Netflix Premium',
  category: 'Entertainment',
  price: '22.99',
  description: '4K streaming, 4 simultaneous screens, offline downloads. 10,000+ titles worldwide.',
  image: "https://images.unsplash.com/photo-1667398789674-123c90ae0a1d",
  imageAlt: 'Home cinema setup with large bright screen showing movie, dark atmospheric room',
  badge: 'HOT',
  markets: ['USA', 'India'],
  rank: 3
},
{
  id: 'microsoft-365',
  name: 'Microsoft 365 Business',
  category: 'Business',
  price: '12.50',
  description: 'Word, Excel, PowerPoint, Teams, and 1TB OneDrive. For business and personal use.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_11a13b86a-1772501061175.png",
  imageAlt: 'Modern office with multiple screens showing productivity software, blue light atmosphere',
  badge: 'POPULAR',
  markets: ['USA', 'India', 'China'],
  rank: 4
},
{
  id: 'spotify-premium',
  name: 'Spotify Premium',
  category: 'Entertainment',
  price: '9.99',
  description: 'Ad-free music, offline listening, unlimited skips. 100M+ songs and podcasts.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_11e1d2eba-1772153726612.png",
  imageAlt: 'Colorful music visualizer with glowing sound waves on dark background',
  badge: 'POPULAR',
  markets: ['USA', 'India'],
  rank: 5
},
{
  id: 'nordvpn',
  name: 'NordVPN',
  category: 'Security',
  price: '3.99',
  description: 'Military-grade encryption, 5,500+ servers in 60 countries. No-logs policy.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1be249a4b-1772157615587.png",
  imageAlt: 'Abstract cybersecurity visualization with glowing green network nodes on dark background',
  badge: 'HOT',
  markets: ['USA', 'India', 'China'],
  rank: 6
},
{
  id: 'canva-pro',
  name: 'Canva Pro',
  category: 'Creative',
  price: '12.99',
  description: 'Premium design templates, Brand Kit, background remover, and 100M+ stock assets.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_11ba60dc7-1772888679548.png",
  imageAlt: 'Colorful graphic design workspace with vibrant color palettes and design tools',
  badge: 'NEW',
  markets: ['USA', 'India', 'China'],
  rank: 7
},
{
  id: 'grammarly-premium',
  name: 'Grammarly Premium',
  category: 'Productivity',
  price: '12.00',
  description: 'AI writing assistant with advanced grammar, clarity, and plagiarism detection.',
  image: "https://images.unsplash.com/photo-1481529402569-14288964caa4",
  imageAlt: 'Clean white desk with laptop showing writing interface, bright and airy workspace',
  badge: 'POPULAR',
  markets: ['USA', 'India'],
  rank: 8
},
{
  id: 'zoom-pro',
  name: 'Zoom Pro',
  category: 'Business',
  price: '14.99',
  description: 'Unlimited meetings up to 30 hours, 100 participants, cloud recording, admin controls.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_15e477f36-1766910586016.png",
  imageAlt: 'Video conference call on laptop screen in modern bright office environment',
  badge: 'HOT',
  markets: ['USA', 'India', 'China'],
  rank: 9
},
{
  id: 'notion-plus',
  name: 'Notion Plus',
  category: 'Productivity',
  price: '8.00',
  description: 'All-in-one workspace for notes, wikis, databases, and project management.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_128e820c7-1776089871844.png",
  imageAlt: 'Organized digital workspace with clean note-taking interface on bright screen',
  badge: 'POPULAR',
  markets: ['USA', 'India', 'China'],
  rank: 10
},
{
  id: 'figma-professional',
  name: 'Figma Professional',
  category: 'Creative',
  price: '12.00',
  description: 'Collaborative UI/UX design tool. Real-time multiplayer, unlimited projects, dev mode.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1f5b4d3d4-1772202235094.png",
  imageAlt: 'UI design wireframes and components on dark design canvas with colorful elements',
  badge: 'HOT',
  markets: ['USA', 'India', 'China'],
  rank: 11
},
{
  id: 'dropbox-plus',
  name: 'Dropbox Plus',
  category: 'Productivity',
  price: '9.99',
  description: '2TB cloud storage, Smart Sync, version history, and secure file sharing.',
  image: "https://images.unsplash.com/photo-1734313996263-b5fb6686980e",
  imageAlt: 'Abstract cloud storage visualization with floating data cubes in blue digital space',
  badge: 'POPULAR',
  markets: ['USA', 'India'],
  rank: 12
},
{
  id: 'lastpass-premium',
  name: 'LastPass Premium',
  category: 'Security',
  price: '3.00',
  description: 'Secure password manager with dark web monitoring, 1GB encrypted storage.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_16d49bd53-1778807602721.png",
  imageAlt: 'Digital security lock with glowing blue encryption patterns on dark background',
  badge: 'POPULAR',
  markets: ['USA', 'India', 'China'],
  rank: 13
},
{
  id: 'cursor-ai',
  name: 'Cursor AI Pro',
  category: 'AI Tools',
  price: '20.00',
  description: 'AI-first code editor built on VS Code. Write, edit, and debug with GPT-4 natively.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1b1dbdae5-1772109758135.png",
  imageAlt: 'Dark code editor with colorful syntax highlighting and AI suggestion panel',
  badge: 'NEW',
  markets: ['USA', 'India', 'China'],
  rank: 14
},
{
  id: 'midjourney',
  name: 'Midjourney Standard',
  category: 'AI Tools',
  price: '24.00',
  description: 'AI image generation. 15 GPU hours/month, unlimited relaxed generations.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_106584dfb-1764689812608.png",
  imageAlt: 'Stunning AI-generated fantasy landscape with vivid colors and surreal architecture',
  badge: 'HOT',
  markets: ['USA', 'India', 'China'],
  rank: 15
},
{
  id: 'github-copilot',
  name: 'GitHub Copilot',
  category: 'AI Tools',
  price: '10.00',
  description: 'AI pair programmer. Real-time code suggestions, multi-language support.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_16a68d756-1772361455009.png",
  imageAlt: 'Dark coding environment with glowing code lines and AI autocomplete interface',
  badge: 'HOT',
  markets: ['USA', 'India', 'China'],
  rank: 16
},
{
  id: 'slack-pro',
  name: 'Slack Pro',
  category: 'Business',
  price: '7.25',
  description: 'Team messaging with unlimited message history, Huddles, and 10+ app integrations.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_11a13b86a-1772501061175.png",
  imageAlt: 'Modern team collaboration space with multiple screens showing messaging app, bright office',
  badge: 'POPULAR',
  markets: ['USA', 'India', 'China'],
  rank: 17
},
{
  id: 'dashlane-premium',
  name: 'Dashlane Premium',
  category: 'Security',
  price: '4.99',
  description: 'Password manager with VPN, dark web monitoring, and phishing alerts.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_10cd15f29-1772191881192.png",
  imageAlt: 'Cybersecurity shield visualization with glowing network protection patterns',
  badge: 'POPULAR',
  markets: ['USA', 'India'],
  rank: 18
},
{
  id: 'adobe-photoshop',
  name: 'Adobe Photoshop',
  category: 'Creative',
  price: '22.99',
  description: 'Industry-standard photo editing and compositing. AI-powered tools, Neural Filters.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_110da9c03-1775322216305.png",
  imageAlt: 'Professional photo retouching workspace with vibrant color-graded portrait on screen',
  badge: 'POPULAR',
  markets: ['USA', 'India', 'China'],
  rank: 19
},
{
  id: 'claude-pro',
  name: 'Claude Pro',
  category: 'AI Tools',
  price: '20.00',
  description: 'Anthropic\'s advanced AI assistant. 200K context window, priority access.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_13f77e0fe-1772815067249.png",
  imageAlt: 'Abstract AI brain visualization with glowing orange neural connections on dark background',
  badge: 'NEW',
  markets: ['USA', 'India'],
  rank: 20
},
{
  id: 'premiere-pro',
  name: 'Adobe Premiere Pro',
  category: 'Creative',
  price: '22.99',
  description: 'Professional video editing with AI auto-reframe, speech-to-text, and Lumetri color.',
  image: "https://images.unsplash.com/photo-1653043586925-cfb4676c69a2",
  imageAlt: 'Professional video editing timeline on dark screen with colorful footage clips',
  badge: 'HOT',
  markets: ['USA', 'India', 'China'],
  rank: 21
},
{
  id: 'asana-premium',
  name: 'Asana Premium',
  category: 'Business',
  price: '10.99',
  description: 'Project management with Gantt charts, workflow automation, and advanced reporting.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_12bdcc271-1772386977922.png",
  imageAlt: 'Project management dashboard with colorful task boards and timeline view on bright screen',
  badge: 'POPULAR',
  markets: ['USA', 'India'],
  rank: 22
},
{
  id: 'expressvpn',
  name: 'ExpressVPN',
  category: 'Security',
  price: '6.67',
  description: 'Ultra-fast VPN with 3,000+ servers, split tunneling, and 24/7 support.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_14072585a-1772997598024.png",
  imageAlt: 'Glowing digital globe with encrypted network connections in deep blue space',
  badge: 'HOT',
  markets: ['USA', 'India', 'China'],
  rank: 23
},
{
  id: 'youtube-premium',
  name: 'YouTube Premium',
  category: 'Entertainment',
  price: '13.99',
  description: 'Ad-free YouTube, background play, offline downloads, and YouTube Music included.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1ceca13e9-1773169728546.png",
  imageAlt: 'Bright home entertainment setup with TV showing video streaming platform',
  badge: 'POPULAR',
  markets: ['USA', 'India'],
  rank: 24
},
{
  id: '1password',
  name: '1Password',
  category: 'Security',
  price: '2.99',
  description: 'Password manager with Travel Mode, Watchtower security alerts, and family sharing.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_13eb5ad4d-1777714002546.png",
  imageAlt: 'Matrix-style digital code stream with security lock symbol in green on black background',
  badge: 'POPULAR',
  markets: ['USA', 'India'],
  rank: 25
},
{
  id: 'monday-pro',
  name: 'Monday.com Pro',
  category: 'Business',
  price: '9.00',
  description: 'Visual work OS with automations, integrations, and real-time collaboration dashboards.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_13e17ec1e-1774515743644.png",
  imageAlt: 'Colorful business analytics dashboard with charts and graphs on bright screen',
  badge: 'NEW',
  markets: ['USA', 'India', 'China'],
  rank: 26
},
{
  id: 'perplexity-pro',
  name: 'Perplexity Pro',
  category: 'AI Tools',
  price: '20.00',
  description: 'AI-powered search engine with real-time web access, citations, and image generation.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1a97cb8f7-1772192054483.png",
  imageAlt: 'Futuristic search interface with glowing AI brain processing information in dark space',
  badge: 'NEW',
  markets: ['USA', 'India'],
  rank: 27
},
{
  id: 'loom-business',
  name: 'Loom Business',
  category: 'Productivity',
  price: '12.50',
  description: 'Async video messaging. Screen + cam recording, AI summaries, team workspace.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1ff813462-1772781006813.png",
  imageAlt: 'Person recording screen tutorial video with bright home office setup',
  badge: 'POPULAR',
  markets: ['USA', 'India'],
  rank: 28
},
{
  id: 'webflow-basic',
  name: 'Webflow CMS',
  category: 'Business',
  price: '14.00',
  description: 'No-code website builder with CMS, hosting, and custom domain. Export clean code.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c6a65c22-1765804100175.png",
  imageAlt: 'Modern website design interface with drag-and-drop elements on bright screen',
  badge: 'NEW',
  markets: ['USA', 'India', 'China'],
  rank: 29
},
{
  id: 'elevenlabs-starter',
  name: 'ElevenLabs Starter',
  category: 'AI Tools',
  price: '5.00',
  description: 'AI voice cloning and text-to-speech. 30,000 characters/month, 10+ voice styles.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1011b6d25-1767094875994.png",
  imageAlt: 'Audio waveform visualization with glowing cyan sound waves on dark background',
  badge: 'NEW',
  markets: ['USA', 'India'],
  rank: 30
}];