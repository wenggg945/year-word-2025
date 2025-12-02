import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

import { Sparkles, Users, RotateCcw, Quote, Download, Send, X, BookOpen, Home } from 'lucide-react';

import { initializeApp } from 'firebase/app';

import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';

import { getFirestore, collection, addDoc, query, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';



// ============================================================================

// [MODULE 1] Config & Data

// ============================================================================



const firebaseConfig = {

apiKey: "AIzaSyDFZkTXyR9iISLb40Qw7jGN5I824YVyo3k",

authDomain: "year-word-2025.firebaseapp.com",

projectId: "year-word-2025",

storageBucket: "year-word-2025.firebasestorage.app",

messagingSenderId: "1:307095104144:web:bad8d2a2850d0de7db8615",

appId: "year-word-2025"

};



const appId = "year-word-2025";



const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const isFirebaseReady = true;



const REAL_TEMPLATE_BASE64 = "/year-word-2025.jpg";



const WORD_DB = [

{ char: "暖", meaning: "即使世界寒冷，你也能成為自己的太陽，溫暖他人。" },

{ char: "緩", meaning: "不用急著趕路，沿途的風景，才是時間給你的禮物。" },

{ char: "惜", meaning: "珍惜每一次相遇，因為有些人，見一面少一面。" },

{ char: "擁", meaning: "擁抱不完美的自己，是你今年最勇敢的決定。" },

{ char: "盼", meaning: "心裡有光，眼裡有海，生活就有了期待。" },

{ char: "靜", meaning: "在喧囂中守住內心的安寧，是最高級的修養。" },

{ char: "韌", meaning: "看似柔軟，實則堅不可摧。你比想像中更強大。" },

{ char: "癒", meaning: "傷口是光照進來的地方，你已經在慢慢變好了。" },

{ char: "歸", meaning: "走得再遠，也別忘了為什麼出發。歡迎回家。" },

{ char: "初", meaning: "世界再變，願你依然是那個眼神清澈的少年。" },

{ char: "綻", meaning: "你的花期或許來得晚一些，但開放時定會驚豔時光。" },

{ char: "捨", meaning: "放下過往的包袱，雙手空出來，才能接住未來的驚喜。" },

{ char: "沉", meaning: "沉澱下來，像樹紮根，是為了以後長得更高。" },

{ char: "信", meaning: "相信直覺，相信過程，所有的安排都是最好的安排。" },

{ char: "悅", meaning: "取悅自己，不是自私，而是終身浪漫的開始。" },

{ char: "容", meaning: "心寬一寸，路寬一丈。包容世界，也放過自己。" },

{ char: "誠", meaning: "真誠是通往人心最短的道路，你做到了。" },

{ char: "樸", meaning: "簡單生活，樸實無華，卻擁有了最純粹的快樂。" },

{ char: "聽", meaning: "傾聽內心的聲音，那是宇宙給你的指引。" },

{ char: "伴", meaning: "有人懂你的欲言又止，是這一年最大的幸運。" },

{ char: "旅", meaning: "人生是一場旅程，重要的不是目的地，而是看風景的心情。" },

{ char: "憩", meaning: "累了就停下來歇歇，休息是為了走更長遠的路。" },

{ char: "守", meaning: "守護好你愛的人和事，這是你溫柔的底線。" },

{ char: "恆", meaning: "堅持做一件小事，時間會給你最豐厚的回報。" },

{ char: "仰", meaning: "低頭趕路時，別忘了抬頭看看星空。" },

{ char: "淨", meaning: "清理圈子，清理雜念，讓生活回歸乾淨清爽。" },

{ char: "寬", meaning: "對人寬容，對己寬厚，日子會越過越舒坦。" },

{ char: "柔", meaning: "溫柔不是妥協，而是一種強大的力量。" },

{ char: "遇", meaning: "所有的相遇，都是久別重逢。" },

{ char: "敢", meaning: "去愛，去夢，去闖。趁年輕，趁現在。" },

{ char: "知", meaning: "知足常樂，知止不殆。你活得越來越通透了。" },

{ char: "行", meaning: "想，都是問題；做，才是答案。" },

{ char: "悟", meaning: "經歷過，才懂得。每一次跌倒都是一種領悟。" },

{ char: "簡", meaning: "大道至簡。把複雜的生活過得簡單，就是本事。" },

{ char: "厚", meaning: "厚積薄發，你的努力，時間都看在眼裡。" },

{ char: "雅", meaning: "優雅地老去，優雅地生活，不疾不徐。" },

{ char: "定", meaning: "心若定，風雨亦是風景。" },

{ char: "和", meaning: "和氣生財，和光同塵。你學會了與世界和解。" },

{ char: "樂", meaning: "快樂是自找的，別把鑰匙交給別人。" },

{ char: "善", meaning: "你的善良，自帶光芒，照亮了別人的路。" },

{ char: "真", meaning: "在這個充滿套路的世界，你的真實無比珍貴。" },

{ char: "美", meaning: "發現美，創造美，你本身就是一道風景。" },

{ char: "愛", meaning: "愛人如己。今年的你，學會了如何去愛。" },

{ char: "家", meaning: "家不是講理的地方，是講愛的地方。" },

{ char: "友", meaning: "朋友不在多，而在真。感恩身邊不離不棄的人。" },

{ char: "師", meaning: "三人行，必有我師。保持謙卑，持續學習。" },

{ char: "書", meaning: "讀書是門檻最低的高貴。你在書中找到了自己。" },

{ char: "茶", meaning: "人生如茶，沉時坦然，浮時淡然。" },

{ char: "酒", meaning: "微醺是最好的狀態，敬往事一杯，不問歸期。" },

{ char: "花", meaning: "心有猛虎，細嗅薔薇。你活出了剛柔並濟的美。" },

{ char: "風", meaning: "等風來，不如追風去。" },

{ char: "雲", meaning: "寵辱不驚，看庭前花開花落；去留無意，望天上雲卷雲舒。" },

{ char: "山", meaning: "像山一樣穩重，給身邊的人滿滿的安全感。" },

{ char: "水", meaning: "上善若水。你學會了順勢而為的智慧。" },

{ char: "光", meaning: "你就是光，無需憑藉誰的光亮。" },

{ char: "夢", meaning: "有夢想誰都了不起。堅持下去，夢想會開花。" },

{ char: "實", meaning: "腳踏實地，仰望星空。你的每一步都算數。" },

{ char: "忙", meaning: "忙碌是一種治癒，讓你沒時間矯情。" },

{ char: "閒", meaning: "偷得浮生半日閒。你學會了在忙碌中留白。" },

{ char: "得", meaning: "得之坦然，失之淡然。你的心態越來越好了。" },

{ char: "失", meaning: "失去是為了更好的擁有。別難過，前面有更好的在等你。" },

{ char: "進", meaning: "每天進步一點點，一年後就是巨大的飛躍。" },

{ char: "退", meaning: "退一步海闊天空。忍讓不是懦弱，是智慧。" },

{ char: "圓", meaning: "圓融不是圓滑，而是懂得分寸與包容。" },

{ char: "缺", meaning: "萬物皆有裂痕，那是光照進來的地方。" },

{ char: "新", meaning: "苟日新，日日新，又日新。擁抱變化，擁抱新生。" },

{ char: "舊", meaning: "衣不如新，人不如故。念舊的人最深情。" },

{ char: "快", meaning: "天下武功，唯快不破。你的執行力讓人佩服。" },

{ char: "慢", meaning: "慢慢來，比較快。你學會了享受過程。" },

{ char: "強", meaning: "內心強大。真正的強者，是含著淚依然奔跑的人。" },

{ char: "弱", meaning: "示弱是強者的特權。你學會了卸下鎧甲。" },

{ char: "富", meaning: "心靈的富足，才是真正的富有。" },

{ char: "貴", meaning: "人品貴重，勝過黃金萬兩。" },

{ char: "安", meaning: "心安即是歸處。願你歲歲平安。" },

{ char: "康", meaning: "健康是 1，其他是 0。你開始懂得照顧自己了。" },

{ char: "吉", meaning: "吉人自有天相。你的善良會為你帶來好運。" },

{ char: "祥", meaning: "瑞氣呈祥。好事正在發生的路上。" },

{ char: "喜", meaning: "歡喜心過生活，日子自然甜甜的。" },

{ char: "慧", meaning: "智慧增長，煩惱減少。你活得越來越明白了。" },

{ char: "慈", meaning: "慈悲為懷。你對這個世界充滿了溫柔。" },

{ char: "悲", meaning: "慈悲。懂得他人的苦，所以更加寬容。" },

{ char: "忍", meaning: "忍耐是為了積蓄力量，等待厚積薄發的一天。" },

{ char: "覺", meaning: "覺知當下。你開始專注於此時此刻。" },

{ char: "醒", meaning: "人間清醒。你看透了許多事，卻依然熱愛生活。" },

{ char: "空", meaning: "放空自己，才能裝進新的東西。" },

{ char: "滿", meaning: "知足常樂。你的心裡充滿了感恩。" },

{ char: "獨", meaning: "獨處是靈魂的盛宴。你享受與自己相處的時光。" },

{ char: "眾", meaning: "眾人拾柴火焰高。你懂得了合作的力量。" },

{ char: "變", meaning: "唯一不變的只有改變。你已經準備好迎接挑戰了。" },

{ char: "通", meaning: "窮則變，變則通。你的思維越來越靈活了。" },

{ char: "達", meaning: "豁達樂觀。沒什麼過不去的坎。" },

{ char: "透", meaning: "通透。你看清了世界的真相，依然選擇善良。" },

{ char: "狂", meaning: "人不輕狂枉少年。保持一點熱血與衝動吧！" },

{ char: "傲", meaning: "傲骨不可無。你有自己的原則和底線。" },

{ char: "謙", meaning: "謙受益，滿招損。你的謙虛讓你贏得了尊重。" },

{ char: "禮", meaning: "以禮待人。你的教養刻在骨子裡。" },

{ char: "敬", meaning: "敬畏生命，敬畏自然。你依然保持著一顆赤子之心。" },

{ char: "恕", meaning: "寬恕別人，就是釋放自己。" },

];



// ============================================================================

// [MODULE 2] Logic Hooks

// ============================================================================



const useCanvasGenerator = () => {
  const generateAndDownload = useCallback((word: string, meaning: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        alert('Canvas 初始化失敗');
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      // 先繪製背景圖
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // 計算位置
      const centerX = canvas.width / 2;
      const mainCharY = canvas.height * 0.35;
      const textStartY = canvas.height * 0.58;  // 調高一點，讓文字在引號中間

      // 繪製主要文字
      const mainFontSize = canvas.height * 0.18;
      ctx.fillStyle = '#3f1a08';
      ctx.font = `bold ${mainFontSize}px "Noto Serif TC", serif`;
      ctx.textAlign = 'center'; 
      ctx.textBaseline = 'middle';
      ctx.fillText(word, centerX, mainCharY);

      // 繪製說明文字
      const descFontSize = canvas.height * 0.027;  // 增大字體 (從 0.022 改為 0.027)
      ctx.fillStyle = '#5d4037';  // 咖啡色 (已經是正確的顏色)
      ctx.font = `400 ${descFontSize}px "Noto Serif TC", serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const maxWidth = canvas.width * 0.7;
      const lineHeight = canvas.height * 0.048;  // 增加行高配合更大的字
      
      // 智能斷行
      const sentences = meaning.split(/([，。、！？；：])/);
      let lines = [];
      let currentLine = '';
      
      for (let i = 0; i < sentences.length; i++) {
        const part = sentences[i];
        const testLine = currentLine + part;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && currentLine !== '') {
          lines.push(currentLine);
          currentLine = part;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        lines.push(currentLine);
      }

      // 計算起始 Y 位置，讓文字群組垂直置中在引號之間
      let y = textStartY - ((lines.length - 1) * lineHeight) / 2;
      
      lines.forEach(line => { 
        ctx.fillText(line.trim(), centerX, y); 
        y += lineHeight; 
      });

      // 下載圖片
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `2025歲月拾光_${word}.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        } else {
          alert('圖片生成失敗');
        }
      }, 'image/png');
    };
    
    img.onerror = () => {
      console.error('圖片載入失敗');
      alert('模板圖片載入失敗，請確認 public/year-word-2025.jpg 存在');
    };
    
    img.src = '/year-word-2025.jpg';
    
  }, []);
  
  return { generateAndDownload };
};



