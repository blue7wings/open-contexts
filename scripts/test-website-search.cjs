const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const path = require('node:path')

const source = fs.readFileSync(path.join(__dirname, '../website/assets/site.js'), 'utf8')
const sandbox = {
  document: { currentScript: { src: '/assets/site.js' }, documentElement: { lang: 'en' } },
}
vm.runInNewContext(source.slice(0, source.indexOf('  const lights ='))
  + 'globalThis.search = { searchWindows, highlight, MRU0, APPS, barHTML, sidebarDefaults, settingsForm }; })()', sandbox)
const { searchWindows, highlight, MRU0, APPS } = sandbox.search
const results = query => Array.from(searchWindows(MRU0, query))

assert.deepEqual(results(''), Array.from(MRU0))
assert.deepEqual(results('   '), Array.from(MRU0))
assert.deepEqual(results('CHROME'), ['chrome'])
assert.deepEqual(results('chr context'), ['chrome'])
assert.deepEqual(results('  context   chr  '), ['chrome'])
assert.deepEqual(results('gchr'), [])
assert.deepEqual(results('chr missing'), [])
assert.deepEqual(results('no such window'), [])
assert.equal(results('chatgpt')[0], 'chatgpt')
assert.deepEqual(results('context'), ['terminal', 'chrome', 'slack'])
assert.equal(highlight('Google Chrome', 'chr context'), 'Google <mark>Chr</mark>ome')
assert.equal(highlight('Google Chrome', 'ch hro'), 'Google <mark>Chro</mark>me')
assert.equal(highlight('Google Chrome', ''), 'Google Chrome')
assert.equal(highlight('<img>&"', '<img>'), '<mark>&lt;img&gt;</mark>&amp;&quot;')
assert.equal(highlight('Google Chrome', '.*'), 'Google Chrome')
APPS.exact = { name: 'Context', title: 'Example' }
assert.equal(searchWindows([...MRU0, 'exact'], 'context')[0], 'exact')

const { barHTML, sidebarDefaults, settingsForm } = sandbox.search
const emptyGroups = [{ id: 'u', name: 'Ungrouped', items: [] }, { id: 'c', name: 'Code', items: [] }]
assert.ok(!barHTML(emptyGroups, {}, 'button').includes('data-g="u"'))
assert.ok(barHTML(emptyGroups, {}, 'button').includes('data-g="c"'))
assert.ok(!barHTML([{ ...emptyGroups[0], items: ['chrome'] }], {}, 'button',
  { ...sidebarDefaults, showUngrouped: false, showCreateGroup: false }).includes('chrome'))
assert.equal(barHTML([emptyGroups[0]], {}, 'button', { ...sidebarDefaults, showCreateGroup: false }), '')
assert.match(settingsForm(sidebarDefaults), /min="94" max="376" value="188"/)
assert.match(settingsForm(sidebarDefaults), /data-v="hidden"/)
assert.ok(!settingsForm({ ...sidebarDefaults, pos: 'bottom' }).includes('type="range"'))
assert.match(settingsForm({ ...sidebarDefaults, display: 'icon' }), /data-setting="width" disabled/)
assert.ok(!settingsForm({ ...sidebarDefaults, page: 'general' }).includes('type="range"'))

// Native radio groups must stay independent between the demo and illustration.
assert.match(settingsForm(sidebarDefaults), /name="demo-pos"/)
assert.match(settingsForm({ ...sidebarDefaults, mock: true }), /name="mock-pos"/)
let change, focused
const settingsState = { ...sidebarDefaults }
vm.runInNewContext(source.slice(source.indexOf("    screen.addEventListener('change'"),
  source.indexOf("    sw.addEventListener('mouseover'")), {
  screen: { addEventListener: (_, callback) => { change = callback },
    querySelector: selector => ({ focus: () => { focused = selector } }) },
  st: settingsState, render() {},
})
change({ target: { matches: () => true, dataset: { k: 'pos', v: 'bottom' } } })
assert.equal(settingsState.pos, 'bottom')
assert.equal(focused, 'input[data-k="pos"][data-v="bottom"]')
change({ target: { matches: () => false, dataset: { setting: 'showUngrouped' }, checked: false } })
assert.equal(settingsState.showUngrouped, false)
assert.equal(focused, 'input[data-setting="showUngrouped"]')

// Execute the real key listener so native editing and the held-Option demo cannot regress.
let keydown
const state = { sw: { query: 'chr', list: [], sel: 0 }, mru: MRU0 }
vm.runInNewContext(source.slice(source.indexOf("    window.addEventListener('keydown'"),
  source.indexOf("    document.addEventListener('keyup'")), {
  window: { addEventListener: (_, callback) => { keydown = callback } }, st: state,
  searchWindows, renderSw() {}, step() {}, commit() {}, cancel() {}, openSw() {},
})
function press(key, modifiers = {}) {
  let prevented = false
  keydown({ key, code: 'Key' + key.toUpperCase(), target: { matches: () => true },
    preventDefault() { prevented = true }, stopPropagation() {}, ...modifiers })
  return prevented
}
for (const modifier of ['metaKey', 'ctrlKey']) {
  for (const key of ['a', 'v']) {
    assert.equal(press(key, { [modifier]: true }), false)
    assert.equal(state.sw.query, 'chr')
  }
}
assert.equal(press('x'), false)
assert.equal(press('Backspace'), false)
assert.equal(state.sw.query, 'chr')
assert.equal(press('c', { altKey: true }), true)
assert.equal(state.sw.query, 'chrc')
assert.equal(press('Backspace', { altKey: true }), true)
assert.equal(state.sw.query, 'chr')
console.log('PASS: website search matches app/title terms, ranks results, preserves MRU ties, rejects fuzzy matches, and safely highlights text.')
console.log('PASS: native paste/select-all/editing, held-Option input, sidebar visibility, and width settings.')
