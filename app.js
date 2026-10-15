// app.js - La La Quotes prototype

const quoteBank = buildQuoteBank();
let audioTracks = [
  'https://cdn.pixabay.com/download/audio/2022/03/15/audio_5a4a0d1b3a.mp3?filename=soft-magic-110773.mp3',
  'https://cdn.pixabay.com/download/audio/2021/11/02/audio_5c7c5b3f6a.mp3?filename=acoustic-meditation-106522.mp3',
  'https://cdn.pixabay.com/download/audio/2022/03/15/audio_0b2b1a9f9e.mp3?filename=sunset-travel-110738.mp3'
];
let audio = new Audio();
let currentTrack = 0;
let playing = false;

function buildQuoteBank() {
  const config = {
    '表白': {
      count: 120,
      tags: ['表白', '爱情', '告白', '浪漫'],
      templates: [
        '如果那天你愿意看见我，', '我想把这份心意慢慢说给你听，', '在所有像风一样的日子里，', '今天我决定勇敢一点，',
        '我一直在等一个适合的时机，', '有些话藏在心里太久，', '你走进我的世界时，', '我在黑夜里想了很多，',
        '想和你一起看见未来，', '我不知道该怎么开口，', '其实我一直想说，', '这份情绪像久别重逢的灯光，'
      ],
      endings: [
        '我喜欢你，愿意和你一起走到明天。', '不如就让这次相遇，成为我们开始的理由。', '如果你愿意，我想把余生认真地陪在你身边。',
        '我想在每一个晴天里，和你一起做浪漫的事。', '我想让你知道，我真的很喜欢你。', '这份喜欢从来都不是说出来就算完的。',
        '你是我想认真追赶的那个人。', '我希望这次告白，能换来你一个肯定。', '我想陪你看所有的起风和落雨。', '从认识你的那天起，我就想靠近你。'
      ],
      authors: ['一位小说里的主角', '一部番剧的女主角', '一位电影中的男主', '一位散文作者', '一名浪漫主义作家'],
      sources: ['《雨中的告白》', '《花与月》', '《某个夏天》', '《月光下的二人》', '《彩虹旅店》', '《东京夜色》']
    },
    '死亡': {
      count: 120,
      tags: ['死亡', '离别', '告别', '宿命'],
      templates: [
        '死亡不是终点，', '失去一切时，', '在天亮之前，', '当白雾漫过旧街，', '我们终将学会放手，', '没有人能永远留住时间，',
        '每一次告别都像一场长路，', '疼痛会慢慢变成回忆，', '当生命落下帷幕，', '我们曾经以为永远，', '那些不再可见的身影，', '想起彼时的笑声，'
      ],
      endings: [
        '但我们还在彼此之间不停回响。', '也许只有把它放进心里，才不会失去它。', '最后剩下的，是安静地记住彼此。', '我们都在一点点学会接受离别。',
        '走得再远，也会在某一刻想起。', '人终究是会怀念曾经拥有的一切。', '一切都过去了，唯有回忆还在。', '命运让我们分开，可心却还在。',
        '那些离去的人，仍在我们心里生长。', '生命有尽头，爱没有尽头。', '终究我们都要学会独自活着。', '记忆是最后一盏照亮的灯。'
      ],
      authors: ['一位小说里失去亲人的角色', '一位文学中的长者', '某位电影中的主角', '一位诗人', '一名纪录片旁白'],
      sources: ['《亡灵之城》', '《暮色遗忘》', '《纪念日》', '《远方的灯》', '《没有人能留下》', '《夜航》']
    },
    '成长': {
      count: 120,
      tags: ['成长', '蜕变', '青春', '前进'],
      templates: [
        '成长从来不是一次次轻松的胜利，', '真正长大的时候，', '青春的意义常常在失去以后，', '我们以为自己已经长大，',
        '当世界向我们发出邀请，', '人总会在某一刻突然明白，', '走过风雨的人，', '不知什么时候开始，', '很多东西没有答案，',
        '我曾以为停下脚步就能保住所有，', '一切都在慢慢变得清晰，', '有些改变不是被逼出来的，'
      ],
      endings: [
        '而是在孤独里学会站稳。', '我们才不得不开始成长。', '脚下的路，从来不因为害怕而变短。', '跌倒过的人，才更懂得如何前行。',
        '每一次失去，都在帮我们变强。', '长大就是接受真实的自己。', '我们终究要在痛中学会奔跑。', '那些曾经怕的事，终究会被跨过。',
        '成长不是变得完美，而是学会承受。', '走出来的路，总会比想象更长。', '人终究会在每个不确定里变得更强。', '我们仍在不断长成更好的样子。'
      ],
      authors: ['一位成长小说中的主角', '一位年轻导演', '某本自传中的作者', '一位旅行作家', '一位成长主题的编剧'],
      sources: ['《向前走》', '《玻璃少年》', '《在日落前醒来》', '《路过青春》', '《我们都在长大》', '《一个人去远方》']
    },
    '励志': {
      count: 120,
      tags: ['励志', '坚持', '勇气', '梦想'],
      templates: [
        '想要离开黑暗，', '命运给我们机会时，', '不必等到一切都确认，', '所有人的人生都不是一条直线，', '真正强大的人，',
        '一个人走得再远，', '当你觉得自己快要撑不住时，', '好日子不会自己来，', '我们总要在不确定里，', '有些光，',
        '想要站在高处，', '相信自己并不容易，'
      ],
      endings: [
        '先从迈出一小步开始。', '往往就在你愿意继续努力的时候。', '不必害怕，先做出下一步就好。', '因为你终于明白，自己可以走得更远。',
        '不一定要赢得所有人，至少赢得自己。', '那就把每一寸困难都当成成长的证明。', '只要心还在燃烧，总有机会重生。', '就算困苦再多，也不代表前路没有出口。',
        '生命最好的事情，就是一直向前走。', '你会发现，真正重要的从来不是你多快。', '坚持的意义，就是在你最累时也不肯放手。', '只要还在前进，就没有真正失败。'
      ],
      authors: ['一位励志演讲者', '一位热血电影里的主角', '某部青春电影的旁白', '一位不轻言放弃的作者', '一个在路上的旅人'],
      sources: ['《穿过风》', '《不放弃的日子》', '《风会带你去远方》', '《今天也要出发》', '《向山走》', '《追光者》']
    },
    '友情': {
      count: 120,
      tags: ['友情', '陪伴', '信任', '陪你走'],
      templates: [
        '真正的朋友，不一定会一直说很多，', '能陪你一起笑的人，', '有些回忆不是说出来的，', '在最无助的时候，', '我们都想要一个真正懂自己的人，',
        '朋友是我们在世界上最重要的避难所，', '我总觉得，', '你不必把所有事情都讲给别人听，', '一段长久的友情，', '一起走过的日子，'
      ],
      endings: [
        '会让人突然觉得，世界并不那么可怕。', '往往比任何语言都珍贵。', '比所有羡慕都更难得。', '是人生里最好的光。',
        '再长的路，也有人陪你一起走。', '会长在心里，直到很久很久。', '是每个人都值得拥有的安稳。', '即使分开，也会记得彼此。',
        '陪伴比表达更重要。', '许多时候，真正重要的是站在你身边。', '能被理解，能被信任，真的很幸运。', '一起笑过的人，永远不会轻易被忘记。'
      ],
      authors: ['一位青春小说中的朋友', '一部温情番剧里的角色', '一位电影里的兄弟', '一位记忆里的朋友', '一位散文作家'],
      sources: ['《我们在一起》', '《深夜电台》', '《朋友们》', '《这条路的尽头》', '《葬礼后的午后》', '《夜谈》']
    },
    '失落': {
      count: 120,
      tags: ['失落', '离开', '遗憾', '孤独'],
      templates: [
        '有时候，最难的不是错过，', '失落总会在深夜来临，', '时间会让所有人都变得不一样，', '曾经以为会一直存在的，',
        '你后来才明白，', '情绪有时候会像一场雨，', '人总是要学会把某些东西放下，', '我想把那些不好的日子藏起来，',
        '经常很安静地难过，', '原来失去的并不总是物质，', '有些东西不说出口，', '我以为我看得很淡，'
      ],
      endings: [
        '可心里却一直有个位置。', '但它其实在每一个角落里都在发光。', '最后只剩下细碎的回忆。', '现实总比我们想象的更不容易。',
        '有些人离开后，整个世界都轻了一些。', '因为失落懂得珍惜那些能留下的东西。', '无论它多重，我们都还在承受。', '日子会把一切都缓慢地磨平。',
        '失去以后，才知道什么是真正难熬。', '而人也只有在失落时，才学会长大。', '沉默也许不是没有感受，而是已经尽力了。', '愿将来能更好地接受一切。'
      ],
      authors: ['一位失落小说中的主角', '一位悲伤电影中的旁白', '一位沉默的作者', '一位今天也在写字的人', '一位离别主题的诗人'],
      sources: ['《最后一段夜》', '《空白的日记》', '《镜子中的城》', '《一个无法被看见的人》', '《城市的翻页》', '《冬天的回音》']
    }
  };

  const all = [];
  Object.entries(config).forEach(([theme, cfg]) => {
    for (let i = 0; i < cfg.count; i++) {
      const text = `${cfg.templates[i % cfg.templates.length]}${cfg.endings[(i * 3) % cfg.endings.length]}`;
      const author = cfg.authors[i % cfg.authors.length];
      const source = cfg.sources[(i + 1) % cfg.sources.length];
      all.push({
        id: `${theme}-${i + 1}`,
        text,
        author,
        source,
        themes: [theme, ...cfg.tags.slice(0, 2)],
        tags: cfg.tags,
        language: '中文',
        tone: theme
      });
    }
  });
  return all;
}

