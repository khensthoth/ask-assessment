import React, { useState, useCallback, useEffect } from "react";

// ═══════════════════════════════════════════════════════
// HERBAL CARE ASK ASSESSMENT v2.1 — Standalone Build
// localStorage for persistence (works on any hosting)
// ═══════════════════════════════════════════════════════

const ATTITUDE_QUESTIONS = [
  { id: "a01", care: "Care 关怀", label: "Empathy towards colleagues\n对同事有同理心",
    desc: "When a colleague makes a mistake or faces difficulty, tries to understand rather than blame.\n当同事犯错或遇到困难时，尝试理解而不是责怪。" },
  { id: "a02", care: "Care 关怀", label: "Willingness to help others\n愿意帮助他人",
    desc: "Proactively helps colleagues when busy, absent, or struggling — without being asked.\n同事忙碌或遇困难时主动帮忙，不需要被要求。" },
  { id: "a03", care: "Care 关怀", label: "Respects others' boundaries\n尊重他人的界限",
    desc: "Understands others have their own tasks and limits. Doesn't take advantage.\n理解别人也有工作和极限，不利用乐于助人的同事。" },
  { id: "a04", care: "Care 关怀", label: "Cares about customer experience\n关心顾客体验",
    desc: "Thinks about how their work affects the customer — packing, accuracy, response time, quality.\n考虑工作如何影响顾客——包装、准确性、回复速度、品质。" },
  { id: "a05", care: "Authenticity 真实", label: "Honest about mistakes\n对错误诚实",
    desc: "Admits errors openly and works to fix them — doesn't hide, deny, or blame.\n坦诚承认错误并改正，不隐瞒、否认或责怪他人。" },
  { id: "a06", care: "Authenticity 真实", label: "Communicates truthfully\n沟通真实",
    desc: "Says what they mean clearly. Doesn't exaggerate, gossip, or spread misinformation.\n表达清楚，不夸大、不八卦、不传播不实信息。" },
  { id: "a07", care: "Authenticity 真实", label: "Consistent behaviour\n言行一致",
    desc: "Behaves the same whether the boss is watching or not.\n无论老板在不在，表现一致。" },
  { id: "a08", care: "Authenticity 真实", label: "Handles conflict openly\n公开处理冲突",
    desc: "Addresses disagreements directly and calmly rather than complaining behind backs.\n与同事有分歧时直接冷静沟通，而不是背后抱怨。" },
  { id: "a09", care: "Responsibility 责任", label: "Completes tasks with follow-through\n做事有始有终",
    desc: "Sees tasks through to completion and reports back. Doesn't leave things half-done.\n完成任务并汇报，不半途而废。" },
  { id: "a10", care: "Responsibility 责任", label: "Takes ownership of problems\n对问题负责",
    desc: "Takes responsibility when problems occur — doesn't push to others or say it's not their job.\n出现问题时主动承担，不推卸说「不是我的事」。" },
  { id: "a11", care: "Responsibility 责任", label: "Punctual and reliable\n准时可靠",
    desc: "Arrives on time consistently. Delivers on promises by agreed time.\n一贯准时，答应的事按时完成。" },
  { id: "a12", care: "Responsibility 责任", label: "Manages time well\n善于管理时间",
    desc: "Prioritises tasks. Finishes important work first. Doesn't procrastinate.\n排列优先级，先完成重要工作，不拖延。" },
  { id: "a13", care: "Responsibility 责任", label: "Returns items, cleans workspace\n物品归位，保持整洁",
    desc: "Returns tools and materials to proper place. Keeps workspace organised.\n工具材料用后放回原位，保持工作区整洁。" },
  { id: "a14", care: "Excellence 卓越", label: "Self-driven and proactive\n自动自发",
    desc: "Doesn't wait to be told. Sees what needs doing and does it. Asks for more when finished.\n不等吩咐，主动做事，完成后主动询问其他任务。" },
  { id: "a15", care: "Excellence 卓越", label: "Suggests improvements\n提出改进建议",
    desc: "Thinks about better, faster, cheaper ways. Offers practical suggestions.\n思考更好更快更省的方法，提出实际建议。" },
  { id: "a16", care: "Excellence 卓越", label: "Checks own work quality\n检查自己的工作",
    desc: "Reviews output before passing it on. Catches errors before they reach others.\n交接前检查工作，在错误传递前发现问题。" },
  { id: "a17", care: "Excellence 卓越", label: "Thinks beyond own task\n不只想到自己的任务",
    desc: "Considers how their work affects other departments and the company overall.\n考虑自己的工作如何影响其他部门和公司整体。" },
  { id: "a18", care: "Excellence 卓越", label: "Positive work attitude\n积极的工作态度",
    desc: "Maintains professional attitude. Doesn't let personal moods affect colleagues.\n保持专业态度，不让个人情绪影响同事。" },
];

