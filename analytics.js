/* Provider-neutral analytics boundary. Optional analytics are consent-gated and disabled until configured. */
(() => {
  "use strict";
  const cfg = window.ATELIER_CONFIG?.ANALYTICS || {};
  const configured = cfg.provider === "google-analytics" && /^G-[A-Z0-9]+$/i.test(cfg.measurementId || "");
  let enabled = false, ready = false;
  function hasConsent(){try{return JSON.parse(localStorage.getItem("atelier:consent")||"null")?.analytics===true}catch{return false}}
  function loadGA(){
    if (!configured || ready || !hasConsent()) return;
    const id=cfg.measurementId, s=document.createElement("script"); s.async=true; s.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`; s.dataset.atelierAnalytics="true"; document.head.appendChild(s);
    window.dataLayer=window.dataLayer||[]; window.gtag=window.gtag||function(){window.dataLayer.push(arguments)}; window.gtag("js",new Date()); window.gtag("config",id,{anonymize_ip:true,send_page_view:false}); ready=true;enabled=true;
  }
  loadGA(); window.addEventListener("atelier:consent",loadGA);
  window.trackEvent=function(name,params={}){if(!enabled||typeof window.gtag!=="function")return;const safe={};Object.entries(params||{}).forEach(([k,v])=>{if(typeof v==="string"&&v.length<=120&&!/prompt|password|email|phone|image|file|content/i.test(k))safe[k]=v;else if(typeof v==="number"||typeof v==="boolean")safe[k]=v});window.gtag("event",String(name).slice(0,40),safe)};
  window.AtelierAnalytics=Object.freeze({track:window.trackEvent,isConfigured:configured,get enabled(){return enabled}});
})();
