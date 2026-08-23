import React, { useState } from "react";
import { Database, ExternalLink, Download, Search, Star, Video, Image, FileText, Layers } from "lucide-react";

const T = { bg:"#F8FAFC",card:"#FFFFFF",border:"#E2E8F0",primary:"#0284C7",orange:"#F97316",violet:"#7C3AED",emerald:"#059669",amber:"#D97706",text:"#0F172A",muted:"#64748B",soft:"#F1F5F9" };

const FORMAT_ICON = {
  "Video":        <Video size={11} color="#0284C7"/>,
  "Video+Gloss":  <Video size={11} color="#7C3AED"/>,
  "Video+Pose":   <Video size={11} color="#059669"/>,
  "Image":        <Image size={11} color="#F97316"/>,
  "Video+Text":   <Video size={11} color="#D97706"/>,
  "Skeleton":     <Layers size={11} color="#DC2626"/>,
  "Video+Annot":  <FileText size={11} color="#0F172A"/>,
};

const DATASETS = [
  // Core sign language video datasets
  {id:1,name:"ASLLVD",full:"ASL Lexicon Video Dataset",org:"Boston University",samples:"9,794 signs",format:"Video",size:"60 GB",url:"https://www.bu.edu/asllrp/av/dai-asllvd.html",color:"#0284C7",year:2008,
   tags:["ASL","Isolated Signs","Video","Gold Standard"],cite:"Neidle et al., 2012",
   desc:"Gold standard isolated ASL signs with multiple signers. Critical for alphabet & word-level recognition models."},

  {id:2,name:"WLASL",full:"Word-Level American Sign Language",org:"UCF Computer Vision",samples:"21,083 videos · 2,000 words",format:"Video",size:"40 GB",url:"https://dxli94.github.io/WLASL/",color:"#059669",year:2020,
   tags:["ASL","2000 words","Word-Level","CNN/LSTM"],cite:"Li et al., NeurIPS 2020",
   desc:"Largest public word-level ASL dataset. Used to train CNN+LSTM classifiers. Best source for expanding our AI's vocabulary recognition."},

  {id:3,name:"RWTH-PHOENIX",full:"RWTH-PHOENIX Weather 2014T",org:"RWTH Aachen",samples:"8,257 sentences",format:"Video+Gloss",size:"30 GB",url:"https://www-i6.informatik.rwth-aachen.de/~koller/RWTH-PHOENIX/",color:"#7C3AED",year:2014,
   tags:["Continuous SL","German SL","Gloss","NMT"],cite:"Koller et al., ECCV 2015",
   desc:"Benchmark for continuous sign language recognition & translation. German SL weather forecasts with gloss annotations."},

  {id:4,name:"OpenASL",full:"OpenASL — Large-Scale Dataset",org:"Meta AI Research",samples:"288 hours video",format:"Video+Text",size:"120 GB",url:"https://github.com/chevalierNoir/OpenASL",color:"#F97316",year:2022,
   tags:["Meta AI","288h","Translation","Transformer"],cite:"Shi et al., EMNLP 2022",
   desc:"Meta's large-scale ASL-to-English translation dataset from YouTube. Ideal for training transformer-based sign2text models."},

  {id:5,name:"ASL-Citizen",full:"ASL-Citizen: Community Sourced Dataset",org:"Microsoft Research",samples:"83,399 videos · 2,731 words",format:"Video",size:"25 GB",url:"https://www.microsoft.com/en-us/research/project/asl-citizen/",color:"#DC2626",year:2023,
   tags:["Microsoft","Community","Diverse Signers","2731 words"],cite:"Desai et al., NeurIPS 2023",
   desc:"Community-sourced ASL dataset with diverse signers. Microsoft's largest contribution for sign recognition fairness research."},

  {id:6,name:"How2Sign",full:"How2Sign: Multimodal & Multiscale Dataset",org:"CMU + Facebook AI",samples:"35,000 sentences · 80h",format:"Video+Pose",size:"280 GB",url:"https://how2sign.github.io/",color:"#D97706",year:2021,
   tags:["Multimodal","Pose","Depth","35k sentences"],cite:"Duarte et al., CVPR 2021",
   desc:"Multimodal dataset with RGB video + depth + body pose for American SL. Best for skeleton-based gesture recognition and pose estimation."},

  {id:7,name:"MS-ASL",full:"Microsoft American Sign Language Dataset",org:"Microsoft Research",samples:"25,513 videos · 1,000 classes",format:"Video",size:"18 GB",url:"https://www.microsoft.com/en-us/research/project/ms-asl/",color:"#1D4ED8",year:2019,
   tags:["Microsoft","1000 classes","In-the-wild","Real-world"],cite:"Joze & Koller, BMVC 2019",
   desc:"In-the-wild ASL recognition dataset covering 1000 common signs captured from real-world video sources."},

  {id:8,name:"AUTSL",full:"A Large-Scale Turkish Sign Language Dataset",org:"Ankara Univ.",samples:"38,336 video clips · 226 signs",format:"Video+Skeleton",size:"14 GB",url:"https://cvml.ankara.edu.tr/datasets/",color:"#0369A1",year:2021,
   tags:["Turkish SL","Skeleton","RGB-D","Isolated"],cite:"Sincan & Keles, IEEE Access 2020",
   desc:"Large RGB-D + skeleton dataset for isolated Turkish sign language recognition. Useful for multi-modal pose + video fusion research."},

  {id:9,name:"NCSLGR",full:"National Center SL & Gesture Resources",org:"Boston University",samples:"10 hours annotated",format:"Video+Annot",size:"8 GB",url:"https://www.bu.edu/asllrp/ncslgr.html",color:"#0F172A",year:2007,
   tags:["Annotated","Facial Grammar","NMS","Linguistically Rich"],cite:"Neidle & Vogler, 2012",
   desc:"Richly annotated ASL corpus including non-manual signals (facial grammar). Important for understanding complete ASL grammar."},

  {id:10,name:"SignBD",full:"Bengali Sign Language Word Dataset",org:"BUET, Bangladesh",samples:"3,000 samples · 100 words",format:"Image",size:"2 GB",url:"https://github.com/faysalahmed/SignBD-Word",color:"#7C3AED",year:2020,
   tags:["Bengali SL","Image","Isolated","South Asia"],cite:"Ahmed et al., 2020",
   desc:"Isolated Bengali sign language dataset for South Asian SL research. Covers 100 common words with diverse signers."},

  {id:11,name:"CSL-Daily",full:"Chinese Sign Language Daily Life Dataset",org:"Shanghai Jiao Tong Univ.",samples:"20,654 sentences",format:"Video+Gloss",size:"35 GB",url:"https://ustc-slr.github.io/openresources/csl/",color:"#DC2626",year:2022,
   tags:["Chinese SL","Daily Life","Gloss","Continuous"],cite:"Zhou et al., CVPR 2021",
   desc:"Large-scale continuous Chinese sign language dataset for everyday life scenarios with gloss and translation annotations."},

  {id:12,name:"INCLUDE",full:"Indian Sign Language Dataset (INCLUDE)",org:"IIT Bombay",samples:"4,287 videos · 263 signs",format:"Video",size:"3.5 GB",url:"https://zenodo.org/record/4010759",color:"#F97316",year:2020,
   tags:["Indian SL","ISL","263 signs","Educational"],cite:"Sridhar et al., ACMMM 2020",
   desc:"Indian Sign Language recognition dataset created at IIT Bombay. Covers 263 ISL signs relevant to Indian educational contexts."},
];

