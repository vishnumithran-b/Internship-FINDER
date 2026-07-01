import { useState, useMemo, useEffect } from "react";
import {
  Search,
  MapPin,
  Clock,
  ExternalLink,
  BookOpen,
  ChevronRight,
  X,
  Briefcase,
  Globe,
  Filter,
  Star,
  DollarSign,
  Calendar,
  GraduationCap,
  CheckCircle,
  Play,
  Building2,
  RefreshCw,
  Bell,
  BellOff,
} from "lucide-react";

const LAST_UPDATED = new Date("2026-07-01");
const NEXT_UPDATE = new Date("2026-07-08");

function getDaysUntilUpdate() {
  const now = new Date();
  const diff = NEXT_UPDATE.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const REGIONS = ["All Regions", "North America", "Europe", "Asia", "Remote/Global", "Oceania", "Middle East", "Africa"];
const FIELDS = ["All Fields", "Software Engineering", "Data Science", "Finance", "Product Management", "Research", "Design", "Marketing", "Policy & NGO"];
const DURATIONS = ["Any Duration", "4–8 weeks", "10–12 weeks", "6 months", "12 months"];

interface Course {
  title: string;
  platform: string;
  url: string;
  duration: string;
}

interface Internship {
  id: number;
  company: string;
  role: string;
  location: string;
  region: string;
  field: string;
  duration: string;
  stipend: string;
  deadline: string;
  applyUrl: string;
  logo: string;
  logoColor: string;
  requirements: string[];
  description: string;
  tags: string[];
  featured?: boolean;
  courses: Course[];
}

const internships: Internship[] = [
  {
    id: 1,
    company: "Google",
    role: "STEP Intern (Software Engineering)",
    location: "Mountain View, CA — USA",
    region: "North America",
    field: "Software Engineering",
    duration: "10–12 weeks",
    stipend: "$8,000–$9,500/mo",
    deadline: "Nov 1, 2025",
    applyUrl: "https://careers.google.com/jobs/results/?employment_type=INTERN&q=STEP+Intern",
    logo: "G",
    logoColor: "#4285F4",
    featured: true,
    description: "Google's STEP (Student Training in Engineering Program) is a 12-week internship for first- and second-year undergraduate students with a passion for computer science.",
    requirements: [
      "1st or 2nd year undergraduate student",
      "Strong foundation in data structures & algorithms",
      "Proficiency in at least one language: C++, Java, Python",
      "GPA of 3.5+ preferred",
      "Passion for technology and solving large-scale problems",
    ],
    tags: ["Algorithms", "Distributed Systems", "Python", "Java"],
    courses: [
      { title: "Data Structures and Algorithms", platform: "Coursera (UC San Diego)", url: "https://www.coursera.org/specializations/data-structures-algorithms", duration: "6 months" },
      { title: "Google IT Support Professional Certificate", platform: "Coursera", url: "https://www.coursera.org/professional-certificates/google-it-support", duration: "6 months" },
      { title: "Python for Everybody", platform: "Coursera (Michigan)", url: "https://www.coursera.org/specializations/python", duration: "8 months" },
      { title: "LeetCode Grind 75", platform: "LeetCode", url: "https://leetcode.com/studyplan/leetcode-75/", duration: "4 weeks" },
    ],
  },
  {
    id: 2,
    company: "Microsoft",
    role: "Explore Intern",
    location: "Redmond, WA — USA",
    region: "North America",
    field: "Software Engineering",
    duration: "10–12 weeks",
    stipend: "$7,500–$8,500/mo",
    deadline: "Oct 15, 2025",
    applyUrl: "https://careers.microsoft.com/students/us/en/usexplorejob",
    logo: "M",
    logoColor: "#00BCF2",
    featured: true,
    description: "Microsoft Explore is a 12-week summer internship program for freshmen and sophomores. Participants rotate through software engineering, product management, and design tracks.",
    requirements: [
      "1st or 2nd year undergraduate",
      "CS, Engineering, or related major",
      "Basic programming skills (any language)",
      "Strong problem-solving and communication skills",
      "US or Canadian citizenship not required",
    ],
    tags: ["C#", "Azure", "Product Management", "Full-stack"],
    courses: [
      { title: "Microsoft Azure Fundamentals (AZ-900)", platform: "Microsoft Learn", url: "https://learn.microsoft.com/en-us/training/paths/az-900-describe-cloud-concepts/", duration: "3 weeks" },
      { title: "Introduction to Computer Science (CS50)", platform: "edX (Harvard)", url: "https://www.edx.org/course/introduction-computer-science-harvardx-cs50x", duration: "12 weeks" },
      { title: "Foundations of Project Management", platform: "Coursera (Google)", url: "https://www.coursera.org/learn/project-management-foundations", duration: "4 weeks" },
    ],
  },
  {
    id: 3,
    company: "Goldman Sachs",
    role: "Summer Analyst — Engineering",
    location: "London, UK",
    region: "Europe",
    field: "Finance",
    duration: "10–12 weeks",
    stipend: "£4,500–£5,500/mo",
    deadline: "Oct 31, 2025",
    applyUrl: "https://higher.gs.com/roles/engineering",
    logo: "GS",
    logoColor: "#5E74EB",
    featured: false,
    description: "Join Goldman Sachs' engineering division for a summer analyst program, working on financial systems powering global markets — from real-time trading infrastructure to risk analytics.",
    requirements: [
      "Penultimate or final year undergraduate",
      "Degree in CS, Mathematics, Engineering, or Physics",
      "Strong programming fundamentals",
      "Interest in financial markets",
      "Analytical mindset and attention to detail",
    ],
    tags: ["Java", "Python", "Finance", "Risk", "Quantitative"],
    courses: [
      { title: "Financial Markets", platform: "Coursera (Yale)", url: "https://www.coursera.org/learn/financial-markets-global", duration: "7 weeks" },
      { title: "Python for Finance", platform: "Coursera", url: "https://www.coursera.org/learn/python-statistics-financial-analysis", duration: "5 weeks" },
      { title: "Algorithmic Trading & Quantitative Analysis", platform: "Udemy", url: "https://www.udemy.com/course/algorithmic-trading-quantitative-analysis-using-python/", duration: "6 weeks" },
    ],
  },
  {
    id: 4,
    company: "DeepMind",
    role: "Research Intern — AI/ML",
    location: "London, UK",
    region: "Europe",
    field: "Research",
    duration: "6 months",
    stipend: "£4,000–£6,000/mo",
    deadline: "Jan 15, 2026",
    applyUrl: "https://careers.google.com/jobs/results/?employment_type=INTERN&q=DeepMind+Research+Intern",
    logo: "DM",
    logoColor: "#6236FF",
    featured: true,
    description: "DeepMind Research Internships offer an opportunity to work alongside world-class researchers on cutting-edge AI problems including reinforcement learning, generative models, and AI safety.",
    requirements: [
      "PhD student or exceptional Masters/undergrad",
      "Strong publication record or research experience",
      "Deep expertise in machine learning fundamentals",
      "Proficiency in Python, JAX or PyTorch",
      "Background in mathematics, statistics, or CS theory",
    ],
    tags: ["Python", "JAX", "PyTorch", "Reinforcement Learning", "AI Safety"],
    courses: [
      { title: "Deep Learning Specialization", platform: "Coursera (Andrew Ng)", url: "https://www.coursera.org/specializations/deep-learning", duration: "4 months" },
      { title: "Machine Learning (Stanford CS229)", platform: "YouTube / Stanford", url: "https://www.youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU", duration: "10 weeks" },
      { title: "Reinforcement Learning Specialization", platform: "Coursera (Alberta)", url: "https://www.coursera.org/specializations/reinforcement-learning", duration: "4 months" },
      { title: "Mathematics for ML", platform: "Coursera (Imperial College)", url: "https://www.coursera.org/specializations/mathematics-machine-learning", duration: "5 months" },
    ],
  },
  {
    id: 5,
    company: "Shopify",
    role: "Dev Degree — Engineering Intern",
    location: "Ottawa, Canada / Remote",
    region: "North America",
    field: "Software Engineering",
    duration: "12 months",
    stipend: "CAD $5,000–$6,500/mo",
    deadline: "Feb 1, 2026",
    applyUrl: "https://devdegree.ca/apply",
    logo: "S",
    logoColor: "#96BF48",
    featured: false,
    description: "Dev Degree is a 4-year work-integrated learning program in partnership with Carleton or York University, letting you earn a CS degree while working full-time at Shopify.",
    requirements: [
      "Accepted or enrolled at Carleton / York University",
      "Passion for entrepreneurship and e-commerce",
      "Basic programming knowledge (any language)",
      "Strong communication and teamwork skills",
      "Open to learning Ruby on Rails ecosystem",
    ],
    tags: ["Ruby", "React", "Rails", "GraphQL", "E-commerce"],
    courses: [
      { title: "The Odin Project (Full-stack)", platform: "The Odin Project", url: "https://www.theodinproject.com/", duration: "Self-paced" },
      { title: "Ruby on Rails for Beginners", platform: "GoRails / YouTube", url: "https://gorails.com/series/rails-for-beginners", duration: "6 weeks" },
      { title: "Full Stack Open", platform: "University of Helsinki", url: "https://fullstackopen.com/en/", duration: "6 months" },
    ],
  },
  {
    id: 6,
    company: "Spotify",
    role: "Software Engineer Intern",
    location: "Stockholm, Sweden",
    region: "Europe",
    field: "Software Engineering",
    duration: "10–12 weeks",
    stipend: "SEK 35,000–45,000/mo",
    deadline: "Dec 1, 2025",
    applyUrl: "https://www.lifeatspotify.com/students#openings",
    logo: "♪",
    logoColor: "#1DB954",
    featured: false,
    description: "Build features used by 600M+ users. Spotify interns work on recommendation algorithms, streaming infrastructure, creator tools, and data platforms in a squad model.",
    requirements: [
      "2nd year+ undergraduate or Masters student",
      "Strong backend or full-stack engineering skills",
      "Experience with Python, Java, or Scala",
      "Comfort with distributed systems concepts",
      "Portfolio of personal or open-source projects",
    ],
    tags: ["Python", "Scala", "Kafka", "Machine Learning", "Backend"],
    courses: [
      { title: "Distributed Systems (MIT 6.824)", platform: "MIT OpenCourseWare", url: "https://pdos.csail.mit.edu/6.824/", duration: "14 weeks" },
      { title: "Music Recommendation with ML", platform: "Coursera", url: "https://www.coursera.org/learn/machine-learning", duration: "4 weeks" },
      { title: "Apache Kafka Fundamentals", platform: "Confluent / Free", url: "https://developer.confluent.io/learn-kafka/", duration: "3 weeks" },
    ],
  },
  {
    id: 7,
    company: "CERN",
    role: "Summer Student Programme",
    location: "Geneva, Switzerland",
    region: "Europe",
    field: "Research",
    duration: "8–13 weeks",
    stipend: "CHF 90–100/day",
    deadline: "Jan 26, 2026",
    applyUrl: "https://careers.cern/students",
    logo: "⚛",
    logoColor: "#0053A1",
    featured: true,
    description: "Work at the world's largest physics laboratory. CERN summer students participate in experiments, software projects, and attend daily lectures by CERN scientists.",
    requirements: [
      "Undergraduate (minimum 3 semesters completed)",
      "Physics, CS, Engineering, or Mathematics major",
      "Member state national preferred",
      "Good knowledge of physics or computing",
      "Strong academic record",
    ],
    tags: ["C++", "Python", "ROOT", "Particle Physics", "HPC"],
    courses: [
      { title: "Introduction to Particle Physics", platform: "edX (CERN/MIT)", url: "https://www.edx.org/course/particle-physics-an-introduction", duration: "6 weeks" },
      { title: "Scientific Computing with Python", platform: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/", duration: "8 weeks" },
      { title: "Advanced C++ (CppCon Talks)", platform: "YouTube", url: "https://www.youtube.com/@CppCon", duration: "Self-paced" },
    ],
  },
  {
    id: 8,
    company: "NASA",
    role: "Pathways Intern — Engineering",
    location: "Various Centers — USA",
    region: "North America",
    field: "Research",
    duration: "10–12 weeks",
    stipend: "$20–$35/hr",
    deadline: "Mar 1, 2026",
    applyUrl: "https://intern.nasa.gov/",
    logo: "🚀",
    logoColor: "#FC3D21",
    featured: false,
    description: "NASA internships span aerospace, robotics, earth science, and computing. Work at centers like JPL, Goddard, or Johnson with mission scientists and engineers.",
    requirements: [
      "US Citizenship required",
      "Full-time student (high school through graduate)",
      "GPA of 3.0+ required",
      "STEM major relevant to mission area",
      "Background check required",
    ],
    tags: ["MATLAB", "Python", "Aerospace", "Robotics", "Systems Engineering"],
    courses: [
      { title: "Intro to Aerospace Engineering", platform: "edX (TU Delft)", url: "https://www.edx.org/course/introduction-to-aeronautical-engineering", duration: "8 weeks" },
      { title: "Control of Mobile Robots", platform: "Coursera (Georgia Tech)", url: "https://www.coursera.org/learn/mobile-robot", duration: "8 weeks" },
      { title: "Python for Data Science (NASA Data)", platform: "Kaggle", url: "https://www.kaggle.com/learn/python", duration: "4 weeks" },
    ],
  },
  {
    id: 9,
    company: "ByteDance",
    role: "Software Engineer Intern — TikTok",
    location: "Singapore / San Jose",
    region: "Asia",
    field: "Software Engineering",
    duration: "10–12 weeks",
    stipend: "SGD 5,000–7,000/mo",
    deadline: "Nov 30, 2025",
    applyUrl: "https://jobs.bytedance.com/en/campus/position?keywords=software+engineer+intern&category=6704215862557099299",
    logo: "B",
    logoColor: "#FF004F",
    featured: false,
    description: "Build systems that power TikTok's recommendation engine, live streaming, content moderation, and global CDN infrastructure reaching 1.5 billion monthly users.",
    requirements: [
      "Undergraduate or Masters student in CS or related field",
      "Strong programming skills in Go, Python, or C++",
      "Experience with distributed systems or ML is a plus",
      "Good understanding of system design",
      "Problem-solving under pressure",
    ],
    tags: ["Go", "C++", "Distributed Systems", "ML", "Recommendation Systems"],
    courses: [
      { title: "System Design Interview", platform: "ByteByteGo (Free articles)", url: "https://blog.bytebytego.com/", duration: "Self-paced" },
      { title: "Go Programming Language", platform: "Tour of Go (Official)", url: "https://go.dev/tour/welcome/1", duration: "2 weeks" },
      { title: "Designing Data-Intensive Applications", platform: "O'Reilly / Archive", url: "https://archive.org/details/designing-data-intensive-applications", duration: "Self-paced" },
    ],
  },
  {
    id: 10,
    company: "UN Volunteers",
    role: "Digital Youth Volunteer — Global",
    location: "Remote / Multiple Countries",
    region: "Remote/Global",
    field: "Policy & NGO",
    duration: "6 months",
    stipend: "Stipend varies by country",
    deadline: "Rolling",
    applyUrl: "https://www.onlinevolunteering.org/en/volunteers",
    logo: "UN",
    logoColor: "#009EDB",
    featured: false,
    description: "Contribute your digital skills to UN agencies and NGOs worldwide through online volunteering. Projects include data analysis, web development, content creation, and research.",
    requirements: [
      "18+ years old",
      "Any educational background accepted",
      "Digital skills relevant to project area",
      "Commitment to 5–20 hrs/week",
      "Good English communication skills",
    ],
    tags: ["Volunteering", "Remote", "SDGs", "Data", "Communications"],
    courses: [
      { title: "SDG Academy: Climate Change", platform: "edX (SDG Academy)", url: "https://www.edx.org/school/sdgacademyx", duration: "6 weeks" },
      { title: "Social Data Science", platform: "Coursera", url: "https://www.coursera.org/learn/data-science-social-science", duration: "5 weeks" },
      { title: "Introduction to Humanitarian Action", platform: "Kaya Connect (IFRC)", url: "https://kayaconnect.org/", duration: "Self-paced" },
    ],
  },
  {
    id: 11,
    company: "Meta",
    role: "Software Engineer Intern",
    location: "Menlo Park, CA — USA",
    region: "North America",
    field: "Software Engineering",
    duration: "10–12 weeks",
    stipend: "$9,000–$10,500/mo",
    deadline: "Sep 1, 2025",
    applyUrl: "https://www.metacareers.com/jobs?q=software+engineer+intern&teams[0]=Internship+%26+New+Grad+Opportunities",
    logo: "f",
    logoColor: "#0081FB",
    featured: true,
    description: "Build products at the scale of billions. Meta interns work on Instagram, WhatsApp, Oculus, and the core Facebook platform on teams making real product decisions.",
    requirements: [
      "Currently enrolled in BS/MS/PhD program",
      "Strong coding skills in Python, C++, or Hack",
      "Experience with algorithms and data structures",
      "Ability to work independently in a fast-paced team",
      "Open to relocation for summer",
    ],
    tags: ["C++", "Python", "React", "PyTorch", "Distributed Systems"],
    courses: [
      { title: "Meta Front-End Developer Certificate", platform: "Coursera (Meta)", url: "https://www.coursera.org/professional-certificates/meta-front-end-developer", duration: "7 months" },
      { title: "Graph Theory (Discrete Math)", platform: "Khan Academy", url: "https://www.khanacademy.org/computing/computer-science/algorithms", duration: "4 weeks" },
      { title: "React — The Complete Guide", platform: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/front-end-development-libraries/", duration: "6 weeks" },
    ],
  },
  {
    id: 12,
    company: "McKinsey",
    role: "Insight Intern (Business Analyst)",
    location: "Multiple — Global Offices",
    region: "Remote/Global",
    field: "Product Management",
    duration: "10–12 weeks",
    stipend: "Competitive (varies by office)",
    deadline: "Nov 15, 2025",
    applyUrl: "https://www.mckinsey.com/careers/search-jobs?query=intern",
    logo: "Mc",
    logoColor: "#1B4B94",
    featured: false,
    description: "McKinsey Insight is a penultimate-year program giving students exposure to strategy consulting, problem-solving frameworks, and client work across industries.",
    requirements: [
      "Penultimate year undergraduate",
      "Strong academic record (top 10% of class)",
      "Excellent analytical and communication skills",
      "Leadership experience in extracurriculars",
      "Any major considered",
    ],
    tags: ["Strategy", "Excel", "PowerPoint", "Problem-solving", "Finance"],
    courses: [
      { title: "Business Analytics", platform: "edX (Columbia)", url: "https://www.edx.org/learn/business-analytics", duration: "10 weeks" },
      { title: "Case Interview Prep", platform: "CaseCoach (Free tier)", url: "https://www.casecoach.com/", duration: "Self-paced" },
      { title: "Data Analysis with Python", platform: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/data-analysis-with-python/", duration: "4 weeks" },
    ],
  },
  {
    id: 13,
    company: "Airbnb",
    role: "Data Science Intern",
    location: "San Francisco, CA — USA",
    region: "North America",
    field: "Data Science",
    duration: "10–12 weeks",
    stipend: "$8,500–$9,500/mo",
    deadline: "Dec 15, 2025",
    applyUrl: "https://careers.airbnb.com/positions/?team=university-programs&location=united-states",
    logo: "A",
    logoColor: "#FF5A5F",
    featured: false,
    description: "Airbnb's data science team powers trust, pricing, search ranking, and host acquisition. Interns run A/B experiments, build ML models, and present findings to leadership.",
    requirements: [
      "Masters or PhD in Statistics, CS, or related field",
      "Strong SQL and Python skills",
      "Experience with statistical modeling and experimentation",
      "Comfort with Spark or large-scale data processing",
      "Clear written and verbal communication",
    ],
    tags: ["Python", "SQL", "Spark", "A/B Testing", "Statistics"],
    courses: [
      { title: "SQL for Data Science", platform: "Coursera (UC Davis)", url: "https://www.coursera.org/learn/sql-for-data-science", duration: "4 weeks" },
      { title: "Statistics with Python", platform: "Coursera (Michigan)", url: "https://www.coursera.org/specializations/statistics-with-python", duration: "4 months" },
      { title: "A/B Testing (Udacity Free)", platform: "Udacity", url: "https://www.udacity.com/course/ab-testing--ud257", duration: "4 weeks" },
    ],
  },
  {
    id: 14,
    company: "Commonwealth Bank",
    role: "Technology Intern",
    location: "Sydney, Australia",
    region: "Oceania",
    field: "Software Engineering",
    duration: "10–12 weeks",
    stipend: "AUD $4,000–$5,000/mo",
    deadline: "Mar 15, 2026",
    applyUrl: "https://commbank.com.au/about-us/careers/early-careers/internships.html",
    logo: "CB",
    logoColor: "#FFC72C",
    featured: false,
    description: "CBA's Technology Internship embeds students inside engineering squads building mobile banking, cybersecurity platforms, cloud infrastructure, and data products.",
    requirements: [
      "Australian citizen or permanent resident",
      "Penultimate year in CS, IT, or Engineering",
      "Strong academic record",
      "Familiarity with agile development",
      "Passion for fintech innovation",
    ],
    tags: ["Java", "AWS", "Agile", "Cybersecurity", "Fintech"],
    courses: [
      { title: "AWS Cloud Practitioner Essentials", platform: "AWS Training (Free)", url: "https://www.aws.training/Details/eLearning?id=60697", duration: "6 hours" },
      { title: "Cybersecurity Fundamentals", platform: "IBM SkillsBuild (Free)", url: "https://skillsbuild.org/", duration: "6 weeks" },
      { title: "Agile Foundations", platform: "LinkedIn Learning / Free", url: "https://www.pmi.org/learning/training-development/onlinecourses/agile", duration: "2 weeks" },
    ],
  },
  {
    id: 15,
    company: "Samsung R&D",
    role: "Research Intern — AI Lab",
    location: "Seoul, South Korea",
    region: "Asia",
    field: "Research",
    duration: "6 months",
    stipend: "KRW 3,000,000–4,500,000/mo",
    deadline: "Feb 28, 2026",
    applyUrl: "https://careers.samsung.com/classic/en/search/#search/keyword=intern/page=1",
    logo: "S",
    logoColor: "#1428A0",
    featured: false,
    description: "Samsung AI Center offers research internships in NLP, computer vision, on-device AI, and generative models. Work alongside PhD researchers and publish in top-tier venues.",
    requirements: [
      "Masters or PhD student in CS, EE, or related field",
      "Strong ML background with proven research output",
      "PyTorch or TensorFlow proficiency",
      "Publication or preprint in AI/ML preferred",
      "Korean language not required",
    ],
    tags: ["PyTorch", "NLP", "Computer Vision", "Generative AI", "On-device AI"],
    courses: [
      { title: "Natural Language Processing Specialization", platform: "Coursera (deeplearning.ai)", url: "https://www.coursera.org/specializations/natural-language-processing", duration: "4 months" },
      { title: "Computer Vision Basics", platform: "Coursera (Buffalo)", url: "https://www.coursera.org/learn/computer-vision-basics", duration: "4 weeks" },
      { title: "Hugging Face NLP Course (Free)", platform: "Hugging Face", url: "https://huggingface.co/learn/nlp-course/en/chapter1/1", duration: "6 weeks" },
    ],
  },
  {
    id: 16,
    company: "WHO",
    role: "Intern — Health Data & Analytics",
    location: "Geneva, Switzerland",
    region: "Europe",
    field: "Policy & NGO",
    duration: "6 months",
    stipend: "Unpaid (travel grant available)",
    deadline: "Rolling",
    applyUrl: "https://www.who.int/careers/internship-programme/apply",
    logo: "WHO",
    logoColor: "#009ADE",
    featured: false,
    description: "WHO interns support global health programs, epidemiological surveillance, data modeling, and policy briefs for the world's leading international public health authority.",
    requirements: [
      "Graduate student (Masters or above) at time of application",
      "Fluency in at least one UN language",
      "Background in public health, epidemiology, or statistics",
      "Proficiency in R or Python for data analysis",
      "No prior UN employment required",
    ],
    tags: ["R", "Epidemiology", "Policy", "Data", "Global Health"],
    courses: [
      { title: "Epidemiology in Public Health", platform: "Coursera (Johns Hopkins)", url: "https://www.coursera.org/specializations/epidemiology-public-health", duration: "4 months" },
      { title: "R Programming", platform: "Coursera (Johns Hopkins)", url: "https://www.coursera.org/learn/r-programming", duration: "4 weeks" },
      { title: "Global Health: An Interdisciplinary Overview", platform: "Coursera (Geneva)", url: "https://www.coursera.org/learn/global-health", duration: "6 weeks" },
    ],
  },
];

const platformColors: Record<string, string> = {
  "Coursera": "#0056D3",
  "edX": "#02262B",
  "freeCodeCamp": "#006400",
  "Udemy": "#A435F0",
  "Kaggle": "#20BEFF",
  "YouTube": "#FF0000",
  "LeetCode": "#FFA116",
  "MIT OpenCourseWare": "#A31F34",
  "Khan Academy": "#14BF96",
  "Hugging Face": "#FFD21E",
};

function getPlatformColor(platform: string): string {
  for (const [key, color] of Object.entries(platformColors)) {
    if (platform.includes(key)) return color;
  }
  return "#00d4aa";
}

export default function App() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All Regions");
  const [field, setField] = useState("All Fields");
  const [duration, setDuration] = useState("Any Duration");
  const [selected, setSelected] = useState<Internship | null>(null);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [subscribeSubmitted, setSubscribeSubmitted] = useState(false);
  const daysLeft = getDaysUntilUpdate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filtered = useMemo(() => {
    return internships.filter((i) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        i.company.toLowerCase().includes(q) ||
        i.role.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q) ||
        i.tags.some((t) => t.toLowerCase().includes(q));
      const matchRegion = region === "All Regions" || i.region === region;
      const matchField = field === "All Fields" || i.field === field;
      const matchDuration = duration === "Any Duration" || i.duration === duration;
      const matchFeatured = !featuredOnly || i.featured;
      return matchSearch && matchRegion && matchField && matchDuration && matchFeatured;
    });
  }, [search, region, field, duration, featuredOnly]);

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Mesh background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 0%, rgba(0,212,170,0.07) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 100%, rgba(98,54,255,0.07) 0%, transparent 60%)",
        }}
      />

      {/* Header */}
      <header
        className="sticky top-0 z-30 border-b border-border"
        style={{ background: "rgba(8,13,26,0.92)", backdropFilter: "blur(12px)" }}
      >
        <div className="max-w-screen-2xl mx-auto px-6 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2 mr-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Globe className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "-0.02em" }}>
              InternWorld
            </span>
            <span
              className="text-xs px-1.5 py-0.5 rounded"
              style={{ fontFamily: "'JetBrains Mono', monospace", background: "rgba(0,212,170,0.15)", color: "#00d4aa", fontSize: "0.65rem" }}
            >
              BETA
            </span>
          </div>

          {/* Search */}
          <div className="flex-1 relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary/60 transition-all"
              style={{ background: "#161f35", border: "1px solid rgba(255,255,255,0.08)", color: "#e8edf5" }}
              placeholder="Search by company, role, skill, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              <RefreshCw className="w-3 h-3 text-primary" />
              <span>Updated <span className="text-foreground">{formatDate(LAST_UPDATED)}</span></span>
              <span className="text-border">·</span>
              <span>Next in <span className={daysLeft <= 2 ? "text-yellow-400" : "text-primary"}>{daysLeft}d</span></span>
            </div>
            <button
              onClick={() => setShowSubscribe((s) => !s)}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: subscribed ? "rgba(0,212,170,0.12)" : "rgba(255,255,255,0.06)",
                color: subscribed ? "#00d4aa" : "#a0aec0",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {subscribed ? <BellOff className="w-3 h-3" /> : <Bell className="w-3 h-3" />}
              {subscribed ? "Subscribed" : "Get weekly updates"}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-6 py-6 relative">

        {/* Main grid */}
        <main className="w-full">
          {/* Hero strip */}
          <div
            className="rounded-xl p-6 mb-5 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0f1e3a 0%, #0a1528 50%, #0f1625 100%)", border: "1px solid rgba(0,212,170,0.2)" }}
          >
            <div className="relative z-10">
              <h1
                className="text-3xl font-bold mb-1"
                style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, letterSpacing: "-0.03em" }}
              >
                Find Your Perfect{" "}
                <span style={{ color: "#00d4aa" }}>Internship</span>
              </h1>
              <p className="text-muted-foreground text-sm max-w-xl">
                Curated global opportunities with direct apply links, skill requirements, and free course recommendations — so you land the role.
              </p>
              <div className="flex gap-3 mt-4 flex-wrap">
                {["🌍 40+ Countries", "✅ Direct Apply Links", "📚 Free Courses Included", "🔄 Updated Monthly"].map((tag) => (
                  <span key={tag} className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)", color: "#a0aec0" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none" style={{ fontSize: "8rem" }}>
              🌐
            </div>
          </div>

          {/* Weekly Update Banner */}
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3 mb-5"
            style={{ background: "linear-gradient(90deg, rgba(0,212,170,0.07) 0%, rgba(0,212,170,0.03) 100%)", border: "1px solid rgba(0,212,170,0.18)" }}
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(0,212,170,0.15)" }}>
              <RefreshCw className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  This list is refreshed every week
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: daysLeft <= 2 ? "rgba(250,204,21,0.15)" : "rgba(0,212,170,0.12)", color: daysLeft <= 2 ? "#facc15" : "#00d4aa", fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {daysLeft === 0 ? "Updates today!" : `Next update in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Last updated <span className="text-foreground">{formatDate(LAST_UPDATED)}</span> · Next batch: <span className="text-foreground">{formatDate(NEXT_UPDATE)}</span> · New internships, deadlines & courses added every Tuesday.
              </p>
            </div>
            <button
              onClick={() => setShowSubscribe((s) => !s)}
              className="shrink-0 flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-medium transition-all"
              style={{
                background: subscribed ? "rgba(0,212,170,0.15)" : "#00d4aa",
                color: subscribed ? "#00d4aa" : "#080d1a",
                border: subscribed ? "1px solid rgba(0,212,170,0.3)" : "none",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              {subscribed ? <><BellOff className="w-3.5 h-3.5" /> Subscribed</> : <><Bell className="w-3.5 h-3.5" /> Notify me</>}
            </button>
          </div>

          {/* Subscribe modal */}
          {showSubscribe && !subscribeSubmitted && (
            <div
              className="rounded-xl px-5 py-4 mb-5 flex items-center gap-4 flex-wrap"
              style={{ background: "#0f1625", border: "1px solid rgba(0,212,170,0.25)" }}
            >
              <Bell className="w-4 h-4 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium mb-0.5" style={{ fontFamily: "'Outfit', sans-serif" }}>Get notified every Tuesday when new internships drop</p>
                <p className="text-xs text-muted-foreground">Free, no spam — unsubscribe any time.</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-sm px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-primary/50"
                  style={{ background: "#161f35", border: "1px solid rgba(255,255,255,0.08)", color: "#e8edf5", minWidth: "200px" }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && email.includes("@")) {
                      setSubscribeSubmitted(true);
                      setSubscribed(true);
                      setShowSubscribe(false);
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (email.includes("@")) {
                      setSubscribeSubmitted(true);
                      setSubscribed(true);
                      setShowSubscribe(false);
                    }
                  }}
                  className="text-sm px-4 py-2 rounded-lg font-medium transition-all"
                  style={{ background: "#00d4aa", color: "#080d1a", fontFamily: "'Outfit', sans-serif" }}
                >
                  Subscribe
                </button>
                <button onClick={() => setShowSubscribe(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Top Filter Bar */}
          <div
            className="rounded-xl px-4 py-3 mb-5 flex flex-wrap items-center gap-3"
            style={{ background: "#0f1625", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center gap-1.5 text-muted-foreground shrink-0">
              <Filter className="w-3.5 h-3.5" />
              <span className="text-xs font-medium uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Filters</span>
            </div>

            <div className="w-px h-5 bg-border shrink-0" />

            <TopFilterGroup label="Region" options={REGIONS} value={region} onChange={setRegion} />
            <div className="w-px h-5 bg-border shrink-0" />
            <TopFilterGroup label="Field" options={FIELDS} value={field} onChange={setField} />
            <div className="w-px h-5 bg-border shrink-0" />
            <TopFilterGroup label="Duration" options={DURATIONS} value={duration} onChange={setDuration} />
            <div className="w-px h-5 bg-border shrink-0" />

            <button
              onClick={() => setFeaturedOnly(!featuredOnly)}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: featuredOnly ? "rgba(0,212,170,0.15)" : "rgba(255,255,255,0.04)",
                color: featuredOnly ? "#00d4aa" : "#6b7fa3",
                border: featuredOnly ? "1px solid rgba(0,212,170,0.3)" : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <Star className={`w-3 h-3 ${featuredOnly ? "fill-primary text-primary" : ""}`} />
              Featured
            </button>

            <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              <span className="text-primary font-semibold">{filtered.length}</span>
              <span>results</span>
              {(region !== "All Regions" || field !== "All Fields" || duration !== "Any Duration" || featuredOnly || search) && (
                <button
                  className="ml-1 text-xs text-muted-foreground hover:text-foreground underline transition-colors"
                  onClick={() => { setSearch(""); setRegion("All Regions"); setField("All Fields"); setDuration("Any Duration"); setFeaturedOnly(false); }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
              <Search className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm">No internships match your filters.</p>
              <button className="mt-3 text-xs text-primary hover:underline" onClick={() => { setSearch(""); setRegion("All Regions"); setField("All Fields"); setDuration("Any Duration"); setFeaturedOnly(false); }}>
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((intern) => (
                <InternshipCard key={intern.id} intern={intern} onClick={() => setSelected(intern)} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Detail Modal */}
      {selected && (
        <DetailPanel intern={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function TopFilterGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const isActive = value !== options[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
        style={{
          background: isActive ? "rgba(0,212,170,0.12)" : "rgba(255,255,255,0.04)",
          color: isActive ? "#00d4aa" : "#6b7fa3",
          border: isActive ? "1px solid rgba(0,212,170,0.25)" : "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span className="font-medium" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
        <span className="max-w-[100px] truncate" style={{ color: isActive ? "#00d4aa" : "#a0aec0" }}>
          {isActive ? value : "All"}
        </span>
        <ChevronRight className={`w-3 h-3 transition-transform ${open ? "rotate-90" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute top-full left-0 mt-1 z-20 rounded-xl overflow-hidden py-1"
            style={{ background: "#131c30", border: "1px solid rgba(255,255,255,0.1)", minWidth: "180px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
          >
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className="w-full text-left px-4 py-2 text-sm transition-colors"
                style={{
                  color: value === opt ? "#00d4aa" : "#a0aec0",
                  background: value === opt ? "rgba(0,212,170,0.08)" : "transparent",
                }}
                onMouseEnter={(e) => { if (value !== opt) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = value === opt ? "rgba(0,212,170,0.08)" : "transparent"; }}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function InternshipCard({ intern, onClick }: { intern: Internship; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-left rounded-xl p-5 transition-all duration-200 group relative overflow-hidden"
      style={{
        background: "#0f1625",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,170,0.3)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      {intern.featured && (
        <div className="absolute top-3 right-3">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
        </div>
      )}

      {/* Header row */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ background: intern.logoColor, fontFamily: "'Outfit', sans-serif" }}
        >
          {intern.logo}
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-sm leading-tight truncate" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {intern.company}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5 leading-snug line-clamp-2">{intern.role}</div>
        </div>
      </div>

      {/* Meta row */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mb-3">
        <MetaItem icon={<MapPin className="w-3 h-3" />} text={intern.location.split("—")[0].trim()} />
        <MetaItem icon={<Clock className="w-3 h-3" />} text={intern.duration} />
        <MetaItem icon={<DollarSign className="w-3 h-3" />} text={intern.stipend} />
        <MetaItem icon={<Calendar className="w-3 h-3" />} text={intern.deadline} />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {intern.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded"
            style={{ background: "rgba(255,255,255,0.05)", color: "#6b7fa3", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem" }}
          >
            {tag}
          </span>
        ))}
        {intern.tags.length > 3 && (
          <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "#6b7fa3", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem" }}>
            +{intern.tags.length - 3}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span
          className="text-xs px-2 py-0.5 rounded"
          style={{ background: "rgba(0,212,170,0.08)", color: "#00d4aa", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem" }}
        >
          {intern.field}
        </span>
        <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
          <BookOpen className="w-3 h-3" />
          <span>{intern.courses.length} courses</span>
          <ChevronRight className="w-3 h-3" />
        </div>
      </div>
    </button>
  );
}

function MetaItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
      <span className="shrink-0 text-muted-foreground/60">{icon}</span>
      <span className="truncate">{text}</span>
    </div>
  );
}

function DetailPanel({ intern, onClose }: { intern: Internship; onClose: () => void }) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md" onClick={onClose} />

      {/* Centered modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative w-full pointer-events-auto flex flex-col"
          style={{
            maxWidth: "680px",
            maxHeight: "90vh",
            background: "#0a1020",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "20px",
            boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,212,170,0.08)",
          }}
        >
          {/* Modal header — sticky inside the modal */}
          <div
            className="flex items-center justify-between px-6 py-4 shrink-0"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px 20px 0 0", background: "rgba(10,16,32,0.98)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm"
                style={{ background: intern.logoColor, fontFamily: "'Outfit', sans-serif", color: "#fff", fontSize: "1rem" }}
              >
                {intern.logo}
              </div>
              <div>
                <div className="font-bold" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1rem" }}>{intern.company}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(0,212,170,0.1)", color: "#00d4aa", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}
                  >
                    {intern.field}
                  </span>
                  <span className="text-xs text-muted-foreground">{intern.region}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
              style={{ background: "rgba(255,255,255,0.06)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)")}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6" style={{ scrollbarWidth: "none" }}>

            {/* Role title */}
            <h2
              className="text-2xl font-bold leading-tight"
              style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, letterSpacing: "-0.025em" }}
            >
              {intern.role}
            </h2>

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <MapPin className="w-3.5 h-3.5" />, label: "Location", value: intern.location },
                { icon: <Clock className="w-3.5 h-3.5" />, label: "Duration", value: intern.duration },
                { icon: <DollarSign className="w-3.5 h-3.5" />, label: "Stipend", value: intern.stipend },
                { icon: <Calendar className="w-3.5 h-3.5" />, label: "Deadline", value: intern.deadline },
              ].map((item) => (
                <div key={item.label} className="rounded-xl p-3" style={{ background: "#141d33", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
                    <span className="text-primary/70">{item.icon}</span>
                    <span className="text-xs uppercase tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}>{item.label}</span>
                  </div>
                  <div className="text-sm font-medium text-foreground">{item.value}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <SectionHeading icon={<Briefcase />} label="About This Role" />
              <p className="text-sm text-muted-foreground leading-relaxed">{intern.description}</p>
            </div>

            {/* Requirements */}
            <div>
              <SectionHeading icon={<CheckCircle />} label="Requirements" />
              <ul className="space-y-2.5">
                {intern.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#00d4aa" }} />
                    <span className="text-muted-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div>
              <SectionHeading icon={<Building2 />} label="Key Skills" />
              <div className="flex flex-wrap gap-2">
                {intern.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-lg"
                    style={{ background: "rgba(0,212,170,0.08)", color: "#00d4aa", border: "1px solid rgba(0,212,170,0.18)", fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Courses */}
            <div>
              <SectionHeading icon={<GraduationCap />} label="Recommended Free Courses" />
              <p className="text-xs text-muted-foreground mb-3">Hand-picked to help you meet the requirements and stand out.</p>
              <div className="space-y-2.5">
                {intern.courses.map((course, i) => (
                  <a
                    key={i}
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 rounded-xl transition-all group"
                    style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(0,212,170,0.3)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}
                  >
                    <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center mt-0.5" style={{ background: getPlatformColor(course.platform) }}>
                      <Play className="w-3.5 h-3.5 text-white fill-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug">{course.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{course.platform}</span>
                        <span className="text-muted-foreground/40 text-xs">·</span>
                        <span className="text-xs" style={{ color: "#6b7fa3", fontFamily: "'JetBrains Mono', monospace" }}>{course.duration}</span>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary/70 transition-colors shrink-0 mt-1" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Apply CTA footer */}
          <div
            className="px-6 py-4 shrink-0"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)", borderRadius: "0 0 20px 20px", background: "rgba(10,16,32,0.98)" }}
          >
            <a
              href={intern.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm transition-all"
              style={{ background: "#00d4aa", color: "#080d1a", fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "0.95rem" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#00bf99")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#00d4aa")}
            >
              Apply Now — {intern.company}
              <ExternalLink className="w-4 h-4" />
            </a>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Opens the internship application page directly · ESC or click outside to close
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function SectionHeading({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-primary w-4 h-4">{icon}</span>
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        {label}
      </span>
    </div>
  );
}
