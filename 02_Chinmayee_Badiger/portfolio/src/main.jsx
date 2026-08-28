import React from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  BrainCircuit,
  Code2,
  Database,
  GitBranch,
  Layers3,
  Mail,
  Server,
  Sparkles,
} from "lucide-react";
import "./styles.css";

const projects = [
  {
    title: "Sign Language Learning Platform",
    tag: "Full-stack case study",
    summary:
      "A learning and assessment platform with practice flows, course modules, learner progress, and AI gesture evaluation endpoints.",
    stack: ["React", "FastAPI", "MediaPipe", "ML Pipeline"],
    details: ["Learner dashboard", "Practice history", "API reference", "Role-based platform flows"],
  },
  {
    title: "Gesture Recognition API",
    tag: "Backend + ML",
    summary:
      "FastAPI service design for uploading gesture frames, returning accuracy feedback, and supporting future model integration.",
    stack: ["Python", "FastAPI", "Pydantic", "OpenCV"],
    details: ["Evaluation schema", "Router structure", "Dataset docs", "Model-ready response format"],
  },
  {
    title: "Dataset Pipeline",
    tag: "Data preparation",
    summary:
      "Organized dataset documentation and scripts for ASL/static gesture workflows, preprocessing, and training experiments.",
    stack: ["Python", "NumPy", "Pandas", "Training scripts"],
    details: ["Dataset guide", "Classifier script", "ML requirements", "Milestone reports"],
  },
];

const skills = [
  ["Frontend", "React", "Vite", "Responsive UI", "Component composition"],
  ["Backend", "FastAPI", "REST APIs", "Pydantic", "Router design"],
  ["AI / Data", "Gesture recognition", "Dataset pipelines", "Model training basics", "Evaluation flows"],
  ["Tools", "Git", "VS Code", "Figma MCP-ready", "Documentation"],
];

const milestones = [
  {
    period: "Milestone 3",
    title: "Gesture recognition groundwork",
    body: "Prepared dataset guides, ML requirements, training scripts, and API documentation for AI evaluation.",
  },
  {
    period: "Milestone 4",
    title: "Platform API completion",
    body: "Organized backend routes for courses, goals, history, leaderboard, notifications, progress, and instructor views.",
  },
  {
    period: "Portfolio focus",
    title: "Readable, professional presentation",
    body: "Show work through specific contributions and clean UI instead of generic AI-styled decoration.",
  },
];

function Button({ href, children, variant = "primary" }) {
  const className = `button ${variant === "secondary" ? "button-secondary" : "button-primary"}`;
  if (href) {
    return (
      <a className={className} href={href}>
        {children}
      </a>
    );
  }
  return <button className={className}>{children}</button>;
}

function Badge({ children }) {
  return <span className="badge">{children}</span>;
}

