/**
 * Resources (educational articles) — content model and helpers.
 *
 * Articles are authored as structured blocks in this file so new posts can be
 * added without touching any page or component. Inline links use
 * `[label](/path)` syntax inside text blocks.
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string };

export type Category =
  | "AI & Research"
  | "Computer Science"
  | "Career"
  | "Resume & Portfolio"
  | "Guides";

export const CATEGORIES: Category[] = [
  "AI & Research",
  "Computer Science",
  "Career",
  "Resume & Portfolio",
  "Guides",
];

export type Article = {
  slug: string;
  title: string;
  description: string;
  category: Category;
  /** ISO date, e.g. "2026-10-05" */
  published: string;
  readingMinutes: number;
  content: Block[];
};

export const ARTICLES: Article[] = [
  {
    slug: "what-is-rag",
    title: "What Is Retrieval-Augmented Generation (RAG)?",
    description:
      "RAG connects AI models to your own documents so answers are grounded in real sources instead of guesses. Here's how it works, step by step.",
    category: "AI & Research",
    published: "2026-10-05",
    readingMinutes: 7,
    content: [
      { type: "p", text: "Large language models are impressive, but they have a well-known weakness: they confidently generate answers even when they don't actually know them. Ask a standard chatbot about the contents of your Operating Systems lecture notes and it will happily invent an answer — because it has never seen your notes. Retrieval-Augmented Generation, or RAG, fixes this by giving the model something to read before it answers." },
      { type: "h2", text: "The core idea in one paragraph" },
      { type: "p", text: "Instead of asking the AI to answer purely from its training memory, RAG first retrieves the most relevant passages from your own documents, then hands those passages to the AI along with your question. The model generates its answer *based on the retrieved text*. The result: answers grounded in your sources, with citations you can check." },
      { type: "h2", text: "How RAG works, step by step" },
      { type: "ol", items: [
        "**Ingestion.** Your documents (PDFs, DOCX, TXT) are parsed into plain text.",
        "**Chunking.** The text is split into small passages — typically a few hundred to a couple thousand tokens each. Small chunks are easier to search precisely.",
        "**Embedding.** Each chunk is converted into a vector embedding: a list of numbers that captures its meaning. Similar meanings produce similar vectors.",
        "**Indexing.** Those vectors are stored in a vector database built for similarity search.",
        "**Retrieval.** When you ask a question, the question itself is embedded, and the database returns the chunks whose vectors are closest in meaning.",
        "**Generation.** The retrieved chunks are placed into the AI's prompt alongside your question, and the model writes an answer based on them — citing which chunk each claim came from.",
      ] },
      { type: "h2", text: "Why RAG matters for students" },
      { type: "p", text: "Three reasons RAG is a natural fit for academic work. First, **verifiability**: every answer can be traced to a page in your own materials, which is exactly what studying requires. Second, **freshness**: the model doesn't need retraining to know your new lecture slides — you just upload them. Third, **privacy of context**: your documents stay your working set instead of being baked into a public model." },
      { type: "quote", text: "A RAG answer is only as good as its retrieval. If the wrong passages are fetched, even a brilliant model will write a confident answer from the wrong evidence." },
      { type: "h2", text: "Where RAG can go wrong" },
      { type: "ul", items: [
        "**Bad chunking** splits a key definition across two chunks, so neither retrieves well.",
        "**Vague queries** retrieve vaguely related passages — precise questions get precise evidence.",
        "**Over-trusting the generator** — the model can still misread a retrieved passage, so check citations on anything important.",
      ] },
      { type: "h2", text: "RAG in practice" },
      { type: "p", text: "This is the architecture behind ZEVQYN's research workspaces: upload a document, it gets chunked and embedded, and every answer you receive carries citations back to the source. If you want the deeper mechanics, read [Vector Embeddings Explained for Beginners](/resources/vector-embeddings-explained) next — and to understand why this beats a plain chatbot, see [RAG vs Traditional AI Chatbots](/resources/rag-vs-traditional-ai-chatbots)." },
    ],
  },
  {
    slug: "vector-embeddings-explained",
    title: "Vector Embeddings Explained for Beginners",
    description:
      "Embeddings turn text into numbers that capture meaning — the engine behind semantic search and RAG. A beginner-friendly explanation with concrete examples.",
    category: "Computer Science",
    published: "2026-10-05",
    readingMinutes: 6,
    content: [
      { type: "p", text: "Every RAG system, recommendation engine, and semantic search box runs on the same trick: turning text into lists of numbers called **embeddings** (or vectors). Once text becomes numbers, a computer can measure *meaning* with arithmetic. This article explains how, with no math background required." },
      { type: "h2", text: "The problem embeddings solve" },
      { type: "p", text: "Computers don't understand words — they understand numbers. A keyword search for \"deadlock\" will never match a paragraph that only says \"two processes waiting on each other forever,\" even though a human sees they're about the same thing. Embeddings bridge that gap: they convert each piece of text into a vector where *similar meanings land near each other*." },
      { type: "h2", text: "What a vector actually is" },
      { type: "p", text: "A vector is just a list of numbers, like [0.21, -0.87, 0.44, …], typically hundreds or thousands of entries long. An embedding model — a neural network trained on huge amounts of text — produces these lists. The magic is in the geometry: the vectors for \"deadlock\" and \"two processes waiting on each other\" end up pointing in similar directions, while \"deadlock\" and \"chocolate cake\" point in very different ones." },
      { type: "h2", text: "Measuring similarity" },
      { type: "p", text: "To find which document chunk best matches your question, the system embeds your question into a vector too, then measures the angle (cosine similarity) or distance between it and every stored chunk vector. The closest ones win. That's semantic search: matching by meaning, not by shared keywords." },
      { type: "h2", text: "A concrete walkthrough" },
      { type: "ol", items: [
        "You upload lecture notes. Each paragraph becomes a vector and is stored.",
        "You ask: \"What causes a deadlock?\" That question becomes a vector.",
        "The system compares your question-vector against all paragraph-vectors.",
        "The paragraph about \"circular wait among processes holding resources\" scores highest — even though it never uses the word \"causes.\"",
        "That paragraph is handed to the AI, which answers from it and cites it.",
      ] },
      { type: "quote", text: "Embeddings don't understand text the way you do — they capture statistical patterns of meaning. Close in vector space means 'used in similar contexts,' which is usually, but not always, what you want." },
      { type: "h2", text: "Limitations worth knowing" },
      { type: "ul", items: [
        "**Ambiguity survives.** \"Bank\" (river) and \"bank\" (money) can blur together without enough context.",
        "**Longer isn't always better.** Very long chunks dilute meaning; that's why RAG systems chunk text deliberately.",
        "**Models differ.** A better embedding model retrieves more relevant passages — it's one of the highest-leverage upgrades in a RAG pipeline.",
      ] },
      { type: "h2", text: "Why this matters to you" },
      { type: "p", text: "You don't need to train embedding models to benefit from them — but understanding them helps you use AI tools well. Write specific questions, keep documents well-structured, and you'll retrieve better evidence. For the full picture of how retrieval fits into answering, read [What Is Retrieval-Augmented Generation (RAG)?](/resources/what-is-rag)." },
    ],
  },
  {
    slug: "rag-vs-traditional-ai-chatbots",
    title: "RAG vs Traditional AI Chatbots: What's the Difference?",
    description:
      "Both use large language models — but one answers from memory and the other answers from your documents. When to use each, and why it matters for studying.",
    category: "AI & Research",
    published: "2026-10-05",
    readingMinutes: 6,
    content: [
      { type: "p", text: "A traditional AI chatbot and a RAG system can look identical on screen: you type, it answers. Underneath, they work in fundamentally different ways — and for academic work, the difference decides whether you can trust the answer." },
      { type: "h2", text: "The traditional chatbot: answering from memory" },
      { type: "p", text: "A standard chatbot generates answers purely from patterns learned during training. It has no access to your files, your lecture slides, or anything published after its training cutoff. It's fast and fluent — and when it doesn't know something, its default behavior is to produce a plausible-sounding answer anyway. That confident fabrication is called hallucination." },
      { type: "h2", text: "RAG: answering from your documents" },
      { type: "p", text: "A RAG system adds a retrieval step before generation: it searches your uploaded documents for relevant passages and makes the model answer *from those passages*. The answer comes with citations, so every claim can be traced to a source you provided." },
      { type: "h2", text: "Side-by-side comparison" },
      { type: "ul", items: [
        "**Knowledge source:** chatbot → training data (frozen in time); RAG → training data *plus* your documents (current and specific).",
        "**Verifiability:** chatbot → take its word for it; RAG → citations you can open and check.",
        "**Your private materials:** chatbot → can't see them at all; RAG → built around them.",
        "**Failure mode:** chatbot → fluent fiction; RAG → wrong retrieval or misread passages (still check citations).",
        "**Best for:** chatbot → brainstorming, explanations of general concepts, drafting; RAG → studying *your* materials, exam prep, research grounded in specific sources.",
      ] },
      { type: "h2", text: "A practical example" },
      { type: "p", text: "Ask both systems: \"According to my OS lecture 4, what are the four conditions for deadlock?\" The traditional chatbot will list the four classic Coffman conditions from memory — which may or may not match what your lecturer actually taught. The RAG system retrieves your lecture 4 slides and answers from them, citing the slide. If your lecturer emphasized a fifth point or phrased things differently, only the RAG answer reflects *your course*." },
      { type: "quote", text: "Use chatbots to understand ideas in general. Use RAG to understand your specific materials. Exams test the second one." },
      { type: "h2", text: "Can you combine them?" },
      { type: "p", text: "Yes — and good tools do. General explanations from the model's knowledge, specific claims from retrieved documents, with a clear distinction between the two. ZEVQYN's research workspaces follow this pattern: citation-backed answers from your uploads, so studying stays anchored to what you'll actually be tested on." },
    ],
  },
  {
    slug: "how-ai-helps-students-understand-research-papers",
    title: "How AI Can Help Students Understand Research Papers",
    description:
      "Research papers are dense by design. Here's a practical workflow for using AI to decode them faster — without letting it do your thinking for you.",
    category: "Guides",
    published: "2026-10-05",
    readingMinutes: 8,
    content: [
      { type: "p", text: "Every CS student hits the same wall: a 12-page paper where the abstract makes sense, section 3 is written in what feels like another language, and the deadline is Friday. AI can genuinely help — but only if you use it as a reading accelerator rather than a replacement for reading. Here's a workflow that works." },
      { type: "h2", text: "Step 1: Get the skeleton first" },
      { type: "p", text: "Before diving in, ask for a structural summary: what problem does the paper solve, what's the proposed approach, and what did the evaluation show? This gives you a mental map. Reading with a map is dramatically faster than reading blind — you know which sections deserve slow attention and which you can skim." },
      { type: "h2", text: "Step 2: Interrogate the hard parts" },
      { type: "p", text: "When you hit a dense paragraph, don't just ask \"explain this.\" Ask targeted questions: \"What does the term *ablation study* mean in this context?\" or \"Why did the authors choose this baseline instead of X?\" Specific questions get specific answers; vague questions get vague summaries you've already read." },
      { type: "h2", text: "Step 3: Demand citations, then check them" },
      { type: "p", text: "This is the step most students skip. If the AI claims \"the paper reports 94% accuracy,\" ask *where* — which section, which table. Citation-backed tools like ZEVQYN's research workspaces do this automatically. Then actually open the cited passage. The five seconds it takes builds the habit that separates AI-assisted learning from AI-dependent guessing." },
      { type: "h2", text: "Step 4: Test yourself, don't just re-read" },
      { type: "p", text: "Re-reading feels productive and isn't. After working through a paper, generate questions from it — or better, have the AI generate questions *for you* — and answer them from memory. Flashcards from the paper's key definitions (\"What is an embedding?\" → \"A vector representation capturing meaning…\") convert passive reading into retrievable knowledge." },
      { type: "quote", text: "The goal isn't to finish the paper faster. It's to understand it well enough to explain it to someone else. AI gets you to that point in fewer painful hours." },
      { type: "h2", text: "What not to do" },
      { type: "ul", items: [
        "**Don't ask for a summary and stop there.** A summary of a paper you haven't read gives you vocabulary without understanding — it collapses the first time someone asks a follow-up.",
        "**Don't copy AI explanations into assignments.** Beyond academic-integrity rules, it robs you of the struggle that actually builds comprehension.",
        "**Don't trust numbers from memory.** Accuracy figures, dataset sizes, and baseline names should always be verified against the paper itself.",
      ] },
      { type: "h2", text: "A 30-minute paper workflow" },
      { type: "ol", items: [
        "Upload the paper to a research workspace (5 min to index).",
        "Ask for the problem → approach → results skeleton (5 min).",
        "Read the introduction and conclusion yourself (10 min).",
        "Interrogate 2–3 hard sections with targeted questions (10 min).",
        "Generate 5 flashcards of key terms and test yourself (5 min).",
      ] },
      { type: "p", text: "Used this way, AI doesn't replace the intellectual work — it removes the friction around it. For the technology that makes citation-backed answers possible, see [What Is Retrieval-Augmented Generation (RAG)?](/resources/what-is-rag)." },
    ],
  },
  {
    slug: "ats-friendly-resume-guide",
    title: "How to Build an ATS-Friendly Resume as a Computer Science Student",
    description:
      "Most resumes are filtered by software before a human sees them. Here's how to format, phrase, and structure a CS student resume that survives the filter.",
    category: "Resume & Portfolio",
    published: "2026-10-05",
    readingMinutes: 8,
    content: [
      { type: "p", text: "Before a recruiter reads your resume, an Applicant Tracking System (ATS) usually parses it. If the parser can't read your layout, your projects and skills may never reach human eyes. The good news: an ATS-friendly resume isn't about gaming the system — it's about clarity, which humans prefer too." },
      { type: "h2", text: "Formatting rules that matter" },
      { type: "ul", items: [
        "**Single column.** Multi-column layouts, text boxes, and tables confuse parsers. One clean vertical flow.",
        "**Standard section headings.** Use \"Experience,\" \"Projects,\" \"Education,\" \"Skills\" — creative headings like \"My Journey\" get misclassified.",
        "**No graphics-as-information.** Skill bars, proficiency charts, and icons can't be parsed. Write \"Python, FastAPI, PostgreSQL\" as text.",
        "**Standard fonts and no images.** Keep it to common fonts; skip photos, logos, and headers/footers with key info.",
        "**PDF or DOCX**, exported from a clean template — and test that text selects cleanly in the exported file.",
      ] },
      { type: "h2", text: "What to put in each section" },
      { type: "h3", text: "Projects (your strongest section as a student)" },
      { type: "p", text: "List 2–4 projects with a strict formula: **what it is, what you built, what it achieved.** \"Built a blood-donor matching platform (React Native, Firebase) with an 8×8 compatibility matrix; 3 releases shipped via GitHub.\" Technologies in parentheses, outcomes with numbers wherever possible." },
      { type: "h3", text: "Skills" },
      { type: "p", text: "Group them: Languages (Python, TypeScript), Frameworks (React, FastAPI), Tools (Git, Docker). Mirror keywords from the job posting *only if you genuinely know them* — keyword stuffing backfires in interviews." },
      { type: "h3", text: "Experience" },
      { type: "p", text: "Internships, freelance, teaching-assistant roles, open-source contributions — all count. Each bullet: strong verb + what you did + measurable result. \"Fixed 3 race-condition bugs in…\" beats \"Worked on backend stuff.\"" },
      { type: "h3", text: "Education" },
      { type: "p", text: "Degree, university, expected graduation. Include GPA only if it helps you (generally 3.0+/4.0). Relevant coursework can go here if you're light on experience." },
      { type: "quote", text: "Recruiters spend seconds on a first scan. Clear headings, strong verbs, and numbers are what make those seconds count." },
      { type: "h2", text: "Common student mistakes" },
      { type: "ul", items: [
        "**Objective statements** (\"seeking a challenging position…\") — replace with 2–3 lines of professional summary or drop it entirely.",
        "**Listing every technology you've touched** — a shallow wall of keywords invites questions you can't answer.",
        "**No links** — add GitHub, LinkedIn, and portfolio URLs. Make sure they work.",
        "**Two pages for two internships** — as a student, one sharp page beats two padded ones.",
      ] },
      { type: "h2", text: "Build it, don't just format it" },
      { type: "p", text: "Structure matters more than design tools. ZEVQYN's resume builder uses a clean single-column ATS-friendly layout with PDF export — you fill in the content, it handles the formatting rules above. Pair it with [How to Turn University Projects Into Portfolio Projects](/resources/turn-university-projects-into-portfolio-projects) to make your projects section undeniable." },
    ],
  },
  {
    slug: "turn-university-projects-into-portfolio-projects",
    title: "How to Turn University Projects Into Portfolio Projects",
    description:
      "Your coursework is more impressive than you think. Here's how to reframe lab assignments and semester projects into portfolio pieces recruiters respect.",
    category: "Guides",
    published: "2026-10-05",
    readingMinutes: 7,
    content: [
      { type: "p", text: "\"I don't have any real projects\" is the most common — and most wrong — thing CS students say. You have semesters of projects. The gap isn't the work; it's the presentation. A lab assignment framed as \"Lab 05\" impresses nobody. The same work framed as a solved problem with decisions and outcomes impresses recruiters." },
      { type: "h2", text: "Step 1: Pick the right projects" },
      { type: "p", text: "Choose 2–4 projects where you can answer yes to at least two of these: Did you make real technical decisions? Did something actually work end-to-end? Could you demo it in 2 minutes? A complete small project beats an ambitious half-finished one every time." },
      { type: "h2", text: "Step 2: Reframe the narrative" },
      { type: "p", text: "Rewrite each project in three parts:" },
      { type: "ol", items: [
        "**Problem.** What was hard or interesting? (\"Needed encrypted on-device storage for a finance app with zero backend.\")",
        "**Decisions.** What did *you* choose and why? (\"Used expo-crypto instead of crypto-js after discovering the latter throws in the React Native runtime.\")",
        "**Outcome.** What works now? Numbers help: users, performance, test coverage, releases shipped.",
      ] },
      { type: "p", text: "Notice what's missing: the course code, the professor's name, the grade. Recruiters hire problem-solvers, not assignment-completers." },
      { type: "h2", text: "Step 3: Make it verifiable" },
      { type: "ul", items: [
        "**Clean up the repo.** A README with what it is, how to run it, and a screenshot or demo. Delete dead code and commit messages like \"final final v2.\"",
        "**Add a live link** if possible — deployed demo, APK release, or at minimum clear run instructions.",
        "**Show the process.** A short \"challenges\" section (what broke, how you fixed it) signals senior thinking.",
      ] },
      { type: "quote", text: "Recruiters don't need your projects to be original ideas. They need evidence you can finish things, make decisions, and explain them." },
      { type: "h2", text: "Step 4: Connect it to your resume and portfolio" },
      { type: "p", text: "The same project should appear in three places, each tuned differently: one bullet on the resume (outcome-focused), a full case study on the portfolio (decision-focused), and the repo itself (code-focused). Consistency across all three builds trust. ZEVQYN's portfolio builder lets you attach your projects to a public page with a shareable link — see [How to Build a Strong Developer Portfolio](/resources/build-strong-developer-portfolio) for the full playbook." },
    ],
  },
  {
    slug: "build-strong-developer-portfolio",
    title: "How to Build a Strong Developer Portfolio",
    description:
      "What actually makes a developer portfolio convincing: project selection, case-study structure, and the small details that signal professionalism.",
    category: "Resume & Portfolio",
    published: "2026-10-05",
    readingMinutes: 7,
    content: [
      { type: "p", text: "Your resume gets you past the filter; your portfolio closes the deal. But most student portfolios fail in the same way: a grid of project names with no evidence of thought. Here's what separates a portfolio that gets callbacks from one that gets closed." },
      { type: "h2", text: "The 10-second test" },
      { type: "p", text: "A recruiter spends about ten seconds on a first visit. In that time they should learn: who you are, what you build, and one impressive proof point. That means your headline and hero section do the heaviest lifting — name, one-line identity (\"CS student building AI products\"), and links to GitHub and LinkedIn, all visible without scrolling." },
      { type: "h2", text: "Project selection: fewer, deeper" },
      { type: "p", text: "Three strong projects beat eight shallow ones. For each project, a convincing entry has:" },
      { type: "ul", items: [
        "**A one-line summary** a non-technical person understands.",
        "**The stack** — technologies used, as plain text.",
        "**What you actually did** — your decisions, not the tutorial's.",
        "**Proof** — live link, screenshots, or at minimum a repo with a real README.",
        "**Code and demo links** side by side.",
      ] },
      { type: "h2", text: "Write case studies, not descriptions" },
      { type: "p", text: "\"A task manager app built with React\" describes thousands of projects. \"A task manager that syncs offline-first with conflict resolution — here's the merge strategy I chose and why\" describes *yours*. The formula from [turning university projects into portfolio pieces](/resources/turn-university-projects-into-portfolio-projects) applies: problem → your decisions → outcome." },
      { type: "h2", text: "Details that signal professionalism" },
      { type: "ul", items: [
        "**A real photo or clean avatar** — faceless portfolios feel template-generated.",
        "**An about section** in your own voice, 3–5 lines: who you are, what you're learning, what you're looking for.",
        "**Skills grouped by category**, not an endless cloud.",
        "**Education and certifications** — brief, factual.",
        "**A contact call-to-action** — make the next step obvious: \"Let's work together\" with working links.",
        "**No broken links.** Click every single one before you share the URL.",
      ] },
      { type: "quote", text: "A portfolio isn't a gallery of what you made. It's an argument that you can think, build, and finish." },
      { type: "h2", text: "Keep it alive" },
      { type: "p", text: "A portfolio frozen in 2024 hurts more than no portfolio. Update it when you finish something meaningful — new project, new skill, new role. Tools like ZEVQYN's portfolio builder make this low-friction: edit your profile, attach projects, publish to a public link, and share the same URL everywhere." },
    ],
  },
  {
    slug: "prepare-software-engineering-internship",
    title: "How to Prepare for a Software Engineering Internship",
    description:
      "A realistic preparation plan for landing a software engineering internship: skills, projects, applications, and interviews — in the right order.",
    category: "Career",
    published: "2026-10-05",
    readingMinutes: 9,
    content: [
      { type: "p", text: "Internship hunting feels chaotic because students prepare in the wrong order: grinding LeetCode for months with no projects, or building projects with no plan to apply. Here's the sequence that actually works, roughly in order of leverage." },
      { type: "h2", text: "Phase 1: Foundations (ongoing)" },
      { type: "p", text: "You need one language deeply (Python or TypeScript/JavaScript are safe bets), Git fluency, and core CS fundamentals: data structures, basic algorithms, HTTP, databases, and how the web actually works. Your coursework covers much of this — the gap is usually *applied* practice, not theory." },
      { type: "h2", text: "Phase 2: Proof of work (4–8 weeks of focus)" },
      { type: "p", text: "Build 2–3 complete projects (see [how to turn university projects into portfolio pieces](/resources/turn-university-projects-into-portfolio-projects)). Then package them: an [ATS-friendly resume](/resources/ats-friendly-resume-guide) and a [strong portfolio](/resources/build-strong-developer-portfolio) with a public link. Most students skip the packaging and wonder why good projects get no replies." },
      { type: "h2", text: "Phase 3: Applications (volume + targeting)" },
      { type: "ul", items: [
        "**Apply widely but not blindly.** 50+ applications is normal; tailor the top lines of your resume to each role's keywords.",
        "**Use every channel:** company career pages, LinkedIn, referrals from seniors, university career offices, and open-source communities.",
        "**Track everything** in a simple sheet: company, role, date, status. Follow up once after 1–2 weeks of silence.",
        "**Treat rejections as data.** No replies at all → resume/portfolio problem. Replies but no offers → interview problem.",
      ] },
      { type: "h2", text: "Phase 4: Interviews" },
      { type: "ol", items: [
        "**Coding rounds:** practice the common patterns (two pointers, sliding window, hash maps, BFS/DFS, basic DP) — not every problem ever asked. Talk through your thinking out loud.",
        "**Project deep-dives:** be ready to explain any project on your resume in detail: architecture, your decisions, what broke, what you'd do differently. This is where packaged projects pay off.",
        "**Behavioral:** prepare 3–4 stories (a hard bug, a disagreement, a deadline) in STAR format: Situation, Task, Action, Result.",
      ] },
      { type: "quote", text: "Companies don't hire the student who knows the most. They hire the student who can show finished work, explain decisions, and learn fast." },
      { type: "h2", text: "The timeline" },
      { type: "p", text: "Start preparing one semester before you want the internship. Applications for summer roles often open 4–6 months early — waiting until summer to start is the single most common mistake. Build in public as you go: commit code, write about what you learn, keep your portfolio current. By the time applications open, your proof is already assembled." },
      { type: "h2", text: "Mindset" },
      { type: "p", text: "You will be rejected more than accepted. That's the market, not a verdict on you. Each cycle — apply, interview, reflect, improve — makes the next one stronger. The students who land internships aren't the ones who never failed; they're the ones who kept iterating." },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function relatedArticles(article: Article, count = 3): Article[] {
  const others = ARTICLES.filter((a) => a.slug !== article.slug);
  const sameCat = others.filter((a) => a.category === article.category);
  const rest = others.filter((a) => a.category !== article.category);
  return [...sameCat, ...rest].slice(0, count);
}

export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