const SKILL_QUESTIONS = [
  { id: "s01", cat: "Independent 独立", label: "Completes daily tasks without supervision\n无需监督完成日常工作",
    desc: "Once trained, carries out duties reliably without needing reminders.\n经过培训后可靠地完成工作，不需要提醒。" },
  { id: "s02", cat: "Independent 独立", label: "Handles routine problems independently\n独立处理常见问题",
    desc: "Resolves common issues without escalating every time.\n能自行解决常见问题，不必每次都上报。" },
  { id: "s03", cat: "Tools 工具", label: "Proficient with required tools/systems\n熟练使用所需工具和系统",
    desc: "Uses job tools (Lark, AutoCount, equipment) without frequent help.\n使用工作工具不需要频繁帮助。" },
  { id: "s04", cat: "Tools 工具", label: "Adapts to new tools and methods\n适应新工具和方法",
    desc: "Willing and able to learn new systems within reasonable time.\n愿意并能在合理时间内学会新系统。" },
  { id: "s05", cat: "Coordination 协调", label: "Coordinates well across departments\n跨部门协调良好",
    desc: "Communicates clearly with other zones. Passes info accurately and on time.\n与其他区域沟通清晰，准确及时传递信息。" },
  { id: "s06", cat: "Coordination 协调", label: "Follows instructions accurately\n准确执行指示",
    desc: "Carries out instructions correctly without frequent misunderstandings.\n正确执行指示，不经常误解。" },
  { id: "s07", cat: "Problem Solving 解决问题", label: "Identifies root causes\n能找到根本原因",
    desc: "Thinks about WHY problems happen and how to prevent — not just fix.\n思考问题为什么发生以及如何预防。" },
  { id: "s08", cat: "Problem Solving 解决问题", label: "Stays calm under pressure\n压力下保持冷静",
    desc: "Works effectively when busy or stressed without panicking.\n忙碌有压力时仍能有效工作，不恐慌。" },
  { id: "s09", cat: "Guiding 指导", label: "Can teach or train a colleague\n能教导同事",
    desc: "Explains tasks clearly enough for a new person to follow. Patient.\n清楚解释工作让新人能跟上，有耐心。" },
  { id: "s10", cat: "Guiding 指导", label: "Shares knowledge openly\n公开分享知识",
    desc: "Doesn't hoard useful info. Helps others learn so the team improves.\n不藏知识，帮助他人学习让团队进步。" },
  { id: "s11", cat: "Quality 品质", label: "Work output is accurate\n工作成果准确",
    desc: "Makes few errors. Others can trust their work is done correctly.\n很少出错，他人可信赖其工作正确。" },
  { id: "s12", cat: "Quality 品质", label: "Consistent daily performance\n日常表现稳定",
    desc: "Delivers reliable work every day, not just on good days.\n每天都交付可靠的工作，而不只是状态好的时候。" },
];

const KNOWLEDGE_QUESTIONS = [
  { id: "k01", cat: "Role 岗位", label: "Knows their job and why it matters\n知道工作内容及其重要性",
    desc: "Can explain their role and how it contributes to the company.\n能解释自己的角色及其对公司的贡献。" },
  { id: "k02", cat: "Role 岗位", label: "Understands zone responsibilities\n了解区域职责",
    desc: "Knows what their zone is accountable for and how it connects to others.\n知道所在区域负责什么及如何与其他区域联系。" },
  { id: "k03", cat: "SOP 流程", label: "Knows relevant SOPs\n了解相关SOP",
    desc: "Understands and follows standard procedures. Knows where to find SOPs.\n理解并遵循标准流程，知道在哪找SOP。" },
  { id: "k04", cat: "SOP 流程", label: "Understands quality/safety standards\n了解品质和安全标准",
    desc: "Knows quality expectations (packaging, hygiene, Halal/MeSTI, accuracy).\n了解品质要求（包装、卫生、Halal/MeSTI、准确性）。" },
  { id: "k05", cat: "Product 产品", label: "Understands products/services\n了解产品和服务",
    desc: "Has working knowledge of what the company sells. Can answer simple questions.\n对公司产品有基本了解，能回答简单问题。" },
  { id: "k06", cat: "Product 产品", label: "Knows product handling requirements\n了解产品处理要求",
    desc: "Understands storage, handling, packing. Knows which need special care.\n了解储存、处理、包装要求，知道哪些需特别注意。" },
  { id: "k07", cat: "Systems 系统", label: "Can use company systems\n能使用公司系统",
    desc: "Navigates Lark (messaging, leave, tasks) and other role systems without constant help.\n能使用Lark及岗位相关系统，不需经常求助。" },
  { id: "k08", cat: "Systems 系统", label: "Knows company rules and policies\n了解公司规则和政策",
    desc: "Knows basic rules: leave, working hours, reporting structure, confidentiality.\n了解基本规则：请假、工时、汇报结构、保密。" },
  { id: "k09", cat: "Growth 成长", label: "Actively learns new things\n主动学习新事物",
    desc: "Seeks new skills and knowledge. Doesn't only rely on what they already know.\n主动学习，不只依赖已有知识。" },
  { id: "k10", cat: "Growth 成长", label: "Keeps up with company changes\n跟上公司变化",
    desc: "When procedures change, adapts — doesn't cling to the old way.\n流程变化时努力适应，不死守「旧方法」。" },
];

