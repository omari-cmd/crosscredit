import { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";

const C = {
  navy: "#0D3B27", navyLight: "#1A6040", navyDark: "#071F14",
  green: "#00C46A", greenLight: "#00E87D",
  gold: "#00D97E", goldLight: "#6EFFC0",
  gray: "#F0FAF4", midGray: "#5E8C72", dark: "#1A2E22",
  white: "#FFFFFF", border: "#B8DEC9", red: "#E74C3C",
  blueLight: "#DCF5E9", greenPale: "#C5F0DA",
};
const ff = { sans: "system-ui, sans-serif", serif: "'Georgia', serif" };
const card = { background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: "2rem", maxWidth: 540, margin: "2rem auto", boxShadow: "0 4px 20px rgba(0,0,0,0.07)" };
const btnStyle = (bg = C.navy) => ({ width: "100%", padding: "0.9rem", background: bg, color: C.white, border: "none", borderRadius: 8, fontSize: 16, fontFamily: ff.sans, fontWeight: "bold", cursor: "pointer", marginTop: 8 });
const inputStyle = { width: "100%", padding: "0.75rem 1rem", borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 15, fontFamily: ff.sans, boxSizing: "border-box", color: C.dark, outline: "none", marginBottom: "1rem" };
const labelStyle = { display: "block", fontSize: 13, fontWeight: "bold", color: C.dark, fontFamily: ff.sans, marginBottom: 6 };

function StepBar({ current }) {
  const steps = ["Sign Up", "Upload", "Report", "Submit"];
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: "1.5rem 0 0", fontFamily: ff.sans, flexWrap: "wrap" }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: "bold", background: i < current ? C.green : i === current ? C.navy : C.border, color: i <= current ? C.white : C.midGray }}>{i < current ? "✓" : i + 1}</div>
          <span style={{ fontSize: 11, color: i === current ? C.navy : C.midGray }}>{s}</span>
          {i < steps.length - 1 && <div style={{ width: 18, height: 2, background: i < current ? C.green : C.border }} />}
        </div>
      ))}
    </div>
  );
}

const STATS = [
  { prefix: "$", target: 669, suffix: "B", label: "sent globally in 2023",                    delay: 0   },
  { prefix: "",  target: 26,  suffix: "M", label: "credit invisible in the US",                delay: 250 },
  { prefix: "",  target: 45,  suffix: "M", label: "remittance senders in US",                  delay: 500 },
  { prefix: "",  target: 0,   suffix: "",  label: "platforms reporting remittances — until now", delay: 750 },
];