function renderCategories() {
  const list = document.getElementById('categoryList');
  const map = {};
  quoteBank.forEach(item => {
    item.themes.forEach(theme => {
      map[theme] = (map[theme] || 0) + 1;
    });
  });
  list.innerHTML = '';
  Object.keys(map).sort().forEach(theme => {
    const li = document.createElement('li');
    li.textContent = `${theme} (${map[theme]})`;
    li.addEventListener('click', () => {
      const filtered = quoteBank.filter(item => item.themes.includes(theme));
      showResults(filtered, `分类：${theme}（${filtered.length} 条）`);
    });
    list.appendChild(li);
  });
}

function showResults(list, infoText) {
  const resultsInfo = document.getElementById('resultsInfo');
  const listEl = document.getElementById('resultsList');
  listEl.innerHTML = '';
  resultsInfo.textContent = infoText;

  const template = document.getElementById('quoteTpl');
  list.forEach(item => {
    const clone = template.content.cloneNode(true);
    clone.querySelector('.quote-text').textContent = item.text;
    clone.querySelector('.source').textContent = `${item.author} · ${item.source}`;
    clone.querySelector('.tags').textContent = item.tags.join(' / ');
    clone.querySelector('.saveBtn').addEventListener('click', () => saveFavorite(item));
    clone.querySelector('.shareBtn').addEventListener('click', () => shareItem(item));
    listEl.appendChild(clone);
  });
}