const SCORE_META = {
  1: { tip: "Very Poor 很差", color: "#C62828", bg: "#FFEBEE" },
  2: { tip: "Below 低于预期", color: "#E65100", bg: "#FFF3E0" },
  3: { tip: "Basic 基本", color: "#F9A825", bg: "#FFFDE7" },
  4: { tip: "Good 良好", color: "#2E7D32", bg: "#E8F5E9" },
  5: { tip: "Excellent 优秀", color: "#1B5E20", bg: "#C8E6C9" },
};

const STAFF_LIST = [
  "TWL — Warehouse Supervisor",
  "TTS — Inventory & QC Lead",
  "NTQ — Inventory & QC Exec",
  "LSH — Production Lead",
  "OGL — Production Lead (Asst)",
  "TNK — Production Assistant",
  "FSK — Production Assistant",
  "CSL — Production Assistant",
  "KHK — Production Assistant",
  "TYS — Production Assistant",
  "CCY — Fulfilment Lead",
  "TKH — Fulfilment Clerk",
  "CSP — Fulfilment Clerk",
  "Mizi — Eng. & Maintenance",
  "HES — Sales & Procurement Mgr",
  "BTL — B2B Sales Exec",
  "KHT — B2B Sales Exec",
  "WLY — B2B Sales Exec",
  "THY — Marketplace & Web Sales",
  "SCY — Procurement Exec",
  "SWY — Accounting & Finance",
  "Atikah — Digital Marketing",
  "TCW (Dean) — Asst. Mgr Ops",
  "— Other —",
];

const ALL_Q = [...ATTITUDE_QUESTIONS, ...SKILL_QUESTIONS, ...KNOWLEDGE_QUESTIONS];

// ── HELPERS ──
function calcResults(scores) {
  const avg = (qs) => { const v = qs.map(q => scores[q.id]).filter(Boolean); return v.length === qs.length ? v.reduce((a,b)=>a+b,0)/v.length : null; };
  const aAvg = avg(ATTITUDE_QUESTIONS), sAvg = avg(SKILL_QUESTIONS), kAvg = avg(KNOWLEDGE_QUESTIONS);
  const done = aAvg !== null && sAvg !== null && kAvg !== null;
  const w = done ? aAvg*0.5 + sAvg*0.25 + kAvg*0.25 : null;
  return { aAvg, sAvg, kAvg, weighted: w, done };
}

function getVerdict(w) {
  if (w >= 4.2) return { t: "\u2B50 HIGH POTENTIAL \u9AD8\u6F5C\u529B", c: "#1B5E20", a: "Invest & develop. Priority for promotion." };
  if (w >= 3.5) return { t: "\u2705 SOLID \u7A33\u5B9A", c: "#2E7D32", a: "Good contributor. Identify development areas." };
  if (w >= 2.8) return { t: "\u26A0\uFE0F DEVELOP \u9700\u57F9\u517B", c: "#E65100", a: "90-day development plan. Re-assess." };
  if (w >= 2.0) return { t: "\uD83D\uDD34 AT RISK \u9AD8\u98CE\u9669", c: "#D32F2F", a: "30-Day Reset. Consider not confirming if probation." };
  return { t: "\u274C EXIT \u4E0D\u7B26", c: "#B71C1C", a: "Plan respectful transition." };
}

function getProbation(w, a) {
  if (a !== null && a < 2.5) return { t: "\u274C DO NOT CONFIRM \u4E0D\u4E88\u786E\u8BA4", c: "#B71C1C" };
  if (w >= 3.5) return { t: "\u2705 CONFIRM \u786E\u8BA4", c: "#1B5E20" };
  if (w >= 2.8) return { t: "\u23F3 EXTEND \u5EF6\u957F\u8BD5\u7528", c: "#E65100" };
  return { t: "\u274C DO NOT CONFIRM \u4E0D\u4E88\u786E\u8BA4", c: "#D32F2F" };
}

