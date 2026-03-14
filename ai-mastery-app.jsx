import { useState, useEffect, useRef } from "react";
import { supabase } from "./src/supabaseClient";

/* ─── DATA ─── */
const WEEKS = [
  {
    id: 1, emoji: "🧠", title: "AI Fundamentals + Chat Mastery", subtitle: "Days 1–7", accent: "#528BFF",
    overview: "Master how LLMs work, become an expert prompt engineer, and deeply learn ChatGPT (GPT-5.3/o3), Claude (Opus 4.6), and Gemini 3 Pro.",
    days: [
      { day: 1, title: "How AI Actually Works", emoji: "⚡",
        learn: ["Watch 3Blue1Brown's neural network series — understand transformers visually", "Read Anthropic's prompt engineering docs end to end (docs.claude.com)", "Core concepts: tokens, context windows (200K+), temperature, system prompts, chain-of-thought", "2026 shift: reasoning models (o3, Claude extended thinking) vs fast models (GPT-4o, Sonnet)"],
        create: ["Write a mega X thread explaining AI to a 15-year-old — use Canva AI for visuals", "Create an infographic: 'The AI Landscape in 2026' showing all major players"],
        post: ["X thread: 'I'm spending 30 days mastering every AI tool. Day 1: How AI actually works…'", "Announce the 30-day challenge on Instagram stories"]
      },
      { day: 2, title: "Prompt Engineering Masterclass", emoji: "🎯",
        learn: ["Master: chain-of-thought, few-shot, role prompting, structured outputs (XML/JSON)", "Study the RISEN framework + Claude's official prompting guide", "Learn meta-prompting: prompts that generate better prompts", "Rewrite 10 bad prompts → get 10x better outputs"],
        create: ["Build a 'Prompt Engineering Cheat Sheet' — design in Canva AI, make it downloadable", "Record screen-capture: bad vs good prompt with shocking difference in results"],
        post: ["X post: before/after prompt comparison with screenshots (these go viral)", "Share cheat sheet as free download — start building audience"]
      },
      { day: 3, title: "ChatGPT Deep Dive (GPT-5.3 + o3)", emoji: "🤖",
        learn: ["Explore GPT-5.3 Instant, o3 reasoning, Custom GPTs, Canvas, memory, vision, Advanced Voice", "Test Deep Research (free: 5 reports/month, paid: full GPT-5.3)", "GPT-5.3 vs o3: when to use fast model vs reasoning model", "Give it 10 diverse tasks and rate performance honestly"],
        create: ["Build a custom GPT for a specific use case (content calendar, video script writer)", "Script a video: 'Complete ChatGPT Guide 2026'"],
        post: ["X post: '10 ChatGPT features most people don't know exist in 2026'", "Instagram Reel: quick demo of the most mind-blowing feature"]
      },
      { day: 4, title: "Claude Deep Dive (Opus 4.6 + Sonnet)", emoji: "🔮",
        learn: ["Master Artifacts, Projects, extended thinking, Claude Code (#1 AI coding tool)", "200K context (1M beta on Opus), reasoning, coding, long document analysis", "Test the same 10 tasks from yesterday — compare honestly", "Learn MCP (Model Context Protocol) integrations"],
        create: ["Build something impressive with Claude Artifacts (interactive React app)", "Write detailed comparison notes — be honest about strengths/weaknesses"],
        post: ["X thread: 'Claude vs ChatGPT — I tested both on 10 tasks. Here's what shocked me'"]
      },
      { day: 5, title: "Gemini 3 Pro + Perplexity + DeepSeek", emoji: "🌐",
        learn: ["Gemini 3 Pro: multimodal, 1M token context, Nano Banana Pro images, Veo 3.1 video", "Perplexity: deep research with citations — the anti-hallucination engine", "DeepSeek: open-source reasoning model making waves in coding", "Test each where they're supposed to excel"],
        create: ["Create definitive 'AI Tool Tier List for 2026' — which AI wins at what", "Design infographic ranking all tools by category"],
        post: ["X post: 'The REAL AI tier list for 2026 — based on 100+ tests'", "Instagram carousel: visual tier list"]
      },
      { day: 6, title: "AI for Research & Learning", emoji: "📚",
        learn: ["NotebookLM: upload PDFs/websites → AI podcast discussions (100 notebooks free!)", "Research workflow: Perplexity → Claude → NotebookLM for synthesis", "Research a complex topic in 30 min with AI vs 3 hours manually"],
        create: ["Create a NotebookLM podcast from your own content", "Write a blog post using the AI research pipeline end to end"],
        post: ["X post: screen recording of NotebookLM turning notes into a podcast", "Instagram Reel: 'This AI turns your notes into a PODCAST'"]
      },
      { day: 7, title: "Week 1 Content Day", emoji: "🎬",
        learn: ["Review and consolidate all notes from this week", "Study top AI creators — identify gaps you can fill"],
        create: ["Edit and publish video #1: 'ChatGPT vs Claude vs Gemini — The Truth in 2026'", "Cut 3–4 Reels from this week's best demos"],
        post: ["Publish video — optimize title, thumbnail, description with AI", "X recap: 'Week 1 of my 30-day AI mastery. 7 tools. Here's the truth…'"]
      }
    ]
  },
  {
    id: 2, emoji: "💻", title: "AI Coding & App Building", subtitle: "Days 8–14", accent: "#2EA043",
    overview: "Claude Code is now #1. You already code — now ship products in hours. 'I built X with AI' content is the most viral in the niche.",
    days: [
      { day: 8, title: "Claude Code Mastery", emoji: "⚡",
        learn: ["Set up Claude Code with proper CLAUDE.md files — key to great outputs", "Agentic workflows: Claude Code plans, executes, tests, iterates autonomously", "Terminal-first: 200K context, multi-file editing, shell commands", "Build a complete web app from a single detailed prompt"],
        create: ["Build a real web app end-to-end with Claude Code", "Screen record THE ENTIRE process — raw footage is gold"],
        post: ["X post: time-lapse building a full app with AI in 60 minutes", "Instagram Reel: the best 'wow' moments from the build"]
      },
      { day: 9, title: "Cursor + Google Antigravity", emoji: "🖥️",
        learn: ["Cursor: IDE-first — Tab completion, Composer, inline editing, background agents", "Google Antigravity: new agent-first IDE, multi-agent orchestration, Mission Control", "Compare: Cursor (interactive) vs Claude Code (autonomous)", "Same project in both tools — document differences"],
        create: ["Rebuild yesterday's app using Cursor — compare speed and quality", "Document honest pros/cons of each approach"],
        post: ["X thread: 'Cursor vs Claude Code in 2026 — I used both. Here's the verdict'"]
      },
      { day: 10, title: "Zero-Code Builders (Lovable + Bolt + Replit)", emoji: "🚀",
        learn: ["Lovable: React + Tailwind + Vite from prompts, multiplayer, GitHub sync", "Bolt.new: full-stack in the browser — frontend, backend, database, deploy", "Replit Agent: describe → complete app with hosting, auth, database", "Perfect for non-coders = HUGE audience for content"],
        create: ["Build 3 apps with 3 tools — same idea, compare results", "Record entire process for each"],
        post: ["X post: 'I built 3 apps without code. Here's which tool won'", "Instagram Reel: speed comparison of all 3"]
      },
      { day: 11, title: "OpenAI Codex + GitHub Copilot", emoji: "🔧",
        learn: ["Codex: cloud-based agent — assign tasks, runs autonomously 1–30 min", "Codex CLI + Desktop App (Feb 2026) — parallel multi-agent workflows", "GitHub Copilot Agent Mode: supports Claude, Codex models", "95% of devs use AI weekly, 75% for 50%+ of work"],
        create: ["Build with Codex parallel agents — multiple tasks simultaneously", "Create definitive AI coding tool ranking"],
        post: ["X thread: 'Every AI coding tool ranked — the definitive tier list for 2026'"]
      },
      { day: 12, title: "Shipping & Deploying", emoji: "🌍",
        learn: ["Deploy with Vercel, Railway, or Fly.io — AI handles config", "Supabase + AI for rapid backend (auth, DB, real-time) in minutes", "OpenAI and Anthropic APIs directly — tokens, pricing, streaming", "Build something with AI APIs behind the scenes"],
        create: ["Deploy your best project with a real domain", "Record 'idea to deployed in 2 hours' walkthrough"],
        post: ["X post: 'Shipped a product built entirely with AI. Live link + walkthrough'"]
      },
      { day: 13, title: "AI Automation (n8n + Make.com)", emoji: "⚙️",
        learn: ["n8n (open source) and Make.com for AI-powered automation", "Build: auto-reply emails, auto-post social, auto-research competitors", "Connect AI APIs to real business processes — monetizable skill", "The agentic shift: AI that performs work, not just answers"],
        create: ["Build 3 useful automations that save real time", "Screen record step-by-step for tutorials"],
        post: ["X thread: '3 AI automations that save 5+ hours/week (free templates)'"]
      },
      { day: 14, title: "Week 2 Content Day", emoji: "🎬",
        learn: ["Review all builds — which makes the best video?", "Study what coding/building content performs best right now"],
        create: ["Edit and publish: 'I Built an App with AI in 60 Minutes (No Code Needed)'", "Create 3–4 Reels from build clips and time-lapses"],
        post: ["Publish video #2", "X recap: 'Week 2: 5+ apps built. The honest truth about AI coding in 2026…'"]
      }
    ]
  },
  {
    id: 3, emoji: "🎨", title: "AI Images, Video & Creative", subtitle: "Days 15–21", accent: "#A371F7",
    overview: "Nano Banana Pro leads images, Veo 3.1 leads video, Suno V5 dominates music. Master the full creative AI stack.",
    days: [
      { day: 15, title: "Midjourney + GPT Image 1.5", emoji: "🖼️",
        learn: ["Midjourney: king of artistic imagery — styles, aspect ratios, --v, --chaos", "GPT Image 1.5: highest LM Arena score (1264), best text in images", "Consistent character generation: seed locking, reference images", "Generate 50+ images, experiment with different prompt structures"],
        create: ["Create themed YouTube thumbnails using both tools", "Build a personal prompt library for different visual styles"],
        post: ["X post: grid of best generations with exact prompts", "Instagram Reel: 'Midjourney vs GPT Image — which is better?'"]
      },
      { day: 16, title: "Nano Banana Pro + Flux 2 + Ideogram + Firefly", emoji: "✨",
        learn: ["Nano Banana Pro (Google Gemini 3): top photorealism, multimodal reasoning", "Flux 2: open-weight, full customization, privacy-friendly", "Ideogram: best text rendering in images — logos, posters, marketing", "Adobe Firefly: commercially safe, licensed data, Photoshop integration"],
        create: ["Same prompt across all 6 tools — side-by-side comparison grid", "Design 10 thumbnails with different tools — test which gets better engagement"],
        post: ["X thread: 'I tested EVERY image generator with the same prompt. Results shocked me'"]
      },
      { day: 17, title: "AI Video (Veo 3.1 + Sora 2 + Runway + Kling)", emoji: "🎥",
        learn: ["Google Veo 3.1: gold standard — native 4K, character consistency, integrated audio", "Sora 2: best narrative intelligence — thinks like an AI director", "Runway Gen-4.5: #1 benchmark, motion brushes, creative tooling", "Kling 2.6: audio-visual sync, 2-min videos, best value"],
        create: ["Generate 10+ clips across all tools — compare realism and creativity", "Create a showreel of the best AI video clips"],
        post: ["X post: best clips with prompts — side-by-side comparisons", "Instagram Reel: 'AI video is THIS good now'"]
      },
      { day: 18, title: "AI Voice + Music (ElevenLabs + Suno V5)", emoji: "🎵",
        learn: ["ElevenLabs: all-in-one — voice cloning, TTS, video, music, sound effects", "Suno V5: $2.45B valuation, 100M users, Warner deal, built-in DAW", "Clone your voice in ElevenLabs (< 5 minutes in 2026)", "Generate full songs with Suno: lyrics, vocals, instruments — edit stems"],
        create: ["Clone your voice → generate narration for your content", "Create a full original song with Suno V5 — export and remix stems", "Try Udio ($10/mo) and ElevenLabs Eleven Music"],
        post: ["X post: 'I cloned my voice with AI. Can you tell which is real?'", "Share the AI song with behind-the-scenes"]
      },
      { day: 19, title: "AI Photo/Video Editing", emoji: "✂️",
        learn: ["CapCut AI: auto-captions, effects, background removal, smart editing", "Canva AI: Magic Design, brand kit generation, background remover", "Photoshop Generative Fill + Expand — the pro standard", "YouTube: 1M+ channels use AI creation tools daily"],
        create: ["Edit a complete video using primarily AI tools — measure time saved", "Create 5 social posts from scratch using Canva AI"],
        post: ["X post: 'How I edit videos in half the time with AI (workflow revealed)'"]
      },
      { day: 20, title: "Full AI Creative Pipeline", emoji: "🔄",
        learn: ["Complete pipeline: AI script → images → voiceover → video → edit", "Calculate real cost and time savings vs traditional production", "HeyGen: AI avatars with lip-sync (175+ languages, 4K)", "Synthesia: corporate/explainer content (90% of Fortune 100 use it)"],
        create: ["Produce a COMPLETE video using only AI tools — zero traditional filming", "Document every tool, step, and cost with timestamps"],
        post: ["X thread: 'Entire video made 100% by AI. Every tool, step, and cost revealed'"]
      },
      { day: 21, title: "Week 3 Content Day", emoji: "🎬",
        learn: ["Review creative outputs — pick most visually impressive for video", "Study trending creative AI comparisons right now"],
        create: ["Edit and publish: 'Every AI Creative Tool Ranked' or 'Full Video Made by AI'", "Create 3–4 Reels from eye-catching demos"],
        post: ["Publish video #3", "X recap: 'Week 3: Images, video, voice, music — the game has changed'"]
      }
    ]
  },
  {
    id: 4, emoji: "🚀", title: "Advanced AI + Going Pro", subtitle: "Days 22–30", accent: "#D29922",
    overview: "Go deeper with agents, local models, APIs. Build your brand, content machine, and monetization strategy.",
    days: [
      { day: 22, title: "AI Agents & Agentic Workflows", emoji: "🤖",
        learn: ["The 2026 agentic shift: AI that performs work, not just answers", "Build agents with Claude tool use, Custom GPTs, CrewAI/LangChain", "Manus AI: orchestrates complex tasks across different AI models", "Agents + MCP = AI connected to real tools and data"],
        create: ["Build a functional AI agent that does something useful", "Record the build process — agent content is in demand"],
        post: ["X thread: 'AI Agents explained simply + I built one that does [X] automatically'"]
      },
      { day: 23, title: "AI for Business & Monetization", emoji: "💰",
        learn: ["What AI services people actually pay for right now", "Hot services: automation setup, video production, content systems, consulting", "AI content niche economics — ad revenue, sponsorships, courses", "Faceless channels = fastest-growing income stream in 2026"],
        create: ["Create a services page or pitch deck for AI freelancing", "Draft cold outreach templates for AI implementation services"],
        post: ["X thread: '10 ways to make real money with AI skills in 2026'"]
      },
      { day: 24, title: "Advanced Prompts + Prompt Library", emoji: "📖",
        learn: ["Meta-prompting, prompt chaining, structured outputs, system prompt design", "Create reusable templates: writing, code, research, analysis", "Build custom system prompts for different workflows"],
        create: ["'Ultimate Prompt Library' — 50+ prompts categorized by use case", "Package as free lead magnet or digital product"],
        post: ["X post: share 5 most powerful prompts with results — tease full library"]
      },
      { day: 25, title: "AI APIs & Building Products", emoji: "🔌",
        learn: ["OpenAI API (GPT-5.3, o3, DALL-E, Whisper), Anthropic API (Claude, tool use)", "Tokens, pricing, rate limits, streaming, structured outputs", "Chain multiple AI APIs for something novel", "This separates content creators from builders"],
        create: ["Build a tool using AI APIs — something people can actually use", "Deploy it live and document the entire build"],
        post: ["X post: demo of AI-powered tool with live link", "Instagram Reel: 'I built this AI tool in 2 hours'"]
      },
      { day: 26, title: "Local AI + Open Source", emoji: "🏠",
        learn: ["Ollama + LM Studio for local AI — zero cost, full privacy", "Open source: Llama 3, Mistral, DeepSeek, Phi, Wan 2.2, Flux 2", "When local makes sense: privacy, cost, offline, customization", "Wan 2.2: free unlimited 1080p AI video locally"],
        create: ["Set up a complete local AI stack on your laptop", "Same tasks local vs cloud — compare quality, speed, cost"],
        post: ["X thread: 'Run AI on your laptop for FREE. Here's exactly how'"]
      },
      { day: 27, title: "YouTube's AI Future + Ethics", emoji: "📺",
        learn: ["YouTube 2026: AI tools for Shorts, text-to-game, music, deepfake labeling", "Fighting 'AI slop' — quality and authenticity > quantity", "Disclosure requirements: must label realistic AI content", "Hybrid strategy: Shorts/Reels for discovery + long-form for revenue"],
        create: ["Write your take on responsible AI content creation", "Build an AI news dashboard (RSS, newsletters, X lists)"],
        post: ["X thread: 'YouTube's 2026 AI rules every creator must know'"]
      },
      { day: 28, title: "Content System + Batch Creation", emoji: "📋",
        learn: ["Map pipeline: ideas → scripts → film → edit → publish → repurpose", "AI-assisted templates, SOPs, and workflows for each step", "Plan next 30 days of content: titles, hooks, formats"],
        create: ["Batch-create: 4 scripts, 10 thumbnails, 2 weeks of scheduled X posts", "Use AI tools for every step — practice what you preach"],
        post: ["X post: 'My AI-powered content system — daily posts without burnout'"]
      },
      { day: 29, title: "The Mega Video", emoji: "🏆",
        learn: ["Review everything from all 30 days", "Write comprehensive script for your BEST video yet"],
        create: ["Film and edit: 'How I Mastered AI in 30 Days — Complete 2026 Roadmap'", "Maximum production quality — best thumbnail, strongest hook"],
        post: ["Publish the mega video", "X thread: full 30-day recap with real numbers and honest reflections"]
      },
      { day: 30, title: "Launch Day — Your AI Brand", emoji: "🎯",
        learn: ["Audit: bio, banner, pinned posts, about page on all platforms", "Define positioning: 'I teach people how to use AI to [outcome]'"],
        create: ["Build a landing page with AI — link your best content", "'Start Here' pinned thread on X linking top content from challenge", "Set up first offering: free prompt library, consulting, or community"],
        post: ["X: '30 days ago I set out to master every AI tool. Here's everything I built'", "Pin your best thread and video — this is your new brand"]
      }
    ]
  }
];