// ============================================================================

// [MODULE 3] UI Components

// ============================================================================



const PageWrapper = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (

<div className={`w-full min-h-[100dvh] flex flex-col relative z-10 overflow-y-auto overflow-x-hidden ${className}`}>

<div className="flex-grow flex flex-col items-center justify-center w-full max-w-md mx-auto p-6 py-12 my-auto">

{children}

</div>

</div>

);



const LandingView = ({ onStart }: { onStart: () => void }) => (

<PageWrapper>

<div className="space-y-8 text-center animate-fade-in w-full">

<div className="space-y-6">

<h2 className="text-amber-800/50 tracking-[0.6em] text-xs uppercase font-sans font-medium">ECHOES OF TIME</h2>

<div className="flex flex-col items-center gap-4 relative">

<h1 className="text-6xl md:text-8xl font-serif font-bold text-amber-950 tracking-wider drop-shadow-sm">歲月</h1>

<div className="w-16 h-1 bg-amber-400/50 my-2"></div>

<h1 className="text-6xl md:text-8xl font-serif font-bold text-amber-900 tracking-wider drop-shadow-sm">拾光</h1>

</div>

</div>

<p className="text-stone-600 leading-loose font-serif text-lg md:text-xl tracking-wide pt-4">

時間不語，卻回答了所有問題。<br/>回首過去這一年的點滴，<br/>總結過往，只為溫柔地前行。

</p>

<button onClick={onStart} className="group relative px-12 py-5 mt-8 bg-white/60 backdrop-blur-md border border-white/80 text-amber-900 font-serif text-xl rounded-2xl shadow-md hover:bg-white font-bold flex items-center gap-2 mx-auto hover:-translate-y-1 transition-all duration-300 hover:shadow-amber-200/50">

<Sparkles size={18} className="text-amber-600" /> 抽出我的 2025 關鍵字

</button>

</div>

</PageWrapper>

);



