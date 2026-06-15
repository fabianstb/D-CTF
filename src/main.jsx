import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  BarChart3,
  BookOpen,
  Boxes,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Code2,
  Eye,
  FileArchive,
  Flag,
  Gauge,
  KeyRound,
  LayoutDashboard,
  ListChecks,
  LockKeyhole,
  LogIn,
  LogOut,
  Medal,
  MessageSquare,
  Plus,
  Radar,
  Search,
  Settings,
  Shield,
  Sparkles,
  Target,
  Trophy,
  Upload,
  UserRound,
  Users,
  Wrench,
  X,
} from "lucide-react";
import "./styles.css";

const STORAGE_KEY = "dctf-platform-state-v1";

const seedState = {
  event: {
    name: "D-CTF: Neon District",
    mode: "Team + Individual",
    status: "Live",
    startsAt: "2026-06-14T20:00",
    endsAt: "2026-06-16T20:00",
    publicScoreboard: true,
    freezeScoreboard: false,
    requireEmailVerification: false,
    allowRegistration: true,
    maxAttempts: 12,
    message:
      "Bienvenido al tablero oficial. Respeta las reglas, documenta tus hallazgos y evita ataques fuera de alcance.",
  },
  users: [
    {
      id: "u-admin",
      name: "Admin",
      email: "admin@dctf.local",
      password: "admin",
      role: "admin",
      teamId: "t-core",
      country: "CL",
      affiliation: "D-CTF Ops",
      bio: "Event operator",
      banned: false,
      verified: true,
    },
    {
      id: "u-neo",
      name: "NeoByte",
      email: "neo@dctf.local",
      password: "player",
      role: "competitor",
      teamId: "t-red",
      country: "CL",
      affiliation: "Universidad Austral",
      bio: "Web exploitation and crypto enjoyer.",
      banned: false,
      verified: true,
    },
    {
      id: "u-ada",
      name: "AdaShell",
      email: "ada@dctf.local",
      password: "player",
      role: "competitor",
      teamId: "t-blue",
      country: "MX",
      affiliation: "Night Labs",
      bio: "Reverse engineering specialist.",
      banned: false,
      verified: true,
    },
  ],
  teams: [
    {
      id: "t-core",
      name: "D-CTF Ops",
      country: "CL",
      affiliation: "Organizers",
      website: "https://example.com",
      hidden: true,
      banned: false,
    },
    {
      id: "t-red",
      name: "Red Circuit",
      country: "CL",
      affiliation: "Universidad Austral",
      website: "https://example.com/red",
      hidden: false,
      banned: false,
    },
    {
      id: "t-blue",
      name: "Blue Relay",
      country: "MX",
      affiliation: "Night Labs",
      website: "https://example.com/blue",
      hidden: false,
      banned: false,
    },
    {
      id: "t-ghost",
      name: "Ghost Packet",
      country: "AR",
      affiliation: "Independiente",
      website: "",
      hidden: false,
      banned: false,
    },
  ],
  challenges: [
    {
      id: "c-web",
      name: "Signal Leak",
      category: "Web",
      type: "standard",
      value: 350,
      minValue: 120,
      decay: 18,
      visible: true,
      locked: false,
      maxAttempts: 8,
      tags: ["JWT", "SSRF", "Beginner+"],
      connection: "https://signal-leak.dctf.local",
      files: ["signal-leak.zip"],
      flags: [{ type: "static", value: "DCTF{signal_leak}" }],
      hints: [
        { text: "El token no es el problema; el origen si.", cost: 25 },
        { text: "Mira que hosts internos acepta el proxy.", cost: 50 },
      ],
      description:
        "Un panel de telemetria filtra datos a servicios internos. Encuentra la ruta que expone el secreto.",
    },
    {
      id: "c-crypto",
      name: "Cold Lattice",
      category: "Crypto",
      type: "dynamic",
      value: 500,
      minValue: 150,
      decay: 24,
      visible: true,
      locked: false,
      maxAttempts: 10,
      tags: ["Lattice", "Python"],
      connection: "nc crypto.dctf.local 31337",
      files: ["cold-lattice.py", "output.txt"],
      flags: [{ type: "regex", value: "^DCTF\\{lattice_.+\\}$" }],
      hints: [{ text: "La dimension es pequena por una razon.", cost: 40 }],
      description:
        "Un generador de llaves deja rastros suficientes para reconstruir la semilla original.",
    },
    {
      id: "c-re",
      name: "Pulse VM",
      category: "Reverse",
      type: "standard",
      value: 420,
      minValue: 180,
      decay: 12,
      visible: true,
      locked: false,
      maxAttempts: 15,
      tags: ["VM", "ELF"],
      connection: "",
      files: ["pulse-vm.elf"],
      flags: [{ type: "static", value: "DCTF{pulse_vm}" }],
      hints: [{ text: "No ejecutes instrucciones, interpreta estados.", cost: 35 }],
      description:
        "Un binario usa una maquina virtual compacta. Recupera el flujo real y extrae la flag.",
    },
    {
      id: "c-forensics",
      name: "Satellite Dust",
      category: "Forensics",
      type: "standard",
      value: 280,
      minValue: 100,
      decay: 8,
      visible: true,
      locked: false,
      maxAttempts: 20,
      tags: ["PCAP", "Stego"],
      connection: "",
      files: ["satellite-dust.pcapng"],
      flags: [{ type: "static", value: "DCTF{satellite_dust}" }],
      hints: [{ text: "Ordena primero por tiempos anormales.", cost: 20 }],
      description:
        "Una captura orbital contiene una transferencia camuflada. Reconstruye el artefacto final.",
    },
  ],
  solves: [
    { id: "s1", userId: "u-neo", teamId: "t-red", challengeId: "c-forensics", at: "2026-06-14T21:14:00", points: 280 },
    { id: "s2", userId: "u-ada", teamId: "t-blue", challengeId: "c-web", at: "2026-06-14T21:31:00", points: 350 },
    { id: "s3", userId: "u-neo", teamId: "t-red", challengeId: "c-web", at: "2026-06-14T22:04:00", points: 350 },
  ],
  attempts: [
    { id: "a1", userId: "u-neo", challengeId: "c-crypto", value: "DCTF{test}", correct: false, at: "2026-06-14T22:10:00" },
    { id: "a2", userId: "u-ada", challengeId: "c-web", value: "DCTF{signal_leak}", correct: true, at: "2026-06-14T21:31:00" },
  ],
  pages: [
    { id: "rules", title: "Rules", body: "No attacking infrastructure, players, or third-party services. Scope is limited to listed challenges." },
    { id: "faq", title: "FAQ", body: "Flags use the DCTF{...} format. Contact admins using announcements if a service is down." },
  ],
  announcements: [
    { id: "m1", title: "Competition started", body: "All visible challenges are live. Good hunting.", at: "2026-06-14T20:00:00" },
  ],
  opens: [
    { userId: "u-neo", challengeId: "c-web" },
    { userId: "u-neo", challengeId: "c-crypto" },
    { userId: "u-ada", challengeId: "c-web" },
  ],
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : seedState;
  } catch {
    return seedState;
  }
}