function onSearch() {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();
  if (!query) {
    showResults(quoteBank.slice(0, 50), `展示示例条目（共 ${quoteBank.length} 条）`);
    return;
  }
  const results = quoteBank.filter(item => {
    const haystack = [
      item.text,
      item.author,
      item.source,
      item.tags.join(' '),
      item.themes.join(' '),
      item.language
    ].join(' ').toLowerCase();
    return haystack.includes(query);
  });
  showResults(results, `搜索“${query}” 匹配 ${results.length} 条`);
}

function saveFavorite(item) {
  const mode = document.getElementById('modeSelect').value;
  const storageKey = mode === 'guest' ? 'favorites_guest' : `favorites_${document.getElementById('wechatIdInput').value.trim() || 'me'}`;
  const current = JSON.parse(localStorage.getItem(storageKey) || '[]');
  const exists = current.some(x => x.id === item.id);
  if (!exists) current.push(item);
  localStorage.setItem(storageKey, JSON.stringify(current));
  alert(mode === 'guest' ? '已收藏到游客列表' : `已收藏到微信号 ${document.getElementById('wechatIdInput').value || 'me'} 的收藏`);
  renderFavorites(mode === 'guest' ? 'guest' : (document.getElementById('wechatIdInput').value || 'me'));
}

function renderFavorites(key = 'guest') {
  const wrap = document.getElementById('favoritesList');
  const data = JSON.parse(localStorage.getItem(`favorites_${key}`) || '[]');
  if (!data.length) {
    wrap.textContent = '（无收藏）';
    return;
  }
  wrap.innerHTML = data.map(item => `<div>“${item.text}” <span style="color:#ffd166;">— ${item.author}</span></div>`).join('');
}

function loadFriendFavorites() {
  const friendId = document.getElementById('wechatIdInput').value.trim();
  if (!friendId) {
    alert('请输入好友微信号');
    return;
  }
  renderFavorites(friendId);
}

function shareItem(item) {
  const url = new URL(window.location.href);
  url.searchParams.set('share', item.id);
  navigator.clipboard.writeText(url.href)
    .then(() => alert('分享链接已复制，可在微信中直接打开'))
    .catch(() => alert('复制失败，页面地址：' + url.href));
}

function toggleMusic() {
  if (playing) {
    audio.pause();
    playing = false;
    document.getElementById('toggleMusic').textContent = '🔈';
    return;
  }
  audio.src = audioTracks[currentTrack];
  audio.loop = true;
  audio.play();
  playing = true;
  document.getElementById('toggleMusic').textContent = '🔊';
  currentTrack = (currentTrack + 1) % audioTracks.length;
}

function handleURLParams() {
  const params = new URLSearchParams(window.location.search);
  const shareId = params.get('share');
  if (shareId) {
    const item = quoteBank.find(x => x.id === shareId);
    if (item) showResults([item], '分享的句子');
  }
  const friendId = params.get('favorites');
  if (friendId) {
    document.getElementById('modeSelect').value = 'wechat';
    document.getElementById('wechatIdInput').value = friendId;
    loadFriendFavorites();
  }
}

function initEvents() {
  document.getElementById('searchBtn').addEventListener('click', onSearch);
  document.getElementById('searchInput').addEventListener('keydown', event => {
    if (event.key === 'Enter') onSearch();
  });
  document.getElementById('modeSelect').addEventListener('change', () => {
    const mode = document.getElementById('modeSelect').value;
    const box = document.getElementById('wechatInputWrap');
    box.style.display = mode === 'wechat' ? 'block' : 'none';
    renderFavorites(mode === 'guest' ? 'guest' : (document.getElementById('wechatIdInput').value || 'me'));
  });
  document.getElementById('loadFavBtn').addEventListener('click', loadFriendFavorites);
  document.getElementById('toggleMusic').addEventListener('click', toggleMusic);
}

window.addEventListener('load', () => {
  initEvents();
  renderCategories();
  showResults(quoteBank.slice(0, 50), `展示示例条目（共 ${quoteBank.length} 条）`);
  handleURLParams();
  renderFavorites('guest');
});