function generateTextReport(entry) {
  const v = getVerdict(entry.weighted);
  const p = getProbation(entry.weighted, entry.aAvg);
  let txt = `\u2550\u2550\u2550 HERBAL CARE ASK REPORT \u2550\u2550\u2550\n`;
  txt += `Employee: ${entry.name}\nAssessor: ${entry.assessor}\nDate: ${entry.date}\n\n`;
  txt += `A (Attitude 50%): ${entry.aAvg.toFixed(2)}\nS (Skills 25%):   ${entry.sAvg.toFixed(2)}\nK (Knowledge 25%):${entry.kAvg.toFixed(2)}\n`;
  txt += `WEIGHTED SCORE:   ${entry.weighted.toFixed(2)} / 5.00\n\n`;
  txt += `VERDICT: ${v.t}\n${v.a}\nPROBATION: ${p.t}\n`;
  if (entry.scores) {
    txt += `\n--- Detail ---\n`;
    txt += `[ATTITUDE]\n`;
    ATTITUDE_QUESTIONS.forEach(q => { txt += `${entry.scores[q.id]||"?"}/5 ${q.label.split("\n")[0]}\n`; });
    txt += `[SKILLS]\n`;
    SKILL_QUESTIONS.forEach(q => { txt += `${entry.scores[q.id]||"?"}/5 ${q.label.split("\n")[0]}\n`; });
    txt += `[KNOWLEDGE]\n`;
    KNOWLEDGE_QUESTIONS.forEach(q => { txt += `${entry.scores[q.id]||"?"}/5 ${q.label.split("\n")[0]}\n`; });
  }
  if (entry.notes) txt += `\nNotes: ${entry.notes}\n`;
  return txt;
}

// ── Storage helpers (localStorage for standalone) ──
function loadData() {
  try { return JSON.parse(localStorage.getItem("hc-ask-data") || "[]"); } catch { return []; }
}
function saveData(data) {
  try { localStorage.setItem("hc-ask-data", JSON.stringify(data)); } catch {}
}
function loadAssessor() {
  try { return localStorage.getItem("hc-ask-assessor") || ""; } catch { return ""; }
}
function saveAssessor(name) {
  try { localStorage.setItem("hc-ask-assessor", name); } catch {}
}

function copyTextToClipboard(text) {
  const fallback = () => {
    try {
      const el = document.createElement("textarea");
      el.value = text;
      el.setAttribute("readonly", "");
      el.style.position = "fixed";
      el.style.top = "0";
      el.style.left = "0";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.focus();
      el.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(el);
      return ok;
    } catch {
      return false;
    }
  };

  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => fallback());
  }

  return Promise.resolve(fallback());
}

function safeFilenamePart(value) {
  const s = String(value ?? "").replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").replace(/\s+/g, " ").trim();
  return s.length ? s.slice(0, 80) : "export";
}

function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── COMPONENTS ──
function ScoreBtn({ value, selected, onClick }) {
  const s = SCORE_META[value];
  return (
    <button onClick={() => onClick(value)} title={s.tip} style={{
      width:38, height:38, borderRadius:8,
      border: selected ? `3px solid ${s.color}` : "1.5px solid #D0D0D0",
      background: selected ? s.bg : "#FAFAFA",
      color: selected ? s.color : "#BDBDBD",
      fontWeight: selected ? 800 : 600, fontSize:15,
      cursor:"pointer", transition:"all 0.12s",
      transform: selected ? "scale(1.1)" : "scale(1)", flexShrink:0,
    }}>{value}</button>
  );
}

function QRow({ item, score, onScore }) {
  const [en, cn] = item.label.split("\n");
  const [descEn, descCn] = item.desc.split("\n");
  return (
    <div style={{
      padding:"10px 12px", marginBottom:5, borderRadius:8,
      background: score ? `${SCORE_META[score].bg}50` : "#FAFAFA",
      border: `1px solid ${score ? SCORE_META[score].color+"20" : "#EEE"}`,
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, flexWrap:"wrap" }}>
        <div style={{ flex:1, minWidth:180 }}>
          <div style={{ fontWeight:700, fontSize:13, color:"#212121" }}>{en}</div>
          {cn && <div style={{ fontWeight:600, fontSize:12, color:"#1B5E20" }}>{cn}</div>}
          <div style={{ fontSize:11, color:"#757575", lineHeight:1.4, marginTop:2 }}>{descEn}</div>
          {descCn && <div style={{ fontSize:11, color:"#388E3C", lineHeight:1.4 }}>{descCn}</div>}
        </div>
        <div style={{ display:"flex", gap:4, flexShrink:0 }}>
          {[1,2,3,4,5].map(v => <ScoreBtn key={v} value={v} selected={score===v} onClick={onScore}/>)}
        </div>
      </div>
    </div>
  );
}

