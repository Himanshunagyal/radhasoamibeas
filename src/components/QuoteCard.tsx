import { useState } from 'react';

interface Quote { id: number; text: string; author: string; hi?: string; pa?: string; topic: string; }
interface Props { quote: Quote; lang?: 'en' | 'hi' | 'pa'; }

function generateQuoteCanvas(displayText: string, author: string, topic: string, id: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1080; canvas.height = 1080;
  const ctx = canvas.getContext('2d')!;

  const g = ctx.createLinearGradient(0, 0, 1080, 1080);
  g.addColorStop(0, '#5C0F0F'); g.addColorStop(0.5, '#8B1A1A'); g.addColorStop(1, '#A52020');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1080);

  ctx.strokeStyle = '#C8952A'; ctx.lineWidth = 10; ctx.strokeRect(28, 28, 1024, 1024);
  ctx.strokeStyle = 'rgba(200,149,42,0.3)'; ctx.lineWidth = 2; ctx.strokeRect(50, 50, 980, 980);

  // RSSB logo box
  ctx.fillStyle = 'white';
  ctx.beginPath(); (ctx as any).roundRect(490, 68, 100, 100, 8); ctx.fill();
  ctx.strokeStyle = '#C8952A'; ctx.lineWidth = 3; ctx.stroke();
  ctx.fillStyle = '#8B1A1A'; ctx.font = 'bold 28px Georgia, serif'; ctx.textAlign = 'center';
  ctx.fillText('RS', 540, 110); ctx.fillText('SB', 540, 145);

  // Title
  ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = '22px Georgia, serif'; ctx.textAlign = 'center';
  ctx.fillText('RADHA SOAMI SATSANG BEAS', 540, 205);

  // Divider with dots
  ctx.strokeStyle = '#C8952A'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(160, 225); ctx.lineTo(420, 225); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(660, 225); ctx.lineTo(920, 225); ctx.stroke();
  ctx.fillStyle = '#C8952A';
  ctx.beginPath(); ctx.arc(540, 225, 5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(510, 225, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(570, 225, 3, 0, Math.PI * 2); ctx.fill();

  // Big opening quote mark
  ctx.fillStyle = 'rgba(200,149,42,0.2)'; ctx.font = 'bold 200px Georgia, serif'; ctx.textAlign = 'left';
  ctx.fillText('\u201C', 55, 440);

  // Quote text
  const fontSize = displayText.length > 120 ? 34 : displayText.length > 80 ? 38 : 42;
  ctx.fillStyle = '#FFFFFF'; ctx.font = `italic ${fontSize}px Georgia, serif`; ctx.textAlign = 'center';
  const words = displayText.split(' '); const lines: string[] = []; let cur = '';
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(test).width > 820 && cur) { lines.push(cur); cur = w; } else cur = test;
  }
  if (cur) lines.push(cur);
  const lh = fontSize + 20; const totalH = lines.length * lh;
  const startY = 540 - totalH / 2 + fontSize / 2;
  ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 8;
  lines.forEach((line, i) => ctx.fillText(line, 540, startY + i * lh));
  ctx.shadowBlur = 0;

  // Closing quote mark
  ctx.fillStyle = 'rgba(200,149,42,0.2)'; ctx.font = 'bold 200px Georgia, serif'; ctx.textAlign = 'right';
  ctx.fillText('\u201D', 1020, startY + totalH + 80);

  // Bottom divider
  ctx.strokeStyle = '#C8952A'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(250, 840); ctx.lineTo(830, 840); ctx.stroke();

  // Author
  ctx.fillStyle = '#E8B84B'; ctx.font = 'italic bold 32px Georgia, serif'; ctx.textAlign = 'center';
  ctx.fillText(`\u2014 ${author}`, 540, 890);

  // Topic pill
  ctx.fillStyle = 'rgba(200,149,42,0.2)';
  ctx.beginPath(); (ctx as any).roundRect(440, 910, 200, 36, 18); ctx.fill();
  ctx.strokeStyle = 'rgba(200,149,42,0.5)'; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = '#E8B84B'; ctx.font = '18px sans-serif';
  ctx.fillText(`#${topic.toUpperCase()}`, 540, 934);

  // Watermark with URL
  ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.font = '20px sans-serif';
  ctx.fillText('🌐 rssb-devotional.vercel.app/quotes', 540, 985);

  return canvas;
}