function SectionHeading({ eyebrow, title, body }) {
  return (
    <div className="section-heading">
      <p>{eyebrow}</p>
      <h2>{title}</h2>
      {body && <span>{body}</span>}
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <div className="project-card-header">
        <Badge>{project.tag}</Badge>
        <ArrowUpRight size={18} aria-hidden="true" />
      </div>
      <h3>{project.title}</h3>
      <p>{project.summary}</p>
      <div className="stack-list" aria-label={`${project.title} stack`}>
        {project.stack.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <ul>
        {project.details.map((detail) => (
          <li key={detail}>
            <BadgeCheck size={16} aria-hidden="true" />
            {detail}
          </li>
        ))}
      </ul>
    </article>
  );
}

function App() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Chinmayee Badiger portfolio home">
          <span>CB</span>
          Chinmayee Badiger
        </a>
        <nav aria-label="Portfolio sections">
          <a href="#work">Work</a>
          <a href="#skills">Skills</a>
          <a href="#timeline">Timeline</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <Badge>Frontend + AI project contributor</Badge>
          <h1>Building accessible learning tools with clean interfaces and practical AI workflows.</h1>
          <p>
            I am Chinmayee Badiger, part of Team 4's Sign Language Learning and Assessment Platform.
            My work focuses on gesture recognition support, dataset preparation, backend API structure,
            and turning technical progress into a product people can understand.
          </p>
          <div className="hero-actions">
            <Button href="#work">
              View work <ArrowUpRight size={16} aria-hidden="true" />
            </Button>
            <Button href="mailto:chinmayee.badiger@example.com" variant="secondary">
              <Mail size={16} aria-hidden="true" /> Contact
            </Button>
          </div>
        </div>

        <aside className="profile-panel" aria-label="Portfolio summary">
          <div className="panel-topline">
            <Sparkles size={18} aria-hidden="true" />
            Current Focus
          </div>
          <h2>Sign language learning platform</h2>
          <p>
            Backend routes, AI evaluation docs, dataset scripts, and learner-facing platform features.
          </p>
          <div className="summary-grid">
            <div>
              <strong>8+</strong>
              <span>API areas</span>
            </div>
            <div>
              <strong>4</strong>
              <span>Milestones</span>
            </div>
            <div>
              <strong>ML</strong>
              <span>Pipeline</span>
            </div>
            <div>
              <strong>UI</strong>
              <span>Product flow</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="section" id="work">
        <SectionHeading
          eyebrow="Selected Work"
          title="Projects with clear responsibilities"
          body="Each card focuses on what was built and why it mattered."
        />
        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </section>

      <section className="case-study">
        <div>
          <Badge>Case Study</Badge>
          <h2>Team 4 Sign Language AI</h2>
          <p>
            The platform combines lessons, practice sessions, role-based views, progress tracking, and
            AI gesture assessment. The strongest portfolio story is not "AI-powered"; it is how each
            layer supports a learner trying to improve a real skill.
          </p>
        </div>
        <div className="case-grid">
          <div>
            <Server size={20} aria-hidden="true" />
            <strong>API structure</strong>
            <span>FastAPI routers for evaluation, courses, progress, history, goals, and notifications.</span>
          </div>
          <div>
            <Database size={20} aria-hidden="true" />
            <strong>Dataset work</strong>
            <span>Guides and scripts for organizing image/video datasets and model experiments.</span>
          </div>
          <div>
            <BrainCircuit size={20} aria-hidden="true" />
            <strong>AI evaluation</strong>
            <span>Response schemas and documentation for gesture accuracy feedback.</span>
          </div>
          <div>
            <Layers3 size={20} aria-hidden="true" />
            <strong>Product thinking</strong>
            <span>Learner, instructor, progress, and assessment flows kept connected.</span>
          </div>
        </div>
      </section>

      <section className="section" id="skills">
        <SectionHeading
          eyebrow="Skills"
          title="A practical frontend-to-ML toolkit"
          body="Grouped by how the work shows up in the project."
        />
        <div className="skills-grid">
          {skills.map(([group, ...items]) => (
            <article className="skill-card" key={group}>
              <div className="skill-title">
                <Code2 size={18} aria-hidden="true" />
                <h3>{group}</h3>
              </div>
              <div className="skill-tags">
                {items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section timeline-section" id="timeline">
        <SectionHeading
          eyebrow="Timeline"
          title="How the work developed"
          body="A concise story for interviews, reviews, and internship demos."
        />
        <div className="timeline">
          {milestones.map((item) => (
            <article key={item.title}>
              <span>{item.period}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contact" id="contact">
        <div>
          <BookOpen size={22} aria-hidden="true" />
          <h2>Open to frontend, AI-assisted product, and accessibility-focused work.</h2>
          <p>
            This portfolio is ready to connect to real links, resume files, GitHub repositories,
            and Figma design references as they become available.
          </p>
        </div>
        <div className="contact-actions">
          <Button href="mailto:chinmayee.badiger@example.com">
            <Mail size={16} aria-hidden="true" /> Email
          </Button>
          <Button href="https://github.com/" variant="secondary">
            <GitBranch size={16} aria-hidden="true" /> GitHub
          </Button>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
