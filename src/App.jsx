import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

const TYPES = {
  wish: { label: "願い", emoji: "🌟", color: "#c8a96e", hint: "宇宙に放つ" },
  joy: { label: "嬉しかったこと", emoji: "✨", color: "#9b7fd4", hint: "感謝として放つ" },
  granted: { label: "叶ったこと", emoji: "💫", color: "#6db8d4", hint: "報告する" },
};

function randomPos() {
  return { x: 5 + Math.random() * 90, y: 5 + Math.random() * 55 };
}

function BackgroundStars() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {Array.from({ length: 80 }).map((_, i) => (
        <div
          key={`bg-${i}`}
          style={{
            position: "absolute",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: 1 + Math.random() * 1.5,
            height: 1 + Math.random() * 1.5,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.3)",
            animation: `twinkle ${2 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 4}s`,
          }}
        />
      ))}
    </div>
  );
}

function ShootingStars({ shootingStars }) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {shootingStars.map((ss) => (
        <div
          key={ss.id}
          style={{
            position: "absolute",
            left: `${ss.x}%`,
            top: `${ss.y}%`,
            fontSize: 18,
            animation: "shootingStar 1.2s ease-out forwards",
            filter: "drop-shadow(0 0 12px #c8a96e)",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
          }}
        >
          🌠
        </div>
      ))}
    </div>
  );
}

function WishStarShape({ type }) {
  if (type === "wish") {
    return (
      <div style={{
        width: 10, height: 10,
        borderRadius: "50%",
        background: "white",
        boxShadow: `0 0 4px 2px white, 0 0 12px 4px #c8a96e, 0 0 28px 8px rgba(200,169,110,0.4), 0 0 50px 14px rgba(200,169,110,0.15)`,
        animation: `twinkle ${3 + Math.random() * 3}s ease-in-out infinite`,
      }} />
    );
  }
  if (type === "joy") {
    return (
      <div style={{ position: "relative", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", width: "100%", height: 1.5, background: "linear-gradient(to right, transparent, #c9b8f0, transparent)", borderRadius: 4, opacity: 0.7 }} />
        <div style={{ position: "absolute", width: 1.5, height: "100%", background: "linear-gradient(to bottom, transparent, #c9b8f0, transparent)", borderRadius: 4, opacity: 0.7 }} />
        <div style={{ position: "absolute", width: 22, height: 1, background: "linear-gradient(to right, transparent, rgba(155,127,212,0.5), transparent)", transform: "rotate(45deg)" }} />
        <div style={{ position: "absolute", width: 22, height: 1, background: "linear-gradient(to right, transparent, rgba(155,127,212,0.5), transparent)", transform: "rotate(-45deg)" }} />
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "white", boxShadow: "0 0 6px 2px rgba(155,127,212,0.9), 0 0 14px 5px rgba(155,127,212,0.4)", animation: `twinkle ${3 + Math.random() * 3}s ease-in-out infinite` }} />
      </div>
    );
  }
  if (type === "granted") {
    return (
      <div style={{ position: "relative", width: 40, height: 40, animation: `twinkle ${3 + Math.random() * 3}s ease-in-out infinite` }}>
        {[
          { width: 5, height: 36, margin: "-18px 0 0 -2.5px", background: "linear-gradient(to bottom, transparent, white 40%, white 60%, transparent)" },
          { width: 36, height: 5, margin: "-2.5px 0 0 -18px", background: "linear-gradient(to right, transparent, white 40%, white 60%, transparent)" },
          { width: 3, height: 22, margin: "-11px 0 0 -1.5px", background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.6) 50%, transparent)", transform: "rotate(45deg)" },
          { width: 3, height: 22, margin: "-11px 0 0 -1.5px", background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.6) 50%, transparent)", transform: "rotate(-45deg)" },
        ].map((st, i) => (
          <span key={i} style={{ position: "absolute", top: "50%", left: "50%", display: "block", borderRadius: "50%", filter: "blur(0.5px)", ...st }} />
        ))}
        <span style={{ position: "absolute", top: "50%", left: "50%", width: 5, height: 5, margin: "-2.5px 0 0 -2.5px", borderRadius: "50%", background: "white", boxShadow: "0 0 6px 3px rgba(109,184,212,0.9), 0 0 16px 6px rgba(109,184,212,0.4)" }} />
      </div>
    );
  }
  return null;
}