function AnimatedCounter({ prefix, target, suffix, label, delay, isLast }) {
  const [display, setDisplay] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || target === 0) return;
    const timer = setTimeout(() => {
      const duration = 2000;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(Math.round(eased * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timer);
  }, [visible, target, delay]);

  return (
    <div ref={ref} style={{ display: "flex", alignItems: "center" }}>
      <div style={{
        textAlign: "center", padding: "0 1.25rem",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}>
        <div style={{ fontSize: 26, fontWeight: "bold", color: C.goldLight, fontFamily: ff.serif }}>
          {prefix}{display}{suffix}
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", fontFamily: ff.sans, marginTop: 2 }}>{label}</div>
      </div>
      {!isLast && <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.15)" }} />}
    </div>
  );
}

function LandingPage({ onStart }) {
  return (
    <div>
      <div style={{ background: `linear-gradient(150deg, ${C.navyDark} 0%, ${C.navy} 60%, ${C.navyLight} 100%)`, padding: "5rem 2rem 4rem", textAlign: "center", color: C.white }}>
        <div style={{ fontSize: 11, color: C.goldLight, letterSpacing: 4, fontFamily: ff.sans, marginBottom: "1rem", fontWeight: "bold" }}>FOR IMMIGRANTS · BY AN IMMIGRANT</div>
        <h1 style={{ fontSize: 42, fontWeight: "bold", margin: "0 0 1.25rem", lineHeight: 1.15, fontFamily: ff.serif }}>
          You send money home every month.<br /><span style={{ color: C.goldLight }}>Make it count.</span>
        </h1>
        <p style={{ fontSize: 17, opacity: 0.88, maxWidth: 540, margin: "0 auto 2rem", fontFamily: ff.sans, lineHeight: 1.7 }}>
          Millions of immigrants send remittances consistently — a powerful act of responsibility. CrossCredit turns those transfers into a recognized US credit history.
        </p>
        <button style={{ ...btnStyle(C.green), width: "auto", padding: "1rem 2.5rem", fontSize: 17, borderRadius: 8 }} onClick={onStart}>Build my credit — free to start</button>
        <p style={{ fontSize: 12, opacity: 0.5, marginTop: "1rem", fontFamily: ff.sans }}>Works with Remitly · Sendwave · Western Union · Wise · WorldRemit</p>
      </div>

      <div style={{ background: C.navyDark, padding: "1.5rem 2rem", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 0 }}>
        {STATS.map((s, i) => (
          <AnimatedCounter key={i} {...s} isLast={i === STATS.length - 1} />
        ))}
      </div>

      <div style={{ background: C.white, padding: "3.5rem 2rem", textAlign: "center" }}>
        <div style={{ fontSize: 11, color: C.green, letterSpacing: 3, fontFamily: ff.sans, fontWeight: "bold", marginBottom: 8 }}>HOW IT WORKS</div>
        <h2 style={{ fontSize: 26, color: C.navy, margin: "0 0 2rem", fontFamily: ff.serif }}>Simple. Automatic. Powerful.</h2>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: 8, maxWidth: 860, margin: "0 auto" }}>
          {[{icon:"💸",label:"You send money"},{icon:"📱",label:"App records it"},{icon:"🔐",label:"CrossCredit collects it"},{icon:"📋",label:"eCredable reports it"},{icon:"📈",label:"You build credit"}].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ background: C.gray, borderRadius: 10, padding: "1rem", textAlign: "center", minWidth: 110, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
                <div style={{ fontSize: 11, fontFamily: ff.sans, color: C.navy, fontWeight: "bold" }}>{item.label}</div>
              </div>
              {i < 4 && <span style={{ color: C.green, fontSize: 20, fontWeight: "bold" }}>→</span>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: C.gray, padding: "3rem 2rem" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ fontSize: 11, color: C.green, letterSpacing: 3, fontFamily: ff.sans, fontWeight: "bold", marginBottom: 8, textAlign: "center" }}>WHO IS CROSSCREDIT FOR</div>
          <h2 style={{ fontSize: 24, color: C.navy, margin: "0 0 1.5rem", fontFamily: ff.serif, textAlign: "center" }}>Meet James</h2>
          <div style={{ ...card, margin: "0 auto", display: "flex", gap: "1.5rem", alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: C.white, fontWeight: "bold", flexShrink: 0 }}>JN</div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ fontWeight: "bold", fontSize: 15, color: C.navy, fontFamily: ff.sans }}>James N., 32 · Truck Driver · Dallas, TX · From Kenya 🇰🇪</div>
              <div style={{ background: C.blueLight, borderLeft: `4px solid ${C.navy}`, padding: "0.75rem 1rem", borderRadius: "0 8px 8px 0", fontSize: 13, fontFamily: ff.sans, color: C.dark, lineHeight: 1.6, fontStyle: "italic", margin: "0.75rem 0" }}>
                "I've been sending $400 home every month for 3 years. Never missed a transfer. But the bank here says I have no credit history. How is that possible?"
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["Sends $400/month","Credit score: 580","Goal: Buy a home"].map(t => (
                  <span key={t} style={{ fontSize: 11, background: C.gray, border: `1px solid ${C.border}`, borderRadius: 20, padding: "3px 10px", fontFamily: ff.sans, color: C.dark }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
          <p style={{ textAlign: "center", fontSize: 14, color: C.midGray, fontFamily: ff.sans, marginTop: "1.25rem", lineHeight: 1.7 }}>
            James is one of <strong>45 million</strong> immigrants in the US sending remittances regularly.<br />CrossCredit exists for James. And for millions like him.
          </p>
        </div>
      </div>

      <div style={{ padding: "3rem 2rem", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ fontSize: 11, color: C.green, letterSpacing: 3, fontFamily: ff.sans, fontWeight: "bold", marginBottom: 8, textAlign: "center" }}>WHAT YOU GET</div>
        <h2 style={{ fontSize: 24, color: C.navy, margin: "0 0 1.75rem", fontFamily: ff.serif, textAlign: "center" }}>Everything you need to build credit</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 18 }}>
          {[
            {icon:"🔗",t:"Connect any app",d:"Upload from Remitly, Sendwave, Western Union, Wise — any provider."},
            {icon:"📄",t:"Your Remittance Profile",d:"Upload your transfer history and get a verified summary of your financial activity ready to submit to credit agencies."},
            {icon:"📋",t:"Bureau reporting",d:"We submit to eCredable who reports to Experian, Equifax, and TransUnion."},
            {icon:"📊",t:"Track Your Progress",d:"See your submission history, months reported, and how your remittance activity is building your financial profile over time."},
            {icon:"🏅",t:"Trust badges",d:"Earn milestones for consistent sending — shareable with landlords and lenders."},
          ].map((f2, i) => (
            <div key={i} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: "1.25rem" }}>
              <div style={{ fontSize: 26, marginBottom: 8 }}>{f2.icon}</div>
              <div style={{ fontSize: 14, fontWeight: "bold", color: C.navy, marginBottom: 6, fontFamily: ff.sans }}>{f2.t}</div>
              <div style={{ fontSize: 12, color: C.midGray, fontFamily: ff.sans, lineHeight: 1.6 }}>{f2.d}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: C.navy, padding: "3.5rem 2rem", textAlign: "center" }}>
        <h2 style={{ fontSize: 28, color: C.white, margin: "0 0 1rem", fontFamily: ff.serif }}>
          Your remittances already tell a story.<br /><span style={{ color: C.goldLight }}>Let us tell it to the right people.</span>
        </h2>
        <button style={{ ...btnStyle(C.green), width: "auto", padding: "1rem 2.5rem", fontSize: 17 }} onClick={onStart}>Get started — it's free</button>
      </div>
    </div>
  );
}