function saveState(next) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function formatTime(value) {
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function computeChallengeValue(challenge, solvesCount) {
  if (challenge.type !== "dynamic") return Number(challenge.value);
  const current = Number(challenge.value) - solvesCount * Number(challenge.decay || 0);
  return Math.max(Number(challenge.minValue || 0), current);
}

const emptyChallengeForm = {
  id: "",
  name: "",
  category: "Web",
  type: "standard",
  value: 100,
  minValue: 100,
  decay: 10,
  maxAttempts: 12,
  visible: true,
  locked: false,
  tags: "custom",
  connection: "",
  files: "",
  flagType: "static",
  flag: "DCTF{}",
  hints: "",
  description: "",
};

function listToText(items, key) {
  return (items || []).map((item) => (key ? item[key] : item)).join("\n");
}

function textToList(value) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function challengeToForm(challenge = {}) {
  const flag = challenge.flags?.[0] || { type: "static", value: "DCTF{}" };
  return {
    ...emptyChallengeForm,
    ...challenge,
    tags: listToText(challenge.tags || [], null),
    files: listToText(challenge.files || [], null),
    flagType: flag.type,
    flag: flag.value,
    hints: (challenge.hints || []).map((hint) => `${hint.cost}|${hint.text}`).join("\n"),
  };
}

function formToChallenge(form, fallbackId) {
  return {
    id: form.id || fallbackId,
    name: form.name.trim() || "Untitled challenge",
    category: form.category,
    type: form.type,
    value: Number(form.value || 0),
    minValue: Number(form.minValue || 0),
    decay: Number(form.decay || 0),
    visible: Boolean(form.visible),
    locked: Boolean(form.locked),
    maxAttempts: Number(form.maxAttempts || 0),
    tags: textToList(form.tags),
    connection: form.connection.trim(),
    files: textToList(form.files),
    flags: [{ type: form.flagType, value: form.flag.trim() || "DCTF{}" }],
    hints: form.hints
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [cost, ...text] = line.split("|");
        return { cost: Number(cost || 0), text: text.join("|").trim() || line };
      }),
    description: form.description.trim() || "Nuevo reto pendiente de descripcion.",
  };
}

function App() {
  const [state, setState] = useState(loadState);
  const [active, setActive] = useState("overview");
  const [sessionId, setSessionId] = useState(() => localStorage.getItem("dctf-session") || "");
  const [loginOpen, setLoginOpen] = useState(!sessionId);
  const [challengeId, setChallengeId] = useState("c-web");
  const [toast, setToast] = useState("");

  const currentUser = state.users.find((user) => user.id === sessionId) || null;
  const selectedChallenge = state.challenges.find((challenge) => challenge.id === challengeId) || state.challenges[0];

  const updateState = (recipe) => {
    setState((current) => {
      const next = recipe(current);
      saveState(next);
      return next;
    });
  };

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  const login = (email, password) => {
    const user = state.users.find((item) => item.email === email && item.password === password);
    if (!user || user.banned) {
      showToast("Credenciales invalidas o usuario bloqueado.");
      return false;
    }
    localStorage.setItem("dctf-session", user.id);
    setSessionId(user.id);
    setLoginOpen(false);
    showToast(`Sesion iniciada: ${user.name}`);
    return true;
  };

  const logout = () => {
    localStorage.removeItem("dctf-session");
    setSessionId("");
    setLoginOpen(true);
  };

  const resetDemo = () => {
    saveState(seedState);
    setState(seedState);
    setChallengeId("c-web");
    showToast("Datos demo restaurados.");
  };

  const stats = useMemo(() => getStats(state, currentUser), [state, currentUser]);

  return (
    <div className="app">
      <Sidebar active={active} setActive={setActive} user={currentUser} onLogin={() => setLoginOpen(true)} onLogout={logout} />
      <main className="workspace">
        <Topbar event={state.event} user={currentUser} onLogin={() => setLoginOpen(true)} resetDemo={resetDemo} />
        {active === "overview" && <Overview state={state} stats={stats} setActive={setActive} />}
        {active === "challenges" && (
          <Challenges
            state={state}
            user={currentUser}
            selected={selectedChallenge}
            setSelected={setChallengeId}
            updateState={updateState}
            showToast={showToast}
          />
        )}
        {active === "scoreboard" && <Scoreboard state={state} />}
        {active === "profile" && <Profile state={state} user={currentUser} updateState={updateState} onLogin={() => setLoginOpen(true)} />}
        {active === "admin" && <Admin state={state} user={currentUser} updateState={updateState} showToast={showToast} />}
      </main>
      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} onLogin={login} />}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function getStats(state, user) {
  const visibleChallenges = state.challenges.filter((challenge) => challenge.visible);
  const totalSolves = state.solves.length;
  const userSolves = user ? state.solves.filter((solve) => solve.userId === user.id) : [];
  const teamSolves = user ? state.solves.filter((solve) => solve.teamId === user.teamId) : [];
  const categories = [...new Set(state.challenges.map((challenge) => challenge.category))];
  return {
    visibleChallenges: visibleChallenges.length,
    totalSolves,
    userPoints: userSolves.reduce((sum, solve) => sum + solve.points, 0),
    teamPoints: teamSolves.reduce((sum, solve) => sum + solve.points, 0),
    solvedCount: userSolves.length,
    categories,
  };
}