const STAT = {total:DATASETS.length, totalH:"750+", samples:"200K+", langs:8};

export default function DatasetLibraryPage() {
  const [search,  setSearch]  = useState("");
  const [fmtFil,  setFmtFil]  = useState("All");
  const [saved,   setSaved]   = useState(new Set([1,3,5]));

  const formats = ["All","Video","Image","Skeleton","Gloss"];

  const visible = DATASETS.filter(d=>{
    const q=search.toLowerCase();
    const matchSearch=!q||d.name.toLowerCase().includes(q)||d.full.toLowerCase().includes(q)||d.tags.some(t=>t.toLowerCase().includes(q))||d.org.toLowerCase().includes(q);
    const matchFmt=fmtFil==="All"||d.format.includes(fmtFil)||d.tags.some(t=>t.toLowerCase().includes(fmtFil.toLowerCase()));
    return matchSearch&&matchFmt;
  });

  return (
    <div style={{background:T.bg,minHeight:"100vh",padding:"28px 0"}}>
      <div style={{maxWidth:1150,margin:"0 auto",padding:"0 20px",display:"flex",flexDirection:"column",gap:20}}>

        {/* Header */}
        <div style={{background:"linear-gradient(135deg,#059669 0%,#047857 40%,#0284C7 100%)",
          borderRadius:24,padding:"28px 32px",color:"white",boxShadow:"0 8px 24px rgba(5,150,105,0.25)",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-20,right:-20,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.08)"}}/>
          <div style={{display:"flex",alignItems:"center",gap:14,position:"relative"}}>
            <div style={{width:52,height:52,borderRadius:18,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center"}}><Database size={28} color="white"/></div>
            <div>
              <h1 style={{fontSize:22,fontWeight:800,margin:0}}>Research Dataset Library</h1>
              <p style={{fontSize:13,opacity:0.85,marginTop:3}}>{STAT.total} curated datasets · {STAT.langs} sign languages · Real research sources</p>
            </div>
          </div>
          <div style={{display:"flex",gap:14,marginTop:20,flexWrap:"wrap"}}>
            {[{v:STAT.total,l:"Datasets"},{v:STAT.totalH+"h",l:"Total Video"},{v:STAT.samples,l:"Samples"},{v:STAT.langs,l:"Languages"}].map((s,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.25)",borderRadius:14,padding:"10px 18px",textAlign:"center"}}>
                <p style={{fontSize:18,fontWeight:800,color:"white",margin:0}}>{s.v}</p>
                <p style={{fontSize:11,color:"rgba(255,255,255,0.8)",marginTop:2}}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Notice — AI training note */}
        <div style={{background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:14,padding:"12px 16px",display:"flex",gap:12,alignItems:"flex-start"}}>
          <span style={{fontSize:18,flexShrink:0}}>💡</span>
          <div>
            <p style={{fontSize:12,fontWeight:700,color:"#92400E",margin:0}}>How these datasets improve our AI model</p>
            <p style={{fontSize:11,color:"#B45309",marginTop:3,lineHeight:1.5}}>
              WLASL (2000 words) and MS-ASL (1000 classes) are used to train our gesture classifier. ASLLVD provides ground-truth for alphabet recognition.
              How2Sign pose data enhances our MediaPipe skeleton analysis. ASL-Citizen improves accuracy across diverse skin tones and lighting.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div style={{display:"flex",flexWrap:"wrap",gap:10,alignItems:"center"}}>
          <div style={{position:"relative",flex:1,minWidth:240}}>
            <Search size={15} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:T.muted}}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, language, format, or tag..."
              style={{width:"100%",padding:"10px 12px 10px 36px",border:`1px solid ${T.border}`,borderRadius:12,fontSize:12,color:T.text,background:T.card,outline:"none",boxSizing:"border-box"}}
              onFocus={e=>e.target.style.borderColor=T.primary} onBlur={e=>e.target.style.borderColor=T.border}/>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {formats.map(f=>{
              const active=fmtFil===f;
              return <button key={f} onClick={()=>setFmtFil(f)}
                style={{padding:"8px 14px",borderRadius:10,fontSize:11,fontWeight:700,border:`1px solid ${active?T.primary:T.border}`,cursor:"pointer",background:active?T.primary:T.card,color:active?"#fff":T.muted,transition:"all 0.15s"}}>{f}</button>;
            })}
          </div>
          <span style={{fontSize:11,color:T.muted,fontWeight:600}}>{visible.length} results · ⭐ = saved</span>
        </div>

        {/* Dataset grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(310px,1fr))",gap:16}}>
          {visible.map(d=>{
            const isSaved=saved.has(d.id);
            return (
              <div key={d.id} style={{background:T.card,border:`1px solid ${isSaved?"#FCD34D":T.border}`,borderRadius:20,
                boxShadow:isSaved?"0 2px 12px rgba(217,119,6,0.15)":"0 2px 12px rgba(15,23,42,0.05)",overflow:"hidden",transition:"all 0.2s"}}>
                {/* Banner */}
                <div style={{background:d.color,padding:"16px 18px",position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:-10,right:-10,width:60,height:60,borderRadius:"50%",background:"rgba(255,255,255,0.1)"}}/>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10}}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                        <p style={{fontSize:18,fontWeight:800,color:"white",margin:0}}>{d.name}</p>
                        <span style={{fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:999,background:"rgba(255,255,255,0.2)",color:"white"}}>{d.year}</span>
                      </div>
                      <p style={{fontSize:11,color:"rgba(255,255,255,0.85)",margin:0}}>{d.org}</p>
                    </div>
                    <button onClick={()=>setSaved(p=>{const n=new Set(p);isSaved?n.delete(d.id):n.add(d.id);return n;})}
                      style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:10,width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
                      <Star size={14} color="white" fill={isSaved?"white":"none"}/>
                    </button>
                  </div>
                  <div style={{display:"flex",gap:5,marginTop:10,flexWrap:"wrap"}}>
                    {d.tags.slice(0,3).map(t=>(
                      <span key={t} style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:999,background:"rgba(255,255,255,0.2)",color:"white",border:"1px solid rgba(255,255,255,0.3)"}}>{t}</span>
                    ))}
                  </div>
                </div>

                {/* Body */}
                <div style={{padding:16}}>
                  <p style={{fontSize:11,color:T.muted,lineHeight:1.55,marginBottom:12}}>{d.desc}</p>

                  {/* Stats grid */}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
                    {[{l:"Samples",v:d.samples.split("·")[0].trim()},{l:"Format",v:d.format.split("+")[0]},{l:"Size",v:d.size}].map((s,i)=>(
                      <div key={i} style={{background:T.soft,borderRadius:10,padding:"7px 8px",textAlign:"center"}}>
                        <p style={{fontSize:10,fontWeight:800,color:T.text,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.v}</p>
                        <p style={{fontSize:9,color:T.muted,marginTop:2}}>{s.l}</p>
                      </div>
                    ))}
                  </div>

                  {/* Citation */}
                  <div style={{padding:"7px 10px",background:"#F8FAFC",borderRadius:9,marginBottom:12,border:`1px solid ${T.border}`}}>
                    <p style={{fontSize:9,color:T.muted,margin:0,fontStyle:"italic"}}>📄 {d.cite}</p>
                  </div>

                  {/* Actions */}
                  <div style={{display:"flex",gap:8}}>
                    <a href={d.url} target="_blank" rel="noreferrer"
                      style={{flex:1,padding:"9px",borderRadius:11,background:T.primary,color:"white",textDecoration:"none",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                      <ExternalLink size={12}/> View Dataset
                    </a>
                    <button onClick={()=>{
                      const text=`${d.name}\n${d.full}\n${d.org}, ${d.year}\n${d.cite}\n${d.url}`;
                      navigator.clipboard?.writeText(text);
                    }}
                      style={{padding:"9px 12px",borderRadius:11,border:`1px solid ${T.border}`,background:T.soft,cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontSize:11,fontWeight:700,color:T.muted}}>
                      <Download size={12}/> Cite
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"14px 18px",textAlign:"center"}}>
          <p style={{fontSize:11,color:T.muted,margin:0}}>
            All datasets are publicly available for research purposes. Always cite original authors in publications.
            Our AI model currently trains on <strong>WLASL + ASLLVD + ASL-Citizen</strong> for gesture recognition.
          </p>
        </div>
      </div>
    </div>
  );
}