const ALL_COUNTRIES = ["Burkina Faso","Burundi","Cameroon","Chad","Congo (Brazzaville)","DRC (Congo)","Dominican Republic","El Salvador","Ethiopia","Ghana","Guatemala","Guinea","Haiti","Honduras","India","Ivory Coast","Jamaica","Kenya","Madagascar","Mali","Mexico","Morocco","Mozambique","Niger","Nigeria","Philippines","Rwanda","Senegal","Sierra Leone","South Africa","Tanzania","Togo","Trinidad & Tobago","Uganda","Zimbabwe","Other"];
const ALL_PROVIDERS = ["Remitly","Sendwave","Western Union","Wise","WorldRemit","MoneyGram","Zelle","Cash App","PayPal","Ria Money Transfer","Other"];

function SearchableMultiSelect({ label, options, selected, onChange, placeholder }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const toggle = (val) => onChange(selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val]);
  const filtered = options.filter(o => o.toLowerCase().includes(query.toLowerCase()));

  // Close dropdown when clicking outside
  const handleBlur = (e) => { if (!ref.current?.contains(e.relatedTarget)) setOpen(false); };

  return (
    <div style={{ marginBottom: "1rem", position: "relative" }} ref={ref} onBlur={handleBlur}>
      <label style={labelStyle}>{label}</label>

      {/* Selected tags */}
      {selected.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
          {selected.map(s => (
            <span key={s} style={{
              display: "flex", alignItems: "center", gap: 4,
              background: C.navy, color: C.white, borderRadius: 20,
              padding: "4px 10px", fontSize: 12, fontFamily: ff.sans,
            }}>
              {s}
              <span
                onClick={() => toggle(s)}
                style={{ cursor: "pointer", fontSize: 14, lineHeight: 1, opacity: 0.8, marginLeft: 2 }}
              >×</span>
            </span>
          ))}
        </div>
      )}

      {/* Search input */}
      <div style={{ position: "relative" }}>
        <input
          style={{ ...inputStyle, marginBottom: 0, paddingRight: "2.5rem" }}
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={selected.length > 0 ? `Add more... (${selected.length} selected)` : placeholder || `Search or select...`}
        />
        <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: C.midGray, fontSize: 12, pointerEvents: "none" }}>
          {open ? "▲" : "▼"}
        </span>
      </div>

      {/* Dropdown list */}
      {open && (
        <div style={{
          position: "absolute", zIndex: 100, width: "100%",
          background: C.white, border: `1.5px solid ${C.navy}`,
          borderRadius: 8, marginTop: 4, maxHeight: 220, overflowY: "auto",
          boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
        }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "0.75rem 1rem", fontSize: 13, color: C.midGray, fontFamily: ff.sans }}>No results found</div>
          ) : filtered.map(opt => {
            const active = selected.includes(opt);
            return (
              <div
                key={opt}
                onMouseDown={e => { e.preventDefault(); toggle(opt); setQuery(""); }}
                style={{
                  padding: "0.6rem 1rem", fontSize: 14, fontFamily: ff.sans,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
                  background: active ? C.blueLight : C.white,
                  color: active ? C.navy : C.dark, fontWeight: active ? "bold" : "normal",
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                <span style={{
                  width: 16, height: 16, borderRadius: 3, flexShrink: 0,
                  border: `2px solid ${active ? C.navy : C.border}`,
                  background: active ? C.navy : C.white,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {active && <span style={{ color: C.white, fontSize: 10, fontWeight: "bold" }}>✓</span>}
                </span>
                {opt}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SignupStep({ onNext }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countries, setCountries] = useState([]);
  const [providers, setProviders] = useState([]);
  const [consent, setConsent] = useState(false);

  const canContinue = name && email && countries.length > 0 && providers.length > 0 && consent;

  return (
    <div>
      <StepBar current={0} />
      <div style={card}>
        <h2 style={{ fontSize: 22, fontWeight: "bold", color: C.navy, margin: "0 0 0.4rem", fontFamily: ff.serif }}>Create your account</h2>
        <p style={{ fontSize: 14, color: C.midGray, fontFamily: ff.sans, margin: "0 0 1.5rem" }}>Free to start. No credit card. Takes 60 seconds.</p>

        <label style={labelStyle}>Full name</label>
        <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. James Njoroge" />

        <label style={labelStyle}>Email address</label>
        <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />

        <SearchableMultiSelect
          label="Countries you send money to (select all that apply)"
          options={ALL_COUNTRIES}
          selected={countries}
          onChange={setCountries}
          placeholder="Search country..."
        />

        <SearchableMultiSelect
          label="Apps you use to send money (select all that apply)"
          options={ALL_PROVIDERS}
          selected={providers}
          onChange={setProviders}
          placeholder="Search app..."
        />

        <div style={{ background: C.greenPale, border: `1px solid ${C.green}`, borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1rem", fontFamily: ff.sans, fontSize: 13, color: C.dark }}>
          🔒 Your data is encrypted and never shared without your permission.
        </div>

        <div
          onClick={() => setConsent(!consent)}
          style={{
            display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer",
            background: consent ? C.greenPale : C.gray,
            border: `1.5px solid ${consent ? C.green : C.border}`,
            borderRadius: 8, padding: "0.85rem 1rem", marginBottom: "1rem",
          }}
        >
          <div style={{
            width: 20, height: 20, borderRadius: 4, border: `2px solid ${consent ? C.green : C.border}`,
            background: consent ? C.green : C.white, flexShrink: 0, marginTop: 1,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {consent && <span style={{ color: C.white, fontSize: 13, fontWeight: "bold" }}>✓</span>}
          </div>
          <span style={{ fontSize: 13, fontFamily: ff.sans, color: C.dark, lineHeight: 1.5 }}>
            I consent to CrossCredit submitting my remittance transfer history to credit reporting agencies for the purpose of building my US credit history.
          </span>
        </div>

        {(!canContinue && name && email) && (
          <div style={{ fontSize: 12, color: C.midGray, fontFamily: ff.sans, marginBottom: 8 }}>
            {countries.length === 0 && "· Select at least one country  "}
            {providers.length === 0 && "· Select at least one app  "}
            {!consent && "· Please give consent to continue"}
          </div>
        )}

        <button
          style={{ ...btnStyle(), opacity: canContinue ? 1 : 0.4 }}
          disabled={!canContinue}
          onClick={() => onNext({ name, email, countries, providers, consent })}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

function UploadStep({ user, onNext }) {
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef({});

  const howTo = {
    "Remitly": "Remitly app → Profile → Transaction History → Export PDF",
    "Western Union": "westernunion.com → Transaction History → Export",
    "Wise": "Wise app → Activity → Download Statement",
    "Sendwave": "Sendwave app → History → Download",
    "WorldRemit": "WorldRemit app → Transaction History → Export",
    "MoneyGram": "moneygram.com → Transaction History → Download",
  };

  const PROMPT = `Analyze this remittance transfer history and respond ONLY with JSON, no markdown:
{"totalSent":<number>,"totalTransactions":<number>,"delivered":<number>,"canceled":<number>,"activeMonths":<number>,"uniqueRecipients":<number>,"successRate":<number 0-100>,"provider":<string>,"userName":<string>,"period":<string>,"indicators":[{"title":<string>,"desc":<string>}],"transactions":[{"date":<string>,"recipient":<string>,"amount":<number>,"method":<string>,"status":<string>}]}
Include up to 6 creditworthiness indicators and up to 10 most recent delivered transactions.`;

  async function analyzeFile(file) {
    const isXlsx = file.name.endsWith(".xlsx") || file.name.endsWith(".xls");
    let messageContent;
    if (isXlsx) {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const csv = XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]);
      messageContent = [{ type: "text", text: `${PROMPT}\n\nData:\n${csv}` }];
    } else {
      const base64 = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result.split(",")[1]); r.onerror = rej; r.readAsDataURL(file); });
      messageContent = [{ type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } }, { type: "text", text: PROMPT }];
    }
    const res = await fetch("http://localhost:3001/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: messageContent }) });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return JSON.parse(data.text.replace(/```json|```/g, "").trim());
  }

  async function processAllFiles() {
    const uploadedProviders = Object.keys(files);
    if (uploadedProviders.length === 0) return;
    setLoading(true); setError("");
    try {
      const results = await Promise.all(uploadedProviders.map(p => analyzeFile(files[p])));

      // Merge all results into one combined report
      const combined = {
        userName: user.name,
        providers: uploadedProviders.join(", "),
        countries: user.countries.join(", "),
        totalSent: results.reduce((sum, r) => sum + (Number(r.totalSent) || 0), 0),
        totalTransactions: results.reduce((sum, r) => sum + (Number(r.totalTransactions) || 0), 0),
        delivered: results.reduce((sum, r) => sum + (Number(r.delivered) || 0), 0),
        canceled: results.reduce((sum, r) => sum + (Number(r.canceled) || 0), 0),
        activeMonths: Math.max(...results.map(r => Number(r.activeMonths) || 0)),
        uniqueRecipients: results.reduce((sum, r) => sum + (Number(r.uniqueRecipients) || 0), 0),
        period: results.map(r => r.period).filter(Boolean).join(" · "),
        indicators: results.flatMap(r => r.indicators || []).slice(0, 6),
        transactions: results.flatMap(r => (r.transactions || []).map(tx => ({ ...tx, provider: r.provider || "" }))).slice(0, 15),
      };
      combined.successRate = combined.totalTransactions > 0 ? Math.round((combined.delivered / combined.totalTransactions) * 100) : 0;

      onNext(combined);
    } catch (err) {
      setError("Error: " + (err.message || "Could not read one or more files. Please make sure each file is a valid PDF or Excel export from your remittance app."));
    }
    setLoading(false);
  }

  if (loading) return (
    <div><StepBar current={1} />
      <div style={card}>
        <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
          <div style={{ fontSize: 52 }}>🔍</div>
          <h3 style={{ color: C.navy, fontFamily: ff.serif, margin: "1rem 0 0.5rem" }}>Every transfer tells a story.</h3>
          <p style={{ color: C.midGray, fontFamily: ff.sans, fontSize: 14 }}>
            We're reading yours. Your report will be ready in about 15 seconds.
          </p>
        </div>
      </div>
    </div>
  );

  const uploadedCount = Object.keys(files).length;
  const canAnalyze = uploadedCount > 0;

  return (
    <div><StepBar current={1} />
      <div style={card}>
        <h2 style={{ fontSize: 22, fontWeight: "bold", color: C.navy, margin: "0 0 0.4rem", fontFamily: ff.serif }}>Upload your transfer history</h2>
        <p style={{ fontSize: 14, color: C.midGray, fontFamily: ff.sans, margin: "0 0 0.5rem" }}>
          You selected <strong>{user.providers.join(", ")}</strong>. Upload one file per app below.
        </p>
        <div style={{ background: C.blueLight, borderRadius: 8, padding: "0.6rem 1rem", marginBottom: "1.25rem", fontFamily: ff.sans, fontSize: 12, color: C.navy }}>
          💡 Upload files from all your apps for a stronger, more complete credit report.
        </div>

        {user.providers.map(provider => {
          const hasFile = !!files[provider];
          return (
            <div key={provider} style={{ marginBottom: "1rem" }}>
              <div style={{ fontSize: 13, fontWeight: "bold", color: C.dark, fontFamily: ff.sans, marginBottom: 6 }}>
                {provider}
                {howTo[provider] && <span style={{ fontWeight: "normal", color: C.midGray, fontSize: 11, marginLeft: 8 }}>{howTo[provider]}</span>}
              </div>
              <div
                style={{
                  border: `2px dashed ${hasFile ? C.green : C.border}`, borderRadius: 10,
                  padding: "1.25rem 1rem", textAlign: "center", cursor: "pointer",
                  background: hasFile ? C.greenPale : C.gray, transition: "all 0.2s",
                }}
                onClick={() => {
                  if (!inputRefs.current[provider]) inputRefs.current[provider] = document.createElement("input");
                  const inp = inputRefs.current[provider];
                  inp.type = "file"; inp.accept = ".pdf,.xlsx,.xls";
                  inp.onchange = e => { if (e.target.files[0]) setFiles(prev => ({ ...prev, [provider]: e.target.files[0] })); };
                  inp.click();
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 6 }}>{hasFile ? "✅" : "📄"}</div>
                <div style={{ fontSize: 13, color: hasFile ? C.green : C.midGray, fontFamily: ff.sans, fontWeight: hasFile ? "bold" : "normal" }}>
                  {hasFile ? files[provider].name : `Click to upload ${provider} history`}
                </div>
                <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 6 }}>
                  {["PDF","XLSX","XLS"].map(t => <span key={t} style={{ fontSize: 10, background: C.navy, color: C.white, borderRadius: 3, padding: "1px 6px", fontFamily: ff.sans }}>{t}</span>)}
                </div>
              </div>
            </div>
          );
        })}

        {uploadedCount > 0 && (
          <div style={{ background: C.greenPale, border: `1px solid ${C.green}`, borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1rem", fontFamily: ff.sans, fontSize: 13, color: C.dark }}>
            ✓ {uploadedCount} of {user.providers.length} files uploaded.
            {uploadedCount < user.providers.length && " You can still continue with the files you have."}
          </div>
        )}

        {error && <div style={{ color: C.red, fontSize: 13, fontFamily: ff.sans, marginTop: 8, marginBottom: 8 }}>{error}</div>}

        <button
          style={{ ...btnStyle(), opacity: canAnalyze ? 1 : 0.4, marginTop: "0.5rem" }}
          disabled={!canAnalyze}
          onClick={processAllFiles}
        >
          {uploadedCount > 1 ? `Analyze ${uploadedCount} files & build my report →` : "Analyze my transfers →"}
        </button>
      </div>
    </div>
  );
}

function ResultsStep({ data, onSubmit }) {
  const [tab, setTab] = useState("summary");
  const months = data.activeMonths || 0;
  const badge = months >= 12 ? { label: "🏅 12-Month Champion", color: C.gold } : months >= 6 ? { label: "⭐ 6-Month Achiever", color: C.green } : months >= 3 ? { label: "🌱 Getting Started", color: C.navyLight } : null;
  return (
    <div><StepBar current={2} />
      <div style={card}>
        <div style={{ background: C.greenPale, border: `1.5px solid ${C.green}`, borderRadius: 10, padding: "1rem 1.25rem", marginBottom: "1.5rem", fontFamily: ff.sans, color: C.green, fontWeight: "bold", fontSize: 14, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>✓</span><span>Your transfer history has been analyzed and is ready for credit reporting</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: "0.25rem" }}>
          <h2 style={{ fontSize: 20, fontWeight: "bold", color: C.navy, margin: 0, fontFamily: ff.serif }}>{data.userName}'s CrossCredit Report</h2>
          {badge && <span style={{ fontSize: 12, background: badge.color, color: C.white, borderRadius: 20, padding: "4px 12px", fontFamily: ff.sans, fontWeight: "bold" }}>{badge.label}</span>}
        </div>
        <p style={{ fontSize: 13, color: C.midGray, fontFamily: ff.sans, margin: "0 0 1.5rem" }}>{data.period} · {data.providers} · Sending to: {data.countries}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: "1.5rem" }}>
          {[
            { value: `$${Number(data.totalSent).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, label: "Total sent" },
            { value: `${data.delivered} of ${data.totalTransactions}`, label: "Delivered transfers" },
            { value: `${data.activeMonths} months`, label: "Active period" },
            { value: `${Math.round(data.successRate)}%`, label: "Success rate" },
          ].map((m, i) => (
            <div key={i} style={{ background: C.gray, borderRadius: 10, padding: "1rem", textAlign: "center", border: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 22, fontWeight: "bold", color: C.navy, display: "block", fontFamily: ff.serif }}>{m.value}</span>
              <span style={{ fontSize: 12, color: C.midGray, fontFamily: ff.sans, marginTop: 4, display: "block" }}>{m.label}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: "1.25rem" }}>
          {["summary","transactions"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "6px 16px", borderRadius: 20, fontSize: 13, fontFamily: ff.sans, cursor: "pointer", border: `1.5px solid ${tab === t ? C.navy : C.border}`, background: tab === t ? C.navy : C.white, color: tab === t ? C.white : C.midGray, fontWeight: tab === t ? "bold" : "normal" }}>
              {t === "summary" ? "Summary" : "Transactions"}
            </button>
          ))}
        </div>
        {tab === "summary" && (
          <div>
            {(data.indicators || []).map((ind, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "0.75rem 0", fontFamily: ff.sans, borderBottom: i < (data.indicators.length - 1) ? `1px solid ${C.border}` : "none" }}>
                <span style={{ color: C.green, fontSize: 18, flexShrink: 0, marginTop: 1 }}>✓</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: "bold", color: C.dark }}>{ind.title}</div>
                  <div style={{ fontSize: 12, color: C.midGray, marginTop: 2, lineHeight: 1.5 }}>{ind.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === "transactions" && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: ff.sans }}>
              <thead><tr>{["Date","Recipient","Amount","Method","Status"].map(h => <th key={h} style={{ background: C.navy, color: C.white, padding: "8px 10px", textAlign: "left", fontSize: 11 }}>{h}</th>)}</tr></thead>
              <tbody>
                {(data.transactions || []).map((tx, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? C.white : C.gray }}>
                    <td style={{ padding: "7px 10px", borderBottom: `1px solid ${C.border}`, color: C.dark }}>{tx.date}</td>
                    <td style={{ padding: "7px 10px", borderBottom: `1px solid ${C.border}`, color: C.dark }}>{tx.recipient}</td>
                    <td style={{ padding: "7px 10px", borderBottom: `1px solid ${C.border}`, color: C.dark }}>${Number(tx.amount).toFixed(2)}</td>
                    <td style={{ padding: "7px 10px", borderBottom: `1px solid ${C.border}`, color: C.dark }}>{tx.method}</td>
                    <td style={{ padding: "7px 10px", borderBottom: `1px solid ${C.border}`, color: tx.status === "Delivered" ? C.green : C.midGray, fontWeight: "bold" }}>{tx.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ marginTop: "1.75rem", background: C.navy, borderRadius: 10, padding: "1.25rem" }}>
          <div style={{ fontSize: 14, fontWeight: "bold", color: C.white, fontFamily: ff.sans, marginBottom: 6 }}>Ready to submit to eCredable?</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontFamily: ff.sans, lineHeight: 1.6, marginBottom: "1rem" }}>By submitting, you authorize CrossCredit to send this report to eCredable for credit bureau reporting. Results typically appear within 30–60 days.</div>
          <button style={{ ...btnStyle(C.green), marginTop: 0, fontSize: 15 }} onClick={onSubmit}>Submit my report to eCredable →</button>
        </div>
      </div>
    </div>
  );
}

function SubmissionStep({ data }) {
  const submitted = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const expected = new Date(Date.now() + 45 * 86400000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const timeline = [
    { status: "Submitted", date: submitted, done: true, desc: "Your report has been sent to eCredable." },
    { status: "Processing", date: "3–5 business days", done: false, desc: "eCredable verifies and formats your data." },
    { status: "Reported", date: "7–14 days", done: false, desc: "Data is sent to Experian, Equifax, and TransUnion." },
    { status: "Credit Updated", date: `~${expected}`, done: false, desc: "Your credit file reflects your remittance history." },
  ];
  return (
    <div><StepBar current={3} />
      <div style={card}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
          <h2 style={{ fontSize: 24, fontWeight: "bold", color: C.navy, margin: "0 0 0.5rem", fontFamily: ff.serif }}>Report Submitted!</h2>
          <p style={{ fontSize: 14, color: C.midGray, fontFamily: ff.sans, lineHeight: 1.6 }}>Congratulations {data.userName}. Your remittance history is now on its way to the credit bureaus. You are building a financial future — one transfer at a time.</p>
        </div>
        <div style={{ marginBottom: "1.75rem" }}>
          <div style={{ fontSize: 13, fontWeight: "bold", color: C.navy, fontFamily: ff.sans, marginBottom: "1rem" }}>Your submission timeline</div>
          {timeline.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 14, marginBottom: 16, alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: step.done ? C.green : C.gray, border: `2px solid ${step.done ? C.green : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: step.done ? C.white : C.midGray }}>{step.done ? "✓" : ""}</div>
                {i < timeline.length - 1 && <div style={{ width: 2, height: 24, background: step.done ? C.green : C.border, marginTop: 4 }} />}
              </div>
              <div style={{ paddingTop: 4 }}>
                <div style={{ fontSize: 14, fontWeight: "bold", color: step.done ? C.green : C.dark, fontFamily: ff.sans }}>{step.status}</div>
                <div style={{ fontSize: 11, color: C.midGray, fontFamily: ff.sans, marginBottom: 2 }}>{step.date}</div>
                <div style={{ fontSize: 12, color: C.midGray, fontFamily: ff.sans }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: C.gray, borderRadius: 10, padding: "1rem", fontFamily: ff.sans, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 13, fontWeight: "bold", color: C.navy, marginBottom: 8 }}>📊 Submission summary</div>
          {[["Report ID",`CC-${Date.now().toString().slice(-6)}`],["Total sent",`$${Number(data.totalSent).toLocaleString()}`],["Transfers reported",`${data.delivered} delivered`],["Active months",`${data.activeMonths} months`],["Providers reported", data.providers || ""],["Countries",data.countries || ""],["Submitted to","eCredable → Credit Bureaus"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "5px 0", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ color: C.midGray }}>{k}</span>
              <span style={{ color: C.dark, fontWeight: "bold" }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "1.5rem", background: C.navy, borderRadius: 10, padding: "1.25rem", textAlign: "center" }}>
          <div style={{ fontSize: 14, color: C.white, fontFamily: ff.sans, fontWeight: "bold", marginBottom: 6 }}>Know someone like you?</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontFamily: ff.sans, marginBottom: "1rem" }}>Help a friend turn their remittances into credit. Share CrossCredit with your community.</div>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: "0.6rem 1rem", fontSize: 13, color: C.goldLight, fontFamily: ff.sans, fontWeight: "bold" }}>crosscredit.io — Build credit by sending home</div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [user, setUser] = useState(null);
  const [reportData, setReportData] = useState(null);
  return (
    <>
    <style>{`
      @keyframes ccDotPulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.3; transform: scale(0.6); }
      }
      @keyframes ccTaglineGlow {
        0%, 100% { opacity: 0.55; letter-spacing: 0.18em; }
        50% { opacity: 1; letter-spacing: 0.22em; }
      }
    `}</style>
    <div style={{ fontFamily: ff.serif, minHeight: "100vh", background: C.gray }}>
      <nav style={{ background: C.navyDark, padding: "0 2rem", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `3px solid ${C.gold}` }}>
        <div onClick={() => setScreen("landing")} style={{ cursor: "pointer" }}>
          <span style={{ fontSize: 22, fontWeight: "bold", letterSpacing: 1, fontFamily: ff.serif }}>
            <span style={{ color: C.white }}>Cross</span><span style={{ color: C.green }}>Credit</span>
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 1 }}>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 9, fontFamily: ff.sans, letterSpacing: "0.18em" }}>SEND MONEY</span>
            <span style={{ color: C.green, fontSize: 5, display: "inline-block", animation: "ccDotPulse 2.2s ease-in-out infinite" }}>●</span>
            <span style={{ color: C.goldLight, fontSize: 9, fontFamily: ff.sans, animation: "ccTaglineGlow 3s ease-in-out infinite" }}>BUILD CREDIT</span>
          </span>
        </div>
        {screen !== "landing" && (
          <button onClick={() => setScreen("landing")} style={{ background: "transparent", color: C.white, border: `1px solid rgba(255,255,255,0.3)`, borderRadius: 6, padding: "6px 14px", fontFamily: ff.sans, fontSize: 13, cursor: "pointer" }}>← Home</button>
        )}
      </nav>
      {screen === "landing"   && <LandingPage onStart={() => setScreen("signup")} />}
      {screen === "signup"    && <SignupStep onNext={u => { setUser(u); setScreen("upload"); }} />}
      {screen === "upload"    && <UploadStep user={user} onNext={d => { setReportData(d); setScreen("results"); }} />}
      {screen === "results"   && <ResultsStep data={reportData} onSubmit={() => setScreen("submitted")} />}
      {screen === "submitted" && <SubmissionStep data={reportData} />}
    </div>
    </>
  );
}