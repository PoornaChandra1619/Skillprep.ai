import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const COMPANIES_DATA = [
  // Tier 1 — FAANG+
  {
    company: "Google",
    slug: "google",
    tier: 1,
    category: "FAANG+",
    color: "#7c5cff",
    logoText: "G",
    roles: {
      "software-engineer": {
        Technical: [
          { id: "g-se-t-1", q: "Design a distributed rate limiter for Google Maps API.", note: "Software engineer track — focus on scale, partition strategies, and redis token bucket storage, not just correctness." },
          { id: "g-se-t-2", q: "Optimize a query scanning 10B rows in BigQuery.", note: "Partitioning and clustering indexing matter here. Walk through query planning analysis." },
          { id: "g-se-t-3", q: "Find the longest path in a directed acyclic graph.", note: "Detail topological sorting first, then dynamic programming logic." }
        ],
        Behavioral: [
          { id: "g-se-b-1", q: "Tell me about a time you disagreed with your lead on a choice.", note: "Google values Googleyness. Focus on active listening, data-driven negotiation, and disagreeing but committing." }
        ],
        HR: [
          { id: "g-se-h-1", q: "Why Google software engineering specifically?", note: "Focus on how you want to solve planetary scale problems, their open source culture, or tool chain ecosystems." }
        ]
      },
      "ml-engineer": {
        Technical: [
          { id: "g-mle-t-1", q: "How would you design a distributed feature store for real-time recommendations?", note: "Address ingestion latency, feature serving consistency, and scaling feature compute pipelines." },
          { id: "g-mle-t-2", q: "Explain how transformer self-attention scales with sequence length.", note: "Address the quadratic complexity O(n^2) and how flash attention mitigates memory bottleneck." }
        ],
        Behavioral: [
          { id: "g-mle-b-1", q: "How do you align cross-functional product requirements with ML metric trade-offs?", note: "Explain how you explain technical trade-offs (like precision vs recall latency) in business language." }
        ],
        HR: [
          { id: "g-mle-h-1", q: "What interests you most about Google DeepMind and AI research?", note: "Mention specific models or achievements like AlphaFold or Gemini developments that align with your aspirations." }
        ]
      },
      "data-analyst": {
        Technical: [
          { id: "g-da-t-1", q: "Write a SQL query to find user retention rate week-over-week.", note: "Use self-joins or cohort window functions. Address how you deal with user timezones." }
        ],
        Behavioral: [
          { id: "g-da-b-1", q: "Tell me about a time when your analysis contradicted a VP's business assumptions.", note: "Show how you presented clear data visualizations and statistical confidence levels to guide objective alignment." }
        ],
        HR: [
          { id: "g-da-h-1", q: "How do you choose which business queries are worth automating?", note: "Discuss value impact vs dashboard maintenance costs to demonstrate maturity." }
        ]
      },
      "product-manager": {
        Technical: [
          { id: "g-pm-t-1", q: "How would you design the search experience for Google Drive?", note: "Focus on user intent analysis, filter categorizations, semantic queries, and sorting models." }
        ],
        Behavioral: [
          { id: "g-pm-b-1", q: "Tell me about a time you had to launch a product with major technical debt.", note: "Focus on feature scope pruning, setting milestone phases, and user fallback communication." }
        ],
        HR: [
          { id: "g-pm-h-1", q: "What is your favorite Google product, and how would you improve it?", note: "Critique constructive metrics (engagement, friction, monetization) instead of just praising it." }
        ]
      }
    }
  },
  {
    company: "Amazon",
    slug: "amazon",
    tier: 1,
    category: "FAANG+",
    color: "#2dd4dc",
    logoText: "a",
    roles: {
      "software-engineer": {
        Technical: [
          { id: "a-se-t-1", q: "Design a system for Amazon's 'frequently bought together' feature.", note: "Amazon interviewers weight leadership principles even in technical rounds — mention customer obsession or ownership where it naturally fits." },
          { id: "a-se-t-2", q: "Given a stream of numbers, how do you find the median at any point?", note: "Use a min-heap and a max-heap to keep track of the halves of the numbers list." }
        ],
        Behavioral: [
          { id: "a-se-b-1", q: "Describe a time you had to make a decision with incomplete information.", note: "This maps to 'Bias for Action.' Be explicit about the risk you accepted and how you mitigated it." },
          { id: "a-se-b-2", q: "Tell me about a time you failed.", note: "Pick a real failure with a genuine lesson — avoid disguised humble-brags like 'I worked too hard.'" }
        ],
        HR: [
          { id: "a-se-h-1", q: "Which Amazon Leadership Principle do you relate to most, and why?", note: "Have one specific, ready story per principle you mention — vague alignment without an example falls flat here." }
        ]
      },
      "ml-engineer": {
        Technical: [
          { id: "a-mle-t-1", q: "Design a scalable latency-sensitive product recommender pipeline.", note: "Discuss near-line collaborative filtering, model inference caching, and batch feature updates." }
        ],
        Behavioral: [
          { id: "a-mle-b-1", q: "Tell me about a time you had to push back on a launch date because of ML safety.", note: "Connect this to Amazon's 'Earn Trust' and 'Customer Obsession' values." }
        ],
        HR: [
          { id: "a-mle-h-1", q: "Why Amazon's AWS AI team specifically?", note: "Highlight your interest in global cloud tooling, developer environments, or enterprise LLM scaling." }
        ]
      },
      "data-analyst": {
        Technical: [
          { id: "a-da-t-1", q: "How would you model and detect fraudulent merchant activity in AWS bills?", note: "Talk about anomaly distribution models, historical thresholding, and risk-weighted score outputs." }
        ],
        Behavioral: [
          { id: "a-da-b-1", q: "Describe how you presented an analytics insight that directly modified shipping routes logistics.", note: "Focus on business numbers impact (reduced transit times, cost savings) and leadership principle alignment." }
        ],
        HR: [
          { id: "a-da-h-1", q: "What does ownership mean to you when analyzing data pipelines?", note: "Highlight that analysts should monitor pipeline hygiene, not just consumer dashboards." }
        ]
      },
      "product-manager": {
        Technical: [
          { id: "a-pm-t-1", q: "Design a dashboard for third-party sellers on Amazon Marketplace.", note: "Focus on seller friction points: inventory levels, customer support tickets, sales trends, and promotion settings." }
        ],
        Behavioral: [
          { id: "a-pm-b-1", q: "Tell me about a time you had to deliver results when you were short on resources.", note: "Detail your prioritization framework, stakeholder alignments, and incremental launch strategy." }
        ],
        HR: [
          { id: "a-pm-h-1", q: "How do you evaluate if a feature matches Amazon's customer obsession value?", note: "Show how you define user metrics, track NPS, and measure long-term lifetime value vs short term conversions." }
        ]
      }
    }
  },
  {
    company: "Microsoft",
    slug: "microsoft",
    tier: 1,
    category: "FAANG+",
    color: "#7c5cff",
    logoText: "M",
    roles: {
      "software-engineer": {
        Technical: [
          { id: "m-se-t-1", q: "How would you detect a cycle in a linked list?", note: "State the two-pointer (Floyd's) approach and its O(1) space advantage over a hash-set approach before coding." }
        ],
        Behavioral: [
          { id: "m-se-b-1", q: "Tell me about a project where you had to learn a new technology quickly.", note: "Emphasize your learning process, not just the outcome — Microsoft rounds often probe how you approach ambiguity." }
        ],
        HR: [
          { id: "m-se-h-1", q: "How do you handle feedback that you disagree with?", note: "Show you can separate emotional reaction from evaluation — a brief example beats a general philosophy." }
        ]
      },
      "ml-engineer": {
        Technical: [
          { id: "m-mle-t-1", q: "Explain how you'd scale Azure AI Copilot queries concurrent processing.", note: "Discuss quantization (int8/fp8), KV caching strategies, and dynamic request batching." }
        ],
        Behavioral: [
          { id: "m-mle-b-1", q: "Describe how you aligned with safety alignment teams during model training.", note: "Explain how you structured bias validations and toxic prompts evaluation pipelines." }
        ],
        HR: [
          { id: "m-mle-h-1", q: "How do you see the AI partnership with OpenAI evolving?", note: "Focus on cloud computing infrastructure, Azure AI platform services, and co-development of models." }
        ]
      },
      "data-analyst": {
        Technical: [
          { id: "m-da-t-1", q: "Analyze user churn rates for Microsoft 365 enterprise tiers.", note: "Structure your answer around active seat usage, renewal cycle timings, and support ticket trends." }
        ],
        Behavioral: [
          { id: "m-da-b-1", q: "Describe a time you analyzed data that influenced a major UX overhaul in Windows.", note: "Focus on conversion funnel friction, user drop-offs, and A/B test validation." }
        ],
        HR: [
          { id: "m-da-h-1", q: "How do you handle data pipeline failures that delay morning dashboards?", note: "Emphasize alert configs, fallback dashboards, and quick incident post-mortems." }
        ]
      },
      "product-manager": {
        Technical: [
          { id: "m-pm-t-1", q: "Design the onboarding experience for Azure Cloud newbies.", note: "Focus on developer quickstart paths, free tier credit warnings, and sandbox templates." }
        ],
        Behavioral: [
          { id: "m-pm-b-1", q: "Describe a time you successfully managed a product rollout across a massive customer base.", note: "Detail your gradual rings rollout deployment strategy, safety gates, and feedback loops." }
        ],
        HR: [
          { id: "m-pm-h-1", q: "How does Microsoft's corporate culture of growth mindset guide your PM choices?", note: "Contrast a growth mindset (learning from failures, seeking feedback) with a fixed mindset." }
        ]
      }
    }
  },
  {
    company: "Meta",
    slug: "meta",
    tier: 1,
    category: "FAANG+",
    color: "#2dd4dc",
    logoText: "∞",
    roles: {
      "software-engineer": {
        Technical: [
          { id: "fb-se-t-1", q: "Design a simplified news feed architecture.", note: "Talk through push (fan-out on write) vs pull (fan-out on read) models, caching active users, and feed rankers." },
          { id: "fb-se-t-2", q: "Find the lowest common ancestor of two nodes in a binary tree.", note: "Explain recursive node matches and state recursive vs iterative space/time tradeoffs." }
        ],
        Behavioral: [
          { id: "fb-se-b-1", q: "Describe a time you took the initiative on a project that wasn't assigned to you.", note: "Meta values self-starters who move fast. Show how your action drove measurable team progress." }
        ],
        HR: [
          { id: "fb-se-h-1", q: "How do you handle shifting priorities and deadlines?", note: "Discuss how you assess impact and reprioritize deliverables without compromising quality." }
        ]
      },
      "ml-engineer": {
        Technical: [
          { id: "fb-mle-t-1", q: "How would you design the ranking algorithm for Instagram Reels?", note: "Address candidate generation, deep ranking models (CTR, watch time, shares), and online feedback loops." }
        ],
        Behavioral: [
          { id: "fb-mle-b-1", q: "Tell me about a time you optimized a model that had a negative impact on another team's metrics.", note: "Highlight your collaborative metric alignment sessions and trade-off decisions." }
        ],
        HR: [
          { id: "fb-mle-h-1", q: "What interests you about Meta's open-source LLM strategy (Llama)?", note: "Discuss developers engagement, cost efficiency, and standardizing AI infrastructure." }
        ]
      },
      "data-analyst": {
        Technical: [
          { id: "fb-da-t-1", q: "How do you evaluate if a new WhatsApp feature caused a drop in daily active users?", note: "Focus on user engagement segments, cohort analysis, and control-treatment leakage checks." }
        ],
        Behavioral: [
          { id: "fb-da-b-1", q: "Tell me about a time when you found a critical data logging bug that altered reported user numbers.", note: "Highlight how you validated the logging pipeline and aligned with the metrics compliance teams." }
        ],
        HR: [
          { id: "fb-da-h-1", q: "How do you balance statistical rigor with business speed?", note: "Discuss how you explain confidence intervals, statistical power, and sample sizes to business stakeholders." }
        ]
      },
      "product-manager": {
        Technical: [
          { id: "fb-pm-t-1", q: "Design a tool to help creators monetize their live streams.", note: "Target fan interactions: tipping mechanics, custom badges, subscription tiers, and payouts dashboards." }
        ],
        Behavioral: [
          { id: "fb-pm-b-1", q: "Describe a time you launched a product that failed to meet its main goal.", note: "Focus on your post-launch analysis, what metric was missed, and the pivot strategy." }
        ],
        HR: [
          { id: "fb-pm-h-1", q: "How do you align your product goals with Meta's vision of connecting people?", note: "Show how you define community metrics, active conversations, and user-to-user connections." }
        ]
      }
    }
  },
  {
    company: "Netflix",
    slug: "netflix",
    tier: 1,
    category: "FAANG+",
    color: "#ff6b72",
    logoText: "N",
    roles: {
      "software-engineer": {
        Technical: [
          { id: "n-se-t-1", q: "Design a video content delivery network (CDN) cache.", note: "Address geo-routing, cache eviction algorithms (LRU/LFU), and how you handle cache misses under peak load." }
        ],
        Behavioral: [
          { id: "n-se-b-1", q: "How do you balance high freedom with high responsibility in your work?", note: "Netflix culture focuses heavily on self-management and alignment with company goals. Provide a specific project example." }
        ],
        HR: [
          { id: "n-se-h-1", q: "What does stunning colleague performance look like to you?", note: "Relate this to Netflix's 'Keeper Test' philosophy and constructive feedback values." }
        ]
      },
      "ml-engineer": {
        Technical: [
          { id: "n-mle-t-1", q: "Design the Netflix homepage artwork personalization algorithm.", note: "Address multi-armed bandits, context vectors (user genre preference, history), and quick feedback collection." }
        ],
        Behavioral: [
          { id: "n-mle-b-1", q: "Explain how you present model recommendations improvements to design/creative leads.", note: "Focus on how you translate model scores into user visual layouts recommendations." }
        ],
        HR: [
          { id: "n-mle-h-1", q: "How do you view Netflix's culture of raw feedback?", note: "Emphasize that feedback should be given with positive intent and received with open reflection." }
        ]
      },
      "data-analyst": {
        Technical: [
          { id: "n-da-t-1", q: "Analyze the drop in subscribers completion rates for a new season release.", note: "Evaluate drop-off episodes points, device type latency, user location categories, and subtitle issues." }
        ],
        Behavioral: [
          { id: "n-da-b-1", q: "Describe a time you did an analysis that suggested canceling a popular show.", note: "Focus on how you metrics-proved that cost-per-view metrics were not viable for renewal." }
        ],
        HR: [
          { id: "n-da-h-1", q: "How do you evaluate metric health in a decentralized analytics team?", note: "Emphasize standard data definitions, shared dashboards, and peer reviews." }
        ]
      },
      "product-manager": {
        Technical: [
          { id: "n-pm-t-1", q: "Design a kid-friendly streaming profile experience.", note: "Focus on visual grid tiles, parent pin locks, content filters, and autoplay recommendations limits." }
        ],
        Behavioral: [
          { id: "n-pm-b-1", q: "Tell me about a time you made a product bet that went against user testing feedback.", note: "Explain how your data model proved test segments were biased, resulting in a successful rollout." }
        ],
        HR: [
          { id: "n-pm-h-1", q: "How do you define success metrics for Netflix's mobile gaming entry?", note: "Discuss user acquisition costs, gaming sessions engagement, and streaming subscriber retention correlations." }
        ]
      }
    }
  },

  // Tier 2 — Top MNC / Unicorn
  {
    company: "Uber",
    slug: "uber",
    tier: 2,
    category: "Top MNC / Unicorn",
    color: "#7c5cff",
    logoText: "U",
    roles: {
      "software-engineer": {
        Technical: [
          { id: "u-se-t-1", q: "How would you design Uber's ride matching system?", note: "Consider cell partitioning (H3/S2 geometry), dispatch delays, and geospatial database indexing." }
        ],
        Behavioral: [
          { id: "u-se-b-1", q: "Tell me about a time you handled an high-pressure production outage.", note: "Uber looks for customer-obsessed problem solvers who can make calm decisions in critical moments." }
        ],
        HR: [
          { id: "u-se-h-1", q: "Why Uber over other ride-sharing or logistics giants?", note: "Focus on their engineering scale, high density marketplace algorithms, or mapping infrastructure." }
        ]
      },
      "ml-engineer": {
        Technical: [
          { id: "u-mle-t-1", q: "Design the real-time ETA prediction system.", note: "Discuss input features (traffic speed, road grid geometry, driver behavior) and model latency requirements." }
        ],
        Behavioral: [
          { id: "u-mle-b-1", q: "How do you coordinate with safety teams to prevent pricing model biases?", note: "Explain how you monitor dynamic surge pricing models for systematic outliers." }
        ],
        HR: [
          { id: "u-mle-h-1", q: "What challenges in the autonomous systems space interest you?", note: "Relate this to Uber's marketplace integrations, routing systems, or mapping scale." }
        ]
      },
      "data-analyst": {
        Technical: [
          { id: "u-da-t-1", q: "How do you identify if surge pricing is hurting driver retention in a city?", note: "Compare driver session times, ride cancellations, and earnings patterns in control areas." }
        ],
        Behavioral: [
          { id: "u-da-b-1", q: "Describe how you presented an analytics dashboard that changed driver onboarding steps.", note: "Focus on onboarding funnel conversions, drop-offs points, and reduction in document verification delay." }
        ],
        HR: [
          { id: "u-da-h-1", q: "What data quality metrics do you track for real-time traffic updates?", note: "Emphasize latency checks, outlier pings filtered, and data validation coverage." }
        ]
      },
      "product-manager": {
        Technical: [
          { id: "u-pm-t-1", q: "Design a shared ride option (UberPool) for price-sensitive commuters.", note: "Focus on matching route algorithms delays, user safety alerts, pricing splits, and driver payouts." }
        ],
        Behavioral: [
          { id: "u-pm-b-1", q: "Tell me about a time you had to pivot a launch strategy due to local city regulations.", note: "Detail your regulatory adjustments, marketing alterations, and feature prunings." }
        ],
        HR: [
          { id: "u-pm-h-1", q: "How do you align driver satisfaction with rider happiness metrics?", note: "Discuss your marketplace balanced scorecard metrics (average ETA vs average driver earnings)." }
        ]
      }
    }
  },
  {
    company: "Adobe",
    slug: "adobe",
    tier: 2,
    category: "Top MNC / Unicorn",
    color: "#2dd4dc",
    logoText: "A",
    roles: {
      "software-engineer": {
        Technical: [
          { id: "ad-se-t-1", q: "Design a collaborative cloud document editing canvas.", note: "Focus on Operational Transformation (OT) vs Conflict-free Replicated Data Types (CRDTs) for concurrent edits." }
        ],
        Behavioral: [
          { id: "ad-se-b-1", q: "Describe a time you collaborated across multiple product teams to deliver a feature.", note: "Highlight your communication alignment strategies and dependency management." }
        ],
        HR: [
          { id: "ad-se-h-1", q: "How do you keep up with creative tech advancements?", note: "Relate this to Adobe's legacy of leading digital media creations and current generative AI investments." }
        ]
      },
      "ml-engineer": {
        Technical: [
          { id: "ad-mle-t-1", q: "Design a latent diffusion image generation service (like Firefly).", note: "Discuss prompt embedding tokens caches, distributed GPU inference grids, and watermark overlay steps." }
        ],
        Behavioral: [
          { id: "ad-mle-b-1", q: "How did you manage copyright safety checks when sourcing training datasets?", note: "Discuss alignment with legal guidelines, artist opt-outs, and dataset filtering." }
        ],
        HR: [
          { id: "ad-mle-h-1", q: "What does responsible generative AI look like in the creative space?", note: "Explain artist compensation models, copyright protections, and transparent model origins." }
        ]
      },
      "data-analyst": {
        Technical: [
          { id: "ad-da-t-1", q: "Analyze user churn funnels in Creative Cloud subscription tiers.", note: "Evaluate app active launch days, export actions done, help support tickets, and pricing tier choices." }
        ],
        Behavioral: [
          { id: "ad-da-b-1", q: "Describe how data insights prompted Adobe Photoshop to modify its welcome layout.", note: "Highlight drop-off metrics for beginners during the first 30 days of app usage." }
        ],
        HR: [
          { id: "ad-da-h-1", q: "How do you choose between standard dashboarding vs custom analytical models?", note: "Focus on business value, frequency of decisions, and engineering cost." }
        ]
      },
      "product-manager": {
        Technical: [
          { id: "ad-pm-t-1", q: "Design a collaborative web reviews workspace for Acrobat.", note: "Focus on comments pin markers, document revisions, user invitations, and slack integrations." }
        ],
        Behavioral: [
          { id: "ad-pm-b-1", q: "Tell me about a time you had to sunset a popular desktop feature for cloud options.", note: "Explain how you managed customer communication, handled legacy import compatibility, and phased prunings." }
        ],
        HR: [
          { id: "ad-pm-h-1", q: "How do you measure creativity tools success?", note: "Discuss workflow efficiency (time to export), user satisfaction, and daily active sessions." }
        ]
      }
    }
  },
  {
    company: "Salesforce",
    slug: "salesforce",
    tier: 2,
    category: "Top MNC / Unicorn",
    color: "#7c5cff",
    logoText: "SF",
    roles: {
      "software-engineer": {
        Technical: [
          { id: "sf-se-t-1", q: "Design a multi-tenant database indexing model.", note: "Salesforce is a multi-tenant platform. Discuss how tenant metadata queries are isolated and scaled securely." }
        ],
        Behavioral: [
          { id: "sf-se-b-1", q: "Tell me about a time you had to support a legacy system while planning a migration.", note: "Emphasize risk planning, step-by-step deprecation, and user alignment." }
        ],
        HR: [
          { id: "sf-se-h-1", q: "What does trust mean to you in cloud infrastructure?", note: "Salesforce ranks Trust as their #1 core value. Relate this directly to security, availability, and transparent outages." }
        ]
      },
      "ml-engineer": {
        Technical: [
          { id: "sf-mle-t-1", q: "Design the Einstein AI sales forecasting pipeline.", note: "Discuss tabular time series models, tenant metadata isolation, and model retraining cycles." }
        ],
        Behavioral: [
          { id: "sf-mle-b-1", q: "How do you explain model updates to enterprise clients who demand explanation?", note: "Emphasize feature importance metrics, model explanations reports, and stable APIs." }
        ],
        HR: [
          { id: "sf-mle-h-1", q: "Why Salesforce for AI application development?", note: "Highlight its massive enterprise data scale, CRM workflow integrations, and trust framework." }
        ]
      },
      "data-analyst": {
        Technical: [
          { id: "sf-da-t-1", q: "Analyze customer support ticket escalation metrics in Service Cloud.", note: "Structure this around ticket age, resolution times by agents, customer size categories, and product areas." }
        ],
        Behavioral: [
          { id: "sf-da-b-1", q: "Tell me about a time your data analysis exposed a product bottleneck for enterprise accounts.", note: "Focus on api rate limits hits, response latency outliers, and subscription upgrades recommendation." }
        ],
        HR: [
          { id: "sf-da-h-1", q: "How do you maintain data governance definitions in a massive lake?", note: "Discuss schema registry tools, metric catalog repositories, and clean ownership docs." }
        ]
      },
      "product-manager": {
        Technical: [
          { id: "sf-pm-t-1", q: "Design a dashboard for sales managers tracking rep quota attainment.", note: "Focus on pipeline pipeline conversion, deals age, rep activity scores, and win-rate trends." }
        ],
        Behavioral: [
          { id: "sf-pm-b-1", q: "Describe a time you had to align conflicting product goals between engineering and enterprise sales.", note: "Highlight how you balanced system performance stability with customized feature contracts." }
        ],
        HR: [
          { id: "sf-pm-h-1", q: "How do you evaluate if a feature addition improves user task efficiency?", note: "Focus on session time prunings, clicks reduced, and average task completion metrics." }
        ]
      }
    }
  },

  // Tier 3 — Service / IT
  {
    company: "TCS",
    slug: "tcs",
    tier: 3,
    category: "Service / IT",
    color: "#2dd4dc",
    logoText: "T",
    roles: {
      "software-engineer": {
        Technical: [
          { id: "tcs-se-t-1", q: "Explain the difference between SQL joins (INNER, LEFT, RIGHT, FULL).", note: "Service-company technical rounds lean toward fundamentals — be precise and use a small example table, don't just define terms." },
          { id: "tcs-se-t-2", q: "What is the difference between process and thread?", note: "Cover memory sharing and context-switch cost — these are the two points interviewers usually probe further." }
        ],
        Behavioral: [
          { id: "tcs-se-b-1", q: "How do you handle working under a tight client deadline?", note: "A short, concrete example beats a general statement about being a 'hard worker.'" }
        ],
        HR: [
          { id: "tcs-se-h-1", q: "Are you willing to relocate / work in shifts?", note: "Answer directly and honestly — hedging here reads as a red flag more than the answer itself does." }
        ]
      },
      "ml-engineer": {
        Technical: [
          { id: "tcs-mle-t-1", q: "What is overfitting, and how do you prevent it in tabular models?", note: "Discuss L1/L2 regularization, dropout steps, cross-validation, and pruning trees." }
        ],
        Behavioral: [
          { id: "tcs-mle-b-1", q: "How do you report model performance to clients who don't know ML?", note: "Translate mathematical accuracy scores into business savings or efficiency metrics." }
        ],
        HR: [
          { id: "tcs-mle-h-1", q: "Are you comfortable with client-facing ML consultation?", note: "Emphasize communication skills, active listening, and setting practical expectations." }
        ]
      },
      "data-analyst": {
        Technical: [
          { id: "tcs-da-t-1", q: "Write a SQL query to join sales and customer tables with aggregations.", note: "Use GROUP BY, SUM, and aggregate filters safely. Watch for null values handling." }
        ],
        Behavioral: [
          { id: "tcs-da-b-1", q: "Describe a time you had to compile a report for a client with dirty source data.", note: "Explain your data cleaning methodologies and assumptions documentations." }
        ],
        HR: [
          { id: "tcs-da-h-1", q: "How do you deal with client dashboards update delays?", note: "Discuss backup files checks, server health alarms, and client notifications templates." }
        ]
      },
      "product-manager": {
        Technical: [
          { id: "tcs-pm-t-1", q: "Write a detailed PRD for a basic employee holiday booking portal.", note: "Cover user roles (employee, manager, HR), approval flows, balance logic, and email triggers." }
        ],
        Behavioral: [
          { id: "tcs-pm-b-1", q: "Tell me about a time you resolved a major project delay with a client.", note: "Detail scope adjustments, prioritization lists, and transparent timelines alignment." }
        ],
        HR: [
          { id: "tcs-pm-h-1", q: "How do you manage client scope changes without budget increases?", note: "Discuss change request logs, impact analysis reports, and steering committee approvals." }
        ]
      }
    }
  },
  {
    company: "Infosys",
    slug: "infosys",
    tier: 3,
    category: "Service / IT",
    color: "#7c5cff",
    logoText: "I",
    roles: {
      "software-engineer": {
        Technical: [
          { id: "inf-se-t-1", q: "Explain the pillars of Object Oriented Programming.", note: "Cover Abstraction, Encapsulation, Inheritance, and Polymorphism with neat, clear real-world examples." }
        ],
        Behavioral: [
          { id: "inf-se-b-1", q: "Describe a situation where a client requested a major scope change.", note: "Show how you documented options, managed expectations, and aligned with your delivery lead." }
        ],
        HR: [
          { id: "inf-se-h-1", q: "Where do you see yourself in 3 years within a service ecosystem?", note: "Highlight your intent to gain broad vertical domains experience and progress into technical leadership." }
        ]
      },
      "ml-engineer": {
        Technical: [
          { id: "inf-mle-t-1", q: "What is the difference between supervised and unsupervised learning?", note: "Define labeled target mappings vs patterns clustering. Use classification vs K-means examples." }
        ],
        Behavioral: [
          { id: "inf-mle-b-1", q: "Describe how you managed project deliveries when client data access was delayed.", note: "Explain how you utilized mock datasets and local testing structures to make progress." }
        ],
        HR: [
          { id: "inf-mle-h-1", q: "What domain training interests you most at Infosys?", note: "Mention specific business verticals like banking, retail, or logistics where ML has massive impact." }
        ]
      },
      "data-analyst": {
        Technical: [
          { id: "inf-da-t-1", q: "How do you handle null values in an Excel or SQL dataset?", note: "Contrast row drop, mean/median imputer, and custom flags imputation, noting safety trade-offs." }
        ],
        Behavioral: [
          { id: "inf-da-b-1", q: "Describe how you presented a monthly business scorecard to client managers.", note: "Highlight key metrics variations, support action items, and clear graphs layout." }
        ],
        HR: [
          { id: "inf-da-h-1", q: "What is your approach to learning new business visualization tools?", note: "Emphasize tutorial checks, building sandboxes, and aligning with internal experts." }
        ]
      },
      "product-manager": {
        Technical: [
          { id: "inf-pm-t-1", q: "Design a feedback collection module for a mobile banking app.", note: "Target prompt timings, star rating scales, detail review comments, and feedback categorizations." }
        ],
        Behavioral: [
          { id: "inf-pm-b-1", q: "Describe how you prioritized features when client stakeholders had completely conflicting goals.", note: "Discuss value impact vs delivery complexity scoring models (like WSJF/RICE)." }
        ],
        HR: [
          { id: "inf-pm-h-1", q: "Why Infosys PM over direct consulting roles?", note: "Highlight product management ownership, structured delivery frameworks, and building global products." }
        ]
      }
    }
  },
  {
    company: "Accenture",
    slug: "accenture",
    tier: 3,
    category: "Service / IT",
    color: "#2dd4dc",
    logoText: ">",
    roles: {
      "software-engineer": {
        Technical: [
          { id: "acc-se-t-1", q: "What is normalized vs denormalized database design?", note: "Discuss anomalies prevention in normal forms (1NF/2NF/3NF) vs read query optimizations in denormalized warehouses." }
        ],
        Behavioral: [
          { id: "acc-se-b-1", q: "Tell me about a time you worked with a difficult team member.", note: "Focus on empathy, clear professional boundaries, and alignment on shared project milestones." }
        ],
        HR: [
          { id: "acc-se-h-1", q: "Why Accenture consulting over standard software roles?", note: "Highlight your interest in solving diverse client domains problems and working with global scale teams." }
        ]
      },
      "ml-engineer": {
        Technical: [
          { id: "acc-mle-t-1", q: "What is the difference between bagging and boosting algorithms?", note: "Discuss parallel models averages (like Random Forest) vs sequential residuals fits (like XGBoost)." }
        ],
        Behavioral: [
          { id: "acc-mle-b-1", q: "Describe how you handled client skepticism during an AI model pilot launch.", note: "Detail your parallel runs verification, metric explanations, and transparent safety checks." }
        ],
        HR: [
          { id: "acc-mle-h-1", q: "Are you willing to participate in client pre-sales proposals?", note: "Focus on scoping requirements, technical slides prep, and presenting POC results." }
        ]
      },
      "data-analyst": {
        Technical: [
          { id: "acc-da-t-1", q: "What are data warehouses vs data lakes?", note: "Contrast structured SQL schemas in warehouses with unstructured files storage in data lakes." }
        ],
        Behavioral: [
          { id: "acc-da-b-1", q: "Describe a time you had to compile a dashboard for c-suite executives.", note: "Emphasize high-level metric summaries, color highlights alerts, and backup sheets links." }
        ],
        HR: [
          { id: "acc-da-h-1", q: "How do you ensure data security regulations (like GDPR) in reports?", note: "Focus on data aggregation, masking emails/PII, and secure dashboard access levels." }
        ]
      },
      "product-manager": {
        Technical: [
          { id: "acc-pm-t-1", q: "Design the checkout flow for an enterprise e-commerce platform.", note: "Target billing verification, order splits, payment gateway validations, and email invoice steps." }
        ],
        Behavioral: [
          { id: "acc-pm-b-1", q: "Tell me about a time you successfully managed a product rollout across multiple global regions.", note: "Detail regional customizations, localized user guides, and staggered deployment timelines." }
        ],
        HR: [
          { id: "acc-pm-h-1", q: "How do you prioritize project milestones when managing enterprise software upgrades?", note: "Discuss risk assessments, critical path analytics, and user testing alignments." }
        ]
      }
    }
  },

  // Tier 4 — Startup / Generic
  {
    company: "YC Startup (Generic)",
    slug: "startup",
    tier: 4,
    category: "Startup / Generic",
    color: "#7c5cff",
    logoText: "Y",
    roles: {
      "software-engineer": {
        Technical: [
          { id: "st-se-t-1", q: "Walk me through how you'd build a feature end-to-end with limited resources.", note: "Startups care about pragmatic trade-offs — explicitly call out what you'd cut or defer and why." }
        ],
        Behavioral: [
          { id: "st-se-b-1", q: "Tell me about a time you took ownership of something outside your defined role.", note: "This is the single most common startup behavioral question — have one strong example ready before the interview, not improvised." }
        ],
        HR: [
          { id: "st-se-h-1", q: "Why a startup instead of a bigger company?", note: "Avoid 'more responsibility' as your only reason — mention something specific about their product or stage that draws you in." }
        ]
      },
      "ml-engineer": {
        Technical: [
          { id: "st-mle-t-1", q: "How do you quickly build an ML proof-of-concept for a new user feature?", note: "Prioritize off-the-shelf API models (like OpenAI API) over training custom models to validate search product market fit." }
        ],
        Behavioral: [
          { id: "st-mle-b-1", q: "Describe how you iterated on a model when database storage was limited.", note: "Explain how you focused on feature engineering, lightweight models, and prompt limits." }
        ],
        HR: [
          { id: "st-mle-h-1", q: "Are you comfortable wear multiple technical hats (e.g. backend / devops)?", note: "Emphasize your adaptability, love for scrappy execution, and building systems from scratch." }
        ]
      },
      "data-analyst": {
        Technical: [
          { id: "st-da-t-1", q: "Set up the key retention metrics tracking for a seed-stage product.", note: "Focus on cohort grids, active daily triggers, churn curves, and product usage funnels." }
        ],
        Behavioral: [
          { id: "st-da-b-1", q: "Tell me about a time you did an analysis that resulted in product direction pivot.", note: "Focus on how database queries exposed feature drop-offs, prompting founders to adjust layout." }
        ],
        HR: [
          { id: "st-da-h-1", q: "How do you manage queries when product schemas are changing daily?", note: "Discuss building modular pipelines, data modeling adjustments, and aligning with developers daily." }
        ]
      },
      "product-manager": {
        Technical: [
          { id: "st-pm-t-1", q: "Define the MVP specs for a new shared workspaces app.", note: "Target the core value proposition: workspace listing, reservation slots, payment charges, and chat alerts. Ignore notifications histories or reviews pages." }
        ],
        Behavioral: [
          { id: "st-pm-b-1", q: "Describe how you managed customer feedback when shipping raw, bugs-heavy features.", note: "Detail your customer support alignments, hotfix deployments, and transparent release updates." }
        ],
        HR: [
          { id: "st-pm-h-1", q: "What does alignment mean to you in a team of 5 people?", note: "Highlight shared goals clarity, daily standup checks, and focus on moving fast." }
        ]
      }
    }
  },
  {
    company: "Stripe",
    slug: "stripe",
    tier: 4,
    category: "Startup / Generic",
    color: "#2dd4dc",
    logoText: "S",
    roles: {
      "software-engineer": {
        Technical: [
          { id: "str-se-t-1", q: "Design an idempotent API payment charge request handler.", note: "Stripe cares about production reliability. Address idempotency keys, atomic locks, double charge mitigations, and distributed transactions." }
        ],
        Behavioral: [
          { id: "str-se-b-1", q: "Tell me about a time you refactored an unmanageable codebase.", note: "Detail your incremental approach, testing coverage safety nets, and communication with the team during migrations." }
        ],
        HR: [
          { id: "str-se-h-1", q: "How do you align with Stripe's goal of increasing the GDP of the internet?", note: "Highlight your enthusiasm for reducing global trade friction and enabling access to global payments infrastructure." }
        ]
      },
      "ml-engineer": {
        Technical: [
          { id: "str-mle-t-1", q: "Design Stripe's Radar fraud detection model inference service.", note: "Discuss low-latency feature lookup caches, real-time predictions scores, and online updates loops." }
        ],
        Behavioral: [
          { id: "str-mle-b-1", q: "Tell me about a time when a fraud model update blocked valid customers.", note: "Explain how you adjusted model threshold limits and collaborated with customer support teams." }
        ],
        HR: [
          { id: "str-mle-h-1", q: "What makes payment fraud detection a unique challenge?", note: "Discuss high adversary variations, massive data scale, and low latency rules." }
        ]
      },
      "data-analyst": {
        Technical: [
          { id: "str-da-t-1", q: "Analyze API merchant churn behaviors across regions.", note: "Evaluate merchant active volumes, transaction failure rates, integration methods, and ticket queries." }
        ],
        Behavioral: [
          { id: "str-da-b-1", q: "Describe a time your analysis exposed payment gateway latency in a country.", note: "Detail how gateway response checks guided engineering team upgrades choices." }
        ],
        HR: [
          { id: "str-da-h-1", q: "How do you explain metric calculations to external merchants?", note: "Discuss clear reports structures, using merchant tooltips, and document queries definitions." }
        ]
      },
      "product-manager": {
        Technical: [
          { id: "str-pm-t-1", q: "Design a customizable invoices editor for global merchants.", note: "Focus on localized VAT tax regulations, currency displays, customized brandings, and PDF downloads." }
        ],
        Behavioral: [
          { id: "str-pm-b-1", q: "Tell me about a time you launched an API feature that broke backwards compatibility for some users.", note: "Detail how you handled warnings alerts, deprecation milestones, and fallback setups." }
        ],
        HR: [
          { id: "str-pm-h-1", q: "How do you prioritize developer experience (DX) in your product designs?", note: "Focus on clean docs, interactive test playgrounds, fast API responses, and simple SDK wrappers." }
        ]
      }
    }
  },
  {
    company: "OpenAI",
    slug: "openai",
    tier: 4,
    category: "Startup / Generic",
    color: "#7c5cff",
    logoText: "O",
    roles: {
      "software-engineer": {
        Technical: [
          { id: "ai-se-t-1", q: "Design a rate limiter for LLM tokens processing requests.", note: "Instead of request counting, limit on token quotas per window. Cover sliding window algorithms, token bucket schemes, and redis cluster caching." }
        ],
        Behavioral: [
          { id: "ai-se-b-1", q: "Describe how you managed project ambiguity under rapid, daily developments.", note: "Focus on how you maintain research agility while executing stable API endpoints delivery." }
        ],
        HR: [
          { id: "ai-se-h-1", q: "How do you view security safety guidelines vs release velocity?", note: "Discuss your alignment with responsible AI development principles and collaborative alignment with safety alignment teams." }
        ]
      },
      "ml-engineer": {
        Technical: [
          { id: "ai-mle-t-1", q: "Explain how you'd scale distributed LLM training across 10,000 GPUs.", note: "Discuss pipeline parallelism, tensor parallelism (Megatron-LM), ZeRO memory optimizations, and network bottlenecks." }
        ],
        Behavioral: [
          { id: "ai-mle-b-1", q: "Describe a model training run that was failing due to loss spikes, and how you fixed it.", note: "Explain how you analyzed gradient norms, learning rate adjustments, and dataset cleaning steps." }
        ],
        HR: [
          { id: "ai-mle-h-1", q: "Why OpenAI over other traditional AI research labs?", note: "Focus on alignment with AGI safety, scale-driven engineering models, and publishing user features." }
        ]
      },
      "data-analyst": {
        Technical: [
          { id: "ai-da-t-1", q: "Set up metrics to track toxicity variations in model outputs over time.", note: "Discuss prompts testing sets, classifier validations, human rating alignment, and average scores trends." }
        ],
        Behavioral: [
          { id: "ai-da-b-1", q: "Tell me about a time you analyzed training dataset quality that led to dataset exclusions.", note: "Detail how you found duplicates, toxic inputs, or low-quality scraped files." }
        ],
        HR: [
          { id: "ai-da-h-1", q: "How do you handle statistical anomalies in RLHF human evaluation metrics?", note: "Explain annotator agreement calculations (Fleiss' Kappa), identifying spam reviews, and normalizing scores." }
        ]
      },
      "product-manager": {
        Technical: [
          { id: "ai-pm-t-1", q: "Design a custom GPT store for users sharing customized assistant setups.", note: "Target creator sharing options, category searches, rating grids, search discovery, and monetization share plans." }
        ],
        Behavioral: [
          { id: "ai-pm-b-1", q: "Tell me about a time you had to launch a product that had major safety concerns.", note: "Discuss how you worked with red teaming segments, safety gates setups, and graduated releases." }
        ],
        HR: [
          { id: "ai-pm-h-1", q: "How do you define product market fit for AI agents features?", note: "Target metrics: task completion success rate, return sessions frequency, and user workflow integrations." }
        ]
      }
    }
  }
];