const DrawingView = () => (

<PageWrapper>

<div className="relative w-80 h-80 flex items-center justify-center">

<div className="absolute inset-0 bg-amber-200/40 rounded-full animate-ping opacity-20 duration-[3s]"></div>

<div className="absolute inset-10 bg-orange-100/50 rounded-full animate-pulse opacity-40"></div>

<div className="w-48 h-48 rounded-full bg-white/30 backdrop-blur-sm border border-white/50 shadow-lg flex items-center justify-center z-10">

{/* V48: Restore the "望" character as requested */}

<span className="text-9xl text-amber-900/80 font-serif animate-pulse pb-4 pl-1 select-none">望</span>

</div>

</div>

<p className="mt-8 text-stone-500 font-serif tracking-[0.3em] text-2xl animate-pulse">正在回望這一年...</p>

</PageWrapper>

);



const ResultView = ({ myWord, onDownload, onContribute, onRetry }: any) => (

<PageWrapper>

<div className="w-full max-w-[380px] bg-gradient-to-br from-[#fff7ed] via-[#fffbeb] to-[#fff1f2] backdrop-blur-md border-4 double border-amber-200/60 p-8 rounded-[2rem] shadow-[0_20px_50px_-10px_rgba(120,53,15,0.15)] flex flex-col items-center text-center space-y-6 animate-slide-up relative group">

<div className="absolute inset-4 border border-amber-500/10 rounded-[1.5rem] pointer-events-none"></div>

<div className="w-16 h-16 bg-amber-400/20 rounded-2xl flex items-center justify-center border border-amber-400/30 shadow-sm mt-2">

<div className="grid grid-cols-2 gap-1 text-base text-amber-900 font-serif leading-none font-bold">

<span>二</span><span>〇</span><span>二</span><span>五</span>

</div>

</div>

<div className="relative py-2 flex-1 flex items-center justify-center">

<div className="text-[10rem] leading-none font-serif text-amber-950 select-none drop-shadow-sm font-bold">{myWord?.char}</div>

</div>

<div className="relative px-2 w-full">

<Quote className="absolute -top-3 -left-1 w-5 h-5 text-amber-400/40 fill-current" />

<p className="text-amber-900/90 text-xl font-medium leading-relaxed font-serif tracking-wide text-balance">{myWord?.meaning}</p>

<Quote className="absolute -bottom-3 -right-1 w-5 h-5 text-amber-400/40 fill-current transform rotate-180" />

</div>

<div className="w-full h-px bg-gradient-to-r from-transparent via-amber-900/10 to-transparent my-2"></div>

<div className="flex flex-col w-full gap-3 z-20 pb-2">

<button onClick={onDownload} className="w-full py-4 bg-amber-900 text-amber-50 rounded-2xl hover:bg-amber-800 transition-all flex items-center justify-center gap-3 font-serif tracking-widest shadow-lg text-lg font-bold hover:-translate-y-1 duration-300 shadow-amber-900/20"><Download size={20} /> 收藏結果</button>

<div className="grid grid-cols-2 gap-3 w-full mt-2">

<button onClick={onContribute} className="py-4 px-2 rounded-xl border border-stone-200 bg-white/50 hover:bg-white hover:border-amber-300 hover:text-amber-800 text-stone-600 text-sm font-bold shadow-sm transition-all hover:-translate-y-0.5">投稿專屬字</button>

<button onClick={onRetry} className="py-4 px-2 rounded-xl border border-stone-200 bg-white/50 hover:bg-white hover:border-amber-300 hover:text-amber-800 text-stone-600 text-sm font-bold shadow-sm flex items-center justify-center gap-1 transition-all hover:-translate-y-0.5"><RotateCcw size={14} /> 重抽</button>

</div>

</div>

</div>

</PageWrapper>

);



