// app.js - simple SPA logic
let quotes = [];
let categories = {};
let audioTracks = [
  // royalty-free sample mp3s (hosted) - used as demo
  'https://cdn.pixabay.com/download/audio/2022/03/15/audio_5a4a0d1b3a.mp3?filename=soft-magic-110773.mp3',
  'https://cdn.pixabay.com/download/audio/2021/11/02/audio_5c7c5b3f6a.mp3?filename=acoustic-meditation-106522.mp3',
  'https://cdn.pixabay.com/download/audio/2022/03/15/audio_0b2b1a9f9e.mp3?filename=sunset-travel-110738.mp3'
];
let audio = new Audio();
let currentTrack = 0;
let playing = false;

async function init(){
  document.getElementById('searchBtn').addEventListener('click', onSearch);
  document.getElementById('searchInput').addEventListener('keydown', e=>{if(e.key==='Enter') onSearch()});
  document.getElementById('modeSelect').addEventListener('change', onModeChange);
  document.getElementById('loadFavBtn').addEventListener('click', loadFriendFavorites);
  document.getElementById('toggleMusic').addEventListener('click', toggleMusic);

  // load data
  const res = await fetch('/data/quotes.json');
  quotes = await res.json();
  buildCategories();
  renderCategories();
  // default show top 50
  showResults(quotes.slice(0,50), `展示示例条目（共 ${quotes.length} 条）`);
}

function buildCategories(){
  categories = {};
  quotes.forEach(q=>{
    q.themes.forEach(t=>{
      categories[t] = (categories[t]||0)+1;
    })
  })
}

function renderCategories(){
  const ul = document.getElementById('categoryList');
  ul.innerHTML='';
  Object.keys(categories).sort().forEach(k=>{
    const li = document.createElement('li');
    li.textContent = `${k} (${categories[k]})`;
    li.addEventListener('click', ()=>{
      const filtered = quotes.filter(q=>q.themes.includes(k));
      showResults(filtered, `分类：${k}（${filtered.length} 条）`);
    });
    ul.appendChild(li);
  })
}

function onSearch(){
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  if(!q) return showResults(quotes.slice(0,50),`展示示例条目（共 ${quotes.length} 条）`);
  const matched = quotes.filter(item=>{
    return item.text.toLowerCase().includes(q) || (item.tags||[]).join(' ').toLowerCase().includes(q) || item.language.toLowerCase().includes(q);
  });
  showResults(matched, `搜索“${q}” 匹配 ${matched.length} 条`);
}

function showResults(list, info){
  const infoEl = document.getElementById('resultsInfo');
  infoEl.textContent = info;
  const ul = document.getElementById('resultsList');
  ul.innerHTML='';
  const tpl = document.getElementById('quoteTpl');
  list.forEach(item=>{
    const node = tpl.content.cloneNode(true);
    node.querySelector('.quote-text').textContent = item.text;
    node.querySelector('.source').textContent = `${item.author} · ${item.source}`;
    node.querySelector('.tags').textContent = item.themes.join(', ');
    const saveBtn = node.querySelector('.saveBtn');
    saveBtn.addEventListener('click', ()=>saveFavorite(item));
    const shareBtn = node.querySelector('.shareBtn');
    shareBtn.addEventListener('click', ()=>shareItem(item));
    ul.appendChild(node);
  })
}

function saveFavorite(item){
  const mode = document.getElementById('modeSelect').value;
  if(mode==='guest'){
    const arr = JSON.parse(localStorage.getItem('favorites_guest')||'[]');
    if(!arr.find(x=>x.id===item.id)) arr.push(item);
    localStorage.setItem('favorites_guest', JSON.stringify(arr));
    alert('已收藏到游客列表');
    renderFavorites('guest');
  } else {
    const wid = document.getElementById('wechatIdInput').value.trim() || 'me';
    const key = `favorites_${wid}`;
    const arr = JSON.parse(localStorage.getItem(key)||'[]');
    if(!arr.find(x=>x.id===item.id)) arr.push(item);
    localStorage.setItem(key, JSON.stringify(arr));
    alert(`已收藏到微信号 ${wid} 的收藏`);
    renderFavorites(wid);
  }
}

function renderFavorites(wid='guest'){
  const key = `favorites_${wid}`;
  const arr = JSON.parse(localStorage.getItem(key)||'[]');
  const wrap = document.getElementById('favoritesList');
  if(arr.length===0) wrap.textContent='（无收藏）';
  else{
    wrap.innerHTML = arr.map(a=>`<div>“${a.text}” <span class="meta">— ${a.author}</span></div>`).join('');
  }
}

function loadFriendFavorites(){
  const wid = document.getElementById('wechatIdInput').value.trim();
  if(!wid) return alert('请输入微信号');
  renderFavorites(wid);
}

function shareItem(item){
  // create simple share URL to open page showing this item
  const url = new URL(window.location.href);
  url.searchParams.set('share', item.id);
  navigator.clipboard.writeText(url.href).then(()=>{
    alert('分享链接已复制到剪贴板，可在微信中直接打开');
  })
}

function onModeChange(){
  const v = document.getElementById('modeSelect').value;
  document.getElementById('wechatInputWrap').style.display = v==='wechat' ? 'block' : 'none';
  renderFavorites(v==='guest' ? 'guest' : (document.getElementById('wechatIdInput').value||'me'));
}

function toggleMusic(){
  if(playing){
    audio.pause();
    playing=false;
    document.getElementById('toggleMusic').textContent='🔈';
  } else {
    audio.src = audioTracks[currentTrack];
    audio.loop = true;
    audio.play();
    playing=true;
    document.getElementById('toggleMusic').textContent='🔊';
    currentTrack = (currentTrack+1) % audioTracks.length;
  }
}

// on load: check URL for share param or favorites param
function handleURLParams(){
  const params = new URLSearchParams(window.location.search);
  if(params.has('share')){
    const id = params.get('share');
    const item = quotes.find(q=>q.id===id);
    if(item) showResults([item], '分享的句子');
  }
  if(params.has('favorites')){
    const wid = params.get('favorites');
    document.getElementById('modeSelect').value = 'wechat';
    onModeChange();
    document.getElementById('wechatIdInput').value = wid;
    renderFavorites(wid);
  }
}

window.addEventListener('load', async ()=>{await init(); handleURLParams(); renderFavorites('guest');});
