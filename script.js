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