export default function QuoteCard({ quote, lang = 'en' }: Props) {
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [aiQuote, setAiQuote] = useState<{ text: string; author: string; topic: string } | null>(null);
  const [generating, setGenerating] = useState(false);

  // ✅ All display variables defined first
  const baseText = aiQuote?.text || (lang === 'hi' ? (quote.hi || quote.text) : lang === 'pa' ? (quote.pa || quote.text) : quote.text);
  const displayText = baseText;
  const displayAuthor = aiQuote?.author || quote.author;
  const displayTopic = aiQuote?.topic || quote.topic;

  // ✅ getCanvas defined after display variables
  const getCanvas = () => generateQuoteCanvas(displayText, displayAuthor, displayTopic, quote.id);

  // ✅ handleDownload first — used as fallback below
  const handleDownload = () => {
    const canvas = getCanvas();
    const link = document.createElement('a');
    link.download = `rssb-quote-${quote.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/generate-quote');
      const data = await res.json();
      if (data.quote) {
        setAiQuote({ text: data.quote, author: data.author, topic: data.topic });
      }
    } catch { /* silently fail */ }
    finally { setGenerating(false); }
  };

  const handleShareImage = async () => {
    setSharing(true);
    try {
      const canvas = getCanvas();
      const blob = await new Promise<Blob>(res => canvas.toBlob(b => res(b!), 'image/png'));
      const file = new File([blob], `rssb-quote-${quote.id}.png`, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: `RSSB Quote — ${displayAuthor}` });
      } else {
        handleDownload();
      }
    } catch { handleDownload(); }
    finally { setSharing(false); }
  };

  const handleWhatsApp = async () => {
    setSharing(true);
    try {
      const canvas = getCanvas();
      const blob = await new Promise<Blob>(res => canvas.toBlob(b => res(b!), 'image/png'));
      const file = new File([blob], `rssb-quote-${quote.id}.png`, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file] });
      } else {
        handleDownload();
        setTimeout(() => {
          const text = encodeURIComponent(`🕉️ "${displayText}"\n\n— ${displayAuthor}\n\n🙏 Sat Naam`);
          window.open(`https://wa.me/?text=${text}`, '_blank');
        }, 800);
      }
    } finally { setSharing(false); }
  };

  const handleCopyText = async () => {
    await navigator.clipboard.writeText(`"${displayText}"\n\n— ${displayAuthor}\n\n🙏 Sat Naam`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const btnStyle = (bg: string, color: string): React.CSSProperties => ({
    background: bg, color, border: 'none', fontWeight: 700,
    padding: '0.5rem 1.1rem', borderRadius: '9999px', fontSize: '0.78rem',
    cursor: sharing || generating ? 'wait' : 'pointer',
    opacity: sharing || generating ? 0.7 : 1,
    whiteSpace: 'nowrap',
  });

  return (
    <div style={{ borderRadius: '1rem', overflow: 'hidden', border: '2px solid #C8952A', boxShadow: '0 8px 30px rgba(139,26,26,0.25)' }}>

      {/* Visual card preview */}
      <div style={{ background: 'linear-gradient(135deg,#5C0F0F,#8B1A1A,#A52020)', padding: '2.5rem 2rem', textAlign: 'center', position: 'relative', minHeight: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: 10, border: '1px solid rgba(200,149,42,0.3)', borderRadius: '0.5rem', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 12, left: 18, color: 'rgba(200,149,42,0.25)', fontSize: '6rem', fontFamily: 'Georgia,serif', lineHeight: 1 }}>"</div>
        <div style={{ position: 'absolute', bottom: 12, right: 18, color: 'rgba(200,149,42,0.25)', fontSize: '6rem', fontFamily: 'Georgia,serif', lineHeight: 1, transform: 'rotate(180deg)' }}>"</div>

        <div style={{ background: 'white', border: '2px solid #C8952A', borderRadius: '6px', padding: '4px 8px', marginBottom: '1rem' }}>
          <span style={{ color: '#8B1A1A', fontWeight: 'bold', fontSize: '11px', lineHeight: 1.2, display: 'block', textAlign: 'center' }}>RS<br />SB</span>
        </div>

        <p style={{ color: 'white', fontFamily: 'Georgia,serif', fontStyle: 'italic', fontSize: 'clamp(0.95rem,2.5vw,1.15rem)', lineHeight: 1.7, margin: '0 1rem 1rem', position: 'relative', zIndex: 1 }}>
          {displayText}
        </p>
        <div style={{ width: '60%', height: '1px', background: 'rgba(200,149,42,0.5)', margin: '0.5rem auto 0.75rem' }} />
        <p style={{ color: '#E8B84B', fontWeight: 600, fontSize: '0.9rem', fontFamily: 'Georgia,serif' }}>— {displayAuthor}</p>
        <span style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: 'rgba(200,149,42,0.8)', background: 'rgba(0,0,0,0.3)', padding: '2px 10px', borderRadius: '9999px', letterSpacing: '0.1em' }}>
          #{displayTopic.toUpperCase()}
        </span>

        {/* AI badge when showing generated quote */}
        {aiQuote && (
          <span style={{ marginTop: '0.5rem', fontSize: '0.65rem', color: '#E8B84B', background: 'rgba(200,149,42,0.2)', border: '1px solid rgba(200,149,42,0.4)', padding: '2px 10px', borderRadius: '9999px' }}>
            ✨ AI Generated
          </span>
        )}
      </div>

      {/* Action bar */}
      <div style={{ background: 'rgba(107,18,18,0.95)', padding: '0.75rem 1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', width: '100%', textAlign: 'center', marginBottom: '0.25rem' }}>Share as image 👇</span>
        <button onClick={handleGenerate}   style={btnStyle('rgba(255,255,255,0.9)', '#8B1A1A')} disabled={generating}>{generating ? '✨ Generating...' : '✨ New AI Quote'}</button>
        <button onClick={handleDownload}   style={btnStyle('#C8952A', '#6B1212')}>⬇ Download PNG</button>
        <button onClick={handleShareImage} style={btnStyle('white', '#8B1A1A')}    disabled={sharing}>📤 Share Image</button>
        <button onClick={handleWhatsApp}   style={btnStyle('#16a34a', 'white')}    disabled={sharing}>📱 WhatsApp</button>
        <button onClick={handleCopyText}   style={btnStyle('rgba(255,255,255,0.15)', 'white')}>{copied ? '✓ Copied' : '📋 Copy Text'}</button>
      </div>
    </div>
  );
}