(() => {
  "use strict";
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
  const state = {category:CATEGORY_DATA[0].name, subcategory:"All", search:"", sort:"featured", favoritesOnly:false, favorites:new Set(loadFavorites()), viewed:[], visibleCount:18, currentPrompt:"", generation:0};
  const categoryNav=$("#categoryNav"), designGrid=$("#designGrid"), subcategoryRow=$("#subcategoryRow");
  const dialog=$("#designDialog"), dialogContent=$("#dialogContent"), toast=$("#toast");
  function loadFavorites(){try{return JSON.parse(localStorage.getItem("wmd-favorites")||"[]")}catch{return []}}
  function saveFavorites(){try{localStorage.setItem("wmd-favorites",JSON.stringify([...state.favorites]))}catch{}}
  function escapeHtml(value){return String(value).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
  function currentCategory(){return CATEGORY_DATA.find(c=>c.name===state.category)||CATEGORY_DATA[0]}
  function allDesigns(){return CATEGORY_DATA.flatMap(c=>c.designs.map(d=>({...d,category:c.name,categoryIcon:c.icon})))}
  function getDesign(id){return allDesigns().find(d=>d.id===id)}
  function showToast(message){toast.textContent=message;toast.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove("show"),2300)}
  async function copyText(text){try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text)}else{const area=document.createElement("textarea");area.value=text;area.style.position="fixed";area.style.opacity="0";document.body.appendChild(area);area.select();const ok=document.execCommand("copy");area.remove();if(!ok)throw new Error("Clipboard unavailable")}showToast("Prompt copied to clipboard")}catch{showToast("Copy was blocked by your browser. Select and copy the prompt manually.")}}
  function artStyle(palette){return `--art-bg:${palette.bg};--art-ink:${palette.ink};--art-line:${palette.line}`}
  function renderCategories(){
    $("#categoryCount").textContent=String(CATEGORY_DATA.length).padStart(2,"0");
    categoryNav.innerHTML=CATEGORY_DATA.map(c=>`<button class="category-link ${c.name===state.category?"active":""}" data-category="${escapeHtml(c.name)}"><span class="cat-icon">${c.icon}</span><span>${escapeHtml(c.name)}</span><span class="cat-count">250</span></button>`).join("");
    $("#genCategory").innerHTML=CATEGORY_DATA.map(c=>`<option value="${escapeHtml(c.name)}">${escapeHtml(c.name)}</option>`).join("");
    $("#genCategory").value=state.category;
  }
  function renderSubcategories(){
    const subs=["All",...new Set(currentCategory().designs.map(d=>d.subcategory))];
    subcategoryRow.innerHTML=subs.map(s=>`<button class="subcat ${s===state.subcategory?"active":""}" data-subcategory="${escapeHtml(s)}">${escapeHtml(s)}</button>`).join("");
  }
  function filteredDesigns(){
    let list=currentCategory().designs.map(d=>({...d,category:state.category,categoryIcon:currentCategory().icon}));
    if(state.subcategory!=="All")list=list.filter(d=>d.subcategory===state.subcategory);
    if(state.search){const q=state.search.toLowerCase();list=list.filter(d=>`${d.name} ${d.description} ${d.prompt} ${d.subcategory} ${d.category}`.toLowerCase().includes(q))}
    if(state.favoritesOnly)list=list.filter(d=>state.favorites.has(d.id));
    if(state.sort==="az")list.sort((a,b)=>a.name.localeCompare(b.name));
    if(state.sort==="za")list.sort((a,b)=>b.name.localeCompare(a.name));
    return list;
  }
  function cardMarkup(d){
    const saved=state.favorites.has(d.id);
    return `<article class="design-card"><div class="design-art" style="${artStyle(d.palette)}"><span class="art-index">${d.id.toUpperCase()}</span><span class="art-symbol" aria-hidden="true">${d.mark}</span><button class="favorite-btn ${saved?"saved":""}" data-favorite="${d.id}" aria-label="${saved?"Remove from":"Save to"} favorites" aria-pressed="${saved}">${saved?"♥":"♡"}</button></div><div class="card-body"><span class="card-kicker">${escapeHtml(d.subcategory)}</span><h4>${escapeHtml(d.name)}</h4><p>${escapeHtml(d.description)}</p><div class="card-actions"><button data-view="${d.id}">View details ↗</button><button class="copy-card" data-copy="${d.id}">Copy prompt ▣</button></div></div></article>`;
  }
  function renderDesigns(){
    const list=filteredDesigns();const shown=list.slice(0,state.visibleCount);
    designGrid.innerHTML=shown.map(cardMarkup).join("");
    $("#activeCategoryTitle").textContent=state.category;
    $("#categoryEyebrow").textContent=`COLLECTION / ${String(CATEGORY_DATA.findIndex(c=>c.name===state.category)+1).padStart(2,"0")}`;
    $("#resultCount").textContent=`${list.length} ${list.length===1?"concept":"concepts"}`;
    $("#showingCount").textContent=shown.length;
    $("#savedCount").textContent=state.favorites.size;
    $("#emptyState").hidden=list.length!==0;
    let more=$("#loadMore");
    if(!more){more=document.createElement("button");more.id="loadMore";more.className="button button-outline";more.textContent="Load more designs";more.style.cssText="display:block;margin:22px auto 0";$("#designGrid").after(more);more.addEventListener("click",()=>{state.visibleCount+=18;renderDesigns()})}
    more.hidden=list.length<=shown.length;
  }
  function selectCategory(name){state.category=name;state.subcategory="All";state.visibleCount=18;state.favoritesOnly=false;$("#favoritesFilter").setAttribute("aria-pressed","false");renderCategories();renderSubcategories();renderDesigns()}
  function toggleFavorite(id){if(state.favorites.has(id))state.favorites.delete(id);else state.favorites.add(id);saveFavorites();renderDesigns();showToast(state.favorites.has(id)?"Saved to your favorites":"Removed from favorites")}
  function openDesign(id){
    const d=getDesign(id);if(!d)return;
    state.viewed=[id,...state.viewed.filter(x=>x!==id)].slice(0,10);
    dialogContent.innerHTML=`<div class="dialog-art" style="${artStyle(d.palette)}"><span>${d.mark}</span></div><div class="dialog-body"><span class="card-kicker">${escapeHtml(d.category)} / ${escapeHtml(d.subcategory)}</span><h2>${escapeHtml(d.name)}</h2><p>${escapeHtml(d.description)}</p><h3>AI image prompt</h3><div class="dialog-prompt">${escapeHtml(d.prompt)}</div><button class="button button-dark" id="dialogCopy">Copy complete prompt <span>▣</span></button> <button class="button button-quiet" id="dialogSave">${state.favorites.has(id)?"♥ Saved":"♡ Save design"}</button></div>`;
    $("#dialogCopy").addEventListener("click",()=>copyText(d.prompt));
    $("#dialogSave").addEventListener("click",()=>{toggleFavorite(id);$("#dialogSave").textContent=state.favorites.has(id)?"♥ Saved":"♡ Save design"});
    if(typeof dialog.showModal==="function")dialog.showModal();else dialog.setAttribute("open","");
  }
  function generatePrompt(alternative=false){
    const idea=$("#ideaInput").value.trim();if(!idea){$("#ideaInput").focus();showToast("Add your idea first, then generate a prompt.");return false}
    const category=$("#genCategory").value, style=$("#styleInput").value, palette=$("#colorInput").value, orientation=$("#orientationInput").value, quality=$("#qualityInput").value, composition=$("#compositionInput").value, details=$("#detailsInput").value.trim(), extra=$("#extraInput").value.trim();
    const openings=["Create a distinctive, professionally art-directed visual of","Develop a premium editorial concept featuring","Design a visually compelling, high-end interpretation of","Produce a refined visual study of"];
    const openings2=["Explore an alternative creative direction for","Reimagine this concept as","Create a second art-directed interpretation of","Offer a fresh composition for"];
    const start=(alternative?openings2:openings)[state.generation%(alternative?openings2.length:openings.length)];
    const parts=[`${start} ${idea.replace(/\s+/g," ")}.`, `Category: ${category}.`, `Creative style: ${style.toLowerCase()}.`, `Colour palette: ${palette.toLowerCase()}.`, `Visual treatment: ${quality.toLowerCase()}, with convincing materials, precise detailing, balanced contrast, and a cohesive premium finish.`, `Composition: ${composition.toLowerCase()}; image orientation: ${orientation}.`];
    if(details)parts.push(`Important materials, patterns, and details: ${details.replace(/\s+/g," ")}.`);
    parts.push("Use intentional visual hierarchy, thoughtful negative space, sophisticated styling, believable texture, and carefully controlled lighting. Keep the main subject clear and the overall result polished, original, and suitable for a professional wedding inspiration moodboard.");
    if(extra)parts.push(`Additional requirements: ${extra.replace(/\s+/g," ")}.`);
    parts.push("Avoid unintended text, logos, watermarks, clutter, low-resolution artifacts, and distorted objects or anatomy where applicable.");
    state.currentPrompt=parts.join("\n\n");$("#generatedPrompt").textContent=state.currentPrompt;$("#outputArea").hidden=false;$("#copyStatus").textContent="";return true;
  }
  categoryNav.addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(b)selectCategory(b.dataset.category)});
  subcategoryRow.addEventListener("click",e=>{const b=e.target.closest("[data-subcategory]");if(b){state.subcategory=b.dataset.subcategory;state.visibleCount=18;renderSubcategories();renderDesigns()}});
  designGrid.addEventListener("click",e=>{const copy=e.target.closest("[data-copy]"),view=e.target.closest("[data-view]"),fav=e.target.closest("[data-favorite]");if(copy){const d=getDesign(copy.dataset.copy);if(d)copyText(d.prompt)}else if(view)openDesign(view.dataset.view);else if(fav)toggleFavorite(fav.dataset.favorite)});
  $("#searchInput").addEventListener("input",e=>{state.search=e.target.value.trim();state.visibleCount=18;renderDesigns()});
  $("#sortSelect").addEventListener("change",e=>{state.sort=e.target.value;renderDesigns()});
  $("#favoritesFilter").addEventListener("click",()=>{state.favoritesOnly=!state.favoritesOnly;$("#favoritesFilter").setAttribute("aria-pressed",String(state.favoritesOnly));state.visibleCount=18;renderDesigns()});
  $("#clearFilters").addEventListener("click",()=>{$("#searchInput").value="";state.search="";state.subcategory="All";state.favoritesOnly=false;$("#favoritesFilter").setAttribute("aria-pressed","false");state.visibleCount=18;renderSubcategories();renderDesigns()});
  $("#promptForm").addEventListener("submit",e=>{e.preventDefault();state.generation++;if(generatePrompt(false))$("#outputArea").scrollIntoView({behavior:"smooth",block:"nearest"})});
  $("#regenerateButton").addEventListener("click",()=>{state.generation++;if(generatePrompt(true))showToast("Alternative prompt generated")});
  $("#copyGenerated").addEventListener("click",async()=>{if(state.currentPrompt){await copyText(state.currentPrompt);$("#copyStatus").textContent="Copy requested — ready to paste."}});
  $("#resetForm").addEventListener("click",()=>{$("#promptForm").reset();$("#genCategory").value=state.category;state.currentPrompt="";$("#outputArea").hidden=true;$("#ideaInput").focus();showToast("Prompt form reset")});
  $("#closeDialog").addEventListener("click",()=>dialog.close());
  dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
  $("#menuToggle").addEventListener("click",()=>{const open=$("#navLinks").classList.toggle("open");$("#menuToggle").setAttribute("aria-expanded",String(open))});
  $$("#navLinks a").forEach(a=>a.addEventListener("click",()=>{$("#navLinks").classList.remove("open");$("#menuToggle").setAttribute("aria-expanded","false")}));
  $$(".text-link, .top-cta, .hero-actions a").forEach(a=>a.addEventListener("click",()=>{}));
  $("#ideaInput").addEventListener("input",e=>{if(e.target.value.length>480)e.target.setCustomValidity("Please keep your idea under 500 characters.");else e.target.setCustomValidity("")});
  renderCategories();renderSubcategories();renderDesigns();
})();