function Section({ title, titleCn, icon, color, weight, groups, scores, onScore }) {
  const ids = groups.flatMap(g => g.items.map(i => i.id));
  const ct = ids.filter(id => scores[id]).length;
  const avg = ct === ids.length && ids.length > 0 ? ids.reduce((s,id) => s+scores[id],0)/ids.length : null;
  return (
    <div style={{ marginBottom:20, padding:"16px 14px 12px", borderRadius:12, background:"#FFF", border:`1px solid ${color}18` }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <div>
          <div style={{ fontSize:14, fontWeight:800, color }}>{icon} {title} <span style={{ fontWeight:500, fontSize:12 }}>({titleCn})</span></div>
          <div style={{ fontSize:10, color:"#9E9E9E" }}>Weight: {weight}% — {ct}/{ids.length}</div>
        </div>
        {avg !== null && (
          <div style={{ background:`${color}10`, border:`2px solid ${color}`, borderRadius:8, padding:"4px 10px", textAlign:"center" }}>
            <div style={{ fontSize:18, fontWeight:800, color }}>{avg.toFixed(2)}</div>
          </div>
        )}
      </div>
      {groups.map(g => (
        <div key={g.label}>
          <div style={{ fontSize:10, fontWeight:700, color:"#616161", textTransform:"uppercase", letterSpacing:0.8, margin:"8px 0 4px", borderLeft:`3px solid ${color}`, paddingLeft:8 }}>{g.label}</div>
          {g.items.map(item => <QRow key={item.id} item={item} score={scores[item.id]} onScore={v => onScore(item.id, v)}/>)}
        </div>
      ))}
    </div>
  );
}

// ── MAIN ──
export default function App() {
  const [staff, setStaff] = useState("");
  const [customName, setCustomName] = useState("");
  const [assessor, setAssessor] = useState(() => loadAssessor());
  const [scores, setScores] = useState({});
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(() => loadData());
  const [view, setView] = useState("assess");
  const [copied, setCopied] = useState(false);

  useEffect(() => { saveData(saved); }, [saved]);
  useEffect(() => { saveAssessor(assessor); }, [assessor]);

  const handleScore = useCallback((id, v) => {
    setScores(prev => ({ ...prev, [id]: prev[id]===v ? undefined : v }));
  }, []);

  const name = staff === "\u2014 Other \u2014" ? customName : staff;
  const progress = ALL_Q.filter(q => scores[q.id]).length;
  const allDone = progress === ALL_Q.length;
  const results = calcResults(scores);
  const currentEntry = allDone && name ? {
    name, assessor: assessor || "Unknown",
    aAvg: results.aAvg, sAvg: results.sAvg, kAvg: results.kAvg,
    weighted: results.weighted, notes, scores: { ...scores },
    date: new Date().toLocaleDateString("en-MY"),
  } : null;

  const handleSave = () => {
    if (!name || !allDone) return;
    const entry = {
      name, assessor: assessor || "Unknown",
      aAvg: results.aAvg, sAvg: results.sAvg, kAvg: results.kAvg,
      weighted: results.weighted, notes, scores: {...scores},
      date: new Date().toLocaleDateString("en-MY"),
    };
    setSaved(prev => [...prev.filter(s => !(s.name === name && s.assessor === entry.assessor)), entry]);
    setScores({}); setNotes(""); setStaff(""); setCustomName("");
  };

  const handleCopy = (entry) => {
    const txt = generateTextReport(entry);
    copyTextToClipboard(txt).then((ok) => {
      if (!ok) return window.alert("Clipboard permission denied. Please select/copy manually, or allow clipboard access in your browser settings.");
      setCopied(entry.name);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadTxt = (entry) => {
    const filename = `${safeFilenamePart(entry.name)} - ${safeFilenamePart(entry.assessor)} - ${safeFilenamePart(entry.date)}.txt`;
    downloadTextFile(filename, generateTextReport(entry));
  };

  const handleCopyAll = () => {
    const sorted = [...saved].sort((a,b) => b.weighted - a.weighted);
    let txt = `HERBAL CARE \u2014 TEAM ASK SUMMARY\nDate: ${new Date().toLocaleDateString("en-MY")}\n\n`;
    txt += `#   Employee                 A     S     K     Score   Verdict\n`;
    txt += `${"─".repeat(70)}\n`;
    sorted.forEach((a, i) => {
      const v = getVerdict(a.weighted);
      txt += `${String(i+1).padEnd(4)}${a.name.substring(0,24).padEnd(25)}${a.aAvg.toFixed(1).padEnd(6)}${a.sAvg.toFixed(1).padEnd(6)}${a.kAvg.toFixed(1).padEnd(6)}${a.weighted.toFixed(2).padEnd(8)}${v.t}\n`;
    });
    copyTextToClipboard(txt).then((ok) => {
      if (!ok) return window.alert("Clipboard permission denied. Please select/copy manually, or allow clipboard access in your browser settings.");
      setCopied("all");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadAllTxt = () => {
    const sorted = [...saved].sort((a,b) => b.weighted - a.weighted);
    const txt = sorted.map(generateTextReport).join("\n\n" + "─".repeat(60) + "\n\n");
    const filename = `ASK Assessments - ${new Date().toLocaleDateString("en-MY").replaceAll("/", "-")}.txt`;
    downloadTextFile(filename, txt);
  };

  const handleReset = () => { if (window.confirm("Clear ALL data?")) setSaved([]); };

  const attGroups = [
    { label: "Care \u5173\u6000", items: ATTITUDE_QUESTIONS.filter(q => q.care === "Care \u5173\u6000") },
    { label: "Authenticity \u771F\u5B9E", items: ATTITUDE_QUESTIONS.filter(q => q.care === "Authenticity \u771F\u5B9E") },
    { label: "Responsibility \u8D23\u4EFB", items: ATTITUDE_QUESTIONS.filter(q => q.care === "Responsibility \u8D23\u4EFB") },
    { label: "Excellence \u5353\u8D8A", items: ATTITUDE_QUESTIONS.filter(q => q.care === "Excellence \u5353\u8D8A") },
  ];
  const skillGroups = [
    { label: "Independent \u72EC\u7ACB", items: SKILL_QUESTIONS.filter(q => q.cat.startsWith("Independent")) },
    { label: "Tools \u5DE5\u5177", items: SKILL_QUESTIONS.filter(q => q.cat.startsWith("Tools")) },
    { label: "Coordination \u534F\u8C03", items: SKILL_QUESTIONS.filter(q => q.cat.startsWith("Coordination")) },
    { label: "Problem Solving \u89E3\u51B3\u95EE\u9898", items: SKILL_QUESTIONS.filter(q => q.cat.startsWith("Problem")) },
    { label: "Guiding \u6307\u5BFC", items: SKILL_QUESTIONS.filter(q => q.cat.startsWith("Guiding")) },
    { label: "Quality \u54C1\u8D28", items: SKILL_QUESTIONS.filter(q => q.cat.startsWith("Quality")) },
  ];
  const knowGroups = [
    { label: "Role \u5C97\u4F4D", items: KNOWLEDGE_QUESTIONS.filter(q => q.cat.startsWith("Role")) },
    { label: "SOPs \u6D41\u7A0B", items: KNOWLEDGE_QUESTIONS.filter(q => q.cat.startsWith("SOP")) },
    { label: "Product \u4EA7\u54C1", items: KNOWLEDGE_QUESTIONS.filter(q => q.cat.startsWith("Product")) },
    { label: "Systems \u7CFB\u7EDF", items: KNOWLEDGE_QUESTIONS.filter(q => q.cat.startsWith("Systems")) },
    { label: "Growth \u6210\u957F", items: KNOWLEDGE_QUESTIONS.filter(q => q.cat.startsWith("Growth")) },
  ];

  // ── SUMMARY ──
  if (view === "summary") {
    const sorted = [...saved].sort((a,b) => b.weighted - a.weighted);
    return (
      <div style={{ maxWidth:800, margin:"0 auto", padding:"16px 12px", fontFamily:"'Noto Sans SC','Segoe UI',system-ui,sans-serif" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:8 }}>
          <h2 style={{ margin:0, fontSize:18, color:"#1B5E20" }}>📋 Team Dashboard</h2>
          <div style={{ display:"flex", gap:6 }}>
            <button onClick={handleDownloadAllTxt} style={{ padding:"7px 14px", borderRadius:8, border:"1px solid #616161", background:"white", color:"#424242", fontWeight:600, fontSize:12, cursor:"pointer" }}>
              ⬇ Export TXT
            </button>
            <button onClick={handleCopyAll} style={{ padding:"7px 14px", borderRadius:8, border:"1px solid #1B5E20", background:"white", color:"#1B5E20", fontWeight:600, fontSize:12, cursor:"pointer" }}>
              {copied === "all" ? "\u2713 Copied!" : "\uD83D\uDCCB Copy All"}
            </button>
            <button onClick={() => setView("assess")} style={{ padding:"7px 14px", borderRadius:8, border:"none", background:"#1B5E20", color:"white", fontWeight:600, fontSize:12, cursor:"pointer" }}>
              ← Back
            </button>
          </div>
        </div>
        {sorted.length === 0 ? <div style={{ padding:40, textAlign:"center", color:"#9E9E9E" }}>No assessments yet</div> : (
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
              <thead><tr style={{ background:"#1B5E20", color:"white" }}>
                {["#","Employee","By","A","S","K","Score","Verdict","Probation",""].map((h,i) => (
                  <th key={i} style={{ padding:"8px 6px", textAlign:i<3?"left":"center", fontSize:10 }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>{sorted.map((a, i) => {
                const v = getVerdict(a.weighted); const p = getProbation(a.weighted, a.aAvg);
                return (
                  <tr key={a.name+a.assessor} style={{ background:i%2===0?"#FAFAFA":"white", borderBottom:"1px solid #EEE" }}>
                    <td style={{ padding:"7px 6px", color:"#9E9E9E" }}>#{i+1}</td>
                    <td style={{ padding:"7px 6px", fontWeight:600, fontSize:11 }}>{a.name.split("\u2014")[0].trim()}</td>
                    <td style={{ padding:"7px 6px", fontSize:10, color:"#9E9E9E" }}>{a.assessor}</td>
                    <td style={{ padding:"7px 6px", textAlign:"center", color:a.aAvg<2.5?"#D32F2F":"#424242", fontWeight:a.aAvg<2.5?800:400 }}>{a.aAvg.toFixed(1)}</td>
                    <td style={{ padding:"7px 6px", textAlign:"center" }}>{a.sAvg.toFixed(1)}</td>
                    <td style={{ padding:"7px 6px", textAlign:"center" }}>{a.kAvg.toFixed(1)}</td>
                    <td style={{ padding:"7px 6px", textAlign:"center", fontWeight:800, color:v.c, fontSize:13 }}>{a.weighted.toFixed(2)}</td>
                    <td style={{ padding:"7px 6px", textAlign:"center", color:v.c, fontSize:10 }}>{v.t.split(" ")[0]}</td>
                    <td style={{ padding:"7px 6px", textAlign:"center", color:p.c, fontSize:10 }}>{p.t.split(" ")[0]}</td>
                    <td style={{ padding:"7px 6px" }}>
                      <div style={{ display:"flex", gap:6, justifyContent:"flex-end" }}>
                        <button onClick={() => handleDownloadTxt(a)} style={{ padding:"4px 8px", borderRadius:4, border:"1px solid #CCC", background:"white", fontSize:10, cursor:"pointer" }}>TXT</button>
                        <button onClick={() => handleCopy(a)} style={{ padding:"4px 8px", borderRadius:4, border:"1px solid #CCC", background:"white", fontSize:10, cursor:"pointer" }}>
                          {copied === a.name ? "\u2713" : "\uD83D\uDCCB"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
        )}
        <div style={{ marginTop:12, textAlign:"right" }}>
          <button onClick={handleReset} style={{ padding:"6px 12px", borderRadius:6, border:"1px solid #D32F2F", background:"white", color:"#D32F2F", fontSize:11, cursor:"pointer" }}>
            🗑 Clear All
          </button>
        </div>
      </div>
    );
  }

  // ── ASSESS ──
  return (
    <div style={{ maxWidth:700, margin:"0 auto", padding:"16px 12px", fontFamily:"'Noto Sans SC','Segoe UI',system-ui,sans-serif" }}>
      <div style={{ textAlign:"center", marginBottom:16 }}>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"#1B5E20" }}>Herbal Care 永联成</div>
        <h1 style={{ margin:"2px 0", fontSize:20, fontWeight:800, color:"#212121" }}>ASK Assessment v2.1</h1>
        <div style={{ fontSize:11, color:"#9E9E9E" }}>{ALL_Q.length} questions · A(50%) · S(25%) · K(25%)</div>
      </div>

      <div style={{ marginBottom:12, padding:12, borderRadius:10, background:"white", border:"1px solid #E0E0E0" }}>
        <div style={{ fontSize:10, fontWeight:700, color:"#1B5E20", textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Your Name 你的名字</div>
        <input type="text" value={assessor} onChange={e => setAssessor(e.target.value)} placeholder="e.g. Keith / Dean / TWL"
          style={{ width:"100%", padding:"8px 10px", borderRadius:8, border:"2px solid #E0E0E0", fontSize:13, boxSizing:"border-box" }} />
      </div>

      {saved.length > 0 && (
        <div style={{ textAlign:"center", marginBottom:12 }}>
          <button onClick={() => setView("summary")} style={{ padding:"9px 18px", borderRadius:10, border:"none", background:"#1B5E20", color:"white", fontWeight:700, fontSize:12, cursor:"pointer" }}>
            📋 Dashboard ({saved.length})
          </button>
        </div>
      )}

      <div style={{ marginBottom:14, padding:12, borderRadius:10, background:"white", border:"1px solid #E0E0E0" }}>
        <div style={{ fontSize:10, fontWeight:700, color:"#1B5E20", textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Employee 被评估员工</div>
        <select value={staff} onChange={e => { setStaff(e.target.value); setScores({}); setNotes(""); }}
          style={{ width:"100%", padding:"8px 10px", borderRadius:8, border:"2px solid #E0E0E0", fontSize:13, background:"white", cursor:"pointer" }}>
          <option value="">— Select 选择 —</option>
          {STAFF_LIST.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {staff === "\u2014 Other \u2014" && (
          <input type="text" placeholder="Name \u59D3\u540D..." value={customName} onChange={e => setCustomName(e.target.value)}
            style={{ width:"100%", padding:"8px 10px", borderRadius:8, border:"2px solid #1B5E20", fontSize:13, marginTop:6, boxSizing:"border-box" }} />
        )}
      </div>

      {name && (<>
        <div style={{ marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#9E9E9E", marginBottom:3 }}>
            <span>Assessing: <strong style={{ color:"#1B5E20" }}>{name.split("\u2014")[0].trim()}</strong></span>
            <span>{progress}/{ALL_Q.length} ({Math.round(progress/ALL_Q.length*100)}%)</span>
          </div>
          <div style={{ height:5, borderRadius:3, background:"#EEE", overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${progress/ALL_Q.length*100}%`, background: allDone?"#1B5E20":"#66BB6A", borderRadius:3, transition:"width 0.3s" }} />
          </div>
        </div>

        <div style={{ fontSize:10, color:"#BDBDBD", marginBottom:10, textAlign:"center" }}>
          1=Very Poor 很差 · 2=Below 低于预期 · 3=Basic 基本 · 4=Good 良好 · 5=Excellent 优秀
        </div>

        <Section title="ATTITUDE" titleCn="态度" icon="🌿" color="#1B5E20" weight={50} groups={attGroups} scores={scores} onScore={handleScore} />
        <Section title="SKILLS" titleCn="技能" icon="🔧" color="#1565C0" weight={25} groups={skillGroups} scores={scores} onScore={handleScore} />
        <Section title="KNOWLEDGE" titleCn="知识" icon="📚" color="#6A1B9A" weight={25} groups={knowGroups} scores={scores} onScore={handleScore} />

        <div style={{ marginBottom:14, padding:12, borderRadius:10, background:"white", border:"1px solid #E0E0E0" }}>
          <div style={{ fontSize:10, fontWeight:700, color:"#424242", textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>📝 Notes 备注</div>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Observations..." rows={2}
            style={{ width:"100%", padding:8, borderRadius:8, border:"1px solid #E0E0E0", fontSize:12, resize:"vertical", fontFamily:"inherit", boxSizing:"border-box" }} />
        </div>

        {results.done && (() => {
          const v = getVerdict(results.weighted); const p = getProbation(results.weighted, results.aAvg);
          return (
            <div style={{ padding:14, borderRadius:10, background:"white", border:`2px solid ${v.c}`, marginBottom:14 }}>
              <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap" }}>
                {[{l:"A",v:results.aAvg,c:"#1B5E20"},{l:"S",v:results.sAvg,c:"#1565C0"},{l:"K",v:results.kAvg,c:"#6A1B9A"}].map(x => (
                  <div key={x.l} style={{ flex:1, minWidth:70, textAlign:"center", padding:"6px 4px", borderRadius:8, background:`${x.c}08`, border:`1.5px solid ${x.c}` }}>
                    <div style={{ fontSize:18, fontWeight:800, color:x.c }}>{x.v.toFixed(2)}</div>
                    <div style={{ fontSize:9, color:"#757575" }}>{x.l}</div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign:"center", marginBottom:8 }}>
                <div style={{ fontSize:10, color:"#9E9E9E" }}>WEIGHTED SCORE</div>
                <div style={{ fontSize:28, fontWeight:800, color:v.c }}>{results.weighted.toFixed(2)}<span style={{ fontSize:12 }}> / 5</span></div>
              </div>
              <div style={{ padding:"8px 10px", borderRadius:8, background:v.c+"10", marginBottom:6 }}>
                <div style={{ fontSize:13, fontWeight:800, color:v.c }}>{v.t}</div>
                <div style={{ fontSize:11, color:"#424242" }}>{v.a}</div>
              </div>
              <div style={{ padding:"6px 10px", borderRadius:8, background:"#F5F5F5" }}>
                <span style={{ fontSize:10, color:"#9E9E9E" }}>Probation: </span>
                <span style={{ fontSize:12, fontWeight:700, color:p.c }}>{p.t}</span>
              </div>
            </div>
          );
        })()}

        {allDone && assessor && (
          <>
            {currentEntry && (
              <div style={{ display:"flex", gap:8, marginBottom:10 }}>
                <button onClick={() => handleDownloadTxt(currentEntry)} style={{ flex:1, padding:"10px 12px", borderRadius:10, border:"1px solid #616161", background:"white", color:"#424242", fontWeight:700, fontSize:13, cursor:"pointer" }}>
                  ⬇ Export TXT
                </button>
              </div>
            )}
            <button onClick={handleSave} style={{
              width:"100%", padding:"13px", borderRadius:10, border:"none",
              background:"#1B5E20", color:"white", fontWeight:700, fontSize:14, cursor:"pointer",
            }}>✅ Save & Next 保存并评下一个</button>
          </>
        )}
        {allDone && !assessor && (
          <div style={{ textAlign:"center", fontSize:12, color:"#E65100", fontWeight:600, padding:8 }}>
            ⚠️ Enter your name above first
          </div>
        )}
      </>)}

      <div style={{ marginTop:24, padding:"8px 12px", borderRadius:8, background:"#F5F5F5", fontSize:9, color:"#BDBDBD", lineHeight:1.5, textAlign:"center" }}>
        HCOS ASK Assessment v2.1 · Data saved in browser 数据保存在浏览器
      </div>
    </div>
  );
}