const ContributeView = ({ word, reason, setWord, setReason, onSubmit, onClose, onSkip }: any) => {
  const isComposing = useRef(false);
  // V50: Toggle placeholder on focus
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isTextAreaFocused, setIsTextAreaFocused] = useState(false);

  return (
    <PageWrapper>
      <div className="absolute top-6 right-6 z-20">
        <button onClick={onClose} className="p-3 bg-white/40 rounded-full text-stone-500 hover:text-stone-800 transition-colors backdrop-blur-sm"><X size={24} /></button>
      </div>
      <div className="w-full max-w-md space-y-8 animate-fade-in relative z-10">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-serif font-bold tracking-wider text-amber-950">由你定義</h2>
          <p className="text-stone-600 text-base font-serif font-light leading-relaxed">如果要你自己選，<span className="text-amber-700 font-bold border-b border-amber-300 pb-0.5">什麼字</span> 能總結你的這一年？</p>
        </div>
        <div className="space-y-6 bg-white/60 p-8 rounded-[2rem] border border-white/60 backdrop-blur-md shadow-xl">
          <div className="relative">
            <input 
              type="text"
              onCompositionStart={() => isComposing.current = true}
              onCompositionEnd={(e) => {
                isComposing.current = false;
                const val = e.currentTarget.value;
                setWord(val.slice(-1));
              }}
              onChange={(e) => {
                const val = e.target.value;
                if (isComposing.current) { setWord(val); } 
                else { setWord(val.slice(-1)); }
              }}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              value={word}
              className="w-full bg-transparent border-b-2 border-amber-100 p-4 text-center text-7xl font-serif text-amber-900 focus:border-amber-400 focus:outline-none transition-all placeholder-amber-900/10"
              placeholder={isInputFocused ? "" : "？"}
            />
            <div className="text-center mt-2 text-xs text-amber-800/40 tracking-wider h-4"><span>僅取一字</span></div>
          </div>
          <div className="relative">
            <textarea 
              value={reason} 
              onChange={(e) => setReason(e.target.value)} 
              maxLength={200} 
              onFocus={() => setIsTextAreaFocused(true)}
              onBlur={() => setIsTextAreaFocused(false)}
              className="w-full bg-white/50 border border-white/50 rounded-xl p-6 text-stone-700 focus:bg-white/80 focus:border-amber-300 focus:outline-none h-32 transition-all placeholder-stone-400 resize-none leading-relaxed font-serif text-center" 
              placeholder={isTextAreaFocused ? "" : "寫下你的故事 (200字內)..."} 
            />
            <div className="absolute bottom-2 right-4 text-[10px] text-stone-400">{reason.length}/200</div>
          </div>
        </div>
        <div className="flex gap-4 pt-2 font-serif justify-center">
          <button onClick={onSkip} className="px-4 py-4 text-stone-400 hover:text-stone-600 transition-colors text-xs tracking-widest whitespace-nowrap">一起回顧彼此的 2025 專屬文字</button>
          <button onClick={onSubmit} disabled={!word.trim()} className={`px-8 py-4 bg-amber-900 text-white rounded-xl flex items-center justify-center gap-2 text-sm tracking-widest hover:bg-amber-800 shadow-lg transition-all hover:-translate-y-0.5 duration-300 ${(!word.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}>確認發布 <Send size={16} /></button>
        </div>
      </div>
    </PageWrapper>
  );
};

const GalleryView = ({ words, myWordData, onHome, totalCount, userUid }: any) => {

const [selectedGroup, setSelectedGroup] = useState<any>(null);



const groupedWords = useMemo(() => {

const groups: {[key: string]: {word: string, count: number, stories: any[]}} = {};

if (myWordData && myWordData.word) {

groups[myWordData.word] = {

word: myWordData.word,

count: 1,

stories: [{...myWordData, isMe: true}]

};

}

words.forEach((item: any) => {

if (!groups[item.word]) {

groups[item.word] = { word: item.word, count: 0, stories: [] };

}

const isMe = userUid && item.userId === userUid;

if (isMe && myWordData && myWordData.word === item.word) {

// do nothing

} else {

groups[item.word].count += 1;

if (item.reason) {

groups[item.word].stories.push({...item, isMe});

}

}

});

return Object.values(groups).sort((a, b) => b.count - a.count);

}, [words, myWordData, userUid]);



return (

<div className="min-h-[100dvh] flex flex-col relative z-10">

<div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-amber-100 px-6 py-4 flex justify-between items-center shadow-sm">

<div className="flex flex-col items-start">

<h2 className="text-lg font-serif font-bold flex items-center gap-2 text-amber-950 tracking-widest">

<Users size={18} className="text-amber-600"/>

回顧彼此的 2025

</h2>

<span className="text-[10px] text-amber-800/60 font-sans tracking-wider ml-7">

共有 {totalCount} 人投稿

</span>

</div>

<button

onClick={onHome}

className="group flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-white px-4 py-2 rounded-full border border-amber-200 shadow-sm hover:bg-amber-50 hover:border-amber-300 transition-all active:scale-95 hover:shadow-md"

>

<Home size={14} className="text-amber-600" /> 回首頁

</button>

</div>

<div className="flex-1 p-6 pb-24 overflow-y-auto custom-scrollbar">

<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 animate-fade-in">
  {groupedWords.map((group: any, i: number) => (
    <div key={i} onClick={() => setSelectedGroup(group)} className="group relative aspect-[3/4] bg-white/60 backdrop-blur-md rounded-2xl p-3 flex flex-col items-center justify-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-white/60 overflow-hidden">
      <div className="absolute inset-0 border-[3px] border-amber-50 rounded-2xl pointer-events-none"></div>
      <span className="text-4xl font-serif font-bold text-amber-950/80 group-hover:text-amber-800 transition-colors duration-300">{group.word}</span>
      {group.count > 0 && (
        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-amber-100/80 px-2 py-1 rounded-full">
          <Users size={12} className="text-amber-600" />
          <span className="text-[10px] font-bold text-amber-900">{group.count}</span>
        </div>
      )}
    </div>
  ))}
</div>

</div>

{selectedGroup && (

<div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-amber-950/60 backdrop-blur-md animate-fade-in" onClick={() => setSelectedGroup(null)}>

<div className="bg-[#fffdf5] w-full max-w-sm max-h-[80vh] rounded-[2rem] shadow-2xl flex flex-col border-4 border-[#e6cfa0] relative overflow-hidden" onClick={e => e.stopPropagation()}>

<div className="flex-shrink-0 p-6 border-b border-amber-100 flex justify-between items-center bg-white/50">

<div className="flex items-center gap-4">

<div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-amber-100 text-2xl font-serif font-bold text-amber-900">{selectedGroup.word}</div>

<div><div className="text-xs text-stone-400 uppercase tracking-wider font-bold">STORIES</div><div className="text-sm text-amber-800 font-bold">{selectedGroup.stories.length} 則故事</div></div>

</div>

<button onClick={() => setSelectedGroup(null)} className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"><X size={20} /></button>

</div>

<div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#fffdf5]">

{selectedGroup.stories.length > 0 ? (

selectedGroup.stories.map((story: any, idx: number) => (

<div key={idx} className="flex gap-3 animate-slide-up" style={{animationDelay: `${idx * 0.1}s`}}>

<div className="flex-shrink-0 mt-1"><Quote size={14} className="text-amber-300 fill-current" /></div>

<div className={`p-4 rounded-2xl rounded-tl-none shadow-sm border text-sm leading-relaxed font-serif w-full ${story.isMe ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-white border-amber-50 text-stone-600'}`}>

{story.reason}

{story.isMe && <div className="mt-2 text-[10px] text-amber-400 font-bold text-right">- 你的投稿 -</div>}

</div>

</div>

))

) : (

<div className="py-12 text-center text-stone-400 text-sm italic">大家選擇了沈默，<br/>或許「{selectedGroup.word}」本身就是千言萬語。</div>

)}