/* Free tools, hash routing, and legal information. Kept separate from the original library controller. */
(() => {
"use strict";
const tools = [["mehndi-prompt-generator", "Mehndi Prompt Generator", "Mehndi Design Tools", "prompt"], ["bridal-mehndi-prompt-maker", "Bridal Mehndi Prompt Maker", "Mehndi Design Tools", "prompt"], ["arabic-mehndi-designer", "Arabic Mehndi Designer", "Mehndi Design Tools", "prompt"], ["pakistani-mehndi-prompt-maker", "Pakistani Mehndi Prompt Maker", "Mehndi Design Tools", "prompt"], ["indian-mehndi-designer", "Indian Mehndi Designer", "Mehndi Design Tools", "prompt"], ["feet-mehndi-prompt-generator", "Feet Mehndi Prompt Generator", "Mehndi Design Tools", "prompt"], ["mandala-mehndi-maker", "Mandala Mehndi Maker", "Mehndi Design Tools", "prompt"], ["finger-mehndi-designer", "Finger Mehndi Designer", "Mehndi Design Tools", "prompt"], ["back-hand-mehndi-generator", "Back Hand Mehndi Generator", "Mehndi Design Tools", "prompt"], ["mehndi-style-mixer", "Mehndi Style Mixer", "Mehndi Design Tools", "prompt"], ["pinterest-pin-maker", "Pinterest Pin Maker", "Image Editing Tools", "image"], ["mehndi-image-resizer", "Mehndi Image Resizer", "Image Editing Tools", "image"], ["mehndi-collage-maker", "Mehndi Collage Maker", "Image Editing Tools", "image"], ["mehndi-photo-editor", "Mehndi Photo Editor", "Image Editing Tools", "image"], ["mehndi-text-overlay-tool", "Mehndi Text Overlay Tool", "Image Editing Tools", "image"], ["mehndi-color-palette-generator", "Mehndi Color Palette Generator", "Image Editing Tools", "utility"], ["mehndi-pattern-creator", "Mehndi Pattern Creator", "Image Editing Tools", "utility"], ["mehndi-image-cropper", "Mehndi Image Cropper", "Image Editing Tools", "image"], ["wedding-mood-board-maker", "Wedding Mood Board Maker", "Image Editing Tools", "image"], ["wedding-invitation-card-maker", "Wedding Invitation Card Maker", "Image Editing Tools", "image"], ["wedding-countdown-calculator", "Wedding Countdown Calculator", "Wedding Utility Tools", "utility"], ["mehndi-artist-cost-calculator", "Mehndi Artist Cost Calculator", "Wedding Utility Tools", "utility"], ["wedding-budget-calculator", "Wedding Budget Calculator", "Wedding Utility Tools", "utility"], ["mehndi-ceremony-planner", "Mehndi Ceremony Planner", "Wedding Utility Tools", "utility"], ["bridal-preparation-checklist", "Bridal Preparation Checklist", "Wedding Utility Tools", "utility"], ["wedding-invitation-text-generator", "Wedding Invitation Text Generator", "Wedding Utility Tools", "utility"], ["wedding-hashtag-generator", "Wedding Hashtag Generator", "Wedding Utility Tools", "utility"], ["mehndi-caption-generator", "Mehndi Caption Generator", "Wedding Utility Tools", "utility"], ["mehndi-seo-title-generator", "Mehndi SEO Title Generator", "Wedding Utility Tools", "utility"], ["mehndi-negative-prompt-generator", "Mehndi Negative Prompt Generator", "Wedding Utility Tools", "utility"]];
const $ = (s,r=document)=>r.querySelector(s);
const directory=$("#toolDirectory"), workspace=$("#toolWorkspace"), legal=$("#legalWorkspace");
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
const groups=["Mehndi Design Tools","Image Editing Tools","Wedding Utility Tools"];
const state={images:[],canvas:null,ctx:null,checklist:new Set()};
function renderDirectory(){
 directory.innerHTML=groups.map(group=>`<section class="tool-group"><div class="tool-group-heading"><h3>${group}</h3><span>${tools.filter(t=>t[2]===group).length.toString().padStart(2,"0")} TOOLS</span></div><div class="tool-name-grid">${tools.filter(t=>t[2]===group).map(t=>`<a class="tool-name-link" href="#tool/${t[0]}"><span>${esc(t[1])}</span><span aria-hidden="true">↗</span></a>`).join("")}</div></section>`).join("");
}
const promptPresets={
"mehndi-prompt-generator":["bridal or festive","palm and back hand","floral, paisley and mandala motifs"],
"bridal-mehndi-prompt-maker":["bridal","full hands extending to forearms","dense traditional bridal storytelling"],
"arabic-mehndi-designer":["contemporary Arabic","back hand and forearm","bold floral vines, flowing diagonals and open negative space"],
"pakistani-mehndi-prompt-maker":["Pakistani bridal","both hands and forearms","fine paisley, jaali grids, traditional details and dense fills"],
"indian-mehndi-designer":["Indian bridal","full hands and forearms","intricate symmetrical motifs, peacocks, mandalas and narrative panels"],
"feet-mehndi-prompt-generator":["festive","feet, ankles and toes","anklet-inspired bands, floral trails and toe detailing"],
"mandala-mehndi-maker":["mandala","centered palm","concentric circles, petals, fine symmetry and radial geometry"],
"finger-mehndi-designer":["minimal contemporary","fingers and fingertips","delicate rings, dots, fine lines and small floral accents"],
"back-hand-mehndi-generator":["bridal","back of hand and wrist","central motif, flowing vines and carefully spaced finger details"],
"mehndi-style-mixer":["custom mixed style","hands and forearms","cohesive combination of floral, Arabic, mandala and bridal motifs"]
};
function input(label,id,type="text",placeholder="",value="",extra=""){return `<label class="tool-field"><span>${label}</span><input id="${id}" type="${type}" placeholder="${placeholder}" value="${value}" ${extra}></label>`}
function select(label,id,opts){return `<label class="tool-field"><span>${label}</span><select id="${id}">${opts.map(x=>`<option>${esc(x)}</option>`).join("")}</select></label>`}
function area(label,id,placeholder="",rows=4){return `<label class="tool-field tool-field-wide"><span>${label}</span><textarea id="${id}" rows="${rows}" maxlength="3000" placeholder="${placeholder}"></textarea></label>`}
function basePromptForm(id){
 const p=promptPresets[id]||["festive","hand and forearm","floral and paisley motifs"];
 return `<div class="tool-form-grid">${select("Design style","pStyle",["Traditional bridal","Arabic floral","Pakistani bridal","Indian traditional","Minimal contemporary","Festive","Royal intricate","Soft floral","Mandala","Custom blend"])}${select("Coverage / placement","pPlace",["Full hand","Half hand","Palm","Back of hand","Fingers","Feet and ankles","Hands and forearms","Wrist and fingers"])}${select("Intricacy","pDetail",["Fine intricate detail","Balanced medium detail","Simple and airy","Dense bridal coverage"])}${select("Composition","pComp",["Symmetrical","Flowing diagonal","Centered mandala","Negative-space focused","Full composition"])}${area("Motifs and personal details","pMotifs","e.g. jasmine, paisley, initials, floral vines",2)}${area("Extra instructions","pExtra","Optional details to include or avoid",2)}</div>${id==="mehndi-style-mixer"?`<fieldset class="tool-style-mixer"><legend>Combine styles (choose any)</legend>${["Arabic floral","Mandala","Pakistani bridal","Indian traditional","Fine-line","Negative-space","Paisley"].map(v=>`<label><input type="checkbox" name="mixStyle" value="${v}"> ${v}</label>`).join("")}</fieldset>`:""}<p class="tool-hint">Preset direction: ${esc(p.join(" · "))}. This tool writes prompts; it does not generate images.</p><div class="tool-actions"><button class="button button-dark" data-action="make-prompt">Generate prompt</button><button class="button button-outline" data-action="copy-output">Copy result</button></div><label class="tool-field tool-field-wide"><span>Editable result</span><textarea id="toolOutput" rows="7" maxlength="5000" placeholder="Your prompt will appear here and can be edited."></textarea></label>`;
}
function imageForm(id){
 let fields="";
 if(id==="pinterest-pin-maker") fields=`${input("Title / overlay text","imgTitle","text","e.g. Bridal Mehndi Inspiration")}${select("Background fit","imgFit",["Contain","Cover"])}<p class="tool-hint">Exports a portrait 2:3 canvas (1000 × 1500).</p>`;
 if(id==="mehndi-image-resizer") fields=`${input("Width in pixels","imgWidth","number","1200","1200",'min="1" max="5000"')}${input("Height in pixels","imgHeight","number","1200","1200",'min="1" max="5000"')}<label class="tool-check"><input id="keepRatio" type="checkbox" checked> Preserve aspect ratio</label>`;
 if(id==="mehndi-collage-maker") fields=`${select("Grid layout","imgGrid",["2 columns","3 columns","2 × 2 grid","3 × 2 grid"])}${input("Caption (optional)","imgTitle","text","Mehndi inspiration")}`;
 if(id==="mehndi-photo-editor") fields=`${input("Brightness (%)","brightness","range","","100",'min="0" max="200"')}${input("Contrast (%)","contrast","range","","100",'min="0" max="200"')}${input("Saturation (%)","saturation","range","","100",'min="0" max="200"')}`;
 if(id==="mehndi-text-overlay-tool") fields=`${input("Overlay text","imgTitle","text","Names or wedding date")}${select("Text position","textPosition",["Bottom center","Top center","Center","Bottom left"])}${input("Text size (px)","textSize","number","48","48",'min="12" max="160"')}${input("Text colour","textColor","color","","#ffffff")}`;
 if(id==="mehndi-image-cropper") fields=`${input("Crop width (%)","cropWidth","number","80","80",'min="10" max="100"')}${input("Crop height (%)","cropHeight","number","80","80",'min="10" max="100"')}${select("Rotation","rotation",["0°","90°","180°","270°"])}`;
 if(id==="wedding-mood-board-maker") fields=`${input("Board title","imgTitle","text","Wedding inspiration")}${select("Board layout","imgGrid",["2 columns","3 columns","2 × 2 grid"])}${area("Labels / notes","boardNotes","One short note per line",3)}`;
 if(id==="wedding-invitation-card-maker") fields=`${input("Couple / host names","inviteNames","text","Ayesha & Ahmed")}${input("Wedding date","inviteDate","text","20 December 2026")}${area("Invitation wording","inviteWording","Together with our families, we invite you…",3)}${input("Accent colour","inviteColor","color","","#9b6875")}`;
 return `<div class="tool-form-grid">${fields}</div><label class="tool-field tool-field-wide"><span>Choose image${["mehndi-collage-maker","wedding-mood-board-maker"].includes(id)?"s (multiple allowed)":""}</span><input id="imageFiles" type="file" accept="image/png,image/jpeg,image/webp,image/gif" ${["mehndi-collage-maker","wedding-mood-board-maker"].includes(id)?"multiple":""}><small>Images stay in your browser. Maximum 8 MB per image.</small></label><div class="tool-actions"><button class="button button-dark" data-action="process-image">Process image</button><button class="button button-outline" data-action="download-image">Download PNG</button></div><div class="image-preview-wrap"><canvas id="toolCanvas" width="800" height="800" aria-label="Processed image preview"></canvas><p id="imageStatus" role="status">Choose an image to begin.</p></div>`;
}
function utilityForm(id){
 if(id==="mehndi-color-palette-generator")return `<div class="tool-form-grid">${select("Mood","mood",["Romantic blush","Royal jewel tones","Earthy mehndi","Ivory garden","Modern monochrome","Festive marigold"])}${select("Palette size","paletteSize",["4 colours","5 colours","6 colours"])}</div><div class="tool-actions"><button class="button button-dark" data-action="palette">Generate palette</button><button class="button button-outline" data-action="copy-output">Copy result</button></div><div id="paletteOutput" class="palette-output"></div><textarea id="toolOutput" class="tool-output-text" rows="3" readonly placeholder="Hex codes will appear here"></textarea>`;
 if(id==="mehndi-pattern-creator")return `<div class="tool-form-grid">${select("Pattern","patternType",["Floral rosette","Mandala rings","Paisley-inspired circles","Geometric lattice"])}${input("Colour","patternColor","color","","#8b4d58")}${input("Canvas size","patternSize","number","600","600",'min="200" max="1200"')}</div><div class="tool-actions"><button class="button button-dark" data-action="pattern">Create SVG pattern</button><button class="button button-outline" data-action="download-svg">Download SVG</button><button class="button button-outline" data-action="copy-output">Copy SVG</button></div><div id="patternPreview" class="pattern-preview"></div><textarea id="toolOutput" class="tool-output-text" rows="6" readonly placeholder="SVG markup will appear here"></textarea>`;
 if(id==="wedding-countdown-calculator")return `<div class="tool-form-grid">${input("Wedding date","weddingDate","date")}${input("Optional event time","eventTime","time","09:00","09:00")}</div><div class="tool-actions"><button class="button button-dark" data-action="countdown">Calculate countdown</button></div><div id="utilityResult" class="utility-result" aria-live="polite"></div>`;
 if(id==="mehndi-artist-cost-calculator")return `<div class="tool-form-grid">${input("Artist rate per guest","artistRate","number","e.g. 500","500",'min="0" max="10000000" step="0.01"')}${input("Number of guests","guestCount","number","e.g. 80","80",'min="0" max="100000" step="1"')}${input("Additional charges","artistExtra","number","Travel / setup","0",'min="0" max="100000000" step="0.01"')}</div><div class="tool-actions"><button class="button button-dark" data-action="artist-cost">Calculate estimate</button></div><div id="utilityResult" class="utility-result"></div>`;
 if(id==="wedding-budget-calculator")return `<p>Enter estimated costs in the categories you need. Leave unused categories at zero.</p><div class="tool-form-grid">${["Venue","Mehndi artist","Outfits","Catering","Decor","Photography","Transport","Other"].map((n,i)=>input(n,`budget${i}`,"number","0","0",'min="0" max="1000000000" step="0.01"')).join("")}${input("Total available budget","budgetLimit","number","Your budget","0",'min="0" max="1000000000" step="0.01"')}</div><div class="tool-actions"><button class="button button-dark" data-action="budget">Summarise budget</button></div><div id="utilityResult" class="utility-result"></div>`;
 if(["mehndi-ceremony-planner","bridal-preparation-checklist"].includes(id))return `<p>Tick tasks as you complete them. Your checklist is kept for this page session only.</p><div id="checklist" class="checklist"></div><div class="tool-actions"><button class="button button-outline" data-action="reset-checklist">Reset checklist</button><button class="button button-dark" data-action="copy-checklist">Copy checklist</button></div>`;
 let fields="";
 if(id==="wedding-invitation-text-generator")fields=`${input("Names","names","text","Ayesha & Ahmed")}${input("Date and venue","eventDetails","text","20 Dec · venue details")}${select("Language","language",["English","Urdu","English and Urdu"])}${select("Tone","tone",["Warm and family-centred","Formal","Poetic","Simple and modern"])}`;
 if(id==="wedding-hashtag-generator")fields=`${input("Bride's name","brideName","text","Bride name")}${input("Groom's name","groomName","text","Groom name")}${input("Optional year","hashtagYear","number","2026","2026",'min="1900" max="2200"')}`;
 if(id==="mehndi-caption-generator")fields=`${input("Topic / occasion","topic","text","Bridal mehndi")}${select("Platform","platform",["Instagram","Pinterest","Facebook","General social media"])}${select("Tone","tone",["Elegant","Playful","Traditional","Romantic","Minimal"])}`;
 if(id==="mehndi-seo-title-generator")fields=`${input("Main topic","topic","text","Pakistani bridal mehndi designs")}${input("Audience / location (optional)","audience","text","Brides, South Asia")}`;
 if(id==="mehndi-negative-prompt-generator")fields=`${input("Design subject","topic","text","Bridal mehndi hands")}${select("Image style","imageStyle",["Photorealistic","Fine-line illustration","Editorial photography","Pattern illustration"])}${select("Avoid","avoid",["Common image artifacts","Anatomy and hand artifacts","Clutter and poor composition","All of the above"])}`;
 return `<div class="tool-form-grid">${fields}</div><div class="tool-actions"><button class="button button-dark" data-action="generate-text">Generate text</button><button class="button button-outline" data-action="copy-output">Copy result</button></div><label class="tool-field tool-field-wide"><span>Editable result</span><textarea id="toolOutput" rows="8" maxlength="5000" placeholder="Your result will appear here."></textarea></label>`;
}

const legalPages={
"about-us":["About Us","The Wedding Atelier offers wedding inspiration, mehndi design concepts, creative text-prompt generation, and browser-based design utilities. The site is designed to help visitors shape ideas and prepare creative briefs. It is an independent informational project; it is not an image-generation service."],
"contact-us":["Contact Us",`Questions, feedback, or correction requests? Email <a href="mailto:chief0000019@gmail.com">chief0000019@gmail.com</a>. Please do not email sensitive personal information or private documents.`],
"privacy-policy":["Privacy Policy","The site runs primarily in your browser. Search terms, prompt inputs, calculator values, and locally selected images are processed in the page unless you choose to transmit them yourself. The design library stores saved favourites in browser localStorage on this device. Browser storage can be viewed or cleared through your browser settings. Do not enter sensitive personal information. The site loads Google Fonts from Google when network access is available; that provider may receive technical request data such as your IP address under its own policies. No account, analytics service, cloud image storage, or AI API is implemented in this version. Contacting us by email transmits your message through your email provider. This notice describes the current frontend and may change if services are added."],
"terms-conditions":["Terms & Conditions","You may use the tools for lawful personal or professional planning and creative work. You are responsible for the content you enter, the rights to images you upload, and reviewing generated text before using it. Do not use the site to infringe intellectual property, violate privacy, harass others, or break applicable law. Catalogue concepts and generated text may be similar to other ideas and are not a guarantee of originality or suitability. The site is provided as available, without a promise of uninterrupted operation or error-free results. You retain rights you have in your own uploaded material; the site does not claim ownership of it. Applicable law may provide rights that cannot be excluded by these terms."],
"disclaimer":["Disclaimer","Prompts, design concepts, palettes, invitations, captions, SEO suggestions, countdowns, and budget calculations are informational tools. They are not professional, financial, legal, or vendor advice. Cost estimates depend on the rates and values you enter and may differ from actual artist or vendor quotes. This site creates text and browser-rendered graphics; it does not create AI images or connect to an AI model. Third-party AI, design, font, and publishing services have their own terms and privacy practices. Verify all details before relying on generated content."],
"acceptable-use":["Acceptable Use Policy","Do not use this website for unlawful activity, malicious uploads, attempts to exploit or disrupt the page, unauthorised access, abusive automation, or infringement of others' rights. Upload only files you are authorised to use. Files are validated by type and size in the frontend, but browser checks are not a substitute for server-side security. Stop using the site if you identify a security issue and report it to chief0000019@gmail.com. Because this is a static site, there is no server-side account system or enforcement mechanism."],
"storage-notice":["Cookie & Local Storage Notice","This version does not intentionally set cookies. It uses localStorage to save design favourites in your browser. Tool inputs and checklist progress are not sent to a server and are not saved persistently by these tools. Browser caches, extensions, hosting providers, or external font requests may operate independently. You can remove local site data through your browser settings; clearing it also removes saved favourites."]
};
function renderLegal(slug){const p=legalPages[slug]||legalPages["about-us"];legal.hidden=false;legal.innerHTML=`<a class="back-tools" href="#tools">← Back to the website</a><div class="eyebrow">THE WEDDING ATELIER · INFORMATION</div><h2>${esc(p[0])}</h2><div class="legal-copy"><p>${slug==="contact-us"?p[1]:esc(p[1])}</p><p class="legal-updated">Last reviewed: 29 October 2026. This information describes the current static frontend and is not a certification of legal compliance.</p></div>`;workspace.hidden=true;$("#tools").hidden=true;$("#library").hidden=true;$("#generator").hidden=true;$("#how").hidden=true;window.scrollTo(0,0)}
function renderTool(id){
 const t=tools.find(x=>x[0]===id);if(!t){location.hash="#tools";return}
 legal.hidden=true;$("#tools").hidden=true;$("#library").hidden=true;$("#generator").hidden=true;$("#how").hidden=true;workspace.hidden=false;
 workspace.innerHTML=`<a class="back-tools" href="#tools">← Back to Free Tools</a><div class="tool-title-row"><div><div class="eyebrow">${esc(t[2])} · FREE BROWSER TOOL</div><h2>${esc(t[1])}</h2><p>${t[3]==="prompt"?"Create a tailored design prompt you can edit and copy.":t[3]==="image"?"Process a local image in your browser and export the result.":"Generate a useful result with simple controls."}</p></div></div><div class="tool-panel">${t[3]==="prompt"?basePromptForm(id):t[3]==="image"?imageForm(id):utilityForm(id)}</div><p class="tool-privacy-note">No account is required. Tool inputs stay in this page unless you copy or download the result. <a href="#legal/privacy-policy">Privacy details</a>.</p>`;
 state.images=[];state.canvas=$("#toolCanvas");state.ctx=state.canvas?.getContext("2d")||null;
 if(id==="mehndi-ceremony-planner"||id==="bridal-preparation-checklist")renderChecklist(id);
 if(id==="mehndi-photo-editor")["brightness","contrast","saturation"].forEach(k=>$("#"+k)?.addEventListener("input",()=>processImage(id,false)));
 window.scrollTo(0,0);
}
function renderChecklist(id){
 const items=id==="mehndi-ceremony-planner"?["Confirm ceremony date and venue","Set guest list and invitations","Book mehndi artist(s)","Confirm artist rates and timing","Plan seating and refreshments","Arrange decor and lighting","Prepare music and schedule","Confirm supplies and emergency kit","Share schedule with family","Confirm final vendor details"]:["Confirm bridal outfit and fitting","Prepare jewellery and accessories","Confirm mehndi appointment","Plan outfit-friendly mehndi timing","Arrange comfortable seating","Prepare skincare essentials","Keep phone charger and essentials ready","Confirm transport","Pack touch-up and emergency kit","Rest, hydrate, and confirm schedule"];
 $("#checklist").innerHTML=items.map((x,i)=>`<label class="check-item"><input type="checkbox" data-task="${i}"><span>${x}</span></label>`).join("")+`<p id="checkProgress" class="tool-hint">0 of ${items.length} completed</p>`;
 $("#checklist").addEventListener("change",()=>{const checks=[...$("#checklist").querySelectorAll("input")];$("#checkProgress").textContent=`${checks.filter(c=>c.checked).length} of ${checks.length} completed`;});
}
function getVal(id,def=""){return $("#"+id)?.value?.trim()??def}
function putOutput(text){const o=$("#toolOutput");if(o)o.value=text;const r=$("#utilityResult");if(r)r.textContent=text}
function makePrompt(id){
 const p=promptPresets[id]||["festive","hand and forearm","floral motifs"];
 const styles=id==="mehndi-style-mixer"?[...document.querySelectorAll('input[name="mixStyle"]:checked')].map(x=>x.value):[];
 const style=styles.length?styles.join(", "):getVal("pStyle",p[0]);
 return `Create a detailed ${style.toLowerCase()} mehndi design for ${getVal("pPlace",p[1]).toLowerCase()}. Visual direction: ${p[2]}. Use ${getVal("pDetail","Fine intricate detail").toLowerCase()}, ${getVal("pComp","Symmetrical").toLowerCase()} composition, precise henna linework, intentional negative space, balanced motifs, and clear readable pattern flow. ${getVal("pMotifs")?`Include: ${getVal("pMotifs")}. `:""}${getVal("pExtra")?`Additional instructions: ${getVal("pExtra")}. `:""}Show natural henna tones on realistic skin, carefully defined edges, elegant lighting, and a clean uncluttered presentation. Avoid distorted hands, extra fingers, broken patterns, text, logos, and watermarks.`;
}
function hex(c){return /^#[0-9a-f]{6}$/i.test(c)?c:"#8b4d58"}
function drawContain(ctx,img,x,y,w,h,cover=false){const r=cover?Math.max(w/img.width,h/img.height):Math.min(w/img.width,h/img.height),dw=img.width*r,dh=img.height*r;ctx.drawImage(img,x+(w-dw)/2,y+(h-dh)/2,dw,dh)}
function loadImages(files){return Promise.all([...files].slice(0,12).map(file=>new Promise((resolve,reject)=>{if(!/^image\/(png|jpeg|webp|gif)$/.test(file.type)||file.size>8*1024*1024){reject(new Error(`${file.name}: use PNG, JPEG, WebP or GIF under 8 MB.`));return}const url=URL.createObjectURL(file),img=new Image();img.onload=()=>{URL.revokeObjectURL(url);resolve(img)};img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error(`Could not read ${file.name}.`))};img.src=url})))}
async function processImage(id,showMessage=true){
 const fileInput=$("#imageFiles"),files=fileInput?.files;if(!files?.length){if(showMessage)$("#imageStatus").textContent="Choose a valid image first.";return false}
 const status=$("#imageStatus");if(status)status.textContent="Processing…";
 try{
  const imgs=await loadImages(files);let w=imgs[0].width,h=imgs[0].height;
  if(id==="pinterest-pin-maker"){w=1000;h=1500}
  if(id==="mehndi-image-resizer"){w=Math.min(5000,Math.max(1,Number(getVal("imgWidth","1200"))));h=Math.min(5000,Math.max(1,Number(getVal("imgHeight","1200"))));if(!Number.isFinite(w)||!Number.isFinite(h))throw Error("Enter valid image dimensions.");if($("#keepRatio")?.checked){const ratio=imgs[0].width/imgs[0].height;if(w/h>ratio)w=Math.round(h*ratio);else h=Math.round(w/ratio)}}
  if(["mehndi-collage-maker","wedding-mood-board-maker"].includes(id)){const cols=getVal("imgGrid").startsWith("3")?3:2,rows=Math.ceil(imgs.length/cols);w=900;h=rows*520}
  if(id==="wedding-invitation-card-maker"){w=1200;h=1600}
  if(w*h>16000000)throw Error("That canvas is too large. Choose smaller dimensions.");
  const canvas=$("#toolCanvas");canvas.width=w;canvas.height=h;const ctx=canvas.getContext("2d");ctx.fillStyle=id==="wedding-invitation-card-maker"?"#fff8f0":"#fbf8f3";ctx.fillRect(0,0,w,h);
  if(["mehndi-collage-maker","wedding-mood-board-maker"].includes(id)){
   const cols=getVal("imgGrid").startsWith("3")?3:2,cellW=w/cols,cellH=500;
   imgs.forEach((img,i)=>{const x=(i%cols)*cellW,y=Math.floor(i/cols)*cellH;ctx.fillStyle="#fffdfa";ctx.fillRect(x+8,y+8,cellW-16,cellH-16);drawContain(ctx,img,x+20,y+20,cellW-40,cellH-40);});
   if(getVal("imgTitle")){ctx.fillStyle="#513747";ctx.font="28px Georgia";ctx.textAlign="center";ctx.fillText(getVal("imgTitle").slice(0,100),w/2,h-12)}
   if(id==="wedding-mood-board-maker"&&getVal("boardNotes")){ctx.fillStyle="#513747";ctx.font="16px Arial";ctx.textAlign="left";ctx.fillText(getVal("boardNotes").split("\n")[0].slice(0,80),20,h-38)}
  } else {
   const img=imgs[0];
   if(id==="mehndi-image-cropper"){
    const cw=Math.max(.1,Math.min(1,Number(getVal("cropWidth","80"))/100)),ch=Math.max(.1,Math.min(1,Number(getVal("cropHeight","80"))/100));const sw=img.width*cw,sh=img.height*ch;const angle=parseInt(getVal("rotation","0"),10)||0;
    if(angle===90||angle===270){canvas.width=Math.round(sh);canvas.height=Math.round(sw)}else{canvas.width=Math.round(sw);canvas.height=Math.round(sh)}
    const c=canvas.getContext("2d");c.translate(canvas.width/2,canvas.height/2);c.rotate(angle*Math.PI/180);c.drawImage(img,-sw/2,-sh/2,sw,sh);
   } else {
    if(id==="mehndi-photo-editor"){ctx.filter=`brightness(${getVal("brightness","100")}%) contrast(${getVal("contrast","100")}%) saturate(${getVal("saturation","100")}%)`;}
    const fit=id==="pinterest-pin-maker"?getVal("imgFit","Contain")==="Cover":true;drawContain(ctx,img,0,0,w,h,fit);ctx.filter="none";
    if(id==="mehndi-text-overlay-tool"){ctx.fillStyle="#00000088";ctx.fillRect(0,h*.78,w,h*.22);ctx.fillStyle=hex(getVal("textColor","#ffffff"));ctx.font=`bold ${Math.min(160,Math.max(12,Number(getVal("textSize","48"))))}px Georgia`;ctx.textAlign=getVal("textPosition").includes("left")?"left":"center";const x=ctx.textAlign==="left"?w*.06:w/2;const y=getVal("textPosition")==="Top center"?h*.12:getVal("textPosition")==="Center"?h*.52:h*.9;ctx.fillText(getVal("imgTitle").slice(0,120),x,y,w*.88)}
    if(id==="pinterest-pin-maker"&&getVal("imgTitle")){ctx.fillStyle="#241b22cc";ctx.fillRect(0,h-180,w,180);ctx.fillStyle="#fffdfa";ctx.font="bold 46px Georgia";ctx.textAlign="center";ctx.fillText(getVal("imgTitle").slice(0,60),w/2,h-85,w-80)}
   }
   if(id==="wedding-invitation-card-maker"){
    ctx.strokeStyle=hex(getVal("inviteColor","#9b6875"));ctx.lineWidth=8;ctx.strokeRect(48,48,w-96,h-96);ctx.lineWidth=2;ctx.strokeRect(66,66,w-132,h-132);ctx.textAlign="center";ctx.fillStyle="#513747";ctx.font="28px Georgia";ctx.fillText("YOU ARE CORDIALLY INVITED",w/2,220);ctx.font="bold 64px Georgia";ctx.fillText(getVal("inviteNames","Together with our families").slice(0,40),w/2,430,w-140);ctx.font="34px Georgia";ctx.fillText(getVal("inviteDate","Wedding celebration").slice(0,70),w/2,530,w-140);ctx.font="26px Georgia";const lines=(getVal("inviteWording","Join us to celebrate this special day.").match(/.{1,42}(\s|$)/g)||[getVal("inviteWording")]).slice(0,8);lines.forEach((line,i)=>ctx.fillText(line.trim(),w/2,650+i*44,w-140));
   }
  }
  state.canvas=canvas;state.ctx=ctx;if(status)status.textContent=`Ready: ${canvas.width} × ${canvas.height}px. Download PNG to export.`;return true;
 }catch(e){if(status)status.textContent=e.message||"Image processing failed. Try another file.";return false}
}
async function action(actionName){
 const id=location.hash.split("/")[1];const t=tools.find(x=>x[0]===id);if(!t)return;
 try{
 if(actionName==="make-prompt"){putOutput(makePrompt(id));return}
 if(actionName==="copy-output"){const text=$("#toolOutput")?.value||$("#paletteOutput")?.textContent||"";await copy(text);return}
 if(actionName==="process-image"){await processImage(id);return}
 if(actionName==="download-image"){if(!$("#toolCanvas")||!$("#imageFiles")?.files.length){$("#imageStatus").textContent="Process an image before downloading.";return}const c=$("#toolCanvas");c.toBlob(blob=>{if(!blob){$("#imageStatus").textContent="Export failed. Try a smaller image.";return}downloadBlob(blob,`${id}.png`)},"image/png");return}
 if(actionName==="palette"){const palettes={"Romantic blush":["#F7E8E5","#D7A0A5","#A96776","#F2D6B3","#6B4A57","#FFF9F2"],"Royal jewel tones":["#173F35","#7A2032","#D4AF72","#25324A","#F2E7D2","#8B5E83"],"Earthy mehndi":["#6B3F2A","#B66A45","#D8B887","#69724D","#F3E7D2","#392C28"],"Ivory garden":["#FFF9F0","#D9C9B8","#A5B49A","#D8A6A0","#C8A76B","#6C5860"],"Modern monochrome":["#171717","#454545","#777777","#B7B7B7","#E8E5E0","#FFFFFF"],"Festive marigold":["#E8A923","#D45A38","#9B2450","#2D654B","#F6D8A8","#FFF4E1"]};const arr=palettes[getVal("mood")].slice(0,Number(getVal("paletteSize","5 colours")[0]));$("#paletteOutput").innerHTML=arr.map(c=>`<div class="palette-swatch"><span style="background:${c}"></span><code>${c}</code><button type="button" data-hex="${c}" aria-label="Copy ${c}">Copy</button></div>`).join("");$("#toolOutput").value=arr.join(", ");return}
 if(actionName==="pattern"){const size=Math.min(1200,Math.max(200,Number(getVal("patternSize","600"))||600)),color=hex(getVal("patternColor"));let shapes="";const type=getVal("patternType");if(type==="Mandala rings"){for(let r=size*.12;r<size*.44;r+=size*.07)shapes+=`<circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="3"/>`;for(let i=0;i<16;i++)shapes+=`<ellipse cx="${size/2}" cy="${size*.22}" rx="${size*.045}" ry="${size*.12}" transform="rotate(${i*22.5} ${size/2} ${size/2})" fill="none" stroke="${color}" stroke-width="2"/>`}else if(type==="Geometric lattice"){for(let i=-size;i<size*2;i+=size/8)shapes+=`<path d="M${i} 0 L${i-size} ${size} M${i} 0 L${i+size} ${size}" stroke="${color}" fill="none" stroke-width="2"/>`}else{for(let i=0;i<12;i++)shapes+=`<ellipse cx="${size/2}" cy="${size*.3}" rx="${size*.09}" ry="${size*.2}" transform="rotate(${i*30} ${size/2} ${size/2})" fill="none" stroke="${color}" stroke-width="3"/>`;shapes+=`<circle cx="${size/2}" cy="${size/2}" r="${size*.12}" fill="none" stroke="${color}" stroke-width="3"/><circle cx="${size/2}" cy="${size/2}" r="${size*.04}" fill="${color}"/>`}const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="100%" height="100%" fill="#fffaf4"/>${shapes}</svg>`;$("#toolOutput").value=svg;$("#patternPreview").innerHTML=svg;return}
 if(actionName==="download-svg"){const svg=$("#toolOutput")?.value;if(!svg){$("#patternPreview").textContent="Create a pattern first.";return}downloadBlob(new Blob([svg],{type:"image/svg+xml"}),"mehndi-pattern.svg");return}
 if(actionName==="countdown"){const date=getVal("weddingDate");if(!date){putOutput("Choose a wedding date first.");return}const target=new Date(`${date}T${getVal("eventTime","00:00")||"00:00"}:00`);if(Number.isNaN(target.getTime())){putOutput("Please enter a valid date and time.");return}const diff=target.getTime()-Date.now();if(diff<0){putOutput("That date and time has passed. Choose a future date to see a countdown.");return}const days=Math.floor(diff/86400000),hours=Math.floor(diff%86400000/3600000),mins=Math.floor(diff%3600000/60000);putOutput(`${days} days, ${hours} hours and ${mins} minutes until your wedding.`);return}
 if(actionName==="artist-cost"){const rate=Number(getVal("artistRate")),guests=Number(getVal("guestCount")),extra=Number(getVal("artistExtra","0"));if([rate,guests,extra].some(n=>!Number.isFinite(n)||n<0)||!Number.isInteger(guests)){putOutput("Enter non-negative amounts and a whole-number guest count.");return}putOutput(`Estimated artist cost: ${(rate*guests+extra).toLocaleString(undefined,{maximumFractionDigits:2})}\nRate × guests: ${(rate*guests).toLocaleString()}\nAdditional charges: ${extra.toLocaleString()}\nEstimate only; confirm the final quote with your artist.`);return}
 if(actionName==="budget"){const labels=["Venue","Mehndi artist","Outfits","Catering","Decor","Photography","Transport","Other"],values=labels.map((_,i)=>Number(getVal(`budget${i}`,"0"))),limit=Number(getVal("budgetLimit","0"));if(values.some(v=>!Number.isFinite(v)||v<0)||!Number.isFinite(limit)||limit<0){putOutput("Enter valid non-negative budget values.");return}const total=values.reduce((a,b)=>a+b,0),delta=limit-total;putOutput(`Estimated total: ${total.toLocaleString()}\n${limit?delta>=0?`Remaining budget: ${delta.toLocaleString()}`:`Over budget by: ${Math.abs(delta).toLocaleString()}`:"Add an available budget to calculate the remaining amount."}\n\n${labels.map((n,i)=>`${n}: ${values[i].toLocaleString()}`).join("\n")}`);return}
 if(actionName==="reset-checklist"){renderChecklist(id);return}
 if(actionName==="copy-checklist"){await copy([...$("#checklist").querySelectorAll(".check-item")].map(el=>`${el.querySelector("input").checked?"[x]":"[ ]"} ${el.innerText.trim()}`).join("\n"));return}
 if(actionName==="generate-text"){
  let out="",topic=getVal("topic","mehndi design"),tone=getVal("tone","elegant").toLowerCase();
  if(id==="wedding-invitation-text-generator"){const names=getVal("names","the couple"),details=getVal("eventDetails","date and venue to be confirmed");out=getVal("language")==="Urdu"?`آپ کو ${names} کی شادی کی خوشی میں شرکت کی دعوت دی جاتی ہے۔\nتاریخ اور مقام: ${details}\nآپ کی شرکت ہمارے لیے باعثِ مسرت ہوگی۔`:getVal("language")==="English and Urdu"?`With joy, we invite you to celebrate ${names}.\nDate & venue: ${details}\nYour presence will make the occasion special.\n\nآپ کو ${names} کی شادی کی تقریب میں شرکت کی دعوت دی جاتی ہے۔\nتاریخ اور مقام: ${details}\nآپ کی شرکت ہمارے لیے باعثِ مسرت ہوگی۔`:`With warm wishes, we invite you to celebrate ${names}.\nDate & venue: ${details}\nYour presence will make our celebration complete.`}
  else if(id==="wedding-hashtag-generator"){const clean=s=>s.normalize("NFKD").replace(/[^a-zA-Z0-9]/g,"");const b=clean(getVal("brideName","Bride")),g=clean(getVal("groomName","Groom")),y=getVal("hashtagYear","");out=[`#${b}Weds${g}`,`#${b}And${g}`,`#${g}KiDulhan${b}`,`#The${b}${g}Wedding`,`#Forever${b}${g}`,`#${b}${g}${y}`].join("\n")}
  else if(id==="mehndi-caption-generator")out=[`A little henna, a lot of meaning. ✨ #MehndiMoments`,`Intricate details for a day to remember. 🌿`,`Every pattern tells a love story. #BridalMehndi`,`Tradition, artistry, and a touch of magic. ✨`,`The beauty is in every little detail. #WeddingInspiration`].map(s=>`${s} (${tone} · ${getVal("platform","social media")})`).join("\n\n");
  else if(id==="mehndi-seo-title-generator"){const t=getVal("topic","mehndi designs"),a=getVal("audience","brides");out=`SEO title (suggested): ${t.slice(0,55)} | The Wedding Atelier\n\nMeta description: Explore ${t.toLowerCase()} inspiration, creative patterns, and ideas for ${a.toLowerCase()}. Discover styles to help plan your special celebration.\n\nKeywords: ${[t,"bridal mehndi ideas","wedding inspiration",a,"henna design ideas"].join(", ")}`}
  else if(id==="mehndi-negative-prompt-generator"){const avoid=getVal("avoid");out=`${getVal("imageStyle","Photorealistic")} ${topic} — negative prompt:\n${avoid==="Anatomy and hand artifacts"?"extra fingers, missing fingers, fused fingers, distorted hands, unnatural anatomy, broken linework, uneven henna patterns":avoid==="Clutter and poor composition"?"cluttered background, poor composition, low contrast, distracting props, unreadable details":"low resolution, blurry, watermark, logo, text, artifacts, oversaturated colours, cluttered background, poor composition, distorted hands, extra fingers, broken patterns, inconsistent linework"}`}
  putOutput(out);return
 }
 }catch(e){const status=$("#imageStatus");if(status)status.textContent=e.message||"Something went wrong.";else putOutput(e.message||"Something went wrong.")}
}
async function copy(text){if(!text){const o=$("#toolOutput");o?.focus();o?.select();return}try{if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(text);else{const ta=document.createElement("textarea");ta.value=text;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();const ok=document.execCommand("copy");ta.remove();if(!ok)throw Error()}const status=$("#imageStatus");if(status)status.textContent="Copied to clipboard.";else{const old=$("#toolOutput");if(old)old.setAttribute("aria-label","Result copied to clipboard")}}catch{$("#toolOutput")?.focus();$("#toolOutput")?.select();alert("Clipboard access was blocked. The text is selected where possible; copy it manually.")}}
function downloadBlob(blob,name){const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
document.addEventListener("click",e=>{
 const a=e.target.closest("[data-action]");if(a){e.preventDefault();action(a.dataset.action)}
 const hexButton=e.target.closest("[data-hex]");if(hexButton)copy(hexButton.dataset.hex);
});
document.addEventListener("change",e=>{if(e.target.id==="imageFiles"){const status=$("#imageStatus");if(status)status.textContent=`${e.target.files.length} file(s) selected. Choose Process image to preview.`}});
function route(){
 const hash=decodeURIComponent(location.hash||"#");
 if(hash.startsWith("#tool/")){renderTool(hash.slice(6));return}
 if(hash.startsWith("#legal/")){renderLegal(hash.slice(7));return}
 workspace.hidden=true;legal.hidden=true;$("#tools").hidden=false;$("#library").hidden=false;$("#generator").hidden=false;$("#how").hidden=false;
 if(hash==="#tools")setTimeout(()=>$("#tools").scrollIntoView(),0);
}
renderDirectory();window.addEventListener("hashchange",route);route();
})();