function StarDetail({ star, onClose }) {
  if (!star) return null;
  const typeInfo = TYPES[star.type];
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.5)",
        animation: "fadeInBg 0.3s ease-out",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(135deg, rgba(30,20,50,0.98), rgba(20,10,40,0.98))",
          border: `1px solid ${typeInfo.color}44`,
          borderRadius: 20,
          padding: "28px 28px 24px",
          maxWidth: 300,
          width: "85%",
          textAlign: "center",
          boxShadow: `0 0 40px ${typeInfo.color}22`,
          animation: "popIn 0.3s ease-out",
        }}
      >
        <div style={{ fontSize: 24, marginBottom: 12 }}>{typeInfo.emoji}</div>
        <div style={{ color: typeInfo.color, fontSize: 10, letterSpacing: 3, marginBottom: 16, opacity: 0.7 }}>
          {typeInfo.label.toUpperCase()}
        </div>
        <div style={{
          color: "rgba(255,255,255,0.85)",
          fontFamily: "'Noto Serif JP', serif",
          fontSize: 15,
          lineHeight: 1.8,
          marginBottom: 16,
        }}>
          {star.text}
        </div>
        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginBottom: 20 }}>
          {star.date}
        </div>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: `1px solid ${typeInfo.color}44`,
            borderRadius: 20,
            color: `${typeInfo.color}99`,
            padding: "6px 24px",
            fontSize: 11,
            cursor: "pointer",
            fontFamily: "'Noto Serif JP', serif",
          }}
        >
          閉じる
        </button>
      </div>
    </div>
  );
}

function MatchMessage({ messages, onDismiss }) {
  if (!messages.length) return null;
  const msg = messages[0];
  return (
    <div
      style={{
        position: "fixed",
        bottom: 100,
        left: "50%",
        transform: "translateX(-50%)",
        background: "linear-gradient(135deg, rgba(30,20,50,0.97), rgba(20,10,40,0.97))",
        border: "1px solid rgba(200,169,110,0.5)",
        borderRadius: 16,
        padding: "20px 28px",
        maxWidth: 320,
        textAlign: "center",
        zIndex: 100,
        animation: "fadeInUp 0.6s ease-out",
        boxShadow: "0 0 40px rgba(200,169,110,0.2)",
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 8 }}>🌠</div>
      <div style={{ color: "#c8a96e", fontFamily: "'Noto Serif JP', serif", fontSize: 13, lineHeight: 1.8 }}>
        {msg.date}に<br />願ってたのかも
      </div>
      <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 8, lineHeight: 1.6 }}>
        よかったね
      </div>
      <button
        onClick={onDismiss}
        style={{
          marginTop: 16,
          background: "transparent",
          border: "1px solid rgba(200,169,110,0.4)",
          borderRadius: 20,
          color: "rgba(200,169,110,0.8)",
          padding: "6px 20px",
          fontSize: 11,
          cursor: "pointer",
          fontFamily: "'Noto Serif JP', serif",
        }}
      >
        ありがとう
      </button>
    </div>
  );
}

