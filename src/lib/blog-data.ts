// Cover images
import coverWhyWeBuilt from "@/assets/blog/cover-why-we-built-paraflow.svg";
import coverStartupMvp from "@/assets/blog/cover-startup-mvp.svg";
import coverCoffeeTest from "@/assets/blog/cover-coffee-test.svg";
import avatarRyan from "@/assets/blog/avatar-ryan.png";

export type BlogCategory = "insight" | "stories" | "features" | "engineering";

export interface Author {
  name: string;
  avatar: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: BlogCategory;
  date: string;
  author: Author;
  coverImage?: string;
  tags: string[];
  content: string;
}

export const categories: { id: BlogCategory; label: string; description: string }[] = [
  { id: "insight", label: "Insights", description: "Internal perspectives and strategic thinking" },
  { id: "stories", label: "User stories", description: "User practices and success stories" },
  { id: "features", label: "Behind features", description: "Deep dives into product capabilities" },
  { id: "engineering", label: "Engineering", description: "Technical frontiers and innovations" },
];

export const authors: Record<string, Author> = {
  ryan: {
    name: "Ryan",
    avatar: avatarRyan,
  },
  alex: {
    name: "Alex Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
  },
  sarah: {
    name: "Sarah Kim",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
  },
  michael: {
    name: "Michael Torres",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
  },
  emma: {
    name: "Emma Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
  },
  paraflow: {
    name: "Paraflow Team",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=paraflow",
  },
  qendrim: {
    name: "Qendrim Bakija",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=qendrim",
  },
};

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "why-we-built-paraflow",
    title: "Why we built Paraflow",
    subtitle: "The origin, thesis, and vision behind Paraflow — and why specs are all you need.",
    category: "insight",
    date: "Sep 2025",
    author: authors.ryan,
    coverImage: coverWhyWeBuilt,
    tags: ["Vision", "AI", "Product Design", "Origin Story"],
    content: `
### Our origin: Why did we build Paraflow?

Imagine you have an idea for a simple app—say, a local community hub for dog owners. You want to connect people, share vet recommendations, and organize playdates. But with no budget for a full team, you try the traditional route.

First, weeks go into a product requirements doc. Then, a designer spends more weeks on static wireframes that look polished but can't be clicked through. After endless revisions, all you have is a handful of PDFs. No way to test, no working flow, no validation—just time and money burned.

That's when it hit us: the old workflow is too slow and costly for small teams. Existing AI tools are faster, but they lack the collaborative, iterative feel of a real design team. Paraflow was born to fix this, taking you from ideas to tangible products in moments, not months, with the control to refine along the way.

As a product manager and founder, I've felt the drag of outdated workflows firsthand. That's why we keep asking at Paraflow: Are we just speeding up yesterday's process, or are we inventing something entirely new?

### Two elephants in the room

**Vibe coding is exploding.** It lets anyone turn an idea into a design instantly, arguably more transformative for non-designers than for pros.

**Agents are advancing fast.** In many cases, AI isn't just a copilot anymore. It's edging into full autopilot.

Seen through a societal lens, these shifts reveal something even bigger:

- **The gate to creation is wide open.** Great ideas are everywhere, but only a few could turn them into products. What if that barrier disappeared?
- **A new way to organize work.** Humans have long divided work among themselves. What if AI joined as an essential teammate?

### Our thesis: Specs are all you need

If we think about the ultimate end state of product design, it's clearly ideas to apps. Who wouldn't want their own Tony Stark's J.A.R.V.I.S. — just say your ideas, and they spring to life?

Most idea-to-app tools are end-to-end without intermediary stages. Rather than chase the one-step magic, Paraflow takes a different view: we help users process artifacts and generate valuable specs at the heart of the design workflow.

> Specs are human-centered. We rely on specs to confirm product direction, but AI might not need them. Does this limitation highlight our uniquely human judgment and sense of aesthetics?

### Our Approach: All-in-One Canvas

Product design has always been visual, and language alone isn't enough. It's like two people trying to discuss a concept over a call — they just can't get it across. But give them a whiteboard, and suddenly ideas click.

From Sketch to today's whiteboard apps, the infinite canvas has become standard. At Paraflow, we use it as the space where humans and AI collaborate, displaying all artifacts and specs.

**Our guiding principles:**

1. **Chat like teammates**: You can discuss any product design topic with AI in Paraflow.
2. **Share the same view**: Everything AI creates is visible, and you can share documents from other platforms.
3. **Point & show**: Select multiple objects and discuss them with AI.
4. **Co-create**: The canvas is collaborative, with write access for you, your human and AI teammates.

### Our Vision: All-in-One Space for Co-Creating with AI

We envision a near future where the AI agent enables you to:

- Draft a PRD from market research and CRM user interviews.
- Style a UI card by combining layouts and design elements from different images.
- Import mock data, or even unit test scenarios, directly onto the canvas for a prototype.

Paraflow aims to be a hub where human ideas and AI interact fully to generate meaningful outcomes. The design process doesn't disappear. It's a new way to nurture ideas, letting them evolve, combine, and refine until they become the best possible products.
    `,
  },
  {
    id: "2",
    slug: "future-product-days-humans-and-ai-on-one-canvas",
    title: "Future Product Days: Humans and AI on one canvas",
    subtitle: "At Future Product Days 2025 in Copenhagen, Ryan shared how Paraflow enables humans and AI to collaborate in product design.",
    category: "insight",
    date: "Dec 2025",
    author: authors.ryan,
    coverImage: coverWhyWeBuilt, // Using same cover as fallback since page was not accessible
    tags: ["Conference", "AI Collaboration", "Product Design Agent", "Copenhagen"],
    content: `
### One sentence to prototype is magic, but...

Various vibe coding tools now let us create product prototypes incredibly fast — and that's exciting.

But the real challenge begins in the next step: most projects are more complex and need to scale. That's when you realize these tools often fall short, and you have to return to the traditional, "non-AI" workflow.

Rather than jumping straight from ideas to a working app, Paraflow helps produce the in-between layers: PRDs, user flows, screen plans, UI, and prototypes. The goal is for AI and humans to collaborate, keeping outcomes controllable and aligned with user needs.

### How is the Product Design Agent like?

We need to return to first principles — to examine how people actually interact and collaborate in everyday work.

Most communication happens naturally through conversation. But product design is a bit different. Often, smooth collaboration requires something more directional and visual — like sketching together on a whiteboard, or sharing your screen so teammates can see your document in real time.

Paraflow "simulates" the way humans communicate during product design. We provide users with a collaborative canvas where you can:

- Interact with AI using natural language
- See the same context as the AI
- Point to any part of the canvas to direct the AI's attention
- Freely bring in external information and documents

> The Product Design Agent isn't a "rigid machine" that just delivers specs in a procedural way. Instead, it can collaborate with you professionally across a variety of scenarios, adapting to any needs you have.

### Showcase: AI PM and AI Designer collaborating with humans

When we create a new project, the AI generates a long-term "To-Do" plan. You can interact with the Product Design Agent at any time to adjust and optimize this plan.

During this process, the AI can refine the PRD and key user flows based on the plan, tailored to your needs. Once the requirements are clearly defined, the AI PM transforms into an AI Designer, turning your needs into a professionally polished UI.

To make the AI Designer more professional, it follows a unified design system, ensuring that multiple UI screens co-created with AI maintain a consistent visual style.

### Towards a new paradigm for Product Define, Design and Development

All specs created in Paraflow can be synced to GitHub and used with AI coding tools like Cursor or Claude Code.

Because the Product Design Agent is AI-native, the generated code is easy for other AI tools to understand, making handoff smooth. In the future, we aim for an "Agent-to-Agent" workflow, solving many pain points of traditional processes.

> The future may be "Specs are all you need." Code is objective — it can be tested, measured, and gradually automated, leaving humans mainly as supervisors. Design, by contrast, is inherently subjective. There is always a "better," never a "best."
    `,
  },
  {
    id: "3",
    slug: "to-startup-and-solopreneur-from-idea-to-mvp",
    title: "To Startup and Solopreneur: From idea to MVP",
    subtitle: "How Paraflow helps startups and solopreneurs turn ideas into MVPs faster with the Product Design Agent.",
    category: "stories",
    date: "Dec 2025",
    author: authors.paraflow,
    coverImage: coverStartupMvp,
    tags: ["Startup", "MVP", "Solo Developer", "Case Study"],
    content: `
Turning an idea into a Minimum Viable Product (MVP) is one of the biggest challenges for startups and solopreneurs. Limited resources, lack of design expertise, and the need to validate ideas quickly can create significant roadblocks. Paraflow, the Product Design Agent, is here to make this journey easier.

## Challenges faced by Startups and Solopreneurs

Building an MVP usually means wrestling with:

- **Never enough time**: Weeks slip by just to get a basic flow sketched, while competitors are already shipping.
- **Limited budgets**: A single freelance designer can burn through your runway in a month.
- **Design block**: Most founders know what they want built, but stare at a blank canvas when it comes to UI/UX.

## Eyad's story: How Paraflow helped a solo developer

Eyad Kelleh, a solo developer specializing in backend development, used Paraflow to build an EV charging app called Charge a Smile.

> "As a solo developer, I've always had one major weakness: design. I can build solid backends, create efficient APIs, and handle complex database architectures. But when it comes to making things look good? That's where I've always struggled."

### The problem every solo developer faces

When you're working alone, you wear every hat: project manager, backend architect, database designer, and somehow, you're also supposed to be the UI designer.

My typical development process looked like this:
1. Build a solid backend with proper APIs
2. Create basic HTML forms that work but look amateur
3. Spend hours on Stack Overflow trying to center a div
4. Lose potential clients who expect modern, polished interfaces
5. Compete mainly on price because the visual quality wasn't there

### Day 7: The results blew my mind

By the end of the week, I had created:

- A sophisticated loading screen with 3D elements and smooth animations
- Complex onboarding flow with provider selection and network analysis
- Data visualization dashboard showing coverage percentages and station availability
- Multi-provider interface with distinct branding for ENBW, Tesla, and other networks
- Clean information architecture that actually makes sense visually

Every gradient, every piece of typography, every interactive element looked like it came from a professional design agency.

## From idea to MVP — Your 3-step playbook

### Step 1: Tell Paraflow what you're building
Describe your idea. Or, drop in sketches, screenshots, or docs for background context.

### Step 2: Let the agent do the heavy lifting
Paraflow instantly turns your input into:
- Personas & PRD
- User flows & style guides
- Polished UIs & interactive prototypes

### Step 3: Deliver your MVP
Send prototypes to investors or early users for feedback. Sync everything to GitHub for a smooth developer handoff.

You focus on the idea. Paraflow handles the design grind so you can validate, iterate, and launch faster.
    `,
  },
  {
    id: "4",
    slug: "5-minutes-that-transformed-a-designers-workflow",
    title: "The Coffee Test: 5 minutes that transformed a designer's workflow",
    subtitle: "UI/UX designer Qendrim Bakija tested Paraflow with a simple benchmark: make coffee, come back, and see what happened.",
    category: "stories",
    date: "Dec 2025",
    author: authors.qendrim,
    coverImage: coverCoffeeTest,
    tags: ["Designer Workflow", "Case Study", "Coffee Test", "UI/UX"],
    content: `
For most designers, the real challenge isn't creativity—it's time. Between project briefs, user flows, and information architecture, the creative work gets squeezed into whatever's left.

Qendrim Bakija, a UI/UX designer, had tried plenty of AI design tools. Impressive demos, disappointing results.

So when he tested Paraflow, he set a simple benchmark: the coffee test.

**Describe a project idea. Hit enter. Make coffee. Come back.**

What he found made him rethink everything.

## Qendrim's story

> I decided to test Paraflow with a real project: a mobile app called 'Neighborhood Exchange'—a hyper-local tool where neighbors share items and offer help.

I typed one paragraph describing the concept. Hit enter. Made coffee. Came back.

And just sat there staring at my screen.

### What Paraflow generated in minutes:

- A complete project brief that understood the problem better than some discovery calls I've sat through
- A full PRD with features prioritized logically—not just random "wouldn't it be cool if…" ideas
- User flow covering edge cases I hadn't even thought about yet
- A screen plan with proper information architecture that would usually take days of moving sticky notes around
- Three style guide options—not just "here's some colors," but actual strategic visual directions with reasoning

**This wasn't just generating pretty pictures. It was doing actual strategic thinking.**

## The workflow that actually works

Paraflow handles the heavy lifting, then I have freedom to refine wherever I'm most comfortable:

- **Edit in Paraflow**: Full control over every design decision
- **Export to Figma**: Take it to Figma for detailed work
- **Export to HTML**: Hand off clean code directly to developers

I'm not losing control. I'm gaining a collaborator who handles the tedious parts so I can focus on creative decisions that actually matter.

## The unexpected win: Developers actually get it now

I connected my designs to GitHub, and suddenly the dev team could see everything—my design decisions, the logic behind layouts, the whole system.

The handoff went from "here's the design, good luck!" to an actual conversation about implementation.

## Three months later

> "It's the difference between 'I'm drowning in design work' and 'I actually can deliver so much now.'"

My clients see progress immediately. I'm not burning out on the boring parts. And the quality is better because I have time to actually iterate.

## Let's be real: It's not perfect

"Look, I'm not going to sit here and tell you Paraflow is flawless. It's not. Sometimes the AI makes weird choices, or completely misunderstands what I'm asking for."

"But here's the thing—even when it's not perfect, it's still faster than starting from scratch. It's easier to fix something that's 80% there than to build from zero."

### Ready to run your own coffee test?

Open Paraflow. Write one paragraph describing your design system. Hit generate, then go make your coffee.

When you come back in few minutes, see if you react the same way: "THIS IS SO COOL."
    `,
  },
];

export const getCategoryLabel = (category: BlogCategory): string => {
  return categories.find((c) => c.id === category)?.label || category;
};

export const getPostsByCategory = (category: BlogCategory): BlogPost[] => {
  return blogPosts.filter((post) => post.category === category);
};

export const getPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find((post) => post.slug === slug);
};
