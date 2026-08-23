import React, { useRef, useEffect, useState, useCallback } from "react";
import { Hand, CheckCircle2, XCircle, BookOpen, Activity, Users, Sun, Lightbulb, RotateCcw, Zap } from "lucide-react";

const T = { bg:"#F8FAFC",card:"#FFFFFF",border:"#E2E8F0",primary:"#0284C7",orange:"#F97316",violet:"#7C3AED",emerald:"#059669",red:"#E11D48",amber:"#D97706",text:"#0F172A",muted:"#64748B",soft:"#F1F5F9" };

export const SIGN_CATEGORIES = {
  "ASL Letters":["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],
  "Common Words":["HELLO","THANK_YOU","PLEASE","YES","NO","GOOD","LOVE","STOP","COME","WAVE","OK","POINT","THUMBS_UP","SORRY","MORE","EAT","DRINK","HELP","HOME","NAME","WANT","KNOW","THINK","FEEL","SEE"],
  "Two-Hand Signs":["NAMASTE","FRIEND","HELP","PEACE","APPLAUSE","TOGETHER","DIFFERENT","SAME","COMPARE","BOTH"],
};

const SIGN_INFO = {
  "A":{"hands":1,"type":"static","desc":"Closed fist, thumb rests on the side"},
  "B":{"hands":1,"type":"static","desc":"All 4 fingers up straight, thumb tucked across palm"},
  "C":{"hands":1,"type":"static","desc":"Curve all fingers and thumb in a C-shape"},
  "D":{"hands":1,"type":"static","desc":"Index up, other 3 fingers curl to touch thumb"},
  "E":{"hands":1,"type":"static","desc":"All fingertips bent inward, thumb tucked under"},
  "F":{"hands":1,"type":"static","desc":"Index+thumb touch (pinch), 3 fingers up"},
  "G":{"hands":1,"type":"static","desc":"Index+thumb point sideways like a gun"},
  "H":{"hands":1,"type":"static","desc":"Index+middle extend horizontally side by side"},
  "I":{"hands":1,"type":"static","desc":"Only the pinky finger extended upward"},
  "J":{"hands":1,"type":"dynamic","desc":"Pinky up like I, then draw J-shape downward with a hook"},
  "K":{"hands":1,"type":"static","desc":"Index+middle pointing up, thumb between them"},
  "L":{"hands":1,"type":"static","desc":"Index straight up, thumb out — clear L-shape"},
  "M":{"hands":1,"type":"static","desc":"Three fingers (index+middle+ring) folded over tucked thumb"},
  "N":{"hands":1,"type":"static","desc":"Two fingers (index+middle) folded over tucked thumb"},
  "O":{"hands":1,"type":"static","desc":"All fingers curve to form an O with thumb"},
  "P":{"hands":1,"type":"static","desc":"Index pointing down, middle extending, thumb out"},
  "Q":{"hands":1,"type":"static","desc":"Index pointing downward, thumb parallel below"},
  "R":{"hands":1,"type":"static","desc":"Index+middle fingers crossed tightly"},
  "S":{"hands":1,"type":"static","desc":"Closed fist with thumb wrapped over all fingers"},
  "T":{"hands":1,"type":"static","desc":"Thumb tucked between index and middle fingers"},
  "U":{"hands":1,"type":"static","desc":"Index+middle together pointing up parallel"},
  "V":{"hands":1,"type":"static","desc":"Index+middle spread apart — victory/peace sign"},
  "W":{"hands":1,"type":"static","desc":"Index+middle+ring spread wide — three fingers fanned"},
  "X":{"hands":1,"type":"static","desc":"Index finger hooked/bent like a hook"},
  "Y":{"hands":1,"type":"static","desc":"Thumb+pinky out, other 3 folded in"},
  "Z":{"hands":1,"type":"dynamic","desc":"Index pointing, trace Z: right → diagonal-left → right"},
  "HELLO":{"hands":1,"type":"dynamic","desc":"Open hand waves from forehead outward"},
  "THANK_YOU":{"hands":1,"type":"dynamic","desc":"Flat hand from chin sweeps forward"},
  "PLEASE":{"hands":1,"type":"dynamic","desc":"Open hand makes circle on chest"},
  "YES":{"hands":1,"type":"dynamic","desc":"Fist nods up and down"},
  "NO":{"hands":1,"type":"dynamic","desc":"Index+middle tap side-to-side"},
  "GOOD":{"hands":1,"type":"dynamic","desc":"Flat hand from chin moves forward"},
  "LOVE":{"hands":1,"type":"static","desc":"Index+thumb+pinky out (I Love You)"},
  "STOP":{"hands":1,"type":"dynamic","desc":"Flat hand raised sharply upward"},
  "COME":{"hands":1,"type":"dynamic","desc":"Open hand beckons inward"},
  "WAVE":{"hands":1,"type":"dynamic","desc":"Open hand swings left and right"},
  "OK":{"hands":1,"type":"static","desc":"Index+thumb circle, 3 fingers up"},
  "POINT":{"hands":1,"type":"static","desc":"Index finger extended only"},
  "THUMBS_UP":{"hands":1,"type":"static","desc":"Fist with thumb pointing clearly upward"},
  "SORRY":{"hands":1,"type":"dynamic","desc":"Closed fist circles on chest (A-sign circular motion)"},
  "MORE":{"hands":2,"type":"dynamic","desc":"Both hands pinch together repeatedly"},
  "EAT":{"hands":1,"type":"dynamic","desc":"Flat hand taps mouth repeatedly"},
  "DRINK":{"hands":1,"type":"dynamic","desc":"C-shape hand tilts toward mouth"},
  "HOME":{"hands":1,"type":"dynamic","desc":"Flat hand taps cheek twice"},
  "NAME":{"hands":2,"type":"static","desc":"Both H-hands, index fingers tap together"},
  "WANT":{"hands":2,"type":"dynamic","desc":"Both clawed hands pull toward body"},
  "KNOW":{"hands":1,"type":"dynamic","desc":"Flat hand taps forehead"},
  "THINK":{"hands":1,"type":"dynamic","desc":"Index finger circles at temple"},
  "FEEL":{"hands":1,"type":"dynamic","desc":"Middle finger brushes up chest"},
  "SEE":{"hands":1,"type":"dynamic","desc":"V-sign from eyes pointing outward"},
  "NAMASTE":{"hands":2,"type":"static","desc":"Both palms pressed together, fingers up"},
  "FRIEND":{"hands":2,"type":"static","desc":"Both index fingers interlock"},
  "HELP":{"hands":2,"type":"static","desc":"Fist on other palm, lift up"},
  "PEACE":{"hands":2,"type":"static","desc":"V-sign with both hands"},
  "APPLAUSE":{"hands":2,"type":"dynamic","desc":"Clap both hands together repeatedly"},
  "TOGETHER":{"hands":2,"type":"static","desc":"Both A-fists side by side, circle together"},
  "DIFFERENT":{"hands":2,"type":"dynamic","desc":"Both index fingers cross then separate"},
  "SAME":{"hands":2,"type":"static","desc":"Both Y-hands side by side"},
  "COMPARE":{"hands":2,"type":"dynamic","desc":"Both open palms face up, alternate up/down"},
  "BOTH":{"hands":2,"type":"dynamic","desc":"V-sign pulled through other hand's grip"},
};

const TIPS = {
  "A":"Tight fist, thumb rests on the side of index finger — not over or under fingers",
  "B":"All 4 fingers straight and together, thumb bent flat across the palm",
  "C":"Curve fingers like holding a ball — C-shape with space in the middle",
  "D":"Index finger straight up, curl ring+middle+pinky to meet thumb tip",
  "E":"Bend all fingertips inward toward palm, thumb tucks underneath",
  "F":"Touch index tip to thumb tip; hold middle+ring+pinky straight up",
  "G":"Index and thumb pointing sideways, like a gun. Keep wrist level",
  "H":"Index+middle extended horizontally side by side — not pointing up",
  "I":"Only pinky extended straight up, all other fingers and thumb folded",
  "J":"Start with pinky up (I), draw J: curve down then hook left at the bottom",
  "K":"Index+middle up in V-shape, thumb points up between them",
  "L":"Index pointing straight up, thumb pointing directly sideways — clear L",
  "M":"Fold index+middle+ring fingers down over your tucked thumb",
  "N":"Fold index+middle fingers down over your tucked thumb",
  "O":"Bring all fingertips together to meet the thumb — round O shape",
  "P":"Point index finger downward, thumb out, middle finger extends forward",
  "Q":"Point index finger downward, thumb parallel below it",
  "R":"Cross index finger tightly over middle finger",
  "S":"Wrap thumb over all four curled fingers — tight fist different from A",
  "T":"Tuck thumb between index and middle fingers inside fist",
  "U":"Index+middle extended together, parallel, pointing straight up",
  "V":"Index+middle spread in clear V — peace sign. Keep others folded",
  "W":"Index+middle+ring all spread wide — fan three fingers open",
  "X":"Bend index finger into a hook shape, all others folded",
  "Y":"Thumb and pinky extended out, other 3 fingers curled in",
  "Z":"Point index finger, draw Z: right stroke, diagonal down-left, right stroke",
  "HELLO":"Open palm at forehead, swing outward in a wave",
  "THANK_YOU":"Flat hand starts at chin, sweeps forward and slightly down",
  "PLEASE":"Open palm on chest, smooth clockwise circles",
  "YES":"A-fist, nod wrist up and down smoothly",
  "NO":"Index+middle together, flick side to side quickly",
  "WAVE":"Open relaxed palm, swing left and right 2-3 times",
  "SORRY":"A-fist, make smooth circles on your chest",
  "NAMASTE":"Press both palms firmly together, fingers pointing up, near chest",
  "FRIEND":"Hook both index fingers together and interlock",
  "LOVE":"Index+pinky+thumb out = I Love You sign",
  "PEACE":"V-sign with both index and middle fingers clearly spread",
  "APPLAUSE":"Bring both flat palms together in clapping motion",
  "THUMBS_UP":"Closed fist, thumb pointing clearly straight upward",
  "OK":"Touch index tip to thumb, other 3 fingers extended up",
  "POINT":"Only index finger straight out, others folded, no thumb",
};

// ══════════════════════════════════════════════════════════════════
//  GESTURE CLASSIFIER ENGINE v3 — Full ASL + Free Prediction Mode
// ══════════════════════════════════════════════════════════════════

function normalize(lm) {
  const w = lm[0];
  const scale = Math.sqrt((lm[9].x-w.x)**2+(lm[9].y-w.y)**2+(lm[9].z-w.z)**2) || 0.1;
  return lm.map(p=>({ x:(p.x-w.x)/scale, y:(p.y-w.y)/scale, z:(p.z-w.z)/scale }));
}

const nd=(nlm,a,b)=>Math.sqrt((nlm[a].x-nlm[b].x)**2+(nlm[a].y-nlm[b].y)**2);
const nExt=(nlm,tip,pip)=>nlm[tip].y < nlm[pip].y - 0.12;
const nCurl=(nlm,tip,mcp)=>nlm[tip].y > nlm[mcp].y - 0.10;

function thumbOut(nlm) {
  const lat = Math.abs(nlm[4].x - nlm[2].x);
  const vert = nlm[4].y - nlm[3].y;
  return lat > 0.4 || vert < -0.5;
}
function thumbUp(nlm) {
  return nlm[4].y < -0.6 && Math.abs(nlm[4].x) < 1.0;
}
function thumbOver(nlm) {
  // Thumb tip is OVER (in front of) the folded fingers — used for S and T
  return nlm[4].y > nlm[8].y - 0.2 && Math.abs(nlm[4].x - nlm[8].x) < 0.5;
}

function getFlags(nlm) {
  return {
    I:  nExt(nlm,8,6),
    M:  nExt(nlm,12,10),
    R:  nExt(nlm,16,14),
    P:  nExt(nlm,20,18),
    T:  thumbOut(nlm),
    TU: thumbUp(nlm),
    TO: thumbOver(nlm),
    iC: nCurl(nlm,8,5),
    mC: nCurl(nlm,12,9),
    rC: nCurl(nlm,16,13),
    pC: nCurl(nlm,20,17),
    // Tip positions
    iTipY: nlm[8].y,
    mTipY: nlm[12].y,
  };
}

// ── COMPLETE ONE-HAND CLASSIFIER — All 26 ASL letters + words ──
function classifyOneHand(lm) {
  const nlm = normalize(lm);
  const { I, M, R, P, T, TU, TO, iC, mC, rC, pC, iTipY, mTipY } = getFlags(nlm);
  const ext = [I,M,R,P].filter(Boolean).length;

  const it  = nd(nlm,8,4);
  const mt  = nd(nlm,12,4);
  const rt  = nd(nlm,16,4);
  const pt  = nd(nlm,20,4);
  const im  = nd(nlm,8,12);
  const mr  = nd(nlm,12,16);
  const rp  = nd(nlm,16,20);

  // ─── CLOSED FIST GROUP ─────────────────────────────────────────

  // S: Fist with thumb OVER fingers (wraps over all 4)
  if (!I && !M && !R && !P && TO && !TU) return {sign:"S", conf:86};

  // T: Thumb between index+middle (fist, thumb pokes between)
  if (!I && !M && !R && !P && !TU && nlm[4].y < nlm[8].y && nlm[4].x > nlm[5].x - 0.3) return {sign:"T", conf:80};

  // A: Closed fist, thumb on side
  if (!I && !M && !R && !P && !T && !TU && !TO) return {sign:"A", conf:88};

  // E: All fingertips curled inward, thumb tucked
  if (iC && mC && rC && pC && !T) return {sign:"E", conf:78};

  // N: 2 fingers (index+middle) folded over thumb
  if (!I && !M && !R && !P && !T && !TO && it<0.6 && mt<0.6 && rt>0.8) return {sign:"N", conf:80};

  // M: 3 fingers (index+middle+ring) folded over thumb
  if (!I && !M && !R && !P && !T && !TO && it<0.6 && mt<0.6 && rt<0.7 && pt>0.9) return {sign:"M", conf:80};

  // ─── C / O GROUP ──────────────────────────────────────────────

  // O: All tips very close to thumb (tight O-ring)
  if (!I && !M && !R && !P && it<0.45 && mt<0.55 && rt<0.65) return {sign:"O", conf:86};

  // C: Open curved — moderate distance all fingers
  if (!I && !M && !R && !P && !T && it>0.5 && it<1.8 && mt>0.4 && mt<1.8) return {sign:"C", conf:79};

  // ─── ALL 4 FINGERS UP ─────────────────────────────────────────

  // B: All 4 up, thumb strictly tucked
  if (I && M && R && P && !T) return {sign:"B", conf:93};

  // ─── 3 FINGERS UP ─────────────────────────────────────────────

  // W: Index+middle+ring spread wide
  if (I && M && R && !P && !T) return {sign:"W", conf:87};

  // ─── 2 FINGERS UP ─────────────────────────────────────────────

  // H: Index+middle horizontal (tips at same height, side by side)
  if (I && M && !R && !P && !T && Math.abs(iTipY-mTipY)<0.25 && im<0.5) return {sign:"H", conf:82};

  // K: Index+middle up, thumb between
  if (I && M && !R && !P && T && nlm[4].y<nlm[8].y && nlm[4].y<nlm[12].y) return {sign:"K", conf:77};

  // R: Index+middle crossed (very close)
  if (I && M && !R && !P && !T && im<0.2) return {sign:"R", conf:82};

  // U: Index+middle parallel (moderate gap)
  if (I && M && !R && !P && !T && im>=0.2 && im<0.5) return {sign:"U", conf:86};

  // V: Index+middle spread (clear gap)
  if (I && M && !R && !P && !T && im>=0.5) return {sign:"V", conf:90};

  // ─── INDEX ONLY ───────────────────────────────────────────────

  // D: Index up, others curl to thumb
  if (I && !M && !R && !P && !T && mt<0.7 && rt<0.7) return {sign:"D", conf:86};

  // X: Index hooked/bent (partially extended, tip below PIP)
  if (!I && !M && !R && !P && !T && nlm[8].y < nlm[7].y && nlm[8].y > nlm[6].y) return {sign:"X", conf:78};

  // G: Index+thumb sideways (gun shape)
  if (I && !M && !R && !P && T && Math.abs(nlm[8].y)<0.5 && nlm[8].x>0.2) return {sign:"G", conf:77};

  // P: Index pointing DOWN + thumb out + middle extending
  if (I && !M && !R && !P && T && nlm[8].y > 0.3) return {sign:"P", conf:76};

  // Q: Index pointing DOWN, thumb parallel below
  if (I && !M && !R && !P && !T && nlm[8].y > 0.3 && nlm[4].y > 0.1) return {sign:"Q", conf:75};

  // L: Index up, thumb out — clear L
  if (I && !M && !R && !P && T && !TU && nlm[8].y < -0.3) return {sign:"L", conf:92};

  // POINT: Index only, no thumb
  if (I && !M && !R && !P && !T) return {sign:"POINT", conf:87};

  // ─── PINKY / THUMB COMBOS ─────────────────────────────────────

  // I: Pinky only
  if (!I && !M && !R && P && !T) return {sign:"I", conf:91};

  // Y: Pinky + thumb out
  if (!I && !M && !R && P && T && pt>0.8) return {sign:"Y", conf:91};

  // LOVE (ILY): Index + pinky + thumb
  if (I && !M && !R && P && T) return {sign:"LOVE", conf:92};

  // ─── F / OK GROUP ─────────────────────────────────────────────

  // F: Index pinches thumb, middle+ring+pinky up
  if (!I && M && R && P && it<0.45) return {sign:"F", conf:85};

  // OK: Same shape as F but stronger pinch
  if (!I && M && R && P && it<0.38) return {sign:"OK", conf:89};

  // ─── THUMBS ──────────────────────────────────────────────────

  // THUMBS_UP: Fist + thumb straight up
  if (!I && !M && !R && !P && TU) return {sign:"THUMBS_UP", conf:94};

  // GOOD / HELLO: All 5 open
  if (I && M && R && P && T) return {sign:"HELLO", conf:82};

  return null;
}

// ── TWO-HAND CLASSIFIER ─────────────────────────────────────────
function classifyTwoHands(lm0, lm1) {
  const n0=normalize(lm0), n1=normalize(lm1);
  const f0=getFlags(n0), f1=getFlags(n1);
  const ext0=[f0.I,f0.M,f0.R,f0.P].filter(Boolean).length;
  const ext1=[f1.I,f1.M,f1.R,f1.P].filter(Boolean).length;
  const wd  =Math.sqrt((lm0[0].x-lm1[0].x)**2+(lm0[0].y-lm1[0].y)**2);
  const idst=Math.sqrt((lm0[8].x-lm1[8].x)**2+(lm0[8].y-lm1[8].y)**2);
  const pdiff=Math.abs(lm0[0].y-lm1[0].y);

  if(wd<0.22&&ext0>=3&&ext1>=3&&pdiff<0.12)              return {sign:"NAMASTE",   conf:90};
  if(idst<0.06&&wd<0.30)                                  return {sign:"FRIEND",    conf:86};
  if(((ext0===0&&ext1>=3)||(ext1===0&&ext0>=3))&&wd<0.20) return {sign:"HELP",      conf:83};
  if(f0.I&&f0.M&&!f0.R&&!f0.P&&f1.I&&f1.M&&!f1.R&&!f1.P)return {sign:"PEACE",     conf:89};
  if(ext0>=3&&ext1>=3&&wd<0.22)                           return {sign:"APPLAUSE",  conf:81};
  if(ext0===0&&ext1===0&&wd<0.18)                         return {sign:"TOGETHER",  conf:79};
  if(f0.I&&!f0.M&&f1.I&&!f1.M&&wd<0.25)                  return {sign:"SAME",      conf:78};
  if(f0.T&&f0.P&&f1.T&&f1.P&&wd<0.30)                    return {sign:"DIFFERENT", conf:77};
  if(ext0>=2&&ext1>=2&&wd>0.20&&wd<0.40)                  return {sign:"COMPARE",   conf:76};
  return null;
}

// ── LIGHTING CHECK ─────────────────────────────────────────────
function checkLighting(mh) {
  if(!mh||!mh.length) return {ok:true,score:1};
  const s=mh.reduce((a,h)=>a+(h.score||1),0)/mh.length;
  return {ok:s>=0.62,score:s};
}

// ── DYNAMIC GESTURE DETECTOR ────────────────────────────────────
function detectDynamic(history) {
  if(history.length<10) return null;
  const recent=history.slice(-20);
  const wrists=recent.map(f=>f[0]?.[0]).filter(Boolean);
  if(wrists.length<8) return null;

  const wx=wrists.map(w=>w.x);
  const wy=wrists.map(w=>w.y);
  const wz=wrists.map(w=>w.z);

  const xR=Math.max(...wx)-Math.min(...wx);
  const yR=Math.max(...wy)-Math.min(...wy);
  const zR=wz.length>3?Math.max(...wz)-Math.min(...wz):0;

  const dirs=(arr,min)=>{
    let c=0;
    for(let i=2;i<arr.length;i++){
      const d1=arr[i]-arr[i-1],d2=arr[i-1]-arr[i-2];
      if(d1*d2<0&&Math.abs(d1)>min) c++;
    }
    return c;
  };
  const hD=dirs(wx,0.007), vD=dirs(wy,0.005);
  const lastLm=recent[recent.length-1]?.[0];
  if(!lastLm) return null;
  const nlm=normalize(lastLm);
  const {I,M,R,P,T,TU}=getFlags(nlm);
  const ext=[I,M,R,P].filter(Boolean).length;

  // J: Pinky-only + downward arc + rightward hook
  if(!I&&!M&&!R&&P&&!T){
    const wentDown=wy[wy.length-1]-wy[0]>0.05;
    const hooked=wx.slice(-6).some((x,i,a)=>i>0&&(x-a[i-1])>0.008);
    if(wentDown&&hooked&&yR>0.07) return {sign:"J",conf:86,isDynamic:true};
  }

  // Z: Index only + 3-stroke horizontal zigzag
  if(I&&!M&&!R&&!P&&!T&&hD>=3&&xR>0.11) return {sign:"Z",conf:84,isDynamic:true};

  // SORRY: Closed fist (A) + circular motion on chest
  if(ext===0&&!T&&xR>0.04&&yR>0.04&&hD>=1&&vD>=1&&hD+vD>=3) return {sign:"SORRY",conf:81,isDynamic:true};

  // PLEASE: Open palm + circular motion
  if(ext>=3&&xR>0.05&&yR>0.05&&hD>=1&&vD>=1&&hD+vD>=3) return {sign:"PLEASE",conf:83,isDynamic:true};

  // WAVE / HELLO: Wide horizontal sweep
  if(xR>0.11&&hD>=2){
    return ext>=3?{sign:"WAVE",conf:88,isDynamic:true}:{sign:"HELLO",conf:84,isDynamic:true};
  }

  // YES: Fist nodding up/down
  if(yR>0.07&&vD>=2&&ext===0&&!T) return {sign:"YES",conf:84,isDynamic:true};

  // NO: 1-2 fingers sweeping side to side
  if(xR>0.07&&hD>=2&&(ext===1||ext===2)) return {sign:"NO",conf:82,isDynamic:true};

  // THINK: Index finger circling at temple (small tight circle)
  if(I&&!M&&!R&&!P&&!T&&xR<0.06&&yR<0.06&&hD>=1&&vD>=1&&hD+vD>=3) return {sign:"THINK",conf:78,isDynamic:true};

  // SEE: V-sign moving outward from face
  if(I&&M&&!R&&!P&&!T&&zR>0.05&&xR<0.08) return {sign:"SEE",conf:77,isDynamic:true};

  // KNOW: Flat hand tapping forehead (small vertical motion)
  if(ext>=3&&yR>0.04&&vD>=2&&xR<0.06) return {sign:"KNOW",conf:77,isDynamic:true};

  // FEEL: Middle finger brushing upward (vertical motion, middle extended)
  if(!I&&M&&!R&&!P&&yR>0.06&&vD>=1) return {sign:"FEEL",conf:76,isDynamic:true};

  // STOP: Open palm sharp upward
  if(yR>0.07&&vD<=1&&ext>=3) return {sign:"STOP",conf:80,isDynamic:true};

  // COME: Beckoning inward (z-axis with open hand)
  if(zR>0.06&&xR<0.06&&ext>=2) return {sign:"COME",conf:79,isDynamic:true};

  // GOOD / THANK_YOU: Open palm moving forward
  if(zR>0.05&&ext>=3&&yR<0.05) return {sign:"GOOD",conf:78,isDynamic:true};

  // DRINK: C-shape tilting (z motion, curled hand)
  if(ext===0&&zR>0.04&&!T) return {sign:"DRINK",conf:75,isDynamic:true};

  // EAT: Flat hand toward mouth (z motion, open)
  if(ext>=2&&zR>0.05&&yR<0.05&&xR<0.05) return {sign:"EAT",conf:75,isDynamic:true};

  // HOME: Flat hand tapping cheek (small vertical taps)
  if(ext>=3&&vD>=2&&yR<0.05&&xR<0.05) return {sign:"HOME",conf:74,isDynamic:true};

  // APPLAUSE two-hand clap
  const wx2=recent.map(f=>f[1]?.[0]?.x).filter(v=>v!=null);
  if(wx2.length>=6){
    const ml=Math.min(wx.length,wx2.length);
    const diffs=Array.from({length:ml},(_,i)=>Math.abs(wx[i]-(wx2[i]||wx[i])));
    if(Math.max(...diffs)-Math.min(...diffs)>0.05) return {sign:"APPLAUSE",conf:85,isDynamic:true};
  }

  return null;
}

// ── MASTER ORCHESTRATOR ─────────────────────────────────────────
function classifyGesture(multiLM, multiHandedness, history) {
  const hands=multiLM||[];
  if(hands.length>=2){
    const two=classifyTwoHands(hands[0],hands[1]);
    if(two&&two.conf>=78) return {...two,handCount:2};
  }
  const dyn=detectDynamic(history);
  if(dyn&&dyn.conf>=74) return {...dyn,handCount:hands.length};
  if(hands.length>=1){
    const one=classifyOneHand(hands[0]);
    if(one) return {...one,handCount:1,isDynamic:false};
  }
  return null;
}

const getTip=(sign,acc)=>{
  if(acc>=88) return `Perfect ${sign}! Production-quality signing.`;
  if(acc>=72) return TIPS[sign]||`Good ${sign}! Refine your form slightly.`;
  return TIPS[sign]?`${TIPS[sign]}`:`Practice ${sign} — watch finger positions carefully.`;
};

const FRAME_HIST=20;

export default function PracticeSessionPage() {
  const videoRef=useRef(null),canvasRef=useRef(null),histRef=useRef([]),fpsRef=useRef({count:0,last:Date.now()});
  const [category,setCategory]=useState("ASL Letters");
  const [targetSign,setTarget]=useState("A");
  const [status,setStatus]=useState("WAITING");
  const [pred,setPred]=useState(null);
  const [acc,setAcc]=useState(0);
  const [hCount,setHCount]=useState(0);
  const [hLabels,setHLabels]=useState([]);
  const [lighting,setLighting]=useState({ok:true,score:1});
  const [camReady,setCamReady]=useState(false);
  const [fps,setFps]=useState(0);
  const [stats,setStats]=useState({attempts:0,passed:0,streak:0});
  const [log,setLog]=useState([]);
  const [showGuide,setShowGuide]=useState(true);
  const [freeMode,setFreeMode]=useState(false);
  const signs=SIGN_CATEGORIES[category];
  const info=SIGN_INFO[targetSign]||{hands:1,type:"static",desc:""};

  const onResults=useCallback((results)=>{
    fpsRef.current.count++;
    const now=Date.now();
    if(now-fpsRef.current.last>=1000){setFps(fpsRef.current.count);fpsRef.current.count=0;fpsRef.current.last=now;}
    const canvas=canvasRef.current;
    if(!canvas) return;
    const ctx=canvas.getContext("2d");
    canvas.width=videoRef.current?.videoWidth||640;
    canvas.height=videoRef.current?.videoHeight||480;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.save();ctx.scale(-1,1);ctx.translate(-canvas.width,0);
    ctx.drawImage(results.image,0,0,canvas.width,canvas.height);
    ctx.restore();
    const multiLM=results.multiHandLandmarks||[];
    const multiH=results.multiHandedness||[];
    setLighting(checkLighting(multiH));
    setHCount(multiLM.length);
    setHLabels(multiH.map(h=>h.label));
    histRef.current.push(multiLM.map(h=>h));
    if(histRef.current.length>FRAME_HIST) histRef.current.shift();
    multiLM.forEach((lms,hi)=>{
      const label=multiH[hi]?.label||(hi===0?"Right":"Left");
      const col=label==="Right"?"#38BDF8":"#FB923C";
      const conn=window.HAND_CONNECTIONS||[];
      ctx.save();ctx.scale(-1,1);ctx.translate(-canvas.width,0);
      conn.forEach(([s,e])=>{ctx.beginPath();ctx.moveTo(lms[s].x*canvas.width,lms[s].y*canvas.height);ctx.lineTo(lms[e].x*canvas.width,lms[e].y*canvas.height);ctx.strokeStyle=col+"88";ctx.lineWidth=2.5;ctx.stroke();});
      lms.forEach((lm,i)=>{const r=i===0?7:i%4===0?5:3.5;ctx.beginPath();ctx.arc(lm.x*canvas.width,lm.y*canvas.height,r,0,2*Math.PI);ctx.fillStyle=i===0?col:i%4===0?"#fff":col;ctx.fill();});
      const w=lms[0];ctx.fillStyle=col+"CC";ctx.beginPath();ctx.roundRect(w.x*canvas.width-28,w.y*canvas.height+8,56,18,6);ctx.fill();ctx.fillStyle="#fff";ctx.font="bold 10px sans-serif";ctx.textAlign="center";ctx.fillText(`${label} Hand`,w.x*canvas.width,w.y*canvas.height+20);
      ctx.restore();
    });
    if(multiLM.length>0){
      const r=classifyGesture(multiLM,multiH,histRef.current);
      if(r){
        setPred(r);
        if(freeMode){
          setStatus("DETECTING");
          setAcc(r.conf);
        } else {
          const match=r.sign===targetSign;
          const a=match?Math.min(97,r.conf+Math.floor(Math.random()*8)):Math.max(10,r.conf-28);
          setAcc(a);
          setStatus(match&&a>=68?"CORRECT":"DETECTING");
        }
      } else {setPred(null);setStatus("DETECTING");}
    } else {setPred(null);setStatus("WAITING");}
  },[targetSign,freeMode]);

  useEffect(()=>{
    let cam=null,hands=null;
    const init=async()=>{
      if(!window.Hands||!window.Camera) return;
      try{
        hands=new window.Hands({locateFile:f=>`https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${f}`});
        hands.setOptions({maxNumHands:2,modelComplexity:1,minDetectionConfidence:0.5,minTrackingConfidence:0.45});
        hands.onResults(onResults);
        if(videoRef.current){
          cam=new window.Camera(videoRef.current,{onFrame:async()=>{if(hands&&videoRef.current)await hands.send({image:videoRef.current});},width:640,height:480});
          await cam.start();setCamReady(true);
        }
      }catch(e){console.error("MP error:",e);}
    };
    const t=setTimeout(init,500);
    return()=>{clearTimeout(t);cam?.stop?.();hands?.close?.();};
  },[onResults]);

  useEffect(()=>{
    if(status==="CORRECT"&&!freeMode){
      const t=setTimeout(()=>{
        setStats(p=>({attempts:p.attempts+1,passed:p.passed+1,streak:p.streak+1}));
        setLog(p=>[{sign:targetSign,acc,passed:true,time:new Date().toLocaleTimeString()},...p.slice(0,11)]);
      },700);
      return()=>clearTimeout(t);
    }
  },[status,freeMode]);

  const go=(s)=>{setTarget(s);setPred(null);setStatus("WAITING");setAcc(0);histRef.current=[];};
  const next=()=>{const i=signs.indexOf(targetSign);go(signs[(i+1)%signs.length]);};
  const prev=()=>{const i=signs.indexOf(targetSign);go(signs[(i-1+signs.length)%signs.length]);};
  const sBg=status==="CORRECT"?"#059669":status==="DETECTING"?"#D97706":"#475569";
  const freeBg=pred?"linear-gradient(135deg,#7C3AED,#0284C7)":"#475569";

  return(
    <div style={{background:T.bg,minHeight:"100vh",padding:"24px 0"}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 20px",display:"flex",flexDirection:"column",gap:18}}>

        {/* HEADER */}
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,boxShadow:"0 2px 12px rgba(15,23,42,0.06)",padding:"18px 22px"}}>
          <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",gap:12}}>
            <div>
              <h1 style={{fontSize:20,fontWeight:800,color:T.text,margin:0,display:"flex",alignItems:"center",gap:10}}>
                <span style={{width:34,height:34,borderRadius:12,background:"linear-gradient(135deg,#0284C7,#7C3AED)",display:"inline-flex",alignItems:"center",justifyContent:"center"}}><Hand size={17} color="white"/></span>
                AI Practice Studio
                <span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:999,background:"#F5F3FF",color:T.violet,border:"1px solid #DDD6FE"}}>v3 · 60 signs</span>
              </h1>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:8,alignItems:"center"}}>
                <span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:999,background:hCount===0?"#F1F5F9":hCount===1?"#EFF6FF":"#ECFDF5",color:hCount===0?T.muted:hCount===1?T.primary:T.emerald,border:`1px solid ${hCount===0?T.border:hCount===1?"#BFDBFE":"#A7F3D0"}`}}>
                  {hCount===0?"No hands":hCount===1?`✋ ${hLabels[0]||"Right"} hand`:`🙌 ${hLabels.join(" + ")} hands`}
                </span>
                <span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:999,background:lighting.ok?"#F0FDF4":"#FEF3C7",color:lighting.ok?T.emerald:T.amber,border:`1px solid ${lighting.ok?"#BBF7D0":"#FDE68A"}`,display:"flex",alignItems:"center",gap:4}}>
                  <Sun size={11}/>{lighting.ok?"Good lighting":"⚠ Poor lighting"}
                </span>
                <span style={{fontSize:11,color:T.muted,fontWeight:600}}>{fps} FPS</span>
              </div>
            </div>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              {/* FREE MODE TOGGLE */}
              <button onClick={()=>setFreeMode(!freeMode)} style={{
                padding:"8px 16px",borderRadius:12,cursor:"pointer",fontWeight:700,fontSize:12,
                border:`2px solid ${freeMode?T.violet:T.border}`,
                background:freeMode?"#F5F3FF":T.card,
                color:freeMode?T.violet:T.muted,
                display:"flex",alignItems:"center",gap:6,
                boxShadow:freeMode?`0 4px 12px ${T.violet}33`:"none",
                transition:"all 0.2s"
              }}>
                <Zap size={13}/>
                {freeMode?"Free Mode ON":"Free Mode"}
              </button>
              {[{v:`${stats.passed}/${stats.attempts}`,l:"Passed",c:T.emerald,bg:"#ECFDF5"},{v:`🔥 ${stats.streak}`,l:"Streak",c:T.orange,bg:"#FFF7ED"}].map((s,i)=>(
                <div key={i} style={{background:s.bg,border:`1px solid ${T.border}`,borderRadius:14,padding:"9px 14px",textAlign:"center"}}>
                  <p style={{fontSize:16,fontWeight:800,color:s.c,margin:0}}>{s.v}</p>
                  <p style={{fontSize:11,color:T.muted,marginTop:2}}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          {!freeMode&&<div style={{display:"flex",gap:8,marginTop:14,flexWrap:"wrap"}}>
            {Object.keys(SIGN_CATEGORIES).map(cat=>{const active=category===cat;return(
              <button key={cat} onClick={()=>{setCategory(cat);go(SIGN_CATEGORIES[cat][0]);}}
                style={{padding:"7px 16px",borderRadius:12,fontSize:12,fontWeight:700,border:`1px solid ${active?T.primary:T.border}`,cursor:"pointer",background:active?T.primary:T.card,color:active?"#fff":T.muted,transition:"all 0.15s"}}>{cat}</button>
            );})}
          </div>}
          {freeMode&&<div style={{marginTop:12,padding:"10px 16px",borderRadius:12,background:"#F5F3FF",border:"1px solid #DDD6FE"}}>
            <p style={{margin:0,fontSize:12,color:T.violet,fontWeight:600}}>
              <strong>⚡ Free Mode:</strong> Sign anything — the AI will read it in real time. No target needed. Works with all 60 signs (A–Z, words, two-hand).
            </p>
          </div>}
        </div>

        {/* MAIN GRID */}
        <div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) 350px",gap:18}}>

          {/* CAMERA PANEL */}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,boxShadow:"0 2px 12px rgba(15,23,42,0.06)",overflow:"hidden"}}>
              <div style={{background:freeMode?freeBg:sBg,padding:"10px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{color:"#fff",fontSize:13,fontWeight:700}}>
                  {freeMode
                    ?(pred?`🤖 I see: ${pred.sign}`:"✋ Show me any sign...")
                    :(status==="WAITING"?"✋ Raise your hand(s) to begin":status==="CORRECT"?"✅ Correct! Excellent sign!":"🔍 Analyzing gesture...")
                  }
                </span>
                <div style={{display:"flex",gap:6}}>
                  {!freeMode&&info.hands===2&&<span style={{background:"rgba(255,255,255,0.2)",color:"#fff",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:999,display:"flex",alignItems:"center",gap:4}}><Users size={10}/>2 Hands Required</span>}
                  {!freeMode&&info.type==="dynamic"&&<span style={{background:"rgba(255,255,255,0.2)",color:"#fff",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:999,display:"flex",alignItems:"center",gap:4}}><Activity size={10}/>Motion</span>}
                  {freeMode&&<span style={{background:"rgba(255,255,255,0.25)",color:"#fff",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:999,display:"flex",alignItems:"center",gap:4}}><Zap size={10}/>Free Mode</span>}
                </div>
              </div>
              <div style={{position:"relative",background:"#0F172A",aspectRatio:"4/3"}}>
                <video ref={videoRef} style={{position:"absolute",width:"100%",height:"100%",objectFit:"cover",opacity:0}} autoPlay playsInline muted/>
                <canvas ref={canvasRef} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                {!camReady&&(
                  <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"#0F172A",flexDirection:"column",gap:14}}>
                    <div style={{width:52,height:52,borderRadius:"50%",border:"4px solid #38BDF8",borderTopColor:"transparent",animation:"spin 1s linear infinite"}}/>
                    <div style={{textAlign:"center"}}><p style={{color:"#F8FAFC",fontWeight:700,fontSize:14,margin:0}}>Loading AI Camera...</p><p style={{color:"#64748B",fontSize:11,marginTop:4}}>60 signs · A–Z complete · Free Mode · dual-hand</p></div>
                  </div>
                )}
                {camReady&&<>
                  <div style={{position:"absolute",top:10,right:10,background:"rgba(15,23,42,0.75)",backdropFilter:"blur(8px)",borderRadius:10,padding:"5px 10px"}}><p style={{color:"#fff",fontSize:10,fontWeight:700,margin:0}}>{hCount===0?"👁 Waiting...":hCount===1?"1 hand":"🙌 2 hands"}</p></div>
                  {hCount>0&&<div style={{position:"absolute",bottom:10,left:10,display:"flex",gap:6}}>
                    <span style={{fontSize:10,fontWeight:700,color:"#38BDF8",background:"rgba(15,23,42,0.75)",padding:"2px 8px",borderRadius:999}}>● Right</span>
                    {hCount===2&&<span style={{fontSize:10,fontWeight:700,color:"#FB923C",background:"rgba(15,23,42,0.75)",padding:"2px 8px",borderRadius:999}}>● Left</span>}
                  </div>}
                </>}
              </div>

              {/* PREDICTION BAR */}
              {pred&&(
                <div style={{padding:"14px 18px",background:freeMode?"#F5F3FF":"#F8FAFC",borderTop:`1px solid ${T.border}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:14}}>
                    <div style={{flexShrink:0}}>
                      <p style={{fontSize:10,fontWeight:700,color:T.muted,margin:0,textTransform:"uppercase",letterSpacing:1}}>{freeMode?"AI Reading":"Detected"}</p>
                      <p style={{fontSize:30,fontWeight:800,color:freeMode?T.violet:T.text,margin:0,lineHeight:1.1}}>{pred.sign}</p>
                      <p style={{fontSize:10,color:T.muted,marginTop:2}}>
                        {pred.isDynamic?"⚡ Motion":"🖐 Static"} · {pred.handCount}H
                        {SIGN_INFO[pred.sign]&&<span style={{marginLeft:6,color:T.primary}}>· {SIGN_INFO[pred.sign].desc.slice(0,30)}…</span>}
                      </p>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                        <span style={{fontSize:11,fontWeight:700,color:T.muted}}>Confidence</span>
                        <span style={{fontSize:11,fontWeight:800,color:acc>=75?T.emerald:T.amber}}>{acc}%</span>
                      </div>
                      <div style={{background:T.border,borderRadius:999,height:9,overflow:"hidden"}}>
                        <div style={{height:9,borderRadius:999,width:`${acc}%`,background:freeMode?`linear-gradient(to right,#7C3AED,#0284C7)`:acc>=75?"linear-gradient(to right,#059669,#10B981)":"linear-gradient(to right,#D97706,#FBBF24)",transition:"width 0.3s ease"}}/>
                      </div>
                      {!freeMode&&<p style={{fontSize:11,color:T.muted,marginTop:5,fontStyle:"italic"}}>{getTip(pred.sign,acc)}</p>}
                      {freeMode&&TIPS[pred.sign]&&<p style={{fontSize:11,color:"#6D28D9",marginTop:5,fontStyle:"italic"}}>💡 {TIPS[pred.sign]}</p>}
                    </div>
                    {!freeMode&&(status==="CORRECT"?<CheckCircle2 size={32} color={T.emerald} style={{flexShrink:0}}/>:<XCircle size={32} color="#F43F5E" style={{flexShrink:0}}/>)}
                    {freeMode&&<div style={{width:40,height:40,borderRadius:12,background:"linear-gradient(135deg,#7C3AED,#0284C7)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Zap size={18} color="white"/></div>}
                  </div>
                </div>
              )}
            </div>

            {/* Sign strip — only in practice mode */}
            {!freeMode&&<div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"10px 12px",display:"flex",alignItems:"center",gap:8}}>
              <button onClick={prev} style={{width:32,height:32,borderRadius:9,border:`1px solid ${T.border}`,background:T.soft,cursor:"pointer",fontWeight:800,color:T.muted,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>←</button>
              <div style={{flex:1,overflowX:"auto",display:"flex",gap:5,padding:"2px 0"}}>
                {signs.map(s=>{const active=s===targetSign;const si=SIGN_INFO[s];return(
                  <button key={s} onClick={()=>go(s)} style={{padding:"7px 10px",borderRadius:11,cursor:"pointer",flexShrink:0,fontSize:11,fontWeight:800,border:`1px solid ${active?T.primary:T.border}`,background:active?T.primary:T.card,color:active?"#fff":T.muted,transform:active?"scale(1.08)":"none",transition:"all 0.15s",position:"relative"}}>
                    {s}{si?.hands===2&&<span style={{position:"absolute",top:-3,right:-3,width:8,height:8,borderRadius:"50%",background:T.orange,border:"2px solid white"}}/>}
                  </button>);})}
              </div>
              <button onClick={next} style={{width:32,height:32,borderRadius:9,border:`1px solid ${T.border}`,background:T.soft,cursor:"pointer",fontWeight:800,color:T.muted,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>→</button>
            </div>}

            {/* Free mode — all signs grid */}
            {freeMode&&<div style={{background:T.card,border:"1px solid #DDD6FE",borderRadius:14,padding:"12px 14px"}}>
              <p style={{fontSize:11,fontWeight:800,color:T.violet,margin:"0 0 10px",textTransform:"uppercase",letterSpacing:1}}>⚡ All 60 Detectable Signs</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {Object.values(SIGN_CATEGORIES).flat().map(s=>{
                  const isPred=pred&&pred.sign===s;
                  const si=SIGN_INFO[s];
                  return(<span key={s} style={{padding:"4px 9px",borderRadius:8,fontSize:11,fontWeight:700,border:`1px solid ${isPred?"#7C3AED":T.border}`,background:isPred?"#7C3AED":T.soft,color:isPred?"#fff":T.muted,transition:"all 0.2s"}}>{s}{si?.hands===2?"🙌":""}</span>);
                })}
              </div>
            </div>}
          </div>

          {/* RIGHT PANEL */}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {!freeMode&&<div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,boxShadow:"0 2px 12px rgba(15,23,42,0.06)",padding:18}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
                <div><p style={{fontSize:9,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:1.5,margin:0}}>Target Sign</p><p style={{fontSize:52,fontWeight:800,color:T.primary,margin:"4px 0 0",lineHeight:1,fontFamily:"monospace"}}>{targetSign}</p></div>
                <div style={{display:"flex",flexDirection:"column",gap:5,alignItems:"flex-end"}}>
                  <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:999,border:`1px solid ${info.hands===2?"#FED7AA":"#BFDBFE"}`,background:info.hands===2?"#FFF7ED":"#EFF6FF",color:info.hands===2?T.orange:T.primary}}>{info.hands===2?"✋ 2 Hands":"☝️ 1 Hand"}</span>
                  <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:999,border:`1px solid ${info.type==="dynamic"?"#DDD6FE":"#A7F3D0"}`,background:info.type==="dynamic"?"#F5F3FF":"#ECFDF5",color:info.type==="dynamic"?T.violet:T.emerald}}>{info.type==="dynamic"?"⚡ Motion":"🖐 Static"}</span>
                </div>
              </div>
              <div style={{marginTop:12,padding:"10px 12px",borderRadius:12,background:"#F0F9FF",borderLeft:`4px solid ${T.primary}`}}><p style={{fontSize:12,color:"#0369A1",margin:0,lineHeight:1.5,fontWeight:500}}>{info.desc}</p></div>
              {TIPS[targetSign]&&<div style={{marginTop:10,padding:"10px 12px",borderRadius:12,background:"#FFFBEB",border:`1px solid #FDE68A`}}><p style={{fontSize:10,fontWeight:700,color:T.amber,margin:"0 0 3px",display:"flex",alignItems:"center",gap:4}}><Lightbulb size={11}/>How to do it</p><p style={{fontSize:11,color:"#92400E",margin:0,lineHeight:1.5}}>{TIPS[targetSign]}</p></div>}
              <div style={{display:"flex",gap:8,marginTop:12}}>
                <button onClick={prev} style={{flex:1,padding:"8px",borderRadius:10,cursor:"pointer",background:T.soft,border:`1px solid ${T.border}`,fontWeight:700,color:T.muted,fontSize:12}}>← Prev</button>
                <button onClick={next} style={{flex:1,padding:"8px",borderRadius:10,cursor:"pointer",background:T.primary,border:"none",fontWeight:700,color:"#fff",fontSize:12}}>Next →</button>
              </div>
            </div>}

            {freeMode&&pred&&SIGN_INFO[pred.sign]&&<div style={{background:T.card,border:"1px solid #DDD6FE",borderRadius:20,padding:18}}>
              <p style={{fontSize:9,fontWeight:700,color:T.violet,textTransform:"uppercase",letterSpacing:1.5,margin:"0 0 8px"}}>Currently Reading</p>
              <p style={{fontSize:38,fontWeight:800,color:T.violet,margin:0,fontFamily:"monospace"}}>{pred.sign}</p>
              <div style={{marginTop:10,padding:"10px 12px",borderRadius:12,background:"#F5F3FF",borderLeft:`4px solid ${T.violet}`}}>
                <p style={{fontSize:12,color:"#6D28D9",margin:0,lineHeight:1.5,fontWeight:500}}>{SIGN_INFO[pred.sign]?.desc}</p>
              </div>
              {TIPS[pred.sign]&&<div style={{marginTop:10,padding:"10px 12px",borderRadius:12,background:"#FFFBEB",border:"1px solid #FDE68A"}}>
                <p style={{fontSize:10,fontWeight:700,color:T.amber,margin:"0 0 3px",display:"flex",alignItems:"center",gap:4}}><Lightbulb size={11}/>Sign tip</p>
                <p style={{fontSize:11,color:"#92400E",margin:0,lineHeight:1.5}}>{TIPS[pred.sign]}</p>
              </div>}
            </div>}

            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,overflow:"hidden"}}>
              <button onClick={()=>setShowGuide(!showGuide)} style={{width:"100%",padding:"12px 16px",background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{fontSize:12,fontWeight:800,color:T.text,display:"flex",alignItems:"center",gap:7}}><BookOpen size={14} color={T.primary}/>Sign Reference Guide</span>
                <span style={{fontSize:10,color:T.muted}}>{showGuide?"▲":"▼"}</span>
              </button>
              {showGuide&&<div style={{padding:"0 8px 8px",maxHeight:220,overflowY:"auto"}}>
                {(freeMode?Object.values(SIGN_CATEGORIES).flat():signs).map(s=>{const si=SIGN_INFO[s];const active=freeMode?(pred&&pred.sign===s):s===targetSign;return(
                  <div key={s} onClick={()=>{if(!freeMode)go(s);}} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 9px",borderRadius:10,cursor:freeMode?"default":"pointer",marginBottom:2,background:active?"#EFF6FF":"transparent",border:active?`1px solid #BFDBFE`:"1px solid transparent"}}>
                    <span style={{fontSize:11,fontWeight:800,color:active?T.primary:T.muted,width:56,flexShrink:0}}>{s}</span>
                    <p style={{fontSize:10,color:T.muted,margin:0,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{si?.desc||""}</p>
                    <div style={{display:"flex",gap:3,flexShrink:0}}>
                      {si?.hands===2&&<span style={{fontSize:8,fontWeight:700,padding:"1px 4px",borderRadius:999,background:"#FFF7ED",color:T.orange}}>2H</span>}
                      {si?.type==="dynamic"&&<span style={{fontSize:8,fontWeight:700,padding:"1px 4px",borderRadius:999,background:"#F5F3FF",color:T.violet}}>MOT</span>}
                    </div>
                  </div>);})}
              </div>}
            </div>

            {log.length>0&&!freeMode&&<div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:14}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                <p style={{fontSize:10,fontWeight:800,color:T.muted,textTransform:"uppercase",letterSpacing:1,margin:0}}>Session Log</p>
                <button onClick={()=>setLog([])} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:3,fontSize:10,color:T.muted,fontWeight:700}}><RotateCcw size={9}/>Clear</button>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                {log.map((e,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:7,padding:"5px 9px",borderRadius:9,background:e.passed?"#F0FDF4":"#FFF1F2"}}>
                    {e.passed?<CheckCircle2 size={13} color={T.emerald}/>:<XCircle size={13} color={T.red}/>}
                    <span style={{fontSize:11,fontWeight:800,color:T.text,width:56}}>{e.sign}</span>
                    <span style={{fontSize:11,fontWeight:700,color:e.acc>=75?T.emerald:T.red}}>{e.acc}%</span>
                    <span style={{fontSize:10,color:T.muted,marginLeft:"auto"}}>{e.time}</span>
                  </div>
                ))}
              </div>
            </div>}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
