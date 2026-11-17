/* Retention, local personalization, sharing, language, ads and PWA glue. No backend required. */
(() => {
  "use strict";
  const NS="weddingAtelier:v2", MAX=20, $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const fallback={favorites:[],recentDesigns:[],recentTools:[],copiedPrompts:[],generatedPrompts:[],favoriteTools:[],recentSearches:[],preferences:{}};
  function read(){try{const x=JSON.parse(localStorage.getItem(NS)||"null");if(x&&typeof x==="object")return {...fallback,...x};const old=JSON.parse(localStorage.getItem("wmd-favorites")||"[]");return {...fallback,favorites:Array.isArray(old)?old.filter(v=>typeof v==="string"):[]};}catch{return JSON.parse(JSON.stringify(fallback));}}
  let store=read();
  function write(){try{localStorage.setItem(NS,JSON.stringify(store));return true}catch(e){try{const slim={...store,recentDesigns:store.recentDesigns.slice(0,8),recentTools:store.recentTools.slice(0,8),copiedPrompts:store.copiedPrompts.slice(0,5),generatedPrompts:store.generatedPrompts.slice(0,5)};localStorage.setItem(NS,JSON.stringify(slim));store=slim;return true}catch{return false}}}
  function add(list,item,max=MAX){store[list]=[item,...(store[list]||[]).filter(x=>x.id!==item.id)].slice(0,max);write();}
  function getDesign(id){return window.AtelierDesignIndex?.get(id)||null;}
  function renderRecent(){const bar=$("#libraryPersonalBar"),out=$("#recentlyViewedList");if(!bar||!out)return;const items=(store.recentDesigns||[]).map(x=>getDesign(x.id)).filter(Boolean).slice(0,5);if(!items.length){bar.hidden=true;return}bar.hidden=false;out.innerHTML=items.map(d=>`<button type="button" class="recent-chip" data-recent-design="${d.id}">${escape(d.name)}</button>`).join("");}
  function escape(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':'&quot;',"'":"&#39;"}[c]));}
  function daily(){const items=(window.CATEGORY_DATA||[]).flatMap(c=>c.designs.map(d=>({...d,category:c.name})));if(!items.length)return;const day=Math.floor(Date.now()/86400000),d=items[day%items.length];const title=$("#dailyIdeaTitle"),text=$("#dailyIdeaText");if(title)title.textContent=d.name;if(text)text.textContent=`${d.category} · ${d.subcategory} — ${d.description}`;}
  function surprise(){const cats=window.CATEGORY_DATA||[];if(!cats.length)return;const c=cats[Math.floor(Math.random()*cats.length)],d=c.designs[Math.floor(Math.random()*c.designs.length)];if(typeof window.AtelierOpenDesign==="function")window.AtelierOpenDesign(d.id);else{$(`#categoryNav [data-category="${CSS.escape(c.name)}"]`)?.click();setTimeout(()=>{const b=$(`[data-view="${d.id}"]`);b?.click()},0)}window.trackEvent?.("surprise_me",{category:c.name});}
  function shareCurrent(){const url=window.location.href,title=document.title; if(navigator.share){navigator.share({title,url}).catch(()=>{});}else{navigator.clipboard?.writeText(url).then(()=>showToast("Link copied")).catch(()=>showToast("Copy the page URL from your browser."));}}
  function showToast(msg){const t=$("#toast");if(t){t.textContent=msg;t.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.classList.remove("show"),2200)}}
  function setupLanguage(){const sel=$("#languageSelect");if(!sel)return;try{sel.value=localStorage.getItem("atelier:language")||((navigator.language||"en").slice(0,2))}catch{sel.value=(navigator.language||"en").slice(0,2)}sel.addEventListener("change",()=>{try{localStorage.setItem("atelier:language",sel.value)}catch{};window.dispatchEvent(new Event("atelier:languagechange"));window.trackEvent?.("language_change",{language:sel.value})});}
  function setupPersonalization(){
    $("#surpriseMe")?.addEventListener("click",surprise);
    $("#clearRecent")?.addEventListener("click",()=>{store.recentDesigns=[];write();renderRecent();showToast("Recent history cleared")});
    document.addEventListener("click",e=>{
      const b=e.target.closest("[data-view]");if(b){const d=getDesign(b.dataset.view);if(d){add("recentDesigns",{id:d.id,at:Date.now()});renderRecent();window.trackEvent?.("design_opened",{category:d.category,subcategory:d.subcategory});}}
      const rc=e.target.closest("[data-recent-design]");if(rc&&typeof window.AtelierOpenDesign==="function")window.AtelierOpenDesign(rc.dataset.recentDesign);
      const copy=e.target.closest("[data-copy]");if(copy){const d=getDesign(copy.dataset.copy);if(d){add("copiedPrompts",{id:d.id,name:d.name,at:Date.now()});window.trackEvent?.("prompt_copied",{category:d.category});}}
    },true);
    renderRecent();daily();
  }
  function setupTools(){
    const favKey=id=>`atelier:tool:${id}`;
    function syncToolFavorites(){const n=$$("[data-tool-favorite]");n.forEach(b=>{let saved=false;try{saved=localStorage.getItem(favKey(b.dataset.toolFavorite))==="1"}catch{}b.textContent=saved?"♥":"♡";b.classList.toggle("saved",saved);b.setAttribute("aria-pressed",String(saved));b.setAttribute("aria-label",saved?"Remove saved tool":"Save tool")});const c=$("#favoriteToolCount");if(c)c.textContent=String(n.filter(b=>b.getAttribute("aria-pressed")==="true").length);}
    $("#favoriteToolsFilter")?.addEventListener("click",e=>{const b=e.currentTarget;b.setAttribute("aria-pressed",String(b.getAttribute("aria-pressed")!=="true"));const active=b.getAttribute("aria-pressed")==="true";$$('[data-tool-favorite]').forEach(f=>{const show=!active||f.getAttribute("aria-pressed")==="true";f.closest(".tool-entry").hidden=!show});$$('.tool-group').forEach(g=>g.hidden=![...g.querySelectorAll('.tool-name-link')].some(a=>!a.hidden));});
    $("#toolSearchInput")?.addEventListener("input",e=>{const q=e.target.value.trim().toLowerCase();store.recentSearches=[q,...(store.recentSearches||[]).filter(x=>x!==q)].slice(0,10);write();$$('.tool-name-link').forEach(a=>{a.hidden=q&&!a.textContent.toLowerCase().includes(q)});$$('.tool-group').forEach(g=>g.hidden=![...g.querySelectorAll('.tool-name-link')].some(a=>!a.hidden));window.trackEvent?.("tool_search",{query_length:q.length});});
    document.addEventListener("click",e=>{
      const fav=e.target.closest("[data-tool-favorite]");
      if(fav){e.preventDefault();e.stopPropagation();const id=fav.dataset.toolFavorite;try{const saved=localStorage.getItem(favKey(id))==="1";if(saved)localStorage.removeItem(favKey(id));else localStorage.setItem(favKey(id),"1")}catch{}syncToolFavorites();window.trackEvent?.("tool_favorite_toggle",{tool:id});return}
      const a=e.target.closest('.tool-name-link');if(a){const id=a.getAttribute('href')?.slice(6);if(id){add("recentTools",{id,at:Date.now()});window.trackEvent?.("tool_opened",{tool:id});}}
    });
    syncToolFavorites();
  }
  function setupSafeShare(){
    const host=$(".tool-title-row");if(host&&!$("#sharePage")){const b=document.createElement("button");b.id="sharePage";b.type="button";b.className="button button-outline";b.textContent="Share this page";b.addEventListener("click",shareCurrent);host.appendChild(b)}
  }
  function registerPWA(){if("serviceWorker" in navigator && location.protocol!="file:")window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));}
  function setupAds(){const cfg=window.ATELIER_CONFIG?.ADS;if(cfg?.enabled){$$('.ad-slot').forEach(s=>s.classList.add("ad-ready"));}else $$('.ad-slot').forEach(s=>s.classList.add("ad-disabled"));}
  function installDesignIndexBridge(){const tryIt=()=>{if(window.CATEGORY_DATA&&!window.AtelierDesignIndex){window.AtelierDesignIndex=new Map(window.CATEGORY_DATA.flatMap(c=>c.designs.map(d=>[d.id,{...d,category:c.name,categoryIcon:c.icon}])));daily();renderRecent();}};tryIt();setTimeout(tryIt,100);}
  function installOpenBridge(){const original=window.AtelierOpenDesign;if(original)return;document.addEventListener("click",e=>{const b=e.target.closest('[data-recent-design]');if(b){const target=$(`[data-view="${CSS.escape(b.dataset.recentDesign)}"]`);target?.click()}})}
  function setupCanonical(){const url=window.ATELIER_CONFIG?.SITE_URL;if(!url)return;let link=document.querySelector('link[rel="canonical"]');if(!link){link=document.createElement('link');link.rel='canonical';document.head.appendChild(link)}link.href=url.replace(/\/$/,"/");const og=document.querySelector('meta[property="og:url"]')||document.head.appendChild(Object.assign(document.createElement('meta'),{property:'og:url'}));og.content=link.href;}
  function setupConsent(){
    const cfg=window.ATELIER_CONFIG||{}; const needs=cfg.ANALYTICS?.measurementId || cfg.ADS?.enabled; if(!needs)return;
    let c; try{c=JSON.parse(localStorage.getItem("atelier:consent")||"null")}catch{}
    if(c)return;
    const bar=document.createElement("aside");bar.className="consent-bar";bar.setAttribute("role","dialog");bar.setAttribute("aria-label","Privacy preferences");bar.innerHTML=`<div><strong>Privacy choices</strong><p>Choose whether this site may use optional analytics or advertising services. Essential browser functionality works without consent.</p></div><div class="consent-actions"><button type="button" class="button button-quiet" data-consent="reject">Reject optional</button><button type="button" class="button button-gold" data-consent="accept">Allow optional</button></div>`;document.body.appendChild(bar);
    bar.addEventListener("click",e=>{const b=e.target.closest("[data-consent]");if(!b)return;const allow=b.dataset.consent==="accept";try{localStorage.setItem("atelier:consent",JSON.stringify({analytics:allow,advertising:allow,at:Date.now()}))}catch{};bar.remove();window.dispatchEvent(new CustomEvent("atelier:consent",{detail:{analytics:allow,advertising:allow}}));});
  }
  setupConsent();setupLanguage();setupPersonalization();setupTools();setupSafeShare();registerPWA();setupAds();setupCanonical();installDesignIndexBridge();installOpenBridge();
  window.addEventListener("hashchange",()=>{setTimeout(()=>{renderRecent();setupSafeShare()},0)});
})();