export default function WishUniverse() {
  const [stars, setStars] = useState([]);
  const [input, setInput] = useState("");
  const [type, setType] = useState("wish");
  const [launching, setLaunching] = useState(false);
  const [shootingStars, setShootingStars] = useState([]);
  const [matchMessages, setMatchMessages] = useState([]);
  const [checking, setChecking] = useState(false);
  const [selectedStar, setSelectedStar] = useState(null);
  const inputRef = useRef();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("wish_universe_stars").select("*");
      if (data) setStars(data);
    };
    load();
  }, []);

  const checkMatch = useCallback(async (newEntry) => {
    if (newEntry.type !== "granted") return;
    const wishes = stars.filter((s) => s.type === "wish");
    if (!wishes.length) return;

    setChecking(true);
    try {
      const wishTexts = wishes.map((w, i) => `${i + 1}. [${w.date}] ${w.text}`).join("\n");
      const prompt = `以下の「願い」リストと「叶ったこと」が意味的に近いものがあるか確認してください。叶ったこと：「${newEntry.text}」\n\n願いリスト：\n${wishTexts}\n\n最も近い願いの番号を1つだけ返してください。近いものがなければ「0」を返してください。数字のみ回答。`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );
      const json = await res.json();
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "0";
      const num = parseInt(text);
      if (num > 0 && wishes[num - 1]) {
        const matched = wishes[num - 1];
        const ssId = Date.now();
        setShootingStars((prev) => [...prev, { id: ssId, x: matched.x, y: matched.y }]);
        setTimeout(() => setShootingStars((prev) => prev.filter((s) => s.id !== ssId)), 2000);
        setTimeout(() => {
          setMatchMessages((prev) => [...prev, { id: ssId, date: matched.date }]);
        }, 800);
      }
    } catch {}
    setChecking(false);
  }, [stars]);

  const launch = async () => {
    if (!input.trim() || launching) return;
    setLaunching(true);

    const pos = randomPos();
    const dateStr = new Date().toLocaleDateString("ja-JP", { month: "long", day: "numeric" });
    const newStar = {
      type,
      text: input.trim(),
      date: dateStr,
      x: pos.x,
      y: pos.y,
    };

    const { data, error } = await supabase.from("wish_universe_stars").insert([newStar]).select();
    if (data) {
      setStars((prev) => [...prev, data[0]]);
      checkMatch(data[0]);
    }
    setInput("");
    setLaunching(false);
  };

  return (
    <div
      className="wish-app"
      style={{
        background: "radial-gradient(ellipse at 30% 20%, #0d0820 0%, #040210 50%, #000008 100%)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Noto Serif JP', serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;500&display=swap');
        .wish-app {
          height: 100vh;
          height: 100dvh;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.4; transform: translate(-50%,-50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%,-50%) scale(1.3); }
        }
        @keyframes starAppear {
          from { opacity: 0; transform: translate(-50%,-50%) scale(0); }
          to { opacity: 0.85; transform: translate(-50%,-50%) scale(1); }
        }
        @keyframes shootingStar {
          from { opacity: 1; transform: translate(-50%,-50%) scale(1) rotate(-30deg); }
          to { opacity: 0; transform: translate(80px, 60px) scale(0.3) rotate(-30deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes fadeInBg {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes launch {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.4) translateY(-8px); }
          100% { opacity: 0; transform: scale(0.2) translateY(-40px); }
        }
        textarea:focus { outline: none; }
        textarea::placeholder { color: rgba(255,255,255,0.2); }
        textarea { resize: none; }
        .type-btn { transition: all 0.2s ease; }
        .type-btn:hover { opacity: 1 !important; }
        .wish-star { cursor: pointer; }
        .wish-star:active { opacity: 0.7; }
      `}</style>

      <BackgroundStars />
      <ShootingStars shootingStars={shootingStars} />

      {/* Interactive wish stars */}
      {stars.map((s) => (
        <div
          key={s.id}
          className="wish-star"
          onClick={() => setSelectedStar(s)}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            transform: "translate(-50%, -50%)",
            animation: `starAppear 0.8s ease-out both`,
            zIndex: 5,
            padding: 12,
            margin: -12,
          }}
        >
          <WishStarShape type={s.type} />
        </div>
      ))}

      <div style={{ position: "relative", zIndex: 2, textAlign: "center", paddingTop: 40, paddingBottom: 8 }}>
        <div style={{ color: "rgba(200,169,110,0.5)", fontSize: 10, letterSpacing: 4 }}>
          U N I V E R S E
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 400, padding: "0 20px", paddingBottom: "calc(40px + env(safe-area-inset-bottom))" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, justifyContent: "center" }}>
          {Object.entries(TYPES).map(([key, val]) => (
            <button
              key={key}
              className="type-btn"
              onClick={() => setType(key)}
              style={{
                background: type === key ? `rgba(${key === "wish" ? "200,169,110" : key === "joy" ? "155,127,212" : "109,184,212"},0.15)` : "transparent",
                border: `1px solid ${type === key ? val.color : "rgba(255,255,255,0.1)"}`,
                borderRadius: 20,
                color: type === key ? val.color : "rgba(255,255,255,0.3)",
                padding: "5px 14px",
                fontSize: 11,
                cursor: "pointer",
                fontFamily: "'Noto Serif JP', serif",
                opacity: type === key ? 1 : 0.6,
              }}
            >
              {val.emoji} {val.label}
            </button>
          ))}
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "14px 16px", marginBottom: 12 }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={TYPES[type].hint + "…"}
            rows={3}
            style={{ width: "100%", background: "transparent", border: "none", color: "rgba(255,255,255,0.8)", fontSize: 14, fontFamily: "'Noto Serif JP', serif", lineHeight: 1.7, boxSizing: "border-box" }}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) launch(); }}
          />
        </div>

        <button
          onClick={launch}
          disabled={!input.trim() || launching || checking}
          style={{
            width: "100%",
            padding: "14px",
            background: input.trim() && !launching ? `linear-gradient(135deg, ${TYPES[type].color}22, ${TYPES[type].color}44)` : "rgba(255,255,255,0.03)",
            border: `1px solid ${input.trim() && !launching ? TYPES[type].color + "66" : "rgba(255,255,255,0.06)"}`,
            borderRadius: 12,
            color: input.trim() && !launching ? TYPES[type].color : "rgba(255,255,255,0.2)",
            fontSize: 13,
            fontFamily: "'Noto Serif JP', serif",
            cursor: input.trim() && !launching ? "pointer" : "default",
            letterSpacing: 2,
            transition: "all 0.3s ease",
            animation: launching ? "launch 0.6s ease-out" : "none",
          }}
        >
          {checking ? "確認中…" : launching ? TYPES[type].emoji : "宇宙へ放つ"}
        </button>
      </div>

      <MatchMessage messages={matchMessages} onDismiss={() => setMatchMessages((prev) => prev.slice(1))} />
      <StarDetail star={selectedStar} onClose={() => setSelectedStar(null)} />
    </div>
  );
}
