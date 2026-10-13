// Open Contexts landing page: nav, theme, reveal, and the in-browser demo of the
// app bar (SidebarPanel) and window switcher (SwitcherPanel). Behaviour mirrors
// Sources/OpenContexts/AppController.swift and Panels.swift.
(() => {
  const ASSETS = document.currentScript.src.replace(/[^/]+$/, '')
  const zh = document.documentElement.lang.startsWith('zh')
  const T = zh ? {
    ungrouped: '未分组', newGroupName: '新建分组', code: '代码', team: '团队',
    settings: '设置…', updates: '检查更新…', quit: '退出 OpenContexts', settingsTitle: 'OpenContexts 设置',
    sidebar: '应用栏', always: '始终显示', hover: '悬浮显示', display: '显示内容', icon: '仅图标', iconTitle: '图标和标题',
    position: '应用栏位置', left: '左', right: '右', bottom: '底部', allWin: '所有窗口', curWin: '当前应用窗口',
    access: '辅助功能', granted: '已授权', pin: '固定', hideApp: '隐藏应用', quitApp: '退出应用',
    search: '输入应用名或窗口标题', noMatches: '没有匹配的窗口',
    off: '关闭', alignment: '垂直位置', top: '上方', center: '居中', width: '侧边栏宽度', reset: '恢复默认',
    general: '通用', features: '功能', shortcuts: '快捷键', groups: '分组', language: '语言',
    showUngrouped: '显示未分组（为空时自动隐藏）', showCreateGroup: '显示新建分组按钮',
  } : {
    ungrouped: 'Ungrouped', newGroupName: 'New Group', code: 'Code', team: 'Team',
    settings: 'Settings…', updates: 'Check for Updates…', quit: 'Quit OpenContexts', settingsTitle: 'OpenContexts Settings',
    sidebar: 'Sidebar', always: 'Always visible', hover: 'Show on hover', display: 'Display', icon: 'Icons only', iconTitle: 'Icons and titles',
    position: 'Sidebar position', left: 'Left', right: 'Right', bottom: 'Bottom', allWin: 'All windows', curWin: 'Current app windows',
    access: 'Accessibility', granted: 'Granted', pin: 'Pin', hideApp: 'Hide App', quitApp: 'Quit App',
    search: 'Type an app name or window title', noMatches: 'No matching windows',
    off: 'Off', alignment: 'Vertical alignment', top: 'Top', center: 'Center', width: 'Sidebar width', reset: 'Restore defaults',
    general: 'General', features: 'Features', shortcuts: 'Shortcuts', groups: 'Groups', language: 'Language',
    showUngrouped: 'Show Ungrouped (hidden when empty)', showCreateGroup: 'Show New Group button',
  }

  const sq = (fill, extra = '') => `<rect x="4" y="4" width="56" height="56" rx="13" fill="${fill}"${extra}/>`
  const ICON = {
    terminal: `<svg viewBox="0 0 64 64" aria-hidden="true">${sq('#2c2c2e', ' stroke="#5a5a5e"')}<path d="M17 24l8 7-8 7M29 40h14" fill="none" stroke="#f2f2f2" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    finder: `<svg viewBox="0 0 64 64" aria-hidden="true">${sq('#1f7ff0')}<path d="M4 17A13 13 0 0 1 17 4h18c-4 9-6 18-6 27h6c-1 10 0 20 2 29H17A13 13 0 0 1 4 47z" fill="#9ad6ff"/><path d="M21 22v6M43 22v6" stroke="#0f2742" stroke-width="3" stroke-linecap="round"/><path d="M19 42c8 6 18 6 26 0" fill="none" stroke="#0f2742" stroke-width="2.6" stroke-linecap="round"/></svg>`,
    chrome: `<svg viewBox="0 0 64 64" aria-hidden="true"><g transform="rotate(-150 32 32)" fill="none" stroke-width="26"><circle cx="32" cy="32" r="13" stroke="#ea4335" stroke-dasharray="27.23 81.68"/><circle cx="32" cy="32" r="13" stroke="#fbbc04" stroke-dasharray="27.23 81.68" stroke-dashoffset="-27.23"/><circle cx="32" cy="32" r="13" stroke="#34a853" stroke-dasharray="27.23 81.68" stroke-dashoffset="-54.45"/></g><circle cx="32" cy="32" r="11.5" fill="#fff"/><circle cx="32" cy="32" r="8.5" fill="#1a73e8"/></svg>`,
    notes: `<svg viewBox="0 0 64 64" aria-hidden="true">${sq('#fff', ' stroke="#d9d9d9"')}<path d="M4 17A13 13 0 0 1 17 4h30a13 13 0 0 1 13 13v5H4z" fill="#ffd52e"/><path d="M12 33h40M12 41h40M12 49h40" stroke="#cfcfcf" stroke-width="1.5" stroke-dasharray="2 2"/></svg>`,
    chatgpt: `<svg viewBox="0 0 64 64" aria-hidden="true">${sq('#fff', ' stroke="#d9d9d9"')}<g fill="none" stroke="#111" stroke-width="3.2"><ellipse cx="32" cy="32" rx="16" ry="7"/><ellipse cx="32" cy="32" rx="16" ry="7" transform="rotate(60 32 32)"/><ellipse cx="32" cy="32" rx="16" ry="7" transform="rotate(120 32 32)"/></g></svg>`,
    claude: `<svg viewBox="0 0 64 64" aria-hidden="true">${sq('#d97757')}<path d="M32 15v34M15 32h34M20 20l24 24M44 20L20 44" stroke="#fff" stroke-width="4.2" stroke-linecap="round"/></svg>`,
    slack: `<svg viewBox="0 0 64 64" aria-hidden="true">${sq('#fff', ' stroke="#d9d9d9"')}<g stroke-width="6.5" stroke-linecap="round"><path d="M26 16v32" stroke="#36c5f0"/><path d="M16 38h32" stroke="#ecb22e"/><path d="M38 16v32" stroke="#e01e5a"/><path d="M16 26h32" stroke="#2eb67d"/></g></svg>`,
  }
  const STATUS_ICON = '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="5.5" width="13" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M3.5 3.5h9M5.5 1.5h5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>'

  // box: [x, y, width, height] on the 1120×700 stage
  const APPS = {
    terminal: { name: 'Terminal', title: 'zsh — ~/open-contexts', box: [310, 300, 540, 320] },
    finder: { name: 'Finder', title: 'Applications', box: [250, 64, 520, 330] },
    chrome: { name: 'Google Chrome', title: 'zshnb/open-contexts - Google Chrome', box: [450, 110, 600, 420] },
    notes: { name: 'Notes', title: 'All iCloud — 12 notes', box: [280, 90, 560, 380] },
    chatgpt: { name: 'ChatGPT', title: 'ChatGPT', box: [370, 70, 600, 440] },
    claude: { name: 'Claude', title: 'Claude', box: [330, 120, 620, 430] },
    slack: { name: 'Slack', title: '#releases - Open Contexts - Slack', box: [260, 96, 680, 430] },
  }
  const MRU0 = ['terminal', 'chrome', 'finder', 'slack', 'claude', 'chatgpt', 'notes']
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
  const groups0 = () => [
    { id: 'u', name: T.ungrouped, items: ['finder', 'notes'] },
    { id: 'c', name: T.code, items: ['terminal', 'chrome', 'claude', 'chatgpt'] },
    { id: 't', name: T.team, items: ['slack'] },
  ]
  const badges0 = () => ({ slack: '3', claude: '' }) // '' = dot, as DockBadgeState does for non-numeric badges

  const rowHTML = (id, badges, tag = 'div') => {
    const b = id in badges ? `<i class="badge${badges[id] ? ' num' : ''}">${badges[id]}</i>` : ''
    const t = esc(APPS[id].title)
    const attrs = tag === 'button' ? ` draggable="true" data-id="${id}" aria-label="${esc(APPS[id].name)}, ${t}"` : ''
    return `<${tag} class="row"${attrs} title="${t}"><span class="ico">${ICON[id]}${b}</span><span class="t">${t}</span></${tag}>`
  }
  const sidebarDefaults = { pos: 'left', display: 'title', mode: 'always', align: 'center', width: 188,
    showUngrouped: true, showCreateGroup: true, page: 'sidebar' }
  const barHTML = (groups, badges, tag, settings = sidebarDefaults) =>
    groups.filter(g => g.id !== 'u' || settings.showUngrouped && g.items.length)
      .map(g => `<div class="grp" data-g="${g.id}">${esc(g.name)}</div>` + g.items.map(id => rowHTML(id, badges, tag)).join('')).join('')
    + (settings.showCreateGroup ? `<${tag === 'button' ? 'button' : 'div'} class="newgrp" title="${T.newGroupName}">＋<span class="t"> ${T.newGroupName}</span></${tag === 'button' ? 'button' : 'div'}>` : '')
  function searchWindows(list, query) {
    const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
    return list.map(id => {
      let score = 0
      for (const token of tokens) {
        const scores = [APPS[id].name, APPS[id].title].map(text => {
          const at = text.toLowerCase().indexOf(token)
          if (at < 0) return -1
          return text.length === token.length ? 1000 : at === 0 ? 700
            : /[^\p{L}\p{N}]/u.test(text[at - 1]) || /[a-z]/.test(text[at - 1]) && /[A-Z]/.test(text[at]) ? 600 : 500
        })
        if (Math.max(...scores) < 0) return null
        score += Math.max(...scores)
      }
      return { id, score }
    }).filter(Boolean).sort((a, b) => b.score - a.score).map(match => match.id)
  }
  function highlight(text, query) {
    const ranges = query.toLowerCase().trim().split(/\s+/).filter(Boolean).map(token => {
      const at = text.toLowerCase().indexOf(token)
      return [at, at + token.length]
    }).filter(([at]) => at >= 0)
    let html = '', marked = false
    for (let i = 0; i < text.length; i++) {
      const match = ranges.some(([start, end]) => i >= start && i < end)
      if (match !== marked) html += match ? '<mark>' : '</mark>'
      html += esc(text[i]); marked = match
    }
    return html + (marked ? '</mark>' : '')
  }
  const swRows = (list, sel, tag = 'div', query = '') => list.map((id, i) =>
    `<${tag} class="srow" role="option" data-i="${i}" aria-selected="${i === sel}"><span class="app">${highlight(APPS[id].name, query)}</span>${ICON[id]}<span class="t">${highlight(APPS[id].title, query)}</span></${tag}>`).join('')
  const seg = (k, opts, cur, mock) => `<div class="seg" role="radiogroup" aria-label="${T[{ mode: 'sidebar', pos: 'position', align: 'alignment', display: 'display' }[k]]}">${opts.map(([v, label]) =>
    `<label><input class="bc-input" type="radio" name="${mock ? 'mock' : 'demo'}-${k}" data-k="${k}" data-v="${v}" value="${v}" ${v === cur ? 'checked' : ''}>${label}</label>`).join('')}</div>`
  const settingsForm = s => `<div class="form"><nav class="settings-nav" aria-label="${T.settings}">
    <button class="bc-button" data-variant="ghost" data-size="sm" type="button" data-k="page" data-v="general" aria-current="${s.page === 'general' ? 'page' : 'false'}">${T.general}</button>
    <small>${T.features}</small>
    ${[['sidebar', T.sidebar], ['shortcuts', T.shortcuts]].map(([page, title]) => `<button class="bc-button" data-variant="ghost" data-size="sm" type="button" data-k="page" data-v="${page}" aria-current="${s.page === page ? 'page' : 'false'}">${title}</button>`).join('')}
    </nav><div class="settings-content">${s.page === 'general' ? `
    <div class="frow"><span>${T.language}</span><span class="val">${zh ? '中文' : 'English'}</span></div>
    <div class="frow"><span>${T.access}</span><span class="val">${T.granted}</span></div>` : s.page === 'shortcuts' ? `
    <div class="frow"><span>${T.allWin}</span><span class="val">⌘Tab</span></div>
    <div class="frow"><span>${T.curWin}</span><span class="val">⌘\`</span></div>` : `
    <div class="frow"><span>${T.sidebar}</span>${seg('mode', [['always', T.always], ['hover', T.hover], ['hidden', T.off]], s.mode, s.mock)}</div>
    <div class="frow"><span>${T.position}</span>${seg('pos', [['left', T.left], ['right', T.right], ['bottom', T.bottom]], s.pos, s.mock)}</div>
    ${s.pos !== 'bottom' ? `<div class="frow"><span>${T.alignment}</span>${seg('align', [['top', T.top], ['center', T.center], ['bottom', T.bottom]], s.align, s.mock)}</div>` : ''}
    <div class="frow"><span>${T.display}</span>${seg('display', [['icon', T.icon], ['title', T.iconTitle]], s.display, s.mock)}</div>
    ${s.pos !== 'bottom' ? `<div class="frow"><label for="sidebar-width-${s.mock ? 'mock' : 'demo'}">${T.width}</label><div class="width-control">
      <input class="bc-input" id="sidebar-width-${s.mock ? 'mock' : 'demo'}" type="range" min="94" max="376" value="${s.width}" data-setting="width" ${s.display === 'icon' ? 'disabled' : ''}>
      <button class="bc-button" data-variant="outline" data-size="icon-sm" type="button" data-act="reset-width" aria-label="${T.reset}" title="${T.reset}" ${s.display === 'icon' ? 'disabled' : ''}><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11a9 9 0 1 1 2.64 6.36M3 4v7h7"/></svg></button></div></div>` : ''}
    <div class="frow"><span>${T.groups}</span><div class="group-options">
      <label><input class="bc-input" type="checkbox" data-setting="showUngrouped" ${s.showUngrouped ? 'checked' : ''}>${T.showUngrouped}</label>
      <label><input class="bc-input" type="checkbox" data-setting="showCreateGroup" ${s.showCreateGroup ? 'checked' : ''}>${T.showCreateGroup}</label>
    </div></div>`}</div></div>`

  const lights = (close = '') => `<span class="lights"><i class="${close}"></i><i></i><i></i></span>`
  const titlebar = (title, cls = '') => `<div class="titlebar ${cls}">${lights()}<span class="ttl">${esc(title)}</span></div>`
  const BODY = {
    terminal: () => titlebar(APPS.terminal.title, 'dark') + `<div class="wbody"><div class="term"><span class="d">Last login: Tue Sep 29 09:41:07 on ttys001</span>
<span class="p">~/open-contexts ❯</span> swift build -c release
Building for production...
[42/42] Linking OpenContexts
<span class="p">Build complete!</span> (18.42s)
<span class="p">~/open-contexts ❯</span> open dist/OpenContexts.app
<span class="p">~/open-contexts ❯</span> <span class="cur"></span></div></div>`,
    finder: () => titlebar('Applications') + `<div class="wbody finder"><aside><h4>Favorites</h4><p>AirDrop</p><p>Recents</p><p class="on">Applications</p><p>Desktop</p><p>Documents</p><p>Downloads</p></aside>
      <div class="grid">${[['chatgpt', 'ChatGPT'], ['claude', 'Claude'], ['chrome', 'Google Chrome'], ['notes', 'Notes']].map(([k, n]) => `<div>${ICON[k]}${n}</div>`).join('')}
      <div><img src="${ASSETS}icon.png" alt="" width="48" height="48" style="margin:0 auto 6px">OpenContexts</div><div>${ICON.slack}Slack</div><div>${ICON.terminal}Terminal</div></div></div>`,
    chrome: () => `<div class="chrome-tabs">${lights()}<div class="chrome-tab"><img src="${ASSETS}icon.png" alt="" width="14" height="14">zshnb/open-contexts</div></div>
      <div class="omni">github.com/zshnb/open-contexts</div><div class="wbody page">zshnb / <b>open-contexts</b><span class="pill-tag">Public</span>
      <h5>Open Contexts</h5><div class="sk" style="width:92%"></div><div class="sk" style="width:84%"></div><div class="sk" style="width:60%"></div>
      <div class="sk" style="width:88%;margin-top:22px"></div><div class="sk" style="width:74%"></div><div class="sk" style="width:80%"></div><div class="sk" style="width:40%"></div></div>`,
    notes: () => titlebar(APPS.notes.title) + `<div class="wbody notes"><aside><p class="on"><b>Release checklist</b><small>Today · 4 items</small></p><p><b>Group ideas</b><small>Yesterday</small></p><p><b>Shortcuts</b><small>Monday</small></p></aside>
      <main><h6>Release checklist</h6>☑ Bump VERSION to 0.3.5<br>☑ Update CHANGELOG<br>☐ Tag v0.3.5 and push<br>☐ Check appcast.xml</main></div>`,
    chatgpt: () => titlebar('ChatGPT') + `<div class="wbody chat"><div class="bubble me">How do I switch between windows, not apps, on a Mac?</div>
      <div>macOS ⌘Tab switches apps. A window switcher lists every window in most-recently-used order, so one keystroke gets you back to where you were.</div><div class="sk" style="width:70%"></div><div class="sk" style="width:55%"></div></div>`,
    claude: () => titlebar('Claude') + `<div class="wbody chat" style="background:#faf9f5;height:100%"><div class="bubble me" style="background:#ece9df">Why does ⌘Tab start on the second window?</div>
      <div>The first window in the list is the one you're already in. Starting on the second one means a quick ⌘Tab always takes you back to the previous window.</div><div class="sk" style="width:66%;background:#ece9df"></div></div>`,
    slack: () => titlebar(APPS.slack.title) + `<div class="wbody slack"><aside><b>Open Contexts</b># general<div class="on"># releases</div># design<br># support</aside><main>
      <div class="msg"><span class="av" style="background:#e8a33d"></span><div><b>Mia</b><br>v0.3.5 is out: five interface languages 🎉</div></div>
      <div class="msg"><span class="av" style="background:#5b8def"></span><div><b>Leo</b><br>Bottom bar now shrinks items evenly. Every window fits on one line.</div></div>
      <div class="msg"><span class="av" style="background:#3fb68b"></span><div style="flex:1"><b>Ana</b><div class="sk" style="width:80%"></div><div class="sk" style="width:50%"></div></div></div></main></div>`,
  }

  function mountDemo(viewport) {
    const screen = viewport.querySelector('.screen')
    const ro = new ResizeObserver(() => viewport.style.setProperty('--s', viewport.clientWidth / 1120))
    ro.observe(viewport)

    let st
    const reset = () => {
      st = { mru: [...MRU0], min: new Set(['slack', 'claude', 'chatgpt', 'notes']), badges: badges0(), groups: groups0(),
        ...sidebarDefaults, front: 'terminal', settings: false, sw: null, menu: false, drag: null }
    }
    reset()

    screen.innerHTML = `<div class="menubar"><b data-front></b><span>File</span><span>Edit</span><span>View</span><span>Window</span><span>Help</span>
        <div class="right"><button class="status-btn" type="button" aria-haspopup="menu" aria-expanded="false" aria-label="OpenContexts">${STATUS_ICON}</button><span>Tue Sep 29&nbsp; 9:41 AM</span></div></div>
      <div class="menu" role="menu" hidden style="right:120px"><button type="button" role="menuitem" data-act="settings">${T.settings}</button><button type="button" role="menuitem" disabled>${T.updates}</button><hr><button type="button" role="menuitem" disabled>${T.quit}</button></div>
      ${Object.keys(APPS).map(id => { const [x, y, w, h] = APPS[id].box; return `<div class="win" data-win="${id}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">${BODY[id]()}</div>` }).join('')}
      <div class="win" data-win="settings" style="left:140px;top:60px;width:840px;height:600px">${titlebar(T.settingsTitle).replace('<i class=""></i>', '<i class="close" title="Close"></i>')}<div class="wbody" data-form></div></div>
      <nav class="appbar" aria-label="App bar"></nav>
      <div class="switcher" role="dialog" aria-label="Window switcher" hidden></div>
      <button class="cmd-pill" type="button" data-act="cmdtab"><kbd>⌘ Tab</kbd>${zh ? '打开窗口切换器' : 'Show window switcher'}</button>`

    const $ = s => screen.querySelector(s)
    const bar = $('.appbar'), sw = $('.switcher'), menu = $('.menu'), statusBtn = $('.status-btn')
    const wins = [...screen.querySelectorAll('[data-win]')]

    function render() {
      const order = st.mru
      wins.forEach(w => {
        const id = w.dataset.win
        if (id === 'settings') {
          w.classList.toggle('is-min', !st.settings)
          w.style.zIndex = st.front === 'settings' ? 900 : 90
        } else {
          w.classList.toggle('is-min', st.min.has(id))
          w.style.zIndex = 100 + order.length - order.indexOf(id)
        }
        w.classList.toggle('is-inactive', id !== st.front)
      })
      $('[data-front]').textContent = st.front === 'settings' ? 'OpenContexts' : APPS[st.front].name
      Object.assign(bar.dataset, { pos: st.pos, display: st.display, mode: st.mode, align: st.align })
      bar.style.setProperty('--sidebar-width', `${st.width}px`)
      bar.innerHTML = barHTML(st.groups, st.badges, 'button', st)
      bar.hidden = st.mode === 'hidden' || !bar.innerHTML
      $('[data-form]').innerHTML = settingsForm(st)
      menu.hidden = !st.menu
      statusBtn.setAttribute('aria-expanded', st.menu)
      renderSw()
    }
    function renderSw() {
      sw.hidden = !st.sw
      $('.cmd-pill').hidden = !!st.sw // the button comes back whenever the switcher closes
      if (!st.sw) { sw.innerHTML = ''; return }
      if (!sw.querySelector('input')) sw.innerHTML = `<input class="search-query" type="text" aria-label="${T.search}" placeholder="${T.search}" autocomplete="off" spellcheck="false">`
        + `<div role="listbox" aria-label="${T.allWin}"></div><div class="search-query" role="status"></div>`
      const input = sw.querySelector('input')
      if (input.value !== st.sw.query) input.value = st.sw.query
      sw.querySelector('[role="listbox"]').innerHTML = swRows(st.sw.list, st.sw.sel, 'button', st.sw.query)
      const status = sw.querySelector('[role="status"]')
      status.textContent = st.sw.list.length ? '' : T.noMatches
      status.hidden = !!st.sw.list.length
      input.focus({ preventScroll: true })
    }

    // AppController.activate: restore minimized/hidden, move to front of MRU
    function activate(id) {
      st.min.delete(id)
      delete st.badges[id]
      st.mru = [id, ...st.mru.filter(x => x !== id)]
      st.front = id
      render()
    }
    // AppController: first ⌘Tab selects index 1 (the previous window), ⇧ starts from the end
    function openSw(reverse, held) {
      const list = [...st.mru]
      st.sw = { list, query: '', sel: reverse ? list.length - 1 : Math.min(1, list.length - 1), held }
      st.menu = false
      render()
    }
    const step = d => { const n = st.sw.list.length; if (n) st.sw.sel = (st.sw.sel + d + n) % n; renderSw() }
    const commit = () => { const id = st.sw.list[st.sw.sel]; st.sw = null; id ? activate(id) : renderSw() }
    const cancel = () => { st.sw = null; renderSw() }
    const cmdTab = () => st.sw ? step(1) : openSw(false, false)
    const openSettings = () => { st.settings = true; st.front = 'settings'; st.menu = false; render() }

    function moveWindow(id, gid, beforeId) {
      st.groups.forEach(g => { g.items = g.items.filter(x => x !== id) })
      const g = st.groups.find(g => g.id === gid)
      const i = beforeId ? g.items.indexOf(beforeId) : -1
      g.items.splice(i < 0 ? g.items.length : i, 0, id)
      render()
    }

    screen.addEventListener('mousedown', e => {
      if (st.sw && !e.target.closest('.switcher')) cancel()
      if (st.menu && !e.target.closest('.menu,.status-btn')) { st.menu = false; render() }
      const w = e.target.closest('[data-win]')
      // only re-render when focus changes, or the element under the pointer is replaced before its click fires
      if (w && w.dataset.win !== st.front && !e.target.closest('.close')) w.dataset.win === 'settings' ? (st.front = 'settings', render()) : activate(w.dataset.win)
    })
    screen.addEventListener('click', e => {
      const t = e.target
      if (t.closest('.status-btn')) { st.menu = !st.menu; render() }
      else if (t.closest('[data-act="settings"]')) openSettings()
      else if (t.closest('[data-act="cmdtab"]')) cmdTab()
      else if (t.closest('.close')) { st.settings = false; st.front = st.mru[0]; render() }
      else if (t.closest('.newgrp')) { st.groups.push({ id: 'g' + st.groups.length + Date.now(), name: T.newGroupName, items: [] }); render() }
      else if (t.closest('.row')) activate(t.closest('.row').dataset.id)
      else if (t.closest('.srow')) { st.sw.sel = +t.closest('.srow').dataset.i; commit() }
      else if (t.closest('[data-act="reset-width"]')) { st.width = sidebarDefaults.width; render() }
      else if (t.closest('button[data-k]')) { const b = t.closest('button[data-k]'); st[b.dataset.k] = b.dataset.v; render() }
    })
    screen.addEventListener('input', e => {
      if (e.target.dataset.setting === 'width') {
        st.width = +e.target.value
        bar.style.setProperty('--sidebar-width', `${st.width}px`)
      }
    })
    screen.addEventListener('change', e => {
      if (e.target.matches('input[type="radio"][data-k]')) {
        const { k, v } = e.target.dataset
        st[k] = v
        render()
        screen.querySelector(`input[data-k="${k}"][data-v="${v}"]`).focus({ preventScroll: true })
      } else if (['showUngrouped', 'showCreateGroup'].includes(e.target.dataset.setting)) {
        st[e.target.dataset.setting] = e.target.checked
        render()
        screen.querySelector(`input[data-setting="${e.target.dataset.setting}"]`).focus({ preventScroll: true })
      }
    })
    sw.addEventListener('mouseover', e => {
      const r = e.target.closest('.srow')
      if (r && +r.dataset.i !== st.sw.sel) { st.sw.sel = +r.dataset.i; renderSw() }
    })
    sw.addEventListener('input', e => {
      if (/^[\x20-\x7e]*$/.test(e.target.value)) {
        st.sw.query = e.target.value; st.sw.list = searchWindows(st.mru, st.sw.query); st.sw.sel = 0
      }
      renderSw()
    })

    // Drag windows between groups (HTML5 drag and drop; desktop browsers only)
    const clearDrop = () => bar.querySelectorAll('.drop-before').forEach(x => x.classList.remove('drop-before'))
    bar.addEventListener('dragstart', e => {
      const r = e.target.closest('.row'); if (!r) return
      st.drag = r.dataset.id; r.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', st.drag)
    })
    bar.addEventListener('dragover', e => {
      const t = e.target.closest('.row,.grp'); if (!st.drag || !t) return
      e.preventDefault(); clearDrop(); t.classList.add('drop-before')
    })
    bar.addEventListener('drop', e => {
      const t = e.target.closest('.row,.grp'); if (!st.drag || !t) return
      e.preventDefault()
      if (t.classList.contains('grp')) moveWindow(st.drag, t.dataset.g, null)
      else if (t.dataset.id !== st.drag) moveWindow(st.drag, st.groups.find(g => g.items.includes(t.dataset.id)).id, t.dataset.id)
    })
    bar.addEventListener('dragend', () => { st.drag = null; clearDrop(); render() })

    // Keyboard. Browsers never see ⌘Tab (macOS takes it), so ⌥Tab stands in for the held-modifier flow.
    window.addEventListener('keydown', e => {
      if (e.metaKey || e.ctrlKey) return
      if (e.key === 'Tab' && e.altKey) { e.preventDefault(); e.stopPropagation(); st.sw ? step(e.shiftKey ? -1 : 1) : openSw(e.shiftKey, true); return }
      if (!st.sw) return
      // Option-letter keys produce accented characters on macOS; use the letter for the held-modifier demo.
      const k = e.altKey && /^Key[A-Z]$/.test(e.code) ? e.code.slice(3).toLowerCase() : e.key
      if (k === 'Tab') step(e.shiftKey ? -1 : 1)
      else if (k === 'ArrowDown') step(1)
      else if (k === 'ArrowUp') step(-1)
      else if (k === 'Enter') commit()
      else if (k === 'Escape') cancel()
      else if ((e.altKey || !e.target.matches('input.search-query'))
        && (k === 'Backspace' || !e.isComposing && /^[\x20-\x7e]$/.test(k))) {
        st.sw.query = k === 'Backspace' ? st.sw.query.slice(0, -1) : st.sw.query + k
        st.sw.list = searchWindows(st.mru, st.sw.query)
        st.sw.sel = 0
        renderSw()
      }
      else return
      e.preventDefault()
      e.stopPropagation()
    }, true)
    document.addEventListener('keyup', e => { if (e.key === 'Alt' && st.sw?.held) commit() })

    viewport.closest('.demo').addEventListener('click', e => {
      const a = e.target.closest('.demo-bar [data-act]'); if (!a) return
      if (a.dataset.act === 'cmdtab') cmdTab()
      if (a.dataset.act === 'settings') openSettings()
      if (a.dataset.act === 'reset') { reset(); render() }
    })
    render()
  }

  // Static illustrations for the feature sections
  const MOCKS = {
    search: () => `<div class="mac switcher static"><div class="search-query">chr context</div>${swRows(searchWindows(MRU0, 'chr context'), 0, 'div', 'chr context')}</div>`,
    switcher: () => `<div class="mac switcher static">${swRows(MRU0, 1)}</div>`,
    appbar: () => `<div class="mac desk-mock">
      <div class="appbar static edge" data-pos="left" data-display="title" data-mode="always">${barHTML(groups0(), badges0(), 'div')}</div>
      <div class="appbar static" data-pos="bottom" data-display="title" data-mode="always">${barHTML(groups0(), badges0(), 'div')}</div></div>`,
    groups: () => `<div class="mac groups-mock"><div class="appbar static" data-pos="left" data-display="title" data-mode="always">${barHTML([
      { name: T.ungrouped, items: ['finder'] }, { name: T.code, items: ['terminal', 'chrome', 'claude'] },
      { name: 'AI', items: ['chatgpt'] }, { name: T.team, items: ['slack', 'notes'] }], badges0(), 'div').replace('class="row" title="zsh', 'class="row drop-before" title="zsh')}</div>
      <div class="menu static"><button type="button" tabindex="-1">${T.pin}</button><hr><button type="button" tabindex="-1">${T.hideApp}</button><button type="button" tabindex="-1">${T.quitApp}</button></div></div>`,
    settings: () => `<div class="mac settings-mock"><div class="win static"><div class="titlebar">${lights()}<span class="ttl">${T.settingsTitle}</span></div>${settingsForm({ ...sidebarDefaults, mock: true })}</div>
      <div class="appbar static" data-pos="bottom" data-display="title" data-mode="always">${barHTML(groups0().slice(1), badges0(), 'div')}</div></div>`,
  }

  document.querySelectorAll('[data-mock]').forEach(el => { el.innerHTML = MOCKS[el.dataset.mock](); el.inert = true })
  const vp = document.querySelector('.demo-viewport')
  if (vp) mountDemo(vp)

  // Nav, theme, reveal
  const nav = document.querySelector('.nav')
  const onScroll = () => nav.toggleAttribute('data-scrolled', scrollY > 4)
  addEventListener('scroll', onScroll, { passive: true }); onScroll()

  const ts = document.querySelector('.theme-switch')
  const root = document.documentElement
  const isDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches
  if (ts) {
    ts.setAttribute('aria-checked', isDark())
    ts.addEventListener('click', () => {
      const t = isDark() ? 'light' : 'dark'
      root.dataset.theme = t; ts.setAttribute('aria-checked', t === 'dark')
      try { localStorage.setItem('theme', t) } catch {}
    })
  }

  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) } }), { rootMargin: '0px 0px -10% 0px' })
  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el))
})()