const ROUNDS = ["Technical", "Behavioral", "HR"];

const ROLES = [
  { id: "software-engineer", label: "Software Engineer" },
  { id: "ml-engineer", label: "ML Engineer" },
  { id: "data-analyst", label: "Data Analyst" },
  { id: "product-manager", label: "Product Manager" }
];

const TIERS = [
  { id: 1, label: "Tier 1 — FAANG+ (Google, Amazon, Microsoft...)", category: "FAANG+" },
  { id: 2, label: "Tier 2 — Top MNC / Unicorn (Uber, Adobe, Salesforce...)", category: "Top MNC / Unicorn" },
  { id: 3, label: "Tier 3 — Service & IT Giants (TCS, Infosys, Accenture...)", category: "Service / IT" },
  { id: 4, label: "Tier 4 — Startups & Disruptors (Stripe, OpenAI...)", category: "Startup / Generic" }
];

export default function InterviewQuestions() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/?login=true");
    }
  }, [navigate]);

  const [company, setCompany] = useState("google");
  const [role, setRole] = useState("software-engineer");
  const [round, setRound] = useState("Technical");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTiers, setExpandedTiers] = useState({ 1: true, 2: false, 3: false, 4: false });
  const [questionLimit, setQuestionLimit] = useState(2);

  const active = COMPANIES_DATA.find(c => c.slug === company);
  const list = active?.roles?.[role]?.[round] || [];

  useEffect(() => {
    setQuestionLimit(2);
  }, [company, role, round]);

  const toggleTier = (tierId) => {
    setExpandedTiers(prev => ({ ...prev, [tierId]: !prev[tierId] }));
  };

  const getCompanyQuestionCount = (comp) => {
    let total = 0;
    if (comp.roles) {
      Object.values(comp.roles).forEach(roleMap => {
        Object.values(roleMap).forEach(roundList => {
          total += roundList.length;
        });
      });
    }
    return total;
  };

  const getRoundCount = (roundName) => {
    return active?.roles?.[role]?.[roundName]?.length || 0;
  };

  const handlePractice = () => {
    let mockRole = "Software Engineer";
    if (active) {
      const activeRole = ROLES.find(r => r.id === role);
      mockRole = `${active.company} ${activeRole?.label || "Prep Candidate"}`;
    }
    navigate("/interview", { state: { role: mockRole } });
  };

  return (
    <div id="page-wrapper">
      <Navbar />

      <section id="wrapper">
        <header style={{ 
          position: "relative",
          backgroundImage: `url('/images/pic02.jpg')`, 
          backgroundSize: "cover",
          backgroundPosition: "center",
          paddingTop: "140px", 
          paddingBottom: "60px" 
        }}>
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(5,7,12,0.85) 0%, rgba(5,7,12,0.6) 100%)",
            zIndex: 1
          }} />
          <div className="inner" style={{ position: "relative", zIndex: 2 }}>
            <h2 className="bebas-font">Common Interview Questions</h2>
            <p>Commonly reported preparation patterns. Tap a company and round to practice answering.</p>
          </div>
        </header>

        <div className="wrapper">
          <div className="inner" style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 0" }}>
            
            {/* Header info */}
            <p style={{ color: "var(--text-grey)", fontSize: "14px", marginBottom: "30px", lineHeight: "1.6" }}>
              💡 <em>Note: These are commonly reported patterns for each company type, organized by round — pulled from the same packs your AI Voice Interviewer draws on. Not a guarantee of exact questions, just what to prepare for.</em>
            </p>

            {/* Search Input bar */}
            <div style={{ marginBottom: "30px", position: "relative" }}>
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="var(--text-grey)" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                style={{
                  position: "absolute",
                  left: "18px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none"
                }}
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Search companies (e.g. Google, Stripe, TCS...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  background: "rgba(30, 30, 35, 0.55)",
                  border: "1px solid var(--glass-border)",
                  color: "#ffffff",
                  padding: "12px 20px 12px 45px",
                  borderRadius: "25px",
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.3s ease"
                }}
                className="search-input-field"
              />
            </div>

            {/* Collapsible Tiered Company List */}
            <div style={{ marginBottom: "40px" }}>
              {TIERS.map(t => {
                const tierCompanies = COMPANIES_DATA.filter(c => 
                  c.tier === t.id && 
                  (searchQuery === "" || c.company.toLowerCase().includes(searchQuery.toLowerCase()))
                );

                if (tierCompanies.length === 0) return null;

                const isExpanded = expandedTiers[t.id] || searchQuery !== "";

                return (
                  <div key={t.id} style={{ marginBottom: "25px" }}>
                    <div 
                      onClick={() => toggleTier(t.id)}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px 20px",
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid var(--glass-border)",
                        borderRadius: "8px",
                        cursor: "pointer",
                        marginBottom: isExpanded ? "15px" : "0px",
                        transition: "all 0.3s ease"
                      }}
                      className="tier-header-bar"
                    >
                      <span style={{ fontWeight: "600", fontSize: "14px", color: "var(--brand-cyan)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {t.label}
                      </span>
                      <span style={{ fontSize: "12px", color: "var(--text-grey)" }}>
                        {isExpanded ? "Collapse ▴" : `Expand (${tierCompanies.length} companies) ▾`}
                      </span>
                    </div>

                    {isExpanded && (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "15px", marginBottom: "20px" }}>
                        {tierCompanies.map(c => (
                          <div
                            key={c.slug}
                            onClick={() => setCompany(c.slug)}
                            style={{
                              padding: "16px 20px",
                              borderRadius: "10px",
                              cursor: "pointer",
                              background: company === c.slug ? `${c.color}22` : "rgba(255,255,255,0.02)",
                              border: `1px solid ${company === c.slug ? c.color : "var(--glass-border)"}`,
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              transition: "all 0.3s ease"
                            }}
                            className="sp-card"
                          >
                            <div style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              background: c.color,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#ffffff",
                              fontWeight: "bold",
                              fontSize: "16px"
                            }}>
                              {c.logoText}
                            </div>
                            <div style={{ flex: 1, textAlign: "left" }}>
                              <h4 style={{ margin: "0 0 3px 0", color: "#ffffff", fontWeight: "600", fontSize: "14px" }}>{c.company}</h4>
                              <span style={{ fontSize: "11px", color: "var(--text-grey)" }}>{getCompanyQuestionCount(c)} questions</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Role Selection Tabs */}
            <div style={{ marginBottom: "25px" }}>
              <span style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "var(--brand-cyan)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>
                Select a Role
              </span>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {ROLES.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    style={{
                      background: role === r.id ? "rgba(124, 92, 255, 0.15)" : "rgba(255,255,255,0.03)",
                      color: "#ffffff",
                      border: role === r.id ? "1px solid #7c5cff" : "1px solid var(--glass-border)",
                      padding: "6px 14px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease"
                    }}
                    className="sp-btn"
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Round Tabs */}
            <div style={{ marginBottom: "25px" }}>
              <span style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "var(--brand-cyan)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>
                Round
              </span>
              <div style={{ display: "flex", gap: "10px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "15px", flexWrap: "wrap" }}>
                {ROUNDS.map(r => {
                  const count = getRoundCount(r);
                  return (
                    <button
                      key={r}
                      onClick={() => setRound(r)}
                      style={{
                        background: round === r ? "var(--brand-red)" : "rgba(255,255,255,0.03)",
                        color: "#ffffff",
                        border: round === r ? "1px solid var(--brand-red)" : "1px solid var(--glass-border)",
                        padding: "8px 18px",
                        borderRadius: "20px",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: "pointer"
                      }}
                      className="sp-btn"
                    >
                      {r} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Questions List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "40px" }}>
              {list.length === 0 ? (
                <div style={{ padding: "30px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)", borderRadius: "10px", textAlign: "center", color: "var(--text-grey)" }}>
                  No questions logged yet for this company + role + round combination.
                </div>
              ) : (
                list.slice(0, questionLimit).map((item, i) => (
                  <div 
                    key={item.id || i} 
                    style={{
                      background: "rgba(30, 30, 35, 0.55)",
                      border: "1px solid var(--glass-border)",
                      borderRadius: "12px",
                      padding: "20px"
                    }}
                    className="sp-card"
                  >
                    <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                      <span style={{ color: active?.color || "#7c5cff", fontWeight: "bold", fontSize: "14px" }}>Q{i + 1}</span>
                      <h4 style={{ margin: 0, color: "#ffffff", fontSize: "16px", lineHeight: "1.4", fontWeight: "600" }}>{item.q}</h4>
                    </div>
                    <div style={{ display: "flex", gap: "8px", paddingLeft: "32px", fontSize: "13.5px", color: "var(--text-grey)", lineHeight: "1.6" }}>
                      <span>💡</span>
                      <span>{item.note}</span>
                    </div>
                  </div>
                ))
              )}
              {list.length > questionLimit && (
                <button
                  onClick={() => setQuestionLimit(prev => prev + 5)}
                  className="button fit sp-btn"
                  style={{ width: "100%", marginTop: "10px", fontSize: "13px" }}
                >
                  Show More Questions ({list.length - questionLimit} remaining)
                </button>
              )}
            </div>

            {/* Practice CTA */}
            {list.length > 0 && (
              <button 
                onClick={handlePractice} 
                className="button primary fit sp-btn" 
                style={{ width: "100%", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontSize: "15px" }}
              >
                ▶ Practice this with AI Voice Interviewer
              </button>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}
