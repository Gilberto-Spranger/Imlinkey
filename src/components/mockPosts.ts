export const mockPosts = [
  {
    id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    author: {
      name: "Elena Rostova",
      handle: "@elenar",
      verified: true,
    },
    content: `Artificial intelligence is becoming a daily productivity tool rather than a futuristic concept.
Teams are now using AI to summarize meetings, generate documentation, write production-ready code, and automate repetitive workflows.
The biggest challenge is no longer access to models but designing reliable systems around them.
Companies investing in high-quality data are seeing better results than those relying only on larger models.
Developers are increasingly combining local inference with cloud APIs to reduce latency and cost.
Security and privacy remain critical considerations for enterprise deployments.
Open-source models continue to improve at an impressive pace.
The next generation of AI products will focus on collaboration instead of replacement.
The future belongs to teams that know how to work alongside AI.
#AI #Technology #Innovation`,
    timeAgo: "2h",
    stats: {
      likes: "18.5k",
      comments: "2.3k",
      reposts: "5.1k",
      views: "2.1M",
    },
    media: {
      type: "image" as const,
      url: "https://wxmbjwyiqzhzflmqkqzr.supabase.co/storage/v1/object/public/mockPosts/1701617f8ab6f889d4cf8255e8de4b18.jpg",
    },
  },

  {
    id: "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e",
    author: {
      name: "PC Master Lab",
      handle: "@pcmasterlab",
      verified: true,
    },
    content: `Modern gaming PCs are entering a new generation of performance.
New GPUs deliver better ray tracing while consuming less power.
Frame generation technologies continue to improve visual smoothness.
Fast NVMe SSDs dramatically reduce loading times.
DDR5 memory has become the preferred choice for enthusiast builds.
Airflow optimization is still one of the most overlooked upgrades.
High refresh-rate monitors completely change competitive gaming.
Balancing CPU and GPU remains more important than chasing flagship hardware.
A well-built mid-range PC can outperform expensive unbalanced systems.
#PCGaming #RTX #Hardware`,
    timeAgo: "4h",
    stats: {
      likes: "14.8k",
      comments: "987",
      reposts: "2.2k",
      views: "920k",
    },
    media: {
      type: "image" as const,
      url: "https://wxmbjwyiqzhzflmqkqzr.supabase.co/storage/v1/object/public/mockPosts/60bbcfaf2d62352a11ef585897588683.jpg",
    },
  },

  {
    id: "c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f",
    author: {
      name: "Music Future",
      handle: "@musicfuture",
    },
    content: `Artificial intelligence is transforming music production.
Artists now use AI to generate ideas, harmonies, and instrument arrangements.
Human creativity remains essential for emotional storytelling.
Studios increasingly combine AI assistance with traditional production workflows.
Independent musicians benefit from lower production costs.
Listeners continue to value authenticity and originality.
The industry is adapting licensing models for AI-generated content.
Collaboration between musicians and technology is accelerating.
The next decade will redefine how songs are created and shared.
Music is evolving faster than ever.
#Music #AI #Creators`,
    timeAgo: "6h",
    stats: {
      likes: "21k",
      comments: "1.4k",
      reposts: "3.8k",
      views: "1.8M",
    },
  },

  {
    id: "d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a",
    author: {
      name: "Tech Insider",
      handle: "@techinsider",
      verified: true,
    },
    content: `Edge computing continues to expand across industries.
Processing data closer to users reduces latency significantly.
Smart factories benefit from faster automation decisions.
Healthcare devices increasingly rely on local AI inference.
Autonomous systems require reliable real-time processing.
Cloud infrastructure still plays a central role.
Hybrid architectures are becoming the standard.
Developers must optimize workloads carefully.
The future combines edge intelligence with cloud scalability.
Technology keeps moving closer to the user.
#Edge #Cloud #AI`,
    timeAgo: "8h",
    stats: {
      likes: "12.2k",
      comments: "731",
      reposts: "2.4k",
      views: "640k",
    },
    media: {
      type: "video" as const,
      url: "https://wxmbjwyiqzhzflmqkqzr.supabase.co/storage/v1/object/public/mockPosts/13801233-hd_1080_1920_24fps.mp4",
    },
  },

  {
    id: "e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b",
    author: {
      name: "Code Journal",
      handle: "@codejournal",
    },
    content: `Developers are shipping software faster than ever.
Automation handles testing, formatting, and deployments.
Continuous integration has become standard practice.
Type safety reduces production bugs.
Observability helps detect failures early.
Infrastructure as code simplifies scaling.
Security should be integrated from day one.
Documentation remains a competitive advantage.
Developer experience influences product quality.
Great software is built through continuous improvement.`,
    timeAgo: "10h",
    stats: {
      likes: "9.8k",
      comments: "520",
      reposts: "1.9k",
      views: "510k",
    },
  },

  {
    id: "f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c",
    author: {
      name: "Next Hardware",
      handle: "@nexthardware",
      verified: true,
    },
    content: `Liquid cooling has become more reliable over the years.
Modern AIO coolers offer quieter operation.
Thermal performance depends on airflow as much as radiator size.
Cable management improves cooling efficiency.
Power supplies with higher efficiency reduce heat.
Compact builds require careful planning.
Silent systems are increasingly popular.
Premium cases emphasize airflow first.
Balanced hardware always wins.
Performance starts with good engineering.`,
    timeAgo: "12h",
    stats: {
      likes: "7.3k",
      comments: "401",
      reposts: "1.3k",
      views: "370k",
    },
    media: {
      type: "image" as const,
      url: "https://wxmbjwyiqzhzflmqkqzr.supabase.co/storage/v1/object/public/mockPosts/8920913a90581754cb1a5ce521ded49b.jpg",
    },
  },

  {
    id: "a7b8c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d",
    author: {
      name: "AI Studio",
      handle: "@aistudio",
    },
    content: `Generative AI is changing digital content creation.
Images, videos, and documents can now be produced in minutes.
Creative professionals still guide the final direction.
Prompt engineering continues to evolve rapidly.
Evaluation is more important than generation.
Responsible AI practices build trust.
Quality datasets improve output dramatically.
Human feedback remains essential.
Innovation happens through experimentation.
The creative landscape keeps expanding.`,
    timeAgo: "14h",
    stats: {
      likes: "24k",
      comments: "1.8k",
      reposts: "4.9k",
      views: "2.9M",
    },
  },

  {
    id: "b8c9d0e1-f2a3-4b5c-6d7e-8f9a0b1c2d3e",
    author: {
      name: "Gaming Zone",
      handle: "@gamingzone",
      verified: true,
    },
    content: `Competitive gaming continues to grow globally.
Players invest in low-latency peripherals.
Mechanical keyboards remain a favorite.
Wireless technology has improved dramatically.
Higher FPS provides smoother gameplay.
Practice still matters more than hardware.
Community tournaments attract new talent.
Streaming helps players build careers.
Gaming culture keeps expanding worldwide.
Technology drives the next generation of esports.`,
    timeAgo: "18h",
    stats: {
      likes: "19k",
      comments: "1.1k",
      reposts: "2.7k",
      views: "1.4M",
    },
    media: {
      type: "image" as const,
      url: "https://wxmbjwyiqzhzflmqkqzr.supabase.co/storage/v1/object/public/mockPosts/8ecd5d4e75a56bd80f0587bf812ed026.jpg",
    },
  },

  {
    id: "c9d0e1f2-a3b4-5c6d-7e8f-9a0b1c2d3e4f",
    author: {
      name: "Future Music",
      handle: "@futuremusic",
    },
    content: `Music streaming platforms continue evolving.
Personalized recommendations improve discovery.
Spatial audio is gaining popularity.
Independent artists reach global audiences.
Short-form videos influence music trends.
Communities shape viral success.
Live performances remain irreplaceable.
Technology empowers creators of every size.
Innovation benefits listeners and musicians alike.
The future of music is collaborative.`,
    timeAgo: "20h",
    stats: {
      likes: "11k",
      comments: "602",
      reposts: "1.5k",
      views: "690k",
    },
  },

  {
    id: "d0e1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a",
    author: {
      name: "Innovation Daily",
      handle: "@innovationdaily",
      verified: true,
    },
    content: `Technology advances through consistent experimentation.
Small improvements accumulate over time.
Open collaboration accelerates progress.
Developers share knowledge across communities.
Artificial intelligence expands productivity.
Cloud computing enables global services.
Cybersecurity remains everyone's responsibility.
Reliable infrastructure powers digital experiences.
Innovation depends on curiosity and execution.
The next breakthrough may already be in development.
#Innovation #Future #Tech`,
    timeAgo: "1d",
    stats: {
      likes: "27k",
      comments: "2.5k",
      reposts: "6.7k",
      views: "3.5M",
    },
    media: {
      type: "video" as const,
      url: "https://wxmbjwyiqzhzflmqkqzr.supabase.co/storage/v1/object/public/mockPosts/13801233-hd_1080_1920_24fps.mp4",
    },
  },
];

export default mockPosts;