function Sidebar({ active, setActive, user, onLogin, onLogout }) {
  const items = [
    ["overview", LayoutDashboard, "Inicio"],
    ["challenges", Flag, "Retos"],
    ["scoreboard", Trophy, "Scoreboard"],
    ["profile", UserRound, "Perfil"],
    ["admin", Wrench, "Admin"],
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark"><Shield size={22} /></div>
        <div>
          <strong>D-CTF</strong>
          <span>competition console</span>
        </div>
      </div>
      <nav>
        {items.map(([id, Icon, label]) => (
          <button key={id} className={active === id ? "nav-item active" : "nav-item"} onClick={() => setActive(id)}>
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-card">
        <div className="mini-avatar">{user ? user.name.slice(0, 2).toUpperCase() : "?"}</div>
        <div>
          <strong>{user ? user.name : "Invitado"}</strong>
          <span>{user ? user.role : "sin sesion"}</span>
        </div>
        <button className="icon-button" onClick={user ? onLogout : onLogin} aria-label={user ? "Cerrar sesion" : "Ingresar"}>
          {user ? <LogOut size={18} /> : <LogIn size={18} />}
        </button>
      </div>
    </aside>
  );
}

function Topbar({ event, user, onLogin, resetDemo }) {
  return (
    <header className="topbar">
      <div>
        <span className="eyebrow"><Activity size={14} /> {event.status}</span>
        <h1>{event.name}</h1>
      </div>
      <div className="topbar-actions">
        <div className="time-pill"><Clock3 size={16} /> {formatTime(event.endsAt)}</div>
        <button className="ghost-button" onClick={resetDemo}><Radar size={16} /> Reset</button>
        {!user && <button className="primary-button" onClick={onLogin}><KeyRound size={16} /> Ingresar</button>}
      </div>
    </header>
  );
}

function Overview({ state, stats, setActive }) {
  const topTeams = buildTeamScores(state).slice(0, 3);
  return (
    <section className="screen">
      <div className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={14} /> Next-gen CTF arena</span>
          <h2>Retos, ranking y operaciones en una consola rapida y visual.</h2>
          <p>{state.event.message}</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => setActive("challenges")}><Flag size={17} /> Ver retos</button>
            <button className="secondary-button" onClick={() => setActive("scoreboard")}><Trophy size={17} /> Ranking</button>
          </div>
        </div>
        <div className="orbital">
          <div className="orbit-ring">
            <Shield size={72} />
          </div>
          <div className="metric-chip top"><Target size={15} /> {stats.visibleChallenges} retos</div>
          <div className="metric-chip right"><Users size={15} /> {state.users.length} jugadores</div>
          <div className="metric-chip bottom"><CheckCircle2 size={15} /> {stats.totalSolves} solves</div>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard icon={Flag} label="Retos visibles" value={stats.visibleChallenges} detail={`${stats.categories.length} categorias`} />
        <StatCard icon={CircleDollarSign} label="Tus puntos" value={stats.userPoints} detail={`${stats.solvedCount} solves`} />
        <StatCard icon={Users} label="Puntos equipo" value={stats.teamPoints} detail={state.event.mode} />
        <StatCard icon={Gauge} label="Intentos" value={state.attempts.length} detail="tracking admin" />
      </div>

      <div className="content-grid">
        <Panel title="Top equipos" icon={Trophy}>
          <div className="rank-list">
            {topTeams.map((team, index) => (
              <div className="rank-row" key={team.id}>
                <span className="rank-pos">{index + 1}</span>
                <div>
                  <strong>{team.name}</strong>
                  <span>{team.solves} solves</span>
                </div>
                <b>{team.points}</b>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Anuncios" icon={MessageSquare}>
          {state.announcements.map((item) => (
            <article className="announcement" key={item.id}>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
              <span>{formatTime(item.at)}</span>
            </article>
          ))}
        </Panel>
        <Panel title="Cobertura" icon={Boxes}>
          <div className="category-cloud">
            {stats.categories.map((category) => (
              <span key={category}>{category}</span>
            ))}
          </div>
        </Panel>
      </div>
    </section>
  );
}

function StatCard({ icon: Icon, label, value, detail }) {
  return (
    <div className="stat-card">
      <Icon size={22} />
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

function Panel({ title, icon: Icon, children }) {
  return (
    <section className="panel">
      <div className="panel-title">
        <Icon size={18} />
        <h3>{title}</h3>
      </div>
      {children}
    </section>
  );
}

function Challenges({ state, user, selected, setSelected, updateState, showToast }) {
  const [flagValue, setFlagValue] = useState("");
  const [filter, setFilter] = useState("All");
  const categories = ["All", ...new Set(state.challenges.map((challenge) => challenge.category))];
  const solvesForSelected = state.solves.filter((solve) => solve.challengeId === selected.id);
  const alreadySolved = user && state.solves.some((solve) => solve.userId === user.id && solve.challengeId === selected.id);
  const selectedValue = computeChallengeValue(selected, solvesForSelected.length);

  const submitFlag = () => {
    if (!user) {
      showToast("Inicia sesion para enviar flags.");
      return;
    }
    const normalized = flagValue.trim();
    const correct = selected.flags.some((flag) => {
      if (flag.type === "regex") return new RegExp(flag.value).test(normalized);
      return flag.value === normalized;
    });
    updateState((current) => {
      const nextAttempt = {
        id: uid("a"),
        userId: user.id,
        challengeId: selected.id,
        value: normalized,
        correct,
        at: new Date().toISOString(),
      };
      const already = current.solves.some((solve) => solve.userId === user.id && solve.challengeId === selected.id);
      const nextSolves = correct && !already
        ? [
            ...current.solves,
            {
              id: uid("s"),
              userId: user.id,
              teamId: user.teamId,
              challengeId: selected.id,
              at: new Date().toISOString(),
              points: computeChallengeValue(selected, current.solves.filter((solve) => solve.challengeId === selected.id).length),
            },
          ]
        : current.solves;
      return { ...current, attempts: [nextAttempt, ...current.attempts], solves: nextSolves };
    });
    setFlagValue("");
    showToast(correct ? "Flag correcta. Puntos asignados." : "Flag incorrecta. Intento registrado.");
  };

  const visible = state.challenges.filter((challenge) => challenge.visible && (filter === "All" || challenge.category === filter));

  return (
    <section className="screen challenge-layout">
      <div className="challenge-list">
        <div className="search-row">
          <Search size={17} />
          <select value={filter} onChange={(event) => setFilter(event.target.value)}>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </div>
        {visible.map((challenge) => {
          const count = state.solves.filter((solve) => solve.challengeId === challenge.id).length;
          const solved = user && state.solves.some((solve) => solve.userId === user.id && solve.challengeId === challenge.id);
          return (
            <button key={challenge.id} className={selected.id === challenge.id ? "challenge-card active" : "challenge-card"} onClick={() => setSelected(challenge.id)}>
              <div>
                <strong>{challenge.name}</strong>
                <span>{challenge.category}</span>
              </div>
              <div className="challenge-score">
                <b>{computeChallengeValue(challenge, count)}</b>
                {solved ? <CheckCircle2 size={16} /> : <ChevronRight size={16} />}
              </div>
            </button>
          );
        })}
      </div>
      <article className="challenge-detail">
        <div className="challenge-header">
          <div>
            <span className="eyebrow"><Flag size={14} /> {selected.category}</span>
            <h2>{selected.name}</h2>
          </div>
          <div className={alreadySolved ? "solved-badge" : "point-badge"}>{alreadySolved ? "Solved" : `${selectedValue} pts`}</div>
        </div>
        <p>{selected.description}</p>
        <div className="tag-row">
          {selected.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <div className="detail-grid">
          <InfoBlock icon={Code2} label="Conexion" value={selected.connection || "offline file challenge"} />
          <InfoBlock icon={FileArchive} label="Archivos" value={selected.files.join(", ") || "sin archivos"} />
          <InfoBlock icon={Eye} label="Solves" value={`${solvesForSelected.length}`} />
          <InfoBlock icon={LockKeyhole} label="Intentos max." value={`${selected.maxAttempts}`} />
        </div>
        <Panel title="Hints desbloqueables" icon={BookOpen}>
          <div className="hint-grid">
            {selected.hints.map((hint, index) => (
              <div className="hint-card" key={hint.text}>
                <span>Hint {index + 1} · {hint.cost} pts</span>
                <p>{hint.text}</p>
              </div>
            ))}
          </div>
        </Panel>
        <div className="submit-row">
          <input value={flagValue} onChange={(event) => setFlagValue(event.target.value)} placeholder="DCTF{...}" />
          <button className="primary-button" onClick={submitFlag}><Flag size={16} /> Enviar</button>
        </div>
      </article>
    </section>
  );
}

function InfoBlock({ icon: Icon, label, value }) {
  return (
    <div className="info-block">
      <Icon size={18} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Scoreboard({ state }) {
  const teamScores = buildTeamScores(state);
  const userScores = buildUserScores(state);
  return (
    <section className="screen">
      <div className="section-head">
        <div>
          <span className="eyebrow"><Medal size={14} /> Scoreboard</span>
          <h2>Ranking con desempate por ultima resolucion.</h2>
        </div>
      </div>
      <div className="score-grid">
        <Panel title="Equipos" icon={Users}>
          <ScoreTable rows={teamScores} />
        </Panel>
        <Panel title="Competidores" icon={UserRound}>
          <ScoreTable rows={userScores} />
        </Panel>
      </div>
      <Panel title="Progreso top 10" icon={BarChart3}>
        <div className="bar-chart">
          {teamScores.slice(0, 10).map((team) => (
            <div className="bar-row" key={team.id}>
              <span>{team.name}</span>
              <div><i style={{ width: `${Math.max(8, (team.points / Math.max(teamScores[0]?.points || 1, 1)) * 100)}%` }} /></div>
              <b>{team.points}</b>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}

function ScoreTable({ rows }) {
  return (
    <div className="table">
      {rows.map((row, index) => (
        <div className="table-row" key={row.id}>
          <span>#{index + 1}</span>
          <strong>{row.name}</strong>
          <small>{row.solves} solves</small>
          <b>{row.points}</b>
        </div>
      ))}
    </div>
  );
}

function buildTeamScores(state) {
  return state.teams
    .filter((team) => !team.hidden && !team.banned)
    .map((team) => {
      const solves = state.solves.filter((solve) => solve.teamId === team.id);
      return {
        id: team.id,
        name: team.name,
        solves: solves.length,
        points: solves.reduce((sum, solve) => sum + solve.points, 0),
        lastSolve: solves.map((solve) => solve.at).sort().at(-1) || "",
      };
    })
    .sort((a, b) => b.points - a.points || a.lastSolve.localeCompare(b.lastSolve));
}

function buildUserScores(state) {
  return state.users
    .filter((user) => user.role !== "admin" && !user.banned)
    .map((user) => {
      const solves = state.solves.filter((solve) => solve.userId === user.id);
      return {
        id: user.id,
        name: user.name,
        solves: solves.length,
        points: solves.reduce((sum, solve) => sum + solve.points, 0),
        lastSolve: solves.map((solve) => solve.at).sort().at(-1) || "",
      };
    })
    .sort((a, b) => b.points - a.points || a.lastSolve.localeCompare(b.lastSolve));
}

function Profile({ state, user, updateState, onLogin }) {
  if (!user) {
    return (
      <section className="screen empty-state">
        <KeyRound size={40} />
        <h2>Inicia sesion para ver tu perfil.</h2>
        <button className="primary-button" onClick={onLogin}><LogIn size={16} /> Ingresar</button>
      </section>
    );
  }
  const team = state.teams.find((item) => item.id === user.teamId);
  const solves = state.solves.filter((solve) => solve.userId === user.id);
  const points = solves.reduce((sum, solve) => sum + solve.points, 0);
  const [bio, setBio] = useState(user.bio);

  const saveProfile = () => {
    updateState((current) => ({
      ...current,
      users: current.users.map((item) => item.id === user.id ? { ...item, bio } : item),
    }));
  };

  return (
    <section className="screen profile-grid">
      <Panel title="Perfil competidor" icon={UserRound}>
        <div className="profile-head">
          <div className="profile-avatar">{user.name.slice(0, 2).toUpperCase()}</div>
          <div>
            <h2>{user.name}</h2>
            <p>{user.affiliation} · {user.country}</p>
          </div>
        </div>
        <textarea value={bio} onChange={(event) => setBio(event.target.value)} />
        <button className="secondary-button" onClick={saveProfile}><Settings size={16} /> Guardar perfil</button>
      </Panel>
      <Panel title="Resumen competitivo" icon={Activity}>
        <div className="stats-grid compact">
          <StatCard icon={CircleDollarSign} label="Puntos" value={points} detail="individual" />
          <StatCard icon={CheckCircle2} label="Solves" value={solves.length} detail="retos resueltos" />
          <StatCard icon={Users} label="Equipo" value={team?.name || "N/A"} detail={team?.country || ""} />
        </div>
      </Panel>
      <Panel title="Solves recientes" icon={ListChecks}>
        {solves.map((solve) => {
          const challenge = state.challenges.find((item) => item.id === solve.challengeId);
          return (
            <div className="activity-row" key={solve.id}>
              <CheckCircle2 size={17} />
              <span>{challenge?.name}</span>
              <b>{solve.points} pts</b>
              <small>{formatTime(solve.at)}</small>
            </div>
          );
        })}
      </Panel>
    </section>
  );
}

function Admin({ state, user, updateState, showToast }) {
  const [tab, setTab] = useState("challenges");
  if (!user || user.role !== "admin") {
    return (
      <section className="screen empty-state">
        <Shield size={42} />
        <h2>Panel admin restringido.</h2>
        <p>Ingresa con `admin@dctf.local` / `admin` para gestionar el evento demo.</p>
      </section>
    );
  }

  const tabs = [
    ["challenges", Flag, "Retos"],
    ["users", Users, "Usuarios"],
    ["teams", Boxes, "Equipos"],
    ["content", MessageSquare, "Contenido"],
    ["settings", Settings, "Config"],
  ];

  return (
    <section className="screen">
      <div className="section-head">
        <div>
          <span className="eyebrow"><Wrench size={14} /> Admin console</span>
          <h2>Gestiona retos, puntajes, usuarios, equipos y operacion.</h2>
        </div>
      </div>
      <div className="tabs">
        {tabs.map(([id, Icon, label]) => (
          <button className={tab === id ? "tab active" : "tab"} key={id} onClick={() => setTab(id)}>
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>
      {tab === "challenges" && <AdminChallenges state={state} updateState={updateState} showToast={showToast} />}
      {tab === "users" && <AdminUsers state={state} updateState={updateState} />}
      {tab === "teams" && <AdminTeams state={state} updateState={updateState} />}
      {tab === "content" && <AdminContent state={state} updateState={updateState} />}
      {tab === "settings" && <AdminSettings state={state} updateState={updateState} />}
    </section>
  );
}

function AdminChallenges({ state, updateState, showToast }) {
  const [selectedId, setSelectedId] = useState(state.challenges[0]?.id || "");
  const selected = state.challenges.find((challenge) => challenge.id === selectedId);
  const [draft, setDraft] = useState(challengeToForm(selected));

  const selectChallenge = (challenge) => {
    setSelectedId(challenge.id);
    setDraft(challengeToForm(challenge));
  };

  const newChallenge = () => {
    setSelectedId("");
    setDraft(emptyChallengeForm);
  };

  const saveChallenge = () => {
    const isNew = !draft.id;
    const nextChallenge = formToChallenge(draft, uid("c"));
    updateState((current) => ({
      ...current,
      challenges: isNew
        ? [nextChallenge, ...current.challenges]
        : current.challenges.map((challenge) => challenge.id === nextChallenge.id ? nextChallenge : challenge),
    }));
    setSelectedId(nextChallenge.id);
    setDraft(challengeToForm(nextChallenge));
    showToast(isNew ? "Reto creado." : "Reto actualizado.");
  };

  const deleteChallenge = (id) => {
    updateState((current) => ({
      ...current,
      challenges: current.challenges.filter((challenge) => challenge.id !== id),
      solves: current.solves.filter((solve) => solve.challengeId !== id),
      attempts: current.attempts.filter((attempt) => attempt.challengeId !== id),
    }));
    newChallenge();
    showToast("Reto eliminado junto con solves/intentos asociados.");
  };

  return (
    <div className="admin-grid">
      <Panel title={draft.id ? "Editar reto" : "Crear reto"} icon={Plus}>
        <div className="form-grid">
          <input placeholder="Nombre" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
          <select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>
            <option>Web</option><option>Crypto</option><option>Reverse</option><option>Forensics</option><option>Pwn</option><option>Misc</option>
          </select>
          <select value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value })}>
            <option value="standard">Standard</option><option value="dynamic">Dynamic</option>
          </select>
          <input type="number" placeholder="Puntaje" value={draft.value} onChange={(event) => setDraft({ ...draft, value: event.target.value })} />
          <input type="number" placeholder="Puntaje minimo" value={draft.minValue} onChange={(event) => setDraft({ ...draft, minValue: event.target.value })} />
          <input type="number" placeholder="Decay dinamico" value={draft.decay} onChange={(event) => setDraft({ ...draft, decay: event.target.value })} />
          <input type="number" placeholder="Intentos max." value={draft.maxAttempts} onChange={(event) => setDraft({ ...draft, maxAttempts: event.target.value })} />
          <input placeholder="Conexion / URL / nc host port" value={draft.connection} onChange={(event) => setDraft({ ...draft, connection: event.target.value })} />
          <input placeholder="Tags separados por coma o linea" value={draft.tags} onChange={(event) => setDraft({ ...draft, tags: event.target.value })} />
          <textarea placeholder="Archivos, uno por linea" value={draft.files} onChange={(event) => setDraft({ ...draft, files: event.target.value })} />
          <select value={draft.flagType} onChange={(event) => setDraft({ ...draft, flagType: event.target.value })}>
            <option value="static">Flag estatica</option><option value="regex">Flag regex</option>
          </select>
          <input placeholder="Flag o patron regex" value={draft.flag} onChange={(event) => setDraft({ ...draft, flag: event.target.value })} />
          <textarea placeholder="Hints: costo|texto, uno por linea" value={draft.hints} onChange={(event) => setDraft({ ...draft, hints: event.target.value })} />
          <textarea placeholder="Descripcion markdown/html" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
          <div className="inline-checks">
            <label><input type="checkbox" checked={draft.visible} onChange={(event) => setDraft({ ...draft, visible: event.target.checked })} /> Visible</label>
            <label><input type="checkbox" checked={draft.locked} onChange={(event) => setDraft({ ...draft, locked: event.target.checked })} /> Bloqueado</label>
          </div>
          <div className="form-actions">
            <button className="primary-button" onClick={saveChallenge}><Upload size={16} /> Guardar</button>
            <button className="secondary-button" onClick={newChallenge}><Plus size={16} /> Nuevo</button>
            {draft.id && <button className="danger-button" onClick={() => deleteChallenge(draft.id)}><X size={16} /> Eliminar</button>}
          </div>
        </div>
      </Panel>
      <Panel title="Retos existentes" icon={Flag}>
        <div className="editor-list">
          {state.challenges.map((challenge) => (
            <div className={challenge.id === selectedId ? "editor-row active" : "editor-row"} key={challenge.id}>
              <button onClick={() => selectChallenge(challenge)}>
                <strong>{challenge.name}</strong>
                <small>{challenge.category} · {challenge.type} · {challenge.value} pts · {challenge.visible ? "visible" : "oculto"}</small>
              </button>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function AdminUsers({ state, updateState }) {
  const emptyUser = {
    id: "",
    name: "",
    email: "",
    password: "player",
    role: "competitor",
    teamId: state.teams.find((team) => !team.hidden)?.id || state.teams[0]?.id || "",
    country: "CL",
    affiliation: "",
    bio: "",
    banned: false,
    verified: true,
  };
  const [selectedId, setSelectedId] = useState(state.users[0]?.id || "");
  const selected = state.users.find((user) => user.id === selectedId) || emptyUser;
  const [draft, setDraft] = useState(selected);

  const selectUser = (nextUser) => {
    setSelectedId(nextUser.id);
    setDraft(nextUser);
  };

  const newUser = () => {
    setSelectedId("");
    setDraft(emptyUser);
  };

  const saveUser = () => {
    const nextUser = { ...draft, id: draft.id || uid("u"), name: draft.name || "New competitor" };
    updateState((current) => ({
      ...current,
      users: draft.id
        ? current.users.map((user) => user.id === nextUser.id ? nextUser : user)
        : [nextUser, ...current.users],
    }));
    setSelectedId(nextUser.id);
    setDraft(nextUser);
  };

  const deleteUser = (id) => {
    updateState((current) => ({
      ...current,
      users: current.users.filter((user) => user.id !== id),
      solves: current.solves.filter((solve) => solve.userId !== id),
      attempts: current.attempts.filter((attempt) => attempt.userId !== id),
    }));
    newUser();
  };

  const toggle = (id, key) => {
    updateState((current) => ({
      ...current,
      users: current.users.map((user) => user.id === id ? { ...user, [key]: !user[key] } : user),
    }));
  };
  return (
    <div className="admin-grid">
      <Panel title={draft.id ? "Editar usuario" : "Crear usuario"} icon={Users}>
        <div className="form-grid">
          <input placeholder="Nombre" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
          <input type="email" placeholder="Email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} />
          <input placeholder="Password demo" value={draft.password} onChange={(event) => setDraft({ ...draft, password: event.target.value })} />
          <select value={draft.role} onChange={(event) => setDraft({ ...draft, role: event.target.value })}>
            <option value="competitor">Competidor</option><option value="admin">Admin</option><option value="moderator">Moderador</option>
          </select>
          <select value={draft.teamId} onChange={(event) => setDraft({ ...draft, teamId: event.target.value })}>
            {state.teams.map((team) => <option value={team.id} key={team.id}>{team.name}</option>)}
          </select>
          <input placeholder="Pais" value={draft.country} onChange={(event) => setDraft({ ...draft, country: event.target.value })} />
          <input placeholder="Afiliacion" value={draft.affiliation} onChange={(event) => setDraft({ ...draft, affiliation: event.target.value })} />
          <textarea placeholder="Bio" value={draft.bio} onChange={(event) => setDraft({ ...draft, bio: event.target.value })} />
          <div className="inline-checks">
            <label><input type="checkbox" checked={draft.verified} onChange={(event) => setDraft({ ...draft, verified: event.target.checked })} /> Verificado</label>
            <label><input type="checkbox" checked={draft.banned} onChange={(event) => setDraft({ ...draft, banned: event.target.checked })} /> Bloqueado</label>
          </div>
          <div className="form-actions">
            <button className="primary-button" onClick={saveUser}><Upload size={16} /> Guardar</button>
            <button className="secondary-button" onClick={newUser}><Plus size={16} /> Nuevo</button>
            {draft.id && <button className="danger-button" onClick={() => deleteUser(draft.id)}><X size={16} /> Eliminar</button>}
          </div>
        </div>
      </Panel>
      <Panel title="Usuarios" icon={Users}>
        <div className="editor-list">
          {state.users.map((user) => (
            <div className={user.id === selectedId ? "editor-row active" : "editor-row"} key={user.id}>
              <button onClick={() => selectUser(user)}>
                <strong>{user.name}</strong>
                <small>{user.email} · {user.role} · {user.banned ? "bloqueado" : "activo"}</small>
              </button>
              <button className="ghost-button" onClick={() => toggle(user.id, "banned")}>{user.banned ? "Desbloquear" : "Bloquear"}</button>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function AdminTeams({ state, updateState }) {
  const emptyTeam = { id: "", name: "", country: "CL", affiliation: "", website: "", hidden: false, banned: false };
  const [selectedId, setSelectedId] = useState(state.teams[0]?.id || "");
  const selected = state.teams.find((team) => team.id === selectedId) || emptyTeam;
  const [draft, setDraft] = useState(selected);

  const selectTeam = (team) => {
    setSelectedId(team.id);
    setDraft(team);
  };

  const newTeam = () => {
    setSelectedId("");
    setDraft(emptyTeam);
  };

  const saveTeam = () => {
    const nextTeam = { ...draft, id: draft.id || uid("t"), name: draft.name || "New team" };
    updateState((current) => ({
      ...current,
      teams: draft.id
        ? current.teams.map((team) => team.id === nextTeam.id ? nextTeam : team)
        : [nextTeam, ...current.teams],
    }));
    setSelectedId(nextTeam.id);
    setDraft(nextTeam);
  };

  const deleteTeam = (id) => {
    updateState((current) => ({
      ...current,
      teams: current.teams.filter((team) => team.id !== id),
      users: current.users.map((user) => user.teamId === id ? { ...user, teamId: "" } : user),
      solves: current.solves.filter((solve) => solve.teamId !== id),
    }));
    newTeam();
  };

  const toggle = (id, key) => {
    updateState((current) => ({
      ...current,
      teams: current.teams.map((team) => team.id === id ? { ...team, [key]: !team[key] } : team),
    }));
  };
  return (
    <div className="admin-grid">
      <Panel title={draft.id ? "Editar equipo" : "Crear equipo"} icon={Boxes}>
        <div className="form-grid">
          <input placeholder="Nombre" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
          <input placeholder="Pais" value={draft.country} onChange={(event) => setDraft({ ...draft, country: event.target.value })} />
          <input placeholder="Afiliacion" value={draft.affiliation} onChange={(event) => setDraft({ ...draft, affiliation: event.target.value })} />
          <input placeholder="Website" value={draft.website} onChange={(event) => setDraft({ ...draft, website: event.target.value })} />
          <div className="inline-checks">
            <label><input type="checkbox" checked={draft.hidden} onChange={(event) => setDraft({ ...draft, hidden: event.target.checked })} /> Oculto</label>
            <label><input type="checkbox" checked={draft.banned} onChange={(event) => setDraft({ ...draft, banned: event.target.checked })} /> Bloqueado</label>
          </div>
          <div className="form-actions">
            <button className="primary-button" onClick={saveTeam}><Upload size={16} /> Guardar</button>
            <button className="secondary-button" onClick={newTeam}><Plus size={16} /> Nuevo</button>
            {draft.id && <button className="danger-button" onClick={() => deleteTeam(draft.id)}><X size={16} /> Eliminar</button>}
          </div>
        </div>
      </Panel>
      <Panel title="Equipos" icon={Boxes}>
        <div className="editor-list">
          {state.teams.map((team) => (
            <div className={team.id === selectedId ? "editor-row active" : "editor-row"} key={team.id}>
              <button onClick={() => selectTeam(team)}>
                <strong>{team.name}</strong>
                <small>{team.affiliation} · {team.country} · {team.hidden ? "oculto" : "publico"}</small>
              </button>
              <button className="ghost-button" onClick={() => toggle(team.id, "hidden")}>{team.hidden ? "Mostrar" : "Ocultar"}</button>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function AdminContent({ state, updateState }) {
  const [announcement, setAnnouncement] = useState({ title: "Admin update", body: "" });
  const [pageDraft, setPageDraft] = useState(state.pages[0] || { id: "", title: "", body: "" });
  const publish = () => {
    if (!announcement.body.trim()) return;
    updateState((current) => ({
      ...current,
      announcements: [{ id: uid("m"), title: announcement.title || "Admin update", body: announcement.body, at: new Date().toISOString() }, ...current.announcements],
    }));
    setAnnouncement({ title: "Admin update", body: "" });
  };

  const savePage = () => {
    const nextPage = { ...pageDraft, id: pageDraft.id || uid("page"), title: pageDraft.title || "Untitled page" };
    updateState((current) => ({
      ...current,
      pages: pageDraft.id
        ? current.pages.map((page) => page.id === nextPage.id ? nextPage : page)
        : [nextPage, ...current.pages],
    }));
    setPageDraft(nextPage);
  };

  const deleteAnnouncement = (id) => {
    updateState((current) => ({ ...current, announcements: current.announcements.filter((item) => item.id !== id) }));
  };

  const deletePage = (id) => {
    updateState((current) => ({ ...current, pages: current.pages.filter((page) => page.id !== id) }));
    setPageDraft({ id: "", title: "", body: "" });
  };

  return (
    <div className="admin-grid">
      <Panel title="Nuevo anuncio" icon={MessageSquare}>
        <input value={announcement.title} onChange={(event) => setAnnouncement({ ...announcement, title: event.target.value })} placeholder="Titulo" />
        <textarea value={announcement.body} onChange={(event) => setAnnouncement({ ...announcement, body: event.target.value })} placeholder="Mensaje para competidores" />
        <button className="primary-button" onClick={publish}><Upload size={16} /> Publicar</button>
        <div className="editor-list">
          {state.announcements.map((item) => (
            <div className="editor-row" key={item.id}>
              <button>
                <strong>{item.title}</strong>
                <small>{item.body}</small>
              </button>
              <button className="danger-button" onClick={() => deleteAnnouncement(item.id)}><X size={15} /> Eliminar</button>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Paginas CMS" icon={BookOpen}>
        <div className="form-grid">
          <input value={pageDraft.title} onChange={(event) => setPageDraft({ ...pageDraft, title: event.target.value })} placeholder="Titulo pagina" />
          <textarea value={pageDraft.body} onChange={(event) => setPageDraft({ ...pageDraft, body: event.target.value })} placeholder="Contenido" />
          <div className="form-actions">
            <button className="primary-button" onClick={savePage}><Upload size={16} /> Guardar pagina</button>
            <button className="secondary-button" onClick={() => setPageDraft({ id: "", title: "", body: "" })}><Plus size={16} /> Nueva</button>
            {pageDraft.id && <button className="danger-button" onClick={() => deletePage(pageDraft.id)}><X size={16} /> Eliminar</button>}
          </div>
        </div>
        <div className="editor-list">
          {state.pages.map((page) => (
            <div className={page.id === pageDraft.id ? "editor-row active" : "editor-row"} key={page.id}>
              <button onClick={() => setPageDraft(page)}>
                <strong>{page.title}</strong>
                <small>{page.body}</small>
              </button>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function AdminSettings({ state, updateState }) {
  const patchEvent = (key, value) => {
    updateState((current) => ({ ...current, event: { ...current.event, [key]: value } }));
  };
  return (
    <Panel title="Configuracion del evento" icon={Settings}>
      <div className="settings-grid">
        <label>Nombre<input value={state.event.name} onChange={(event) => patchEvent("name", event.target.value)} /></label>
        <label>Modo<input value={state.event.mode} onChange={(event) => patchEvent("mode", event.target.value)} /></label>
        <label>Estado<select value={state.event.status} onChange={(event) => patchEvent("status", event.target.value)}><option>Live</option><option>Paused</option><option>Ended</option></select></label>
        <label>Inicio<input type="datetime-local" value={state.event.startsAt} onChange={(event) => patchEvent("startsAt", event.target.value)} /></label>
        <label>Termino<input type="datetime-local" value={state.event.endsAt} onChange={(event) => patchEvent("endsAt", event.target.value)} /></label>
        <label>Intentos max.<input type="number" value={state.event.maxAttempts} onChange={(event) => patchEvent("maxAttempts", Number(event.target.value))} /></label>
        <label className="settings-wide">Mensaje publico<textarea value={state.event.message} onChange={(event) => patchEvent("message", event.target.value)} /></label>
        <label className="switch"><input type="checkbox" checked={state.event.publicScoreboard} onChange={(event) => patchEvent("publicScoreboard", event.target.checked)} /> Scoreboard publico</label>
        <label className="switch"><input type="checkbox" checked={state.event.freezeScoreboard} onChange={(event) => patchEvent("freezeScoreboard", event.target.checked)} /> Congelar ranking</label>
        <label className="switch"><input type="checkbox" checked={state.event.allowRegistration} onChange={(event) => patchEvent("allowRegistration", event.target.checked)} /> Registro abierto</label>
        <label className="switch"><input type="checkbox" checked={state.event.requireEmailVerification} onChange={(event) => patchEvent("requireEmailVerification", event.target.checked)} /> Verificar email</label>
      </div>
    </Panel>
  );
}

function LoginModal({ onClose, onLogin }) {
  const [email, setEmail] = useState("admin@dctf.local");
  const [password, setPassword] = useState("admin");
  const submit = (event) => {
    event.preventDefault();
    onLogin(email, password);
  };
  return (
    <div className="modal-backdrop">
      <form className="modal" onSubmit={submit}>
        <button className="icon-button close" type="button" onClick={onClose} aria-label="Cerrar"><X size={18} /></button>
        <div className="modal-icon"><Shield size={28} /></div>
        <h2>Ingresar a D-CTF</h2>
        <p>Usa admin/admin o neo/player para probar roles.</p>
        <input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="email" />
        <input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="password" />
        <button className="primary-button full" type="submit"><LogIn size={16} /> Ingresar</button>
      </form>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