</div>

<div className="h-6 bg-gradient-to-t from-[#fffdf5] to-transparent pointer-events-none flex-shrink-0"></div>

</div>

</div>

)}

</div>

);

};



// ============================================================================

// [MAIN] App Controller

// ============================================================================



export default function App() {

const [view, setView] = useState<'landing' | 'drawing' | 'result' | 'contribute' | 'gallery'>('landing');

const [myWord, setMyWord] = useState<{char: string, meaning: string} | null>(null);

const [userWordInput, setUserWordInput] = useState('');

const [userReasonInput, setUserReasonInput] = useState('');

const [isSubmitting, setIsSubmitting] = useState(false);

const [communityWords, setCommunityWords] = useState<any[]>([]);

const [user, setUser] = useState<any>(null);


const { generateAndDownload } = useCanvasGenerator();



useEffect(() => { if(!isFirebaseReady || !auth) return; const init = async () => { if(typeof __initial_auth_token !== 'undefined' && __initial_auth_token) await signInWithCustomToken(auth, __initial_auth_token); else await signInAnonymously(auth); }; init(); onAuthStateChanged(auth, setUser); }, []);


useEffect(() => {

if(!isFirebaseReady || !db || !user) return;

const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'user_words_2025_v50'), limit(300));

const unsubscribe = onSnapshot(q, (s) => {

const words = s.docs.map(doc => ({ id: doc.id, ...doc.data() }));

setCommunityWords(words);

});

return () => unsubscribe();

}, [user]);