const TOOL_STACK = [
  { cat: "AI Chat", tools: "ChatGPT (GPT-5.3/o3) · Claude (Opus 4.6) · Gemini 3 Pro · Perplexity · DeepSeek", emoji: "💬" },
  { cat: "AI Coding", tools: "Claude Code · Cursor · Codex · Copilot · Antigravity · Lovable · Bolt · Replit", emoji: "💻" },
  { cat: "Images", tools: "Midjourney · GPT Image 1.5 · Nano Banana Pro · Flux 2 · Ideogram · Firefly", emoji: "🖼️" },
  { cat: "Video", tools: "Veo 3.1 · Sora 2 · Runway Gen-4.5 · Kling 2.6 · Pika · HeyGen · Synthesia", emoji: "🎥" },
  { cat: "Voice & Music", tools: "ElevenLabs · Suno V5 · Udio · Kits AI", emoji: "🎵" },
  { cat: "Automation", tools: "n8n · Make.com · Zapier · Manus AI", emoji: "⚙️" },
  { cat: "Design", tools: "Canva AI · CapCut AI · Photoshop AI · Figma AI", emoji: "✨" },
  { cat: "Research", tools: "Perplexity · NotebookLM · Claude Projects", emoji: "📚" },
];

const RESOURCES = [
  {
    week: "Week 1: AI Fundamentals & Chat Tool Mastery",
    icon: "🧠",
    categories: [
      {
        title: "How LLMs and Transformers Actually Work",
        links: [
          { name: "3Blue1Brown: Neural Networks (Ch 5-7)", url: "https://www.3blue1brown.com/topics/neural-networks", desc: "The definitive visual intro to transformers and attention mechanisms." },
          { name: "Andrej Karpathy: Neural Networks Zero to Hero", url: "https://karpathy.ai/zero-to-hero.html", desc: "Build GPT from scratch in code. Includes 'microgpt' (Feb 2026)." },
          { name: "Jay Alammar: The Illustrated Transformer", url: "https://jalammar.github.io/illustrated-transformer/", desc: "Widely-referenced visual blog post cited top universities." }
        ]
      },
      {
        title: "Prompt Engineering Guides & Courses",
        links: [
          { name: "Anthropic's Prompt Engineering Docs", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", desc: "The gold standard. Includes 9-chapter interactive Jupyter tutorial." },
          { name: "OpenAI's Prompt Engineering Guides", url: "https://developers.openai.com/api/docs/guides/prompt-engineering", desc: "Main guide + model-specific guides for GPT-4.1 and GPT-5.1." },
          { name: "DAIR.AI: Prompt Engineering Guide", url: "https://www.promptingguide.ai/", desc: "Comprehensive open-source guide (zero-shot to tree-of-thought)." },
          { name: "DeepLearning.AI: ChatGPT Prompt Eng.", url: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/", desc: "Taught by Andrew Ng. (~1.5 hours, free)." },
          { name: "Vanderbilt Univ: Prompt Eng. (Coursera)", url: "https://www.coursera.org/learn/prompt-engineering", desc: "18+ hours deep-dive (free to audit)." }
        ]
      },
      {
        title: "Mastering Chat Tools (ChatGPT, Claude, Gemini, etc.)",
        links: [
          { name: "OpenAI Deep Research Guide", url: "https://openai.com/index/introducing-deep-research/", desc: "Official guide to the 3-step research process." },
          { name: "Anthropic API & Artifacts Docs", url: "https://platform.claude.com/docs/en/home", desc: "Model comparisons and 'Made with Claude' examples." },
          { name: "DeepSeek Chat", url: "https://chat.deepseek.com/", desc: "COMPLETELY FREE, no limits. R1 reasoning rivals OpenAI o1." },
          { name: "NotebookLM", url: "https://notebooklm.google.com", desc: "Completely free (50 sources). Turn notes into Audio Overviews." },
          { name: "Perplexity", url: "https://www.perplexity.ai/hub/getting-started", desc: "Indian students with .edu email get 1 year Pro free ($240 value)." }
        ]
      },
      {
        title: "Free AI Fundamentals Courses",
        links: [
          { name: "Elements of AI (Helsinki)", url: "https://www.elementsofai.com/", desc: "Absolute beginners, no coding (~30 hrs)." },
          { name: "Harvard CS50 AI with Python", url: "https://cs50.harvard.edu/ai/", desc: "Hands-on Python projects (~7 weeks)." },
          { name: "fast.ai Practical Deep Learning", url: "https://course.fast.ai/", desc: "Code-first deep learning (~7 weeks)." },
          { name: "Google ML Crash Course", url: "https://developers.google.com/machine-learning/crash-course", desc: "Interactive coding exercises (~15 hrs)." }
        ]
      }
    ]
  },
  {
    week: "Week 2: AI Coding Tools & No-Code Builders",
    icon: "💻",
    categories: [
      {
        title: "Claude Code Deep Dive",
        links: [
          { name: "DeepLearning.AI: Claude Code Course", url: "https://learn.deeplearning.ai/courses/claude-code-a-highly-agentic-coding-assistant", desc: "The best starting resource for MCP servers, Git worktrees." },
          { name: "CLAUDE.md Best Practices", url: "https://claude.com/blog/using-claude-md-files", desc: "Official Anthropic guide to context files (Nov 2025)." },
          { name: "Builder.io: Claude Code Practical Guide", url: "https://www.builder.io/blog/claude-code", desc: "Custom slash commands and daily production tips." },
          { name: "Sid Saladi: 60+ CLAUDE.md Templates", url: "https://sidsaladi.substack.com/p/claude-codes-secret-weapon-the-complete", desc: "Copy-paste ready templates on Substack." }
        ]
      },
      {
        title: "Cursor, Antigravity & Copilots",
        links: [
          { name: "Cursor Official Docs & Learn", url: "https://cursor.com/learn", desc: "Free hobby tier (2,000 completions)." },
          { name: "Google Antigravity Codelab", url: "https://codelabs.developers.google.com/getting-started-google-antigravity", desc: "Agent-first IDE. 100% free during public preview." },
          { name: "Google Gemini CLI", url: "https://deeplearning.ai/short-courses/gemini-cli-code-and-create-with-an-open-source-agent/", desc: "Completely free (1,000 req/day). DeepLearning.AI course." },
          { name: "GitHub Copilot for Students", url: "https://education.github.com/pack", desc: "Free for verified students through the Developer Pack." }
        ]
      },
      {
        title: "Zero-Code Builders & Automation",
        links: [
          { name: "Lovable Tutorials", url: "https://lovable.dev/videos/tutorial", desc: "Vibe coding for beginners (incl. Ansh Mehra tutorials)." },
          { name: "Bolt.new Video Tutorials", url: "https://support.bolt.new/building/video-tutorials", desc: "Prompt engineering, GitHub, and deployment." },
          { name: "freeCodeCamp: n8n 4-hour Course", url: "https://www.freecodecamp.org/news/learn-n8n-to-design-develop-and-deploy-production-grade-ai-agents/", desc: "Email agents, RAG, and deployment." },
          { name: "Make Academy", url: "https://academy.make.com/", desc: "Automation to AI Agents path (100% free, Credly badges)." }
        ]
      }
    ]
  },
  {
    week: "Week 3: AI Creative Tools",
    icon: "🎨",
    categories: [
      {
        title: "Midjourney & Image Generation",
        links: [
          { name: "Midjourney Official Tutorials", url: "https://www.youtube.com/watch?v=jDexcrChwRc&list=PLlrmt-IxxiYjZ63LZ7DvjpKLjlVw5SSHK", desc: "10+ videos directly from the creators (Sept 2025)." },
          { name: "Blake Crosley: Midjourney Guide", url: "https://blakecrosley.com/guides/midjourney", desc: "9,300+ word free prompt guide (Updated Mar 2026)." },
          { name: "OpenAI GPT-4o Image Guide", url: "https://openai.com/index/introducing-4o-image-generation/", desc: "Available to all users on free tier (~3 images/day)." },
          { name: "Google Nano Banana Pro Tips", url: "https://blog.google/products-and-platforms/products/gemini/prompting-tips-nano-banana-pro/", desc: "7 professional techniques for the Gemini 3 Pro model." },
          { name: "FLUX.1 [schnell]", url: "https://huggingface.co/black-forest-labs/FLUX.1-schnell", desc: "Apache 2.0 licensed, run locally or free online." }
        ]
      },
      {
        title: "AI Video (Veo, Sora, Runway, Kling)",
        links: [
          { name: "Runway Academy", url: "https://academy.runwayml.com/ways-to-use-runway", desc: "Structured courses on Gen-4.5, video-to-video." },
          { name: "Kling AI Tutorial", url: "https://crepal.ai/blog/aivideo/kling-ai-tutorial-2025/", desc: "Kling gives 66 free credits daily. Covers Gen formulas." },
          { name: "DataCamp: Google Veo 3 Guide", url: "https://www.datacamp.com/tutorial/veo-3", desc: "Creating spec ads and character consistency." }
        ]
      },
      {
        title: "Audio, Editing & Avatars",
        links: [
          { name: "ElevenLabs Beginner Guide", url: "https://www.fahimai.com/how-to-use-elevenlabs", desc: "Free plan: 10k chars/mo + instant voice cloning." },
          { name: "Suno Official Hub", url: "https://suno.com/hub/how-to-make-a-song", desc: "Free plan: 50 credits/day (~10 songs)." },
          { name: "CapCut Beginner Tutorial", url: "https://www.capcut.com/resource/capcut-tutorial-for-beginners", desc: "Fully free. Essential for Reels editing." },
          { name: "Canva AI Guide", url: "https://kripeshadwani.com/how-to-use-ai-in-canva/", desc: "Canva for Education is completely free for students." }
        ]
      }
    ]
  },
  {
    week: "Week 4: Agents, Local AI & Content Strategy",
    icon: "🚀",
    categories: [
      {
        title: "Building AI Agents & APIs",
        links: [
          { name: "Hugging Face AI Agents Course", url: "https://huggingface.co/learn/agents-course/en/unit0/introduction", desc: "Comprehensive course on smolagents, LangGraph." },
          { name: "DeepLearning.AI: Multi Agent Systems", url: "https://www.deeplearning.ai/short-courses/multi-ai-agent-systems-with-crewai/", desc: "Taught by CrewAI's founder." },
          { name: "OpenAI Developer Quickstart", url: "https://platform.openai.com/docs/quickstart", desc: "Make API calls in ~9 lines of Python." },
          { name: "Anthropic: Building with Claude API", url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api", desc: "Official structured video course." }
        ]
      },
      {
        title: "Running Local AI",
        links: [
          { name: "Ollama", url: "https://ollama.com", desc: "Run Llama, Mistral, DeepSeek locally (Zero API costs)." },
          { name: "LM Studio", url: "https://lmstudio.ai/", desc: "GUI interface, OpenAI-compatible local server." }
        ]
      },
      {
        title: "Content Strategy & India Creators",
        links: [
          { name: "X/Twitter Growth Strategy", url: "https://www.growthterminal.ai/blog/how-to-grow-on-x", desc: "Bio optimization, frameworks, post 2-4x daily." },
          { name: "Instagram Reels with AI", url: "https://buffer.com/resources/ai-social-media-content-creation/", desc: "14 tools used to grow 20k+ followers." },
          { name: "Sorav Jain (@soaborav)", url: "https://twitter.com/soaborav", desc: "India's leading digital marketing + AI educator." },
          { name: "Krish Naik", url: "https://www.youtube.com/@krishnaik06", desc: "India's biggest AI/ML educator (Hindi/English)." }
        ]
      }
    ]
  }
];

const SCHEDULE = [
  { time: "7–8 AM", task: "Morning scan — AI news, X feed, trending tools", icon: "☀️" },
  { time: "8–11 AM", task: "LEARN — Deep dive into the day's tool or topic", icon: "🎯" },
  { time: "11–1 PM", task: "CREATE — Build something real, screen record everything", icon: "🛠️" },
  { time: "1–2 PM", task: "Break + lunch — consume AI content passively", icon: "🍜" },
  { time: "2–4 PM", task: "CONTENT — Write scripts, edit footage, design graphics", icon: "✂️" },
  { time: "4–5 PM", task: "POST — Write & publish X posts, schedule content", icon: "📱" },
  { time: "5–6 PM", task: "ENGAGE — Reply to comments, network, grow community", icon: "💬" },
  { time: "Evening", task: "Film if needed, relax, stay current on AI news", icon: "🌙" },
];

/* ─── CONFETTI COLORS ─── */
const CONFETTI_COLORS = ["#528BFF", "#2EA043", "#A371F7", "#D29922", "#F778BA"];

/* ─── HELPERS ─── */
const saveData = (key, val) => { try { localStorage.setItem("aim_" + key, JSON.stringify(val)); } catch(e) {} };
const loadData = (key, fallback) => { try { const v = localStorage.getItem("aim_" + key); return v ? JSON.parse(v) : fallback; } catch(e) { return fallback; } };

/* FIX: Streak counts consecutive days from the most recent completion backward */
function getStreak(completed) {
  // Find highest completed day
  let lastDay = 0;
  for (let d = 30; d >= 1; d--) {
    if (completed[d]) { lastDay = d; break; }
  }
  if (!lastDay) return 0;
  let streak = 0;
  for (let d = lastDay; d >= 1; d--) {
    if (completed[d]) streak++;
    else break;
  }
  return streak;
}

/* ─── STYLES ─── */
const S = {
  bg: "#000000",
  surface: "#0D0D0D",
  surface2: "#161616",
  surface3: "#1C1C1C",
  border: "#262626",
  border2: "#333333",
  text: "#EDEDEF",
  text2: "#A0A0A3",
  text3: "#6B6B6E",
  font: "'Geist', 'SF Pro Display', -apple-system, 'Segoe UI', sans-serif",
  mono: "'Geist Mono', 'SF Mono', 'Fira Code', monospace",
};

/* ─── CONFETTI PARTICLE — each has its own unique rotation so animation looks correct ─── */
function ConfettiParticle({ index }) {
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const left = useRef(Math.random() * 100).current;
  const delay = useRef(Math.random() * 0.6).current;
  const duration = useRef(1.4 + Math.random() * 1.2).current;
  const isCircle = useRef(Math.random() > 0.5).current;
  const rotation = useRef(Math.floor(Math.random() * 540 + 180)).current;

  return (
    <div style={{
      position: "absolute",
      left: `${left}%`,
      top: -20,
      width: 8,
      height: 8,
      borderRadius: isCircle ? "50%" : 2,
      background: color,
      animation: `none`,
      animationFillMode: "forwards",
      transform: "translateY(-20px) rotate(0deg)",
      opacity: 1,
    }}
    ref={(el) => {
      if (!el) return;
      // Apply unique JS-driven animation to avoid CSS keyframe name collision
      el.animate([
        { transform: "translateY(-20px) rotate(0deg)", opacity: 1 },
        { transform: `translateY(105vh) rotate(${rotation}deg)`, opacity: 0 },
      ], {
        duration: duration * 1000,
        delay: delay * 1000,
        easing: "ease-out",
        fill: "forwards",
      });
    }}
    />
  );
}

/* ─── APP ─── */
export default function AIMastery() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState('');

  const [tab, setTab] = useState("plan");
  const [week, setWeek] = useState(0);
  const [openDay, setOpenDay] = useState(null);
  const [completed, setCompleted] = useState({});
  const [notes, setNotes] = useState(() => loadData("notes", {}));
  const [editingNote, setEditingNote] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [filter, setFilter] = useState("all");
  const [showConfetti, setShowConfetti] = useState(false);
  const noteRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      const fetchProgress = async () => {
        const { data } = await supabase.from('progress').select('day');
        if (data) {
          const loaded = {};
          data.forEach(r => loaded[r.day] = true);
          setCompleted(loaded);
        }
      };
      fetchProgress();
    } else {
      setCompleted({});
    }
  }, [session]);

  useEffect(() => { saveData("notes", notes); }, [notes]);
  useEffect(() => { if (editingNote && noteRef.current) noteRef.current.focus(); }, [editingNote]);

  const toggleComplete = async (day, e) => {
    e && e.stopPropagation();
    if (!session) return;

    const isNowDone = !completed[day];
    const next = { ...completed, [day]: isNowDone };
    setCompleted(next);
    
    if (isNowDone) {
      const count = Object.values(next).filter(Boolean).length;
      if (count % 7 === 0 || count === 30) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      await supabase.from('progress').insert({ day, user_id: session.user.id });
    } else {
      await supabase.from('progress').delete().match({ day, user_id: session.user.id });
    }
  };

  const startNote = (day, e) => {
    e.stopPropagation();
    setEditingNote(day);
    setNoteText(notes[day] || "");
  };

  const saveNote = (day) => {
    if (noteText.trim()) setNotes({ ...notes, [day]: noteText.trim() });
    else { const n = { ...notes }; delete n[day]; setNotes(n); }
    setEditingNote(null);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    let error;
    if (isSignUp) {
      const res = await supabase.auth.signUp({ email: authEmail, password: authPassword });
      error = res.error;
      if (!error && res.data.user && !res.data.session) setAuthError('Check your email for the confirmation link!');
    } else {
      const res = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
      error = res.error;
    }
    if (error) setAuthError(error.message);
    setAuthLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const totalDone = Object.values(completed).filter(Boolean).length;
  const streak = getStreak(completed);
  const pct = Math.round((totalDone / 30) * 100);

  const filteredDays = (days) => {
    if (filter === "done") return days.filter(d => completed[d.day]);
    if (filter === "todo") return days.filter(d => !completed[d.day]);
    return days;
  };

  return (
    <div style={{ fontFamily: S.font, background: S.bg, color: S.text, minHeight: "100vh", position: "relative" }}>

      {authLoading && !session && (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ color: S.text2 }}>Authenticating...</div>
        </div>
      )}

      {!authLoading && !session && (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: S.surface, border: `1px solid ${S.border}`, padding: 40, borderRadius: 16, width: "100%", maxWidth: 400 }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <span style={{ fontSize: 40, display: "block", marginBottom: 16 }}>🚀</span>
              <h1 style={{ margin: "0 0 8px 0", fontSize: 24, fontWeight: 700 }}>AI Mastery</h1>
              <p style={{ color: S.text3, margin: 0, fontSize: 14 }}>Log in to track your 30-day progress</p>
            </div>
            <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {authError && (
                <div style={{ background: "rgba(248, 81, 73, 0.1)", color: "#F85149", padding: "12px 16px", borderRadius: 8, fontSize: 13, border: "1px solid rgba(248, 81, 73, 0.2)" }}>
                  {authError}
                </div>
              )}
              <input type="email" placeholder="Email address" value={authEmail} onChange={e => setAuthEmail(e.target.value)} required style={{ padding: "12px 16px", background: S.surface2, border: `1px solid ${S.border}`, borderRadius: 8, color: S.text, fontSize: 14, outline: "none" }} />
              <input type="password" placeholder="Password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} required style={{ padding: "12px 16px", background: S.surface2, border: `1px solid ${S.border}`, borderRadius: 8, color: S.text, fontSize: 14, outline: "none" }} />
              <button type="submit" disabled={authLoading} style={{ padding: "12px", background: "#EDEDEF", color: "#000", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: authLoading ? "not-allowed" : "pointer", opacity: authLoading ? 0.7 : 1, transition: "0.2s" }}>
                {authLoading ? "Please wait..." : (isSignUp ? "Create Account" : "Sign In")}
              </button>
            </form>
            <div style={{ marginTop: 24, textAlign: "center" }}>
              <button onClick={() => { setIsSignUp(!isSignUp); setAuthError(''); }} style={{ background: "transparent", border: "none", color: S.text2, fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>
                {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>
        </div>
      )}

      {session && (
        <>
          {/* Confetti — FIX: Use Web Animations API per particle to avoid shared keyframe collision */}
      {showConfetti && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 999, overflow: "hidden" }}>
          {Array.from({ length: 48 }).map((_, i) => (
            <ConfettiParticle key={i} index={i} />
          ))}
        </div>
      )}

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${S.border}`, padding: "28px 24px 20px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 28 }}>🧠</span>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>30-Day AI Mastery</h1>
                <p style={{ fontSize: 13, color: S.text3, margin: "2px 0 0" }}>Learn every AI tool. Build real projects. Create content daily.</p>
              </div>
            </div>
            <button onClick={handleSignOut} style={{ padding: "6px 12px", background: S.surface2, border: `1px solid ${S.border}`, color: S.text2, borderRadius: 6, fontSize: 12, cursor: "pointer" }}>Sign Out</button>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            {[
              { label: "Progress", value: `${pct}%`, sub: `${totalDone}/30 days` },
              { label: "Streak", value: `${streak}`, sub: streak === 1 ? "day" : "days" },
              { label: "Week", value: `${week + 1}`, sub: WEEKS[week].subtitle },
            ].map((s, i) => (
              <div key={i} style={{ flex: "1 1 90px", background: S.surface2, borderRadius: 10, padding: "10px 14px", border: `1px solid ${S.border}` }}>
                <div style={{ fontSize: 11, color: S.text3, textTransform: "uppercase", letterSpacing: 0.8, fontFamily: S.mono }}>{s.label}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 2 }}>
                  <span style={{ fontSize: 20, fontWeight: 700 }}>{s.value}</span>
                  <span style={{ fontSize: 11, color: S.text3 }}>{s.sub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div style={{ height: 3, background: S.surface3, borderRadius: 2, marginBottom: 16 }}>
            <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg, #528BFF, #A371F7)", borderRadius: 2, transition: "width 0.4s ease" }} />
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 2, overflowX: "auto" }}>
            {[["plan", "Plan"], ["tools", "Tools"], ["resources", "Resources"], ["schedule", "Schedule"], ["notes", "Notes"]].map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} style={{
                padding: "7px 16px", background: "transparent", border: "none",
                borderBottom: `2px solid ${tab === k ? S.text : "transparent"}`,
                color: tab === k ? S.text : S.text3, fontSize: 13, fontWeight: 500,
                cursor: "pointer", fontFamily: S.font, transition: "all 0.15s", whiteSpace: "nowrap"
              }}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "16px 24px 60px" }}>

        {/* ── PLAN TAB ── */}
        {tab === "plan" && (
          <div style={{ animation: "fadeIn 0.2s ease" }}>
            {/* Week pills */}
            <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
              {WEEKS.map((w, i) => (
                <button key={i} onClick={() => { setWeek(i); setOpenDay(null); }} style={{
                  padding: "6px 14px", background: week === i ? S.surface3 : "transparent",
                  border: `1px solid ${week === i ? S.border2 : "transparent"}`, borderRadius: 8,
                  color: week === i ? S.text : S.text3, fontSize: 13, fontWeight: 500,
                  cursor: "pointer", fontFamily: S.font, transition: "all 0.15s"
                }}>{w.emoji} Week {w.id}</button>
              ))}
            </div>

            {/* Week info */}
            <div style={{ padding: "16px 18px", background: S.surface, borderRadius: 12, border: `1px solid ${S.border}`, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 20 }}>{WEEKS[week].emoji}</span>
                <div>
                  <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{WEEKS[week].title}</h2>
                  <p style={{ margin: 0, fontSize: 12, color: S.text3, fontFamily: S.mono }}>{WEEKS[week].subtitle}</p>
                </div>
              </div>
              <p style={{ fontSize: 13, color: S.text2, lineHeight: 1.6, marginTop: 10, marginBottom: 0 }}>{WEEKS[week].overview}</p>
            </div>

            {/* Filter pills */}
            <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
              {[["all", "All"], ["todo", "To do"], ["done", "Done"]].map(([k, l]) => (
                <button key={k} onClick={() => setFilter(k)} style={{
                  padding: "4px 12px", background: filter === k ? S.surface3 : "transparent",
                  border: `1px solid ${filter === k ? S.border : "transparent"}`, borderRadius: 6,
                  color: filter === k ? S.text : S.text3, fontSize: 12, cursor: "pointer", fontFamily: S.font
                }}>{l}</button>
              ))}
            </div>

            {/* Days list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {filteredDays(WEEKS[week].days).map((d) => {
                const isOpen = openDay === d.day;
                const isDone = completed[d.day];
                const hasNote = !!notes[d.day];
                return (
                  <div key={d.day} style={{
                    background: isOpen ? S.surface : "transparent",
                    borderRadius: 8, transition: "background 0.15s",
                    border: isOpen ? `1px solid ${S.border}` : "1px solid transparent"
                  }}>
                    {/* Day header */}
                    <div onClick={() => setOpenDay(isOpen ? null : d.day)}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", cursor: "pointer", borderRadius: 8, transition: "background 0.1s" }}
                      onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = S.surface2; }}
                      onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = "transparent"; }}>
                      {/* Checkbox */}
                      <div onClick={(e) => toggleComplete(d.day, e)} style={{
                        width: 20, height: 20, borderRadius: 4, border: `1.5px solid ${isDone ? "#2EA043" : S.border2}`,
                        background: isDone ? "#2EA04320" : "transparent", cursor: "pointer", display: "flex",
                        alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s"
                      }}>
                        {isDone && <span style={{ color: "#2EA043", fontSize: 12, fontWeight: 700 }}>✓</span>}
                      </div>
                      {/* Day label */}
                      <span style={{ fontSize: 12, fontFamily: S.mono, color: WEEKS[week].accent, fontWeight: 600, minWidth: 28 }}>{d.day}</span>
                      <span style={{ fontSize: 14 }}>{d.emoji}</span>
                      <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: isDone ? S.text3 : S.text, textDecoration: isDone ? "line-through" : "none", transition: "color 0.15s" }}>{d.title}</span>
                      {hasNote && <span style={{ fontSize: 10, color: S.text3, background: S.surface3, padding: "2px 6px", borderRadius: 4 }}>📝</span>}
                      <span style={{ color: S.text3, fontSize: 10, transform: isOpen ? "rotate(90deg)" : "rotate(0)", transition: "transform 0.2s", flexShrink: 0 }}>▶</span>
                    </div>

                    {/* Expanded content */}
                    {isOpen && (
                      <div style={{ padding: "4px 12px 16px 54px", animation: "fadeIn 0.15s ease" }}>
                        {[
                          { label: "Learn", items: d.learn, color: "#528BFF", icon: "📖" },
                          { label: "Create", items: d.create, color: "#2EA043", icon: "🛠" },
                          { label: "Post", items: d.post, color: "#D29922", icon: "📱" },
                        ].map(sec => (
                          <div key={sec.label} style={{ marginBottom: 14 }}>
                            <div style={{ fontSize: 11, fontWeight: 600, color: sec.color, letterSpacing: 0.5, textTransform: "uppercase", fontFamily: S.mono, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                              <span>{sec.icon}</span>{sec.label}
                            </div>
                            {sec.items.map((item, j) => (
                              <div key={j} style={{ display: "flex", gap: 8, marginBottom: 3, paddingLeft: 2 }}>
                                <span style={{ color: S.border2, flexShrink: 0, marginTop: 1, fontSize: 13 }}>—</span>
                                <span style={{ fontSize: 13, color: S.text2, lineHeight: 1.55 }}>{item}</span>
                              </div>
                            ))}
                          </div>
                        ))}

                        {/* Note section */}
                        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 12, marginTop: 8 }}>
                          {editingNote === d.day ? (
                            <div>
                              <textarea ref={noteRef} value={noteText} onChange={e => setNoteText(e.target.value)}
                                placeholder="Write your notes, reflections, or links here…"
                                style={{ width: "100%", minHeight: 80, background: S.surface2, border: `1px solid ${S.border2}`, borderRadius: 8, padding: 10, color: S.text, fontSize: 13, fontFamily: S.font, resize: "vertical", lineHeight: 1.5, boxSizing: "border-box" }} />
                              <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                                <button onClick={() => saveNote(d.day)} style={{ padding: "5px 14px", background: S.surface3, border: `1px solid ${S.border2}`, borderRadius: 6, color: S.text, fontSize: 12, cursor: "pointer", fontFamily: S.font }}>Save</button>
                                <button onClick={() => setEditingNote(null)} style={{ padding: "5px 14px", background: "transparent", border: "none", color: S.text3, fontSize: 12, cursor: "pointer", fontFamily: S.font }}>Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <div onClick={(e) => startNote(d.day, e)} style={{ cursor: "pointer", padding: 8, borderRadius: 6, transition: "background 0.1s" }}
                              onMouseEnter={e => e.currentTarget.style.background = S.surface2}
                              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                              {notes[d.day] ? (
                                <p style={{ margin: 0, fontSize: 13, color: S.text2, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>📝 {notes[d.day]}</p>
                              ) : (
                                <p style={{ margin: 0, fontSize: 13, color: S.text3, fontStyle: "italic" }}>+ Add a note…</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {filteredDays(WEEKS[week].days).length === 0 && (
                <p style={{ textAlign: "center", color: S.text3, fontSize: 13, padding: 40 }}>
                  {filter === "done" ? "No completed days yet. Get started!" : "All done for this week! 🎉"}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── TOOLS TAB ── */}
        {tab === "tools" && (
          <div style={{ animation: "fadeIn 0.2s ease" }}>
            <p style={{ fontSize: 13, color: S.text3, marginBottom: 16, lineHeight: 1.6 }}>Every tool in this plan — updated for March 2026. Based on real-world testing and industry surveys.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {TOOL_STACK.map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "12px 14px", borderRadius: 8, transition: "background 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background = S.surface}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{t.emoji}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: S.text, marginBottom: 3, fontFamily: S.mono, textTransform: "uppercase", letterSpacing: 0.5 }}>{t.cat}</div>
                    <div style={{ fontSize: 13, color: S.text2, lineHeight: 1.5 }}>{t.tools}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24, padding: 16, background: S.surface, borderRadius: 10, border: `1px solid ${S.border}` }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#D29922", fontFamily: S.mono, marginBottom: 10 }}>⚡ KEY 2026 INSIGHTS FROM RESEARCH</div>
              {[
                "Claude Code → #1 AI coding tool in 8 months (46% most-loved by developers)",
                "Google Nano Banana Pro & Veo 3.1 now lead image and video generation",
                "Suno V5 hit $2.45B valuation with built-in DAW + Warner Music deal",
                "ElevenLabs expanded: voice → video → music (all-in-one creative platform)",
                "95% of devs use AI weekly; 75% use it for 50%+ of their coding",
                "YouTube CEO: 1M+ channels use AI tools daily; cracking down on 'AI slop'",
                "AI video crossed the threshold: native 4K, 20+ sec clips, synced audio",
                "Zero-code builders (Lovable, Bolt, Replit Agent) are production-ready",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4, paddingLeft: 2 }}>
                  <span style={{ color: "#D29922", flexShrink: 0, fontSize: 13 }}>—</span>
                  <span style={{ fontSize: 13, color: S.text2, lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RESOURCES TAB ── */}
        {tab === "resources" && (
          <div style={{ animation: "fadeIn 0.2s ease" }}>
            <p style={{ fontSize: 13, color: S.text3, marginBottom: 16, lineHeight: 1.6 }}>
              The ultimate free toolkit for 2026. Prioritizing official docs, top YouTube channels, and structured courses. 
              <span style={{ color: "#2EA043", fontWeight: 500 }}> Special callouts for student discounts and zero-cost tools included.</span>
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {RESOURCES.map((week, i) => (
                <div key={i} style={{ background: S.surface, borderRadius: 12, border: `1px solid ${S.border}`, overflow: "hidden" }}>
                  <div style={{ padding: "14px 18px", background: S.surface2, borderBottom: `1px solid ${S.border}`, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{week.icon}</span>
                    <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: S.text }}>{week.week}</h3>
                  </div>
                  
                  <div style={{ padding: "12px 18px" }}>
                    {week.categories.map((cat, j) => (
                      <div key={j} style={{ marginBottom: j === week.categories.length - 1 ? 0 : 16 }}>
                        <h4 style={{ margin: "0 0 8px 0", fontSize: 12, fontWeight: 600, color: "#528BFF", textTransform: "uppercase", letterSpacing: 0.5, fontFamily: S.mono }}>{cat.title}</h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {cat.links.map((link, k) => (
                            <div key={k} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                              <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 500, color: S.text, textDecoration: "none", display: "inline-block" }}>
                                {link.name} <span style={{ color: S.text3, fontSize: 10 }}>↗</span>
                              </a>
                              <span style={{ fontSize: 12, color: S.text2, lineHeight: 1.4 }}>{link.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Indian Students Callout */}
            <div style={{ marginTop: 24, padding: 16, background: "linear-gradient(to right, rgba(255,153,51,0.05), rgba(255,255,255,0.05), rgba(19,136,8,0.05))", borderRadius: 10, border: `1px solid ${S.border}` }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#EDEDEF", fontFamily: S.mono, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <span>🇮🇳</span> ZERO-COST TOOLKIT FOR STUDENTS
              </div>
              <p style={{ fontSize: 13, color: S.text2, lineHeight: 1.6, margin: 0 }}>
                Build your entire AI brand for ₹0: 
                <strong style={{ color: S.text }}> DeepSeek</strong> (unlimited reasoning), 
                <strong style={{ color: S.text }}> Gemini CLI</strong> (1k req/day), 
                <strong style={{ color: S.text }}> Perplexity Pro</strong> (1 year free w/ .edu email),
                <strong style={{ color: S.text }}> GitHub Copilot</strong> (free via Student Dev Pack),
                <strong style={{ color: S.text }}> Ollama</strong> (free local models), 
                and <strong style={{ color: S.text }}> Canva for Education</strong>.
              </p>
            </div>
          </div>
        )}

        {/* ── SCHEDULE TAB ── */}
        {tab === "schedule" && (
          <div style={{ animation: "fadeIn 0.2s ease" }}>
            <p style={{ fontSize: 13, color: S.text3, marginBottom: 16, lineHeight: 1.6 }}>Daily formula: Learn → Create → Post. Every day, no exceptions.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {SCHEDULE.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "10px 14px", borderRadius: 8, transition: "background 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background = S.surface}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{s.icon}</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 12, fontFamily: S.mono, color: "#528BFF", fontWeight: 600 }}>{s.time}</span>
                    <p style={{ margin: "2px 0 0", fontSize: 13, color: S.text2, lineHeight: 1.5 }}>{s.task}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Targets */}
            <div style={{ marginTop: 24, padding: 16, background: S.surface, borderRadius: 10, border: `1px solid ${S.border}` }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#A371F7", fontFamily: S.mono, marginBottom: 10 }}>📊 30-DAY CONTENT TARGETS</div>
              {[
                "📺  4+ long-form videos (YouTube / Instagram)",
                "📱  12+ Reels / Shorts (repurposed content)",
                "🐦  30+ X posts / threads (1 per day minimum)",
                "🛠  5+ real projects built (apps, tools, automations)",
                "🧰  20+ tools mastered across all categories",
                "📦  1 lead magnet created (prompt library, cheat sheet)",
              ].map((t, i) => (
                <p key={i} style={{ fontSize: 13, color: S.text2, lineHeight: 1.7, margin: "2px 0", paddingLeft: 4 }}>{t}</p>
              ))}
            </div>

            {/* Mindset */}
            <div style={{ marginTop: 12, padding: 16, background: S.surface, borderRadius: 10, border: `1px solid ${S.border}` }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#2EA043", fontFamily: S.mono, marginBottom: 8 }}>💡 THE MINDSET</div>
              <p style={{ fontSize: 14, color: S.text2, lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
                You don't need permission to be an AI expert. You just need to use more tools, build more projects, and share more openly than everyone else. Your confusion, breakthroughs, and experiments ARE the content.
              </p>
            </div>
          </div>
        )}

        {/* ── NOTES TAB ── */}
        {tab === "notes" && (
          <div style={{ animation: "fadeIn 0.2s ease" }}>
            <p style={{ fontSize: 13, color: S.text3, marginBottom: 16, lineHeight: 1.6 }}>All your notes across the 30 days. Click any day in the Plan tab to add notes.</p>
            {Object.keys(notes).length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <p style={{ fontSize: 32, marginBottom: 12 }}>📝</p>
                <p style={{ color: S.text3, fontSize: 14, margin: 0 }}>No notes yet.</p>
                <p style={{ color: S.text3, fontSize: 13, marginTop: 6 }}>Open any day in the Plan tab and click "Add a note" to get started.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {Object.entries(notes).sort(([a], [b]) => Number(a) - Number(b)).map(([day, note]) => {
                  const dayData = WEEKS.flatMap(w => w.days).find(d => d.day === Number(day));
                  return (
                    <div key={day} style={{ padding: 14, background: S.surface, borderRadius: 10, border: `1px solid ${S.border}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 12, fontFamily: S.mono, color: "#528BFF", fontWeight: 600 }}>Day {day}</span>
                        <span style={{ fontSize: 13, color: S.text3 }}>·</span>
                        <span style={{ fontSize: 13, color: S.text2 }}>{dayData?.emoji} {dayData?.title}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: 13, color: S.text2, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{note}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Reset */}
            <div style={{ marginTop: 40, padding: 16, background: S.surface, borderRadius: 10, border: `1px solid ${S.border}` }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#F85149", fontFamily: S.mono, marginBottom: 8 }}>⚠️ DANGER ZONE</div>
              <p style={{ fontSize: 13, color: S.text3, marginBottom: 10 }}>Reset all progress, completed days, and notes. This cannot be undone.</p>
              <button onClick={async () => {
                if (window.confirm("Reset all progress? This will clear completed days securely from the cloud.")) {
                  setCompleted({}); setNotes({}); setOpenDay(null); setFilter("all");
                  if (session) await supabase.from('progress').delete().eq('user_id', session.user.id);
                }
              }} style={{
                padding: "6px 16px", background: "transparent", border: "1px solid #F8514933", borderRadius: 6,
                color: "#F85149", fontSize: 12, cursor: "pointer", fontFamily: S.font, fontWeight: 500
              }}>Reset everything</button>
            </div>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
}