const handleDraw = () => {

setUserWordInput('');

setUserReasonInput('');

setView('drawing');

setTimeout(() => {

setMyWord(WORD_DB[Math.floor(Math.random() * WORD_DB.length)]);

setView('result');

}, 2500);

};


const handleSubmit = async () => {

if (!userWordInput.trim()) return;

setIsSubmitting(true);

try {

const wordToSave = userWordInput.trim().substring(0, 1);

if (isFirebaseReady && db && user) {

await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'user_words_2025_v50'), {

word: wordToSave, reason: userReasonInput.trim().substring(0, 200), timestamp: serverTimestamp(), userId: user.uid, isSystemGenerated: false

});

}

setView('gallery');

} catch (e) { alert("Error"); } finally { setIsSubmitting(false); }

};



const totalCount = communityWords.length + (userWordInput && !communityWords.some((w:any)=>w.userId===user?.uid) ? 1 : 0);

const myWordData = userWordInput ? { word: userWordInput, reason: userReasonInput } : null;



return (

<div className="font-sans text-stone-800 bg-[#fff7ed] min-h-[100dvh] w-full relative overflow-y-auto overflow-x-hidden">

<div className="fixed inset-0 z-0 pointer-events-none">

<div className="absolute top-0 -left-4 w-96 h-96 bg-orange-200/60 rounded-full mix-blend-multiply filter blur-[96px] opacity-70 animate-blob"></div>

<div className="absolute top-0 -right-4 w-96 h-96 bg-amber-200/60 rounded-full mix-blend-multiply filter blur-[96px] opacity-70 animate-blob animation-delay-2000"></div>

<div className="absolute -bottom-8 left-20 w-96 h-96 bg-rose-200/60 rounded-full mix-blend-multiply filter blur-[96px] opacity-70 animate-blob animation-delay-4000"></div>

<div className="absolute bottom-1/2 right-1/2 w-96 h-96 bg-yellow-200/60 rounded-full mix-blend-multiply filter blur-[96px] opacity-60 animate-blob animation-delay-2000"></div>

</div>

<style>{`

@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;700;900&family=Noto+Sans+TC:wght@300;400;500&display=swap');

body { font-family: 'Noto Sans TC', sans-serif; margin: 0; }

.font-serif { font-family: 'Noto Serif TC', serif; }

@keyframes fade-in { from { opacity: 0; filter: blur(10px); } to { opacity: 1; filter: blur(0); } }

.animate-fade-in { animation: fade-in 0.8s ease-out forwards; }

@keyframes slide-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }

.animate-slide-up { animation: slide-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

@keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }

.animate-blob { animation: blob 15s infinite ease-in-out; }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }

.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }

.custom-scrollbar::-webkit-scrollbar-thumb { background: #d6d3d1; border-radius: 10px; }

`}</style>


{view === 'landing' && <LandingView onStart={handleDraw} />}

{view === 'drawing' && <DrawingView />}

{view === 'result' && <ResultView myWord={myWord} onDownload={() => generateAndDownload(myWord?.char, myWord?.meaning)} onContribute={() => setView('contribute')} onRetry={handleDraw} />}

{view === 'contribute' && <ContributeView word={userWordInput} reason={userReasonInput} setWord={setUserWordInput} setReason={setUserReasonInput} onSubmit={handleSubmit} onClose={() => setView('result')} onSkip={() => setView('gallery')} />}

{view === 'gallery' && <GalleryView words={communityWords} myWordData={myWordData} totalCount={totalCount} onHome={() => setView('landing')} userUid={user?.uid} />}

</div>

);

}
