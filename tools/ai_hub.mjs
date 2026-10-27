#!/usr/bin/env node
// ============================================================
// ai_hub — write the lists of the assistant's hub (ai/*.md) from the code.
//
//   node tools/ai_hub.mjs [--fmp <path>]          rewrite every generated block in ai/
//   node tools/ai_hub.mjs [--fmp <path>] --check  change nothing; exit 1 if a block is stale
//
// --fmp is the film_maker_pro resource folder whose Lua is read (default: the
// FMP_DIR environment variable, else ../film_maker_pro next to this repository).
//
// ai/ is what an AI assistant reads to work in Film Maker Pro through its
// external control API (exports.film_maker_pro:Api). Most of it is
// prose written by hand: how to build a scene, where people stand, what a shot
// needs. But some of it is a LIST of what the code does — the operations, the
// moods, the model pools, the autofill genres, the error codes — and a list
// copied by hand is wrong from the next commit on. The first hub said the
// preview stand-ins were Michael, Franklin and Trevor for a week after the code
// had stopped using them, and never mentioned two operations that existed.
//
// So those lists are BLOCKS, written here from the Lua itself:
//
//   <!-- generated:ops -->                 every operation (client/api.lua)
//   <!-- generated:args zone.compose -->   one operation's arguments
//   <!-- generated:errors -->              every error code, its message, its hint
//   <!-- generated:moods -->               MOODS + MOOD_ABOUT (client/zones.lua)
//   <!-- generated:pools -->               POOLS (client/zones.lua)
//   <!-- generated:genres -->              RULES (client/zones.lua)
//   ...
//   <!-- /generated -->
//
// The Lua is READ, never run: a small lexer and a table-constructor parser. Game
// code cannot run outside the game, and nothing here needs it to — the lists are
// literal tables. A value that is not a literal (a function, a call) is kept as
// its source text or skipped.
//
// Run it against each new Film Maker Pro version before tagging this repository.
// ============================================================

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const AI = path.join(ROOT, 'ai')
const CHECK = process.argv.includes('--check')
const fmpArg = process.argv.indexOf('--fmp')
const FMP = path.resolve(fmpArg > 0 ? process.argv[fmpArg + 1]
  : process.env.FMP_DIR || path.join(ROOT, '..', 'film_maker_pro'))
if (!fs.existsSync(path.join(FMP, 'client', 'api.lua'))) {
  console.error(`No client/api.lua in ${FMP}: pass --fmp <film_maker_pro folder>.`)
  process.exit(2)
}

// ------------------------------------------------
// LUA, READ
// ------------------------------------------------

function lex(src) {
  const toks = []
  let i = 0
  const n = src.length
  while (i < n) {
    const c = src[i]
    if (c === ' ' || c === '\t' || c === '\r' || c === '\n') { i++; continue }
    if (src.startsWith('--', i)) {
      const long = /^--\[(=*)\[/.exec(src.slice(i, i + 20))
      if (long) {
        const close = ']' + long[1] + ']'
        const end = src.indexOf(close, i)
        i = end < 0 ? n : end + close.length
      } else {
        const end = src.indexOf('\n', i)
        i = end < 0 ? n : end + 1
      }
      continue
    }
    if (c === "'" || c === '"') {
      let j = i + 1, out = ''
      while (j < n && src[j] !== c) {
        if (src[j] === '\\') {
          const e = src[j + 1]
          out += e === 'n' ? '\n' : e === 't' ? '\t' : e
          j += 2
        } else { out += src[j]; j++ }
      }
      toks.push({ t: 'str', v: out })
      i = j + 1
      continue
    }
    const long = /^\[(=*)\[/.exec(src.slice(i, i + 20))
    if (long) {
      const close = ']' + long[1] + ']'
      const end = src.indexOf(close, i)
      toks.push({ t: 'str', v: src.slice(i + long[0].length, end) })
      i = end + close.length
      continue
    }
    const num = /^(0x[0-9a-fA-F]+|\d+\.?\d*(?:[eE][+-]?\d+)?|\.\d+)/.exec(src.slice(i, i + 40))
    if (num && !/[A-Za-z_]/.test(src[i - 1] || '')) {
      toks.push({ t: 'num', v: Number(num[1]) })
      i += num[1].length
      continue
    }
    const name = /^[A-Za-z_][A-Za-z0-9_]*/.exec(src.slice(i, i + 80))
    if (name) { toks.push({ t: 'name', v: name[0] }); i += name[0].length; continue }
    const op = /^(\.\.\.|\.\.|==|~=|<=|>=|::|\/\/|<<|>>)/.exec(src.slice(i, i + 3))
    if (op) { toks.push({ t: 'op', v: op[1] }); i += op[1].length; continue }
    toks.push({ t: 'op', v: c })
    i++
  }
  return toks
}

const OPENERS = new Set(['function', 'if', 'do'])

/** Index just past a `function … end` whose `function` token is at k. */
function skipFunction(toks, k) {
  let depth = 0
  for (let j = k; j < toks.length; j++) {
    const tk = toks[j]
    if (tk.t !== 'name') continue
    if (OPENERS.has(tk.v)) depth++
    else if (tk.v === 'repeat') depth++
    else if (tk.v === 'end' || tk.v === 'until') {
      depth--
      if (depth === 0) return j + 1
    }
  }
  throw new Error('unterminated function')
}

/** One value starting at k: { value, next }. Literals become JS values, a
 *  dotted name becomes { ref }, anything else { expr } (its first string, if any). */
function parseValue(toks, k) {
  const tk = toks[k]
  if (tk.t === 'op' && tk.v === '{') return parseTable(toks, k)
  if (tk.t === 'name' && tk.v === 'function') return { value: { fn: true }, next: skipFunction(toks, k) }
  // Anything up to the next , ; or } at this depth.
  let j = k, depth = 0
  const parts = []
  while (j < toks.length) {
    const t = toks[j]
    if (t.t === 'name' && t.v === 'function') { j = skipFunction(toks, j); continue }
    if (t.t === 'op' && (t.v === '(' || t.v === '{' || t.v === '[')) depth++
    if (t.t === 'op' && (t.v === ')' || t.v === '}' || t.v === ']')) {
      if (depth === 0) break
      depth--
    }
    if (depth === 0 && t.t === 'op' && (t.v === ',' || t.v === ';')) break
    parts.push(t)
    j++
  }
  let value
  if (parts.length === 1 && parts[0].t === 'str') value = parts[0].v
  else if (parts.length === 1 && parts[0].t === 'num') value = parts[0].v
  else if (parts.length === 1 && parts[0].t === 'name' && ['true', 'false', 'nil'].includes(parts[0].v)) {
    value = parts[0].v === 'true' ? true : parts[0].v === 'false' ? false : null
  } else if (parts.every((p, i) => (i % 2 === 0 ? p.t === 'name' : p.v === '.'))) {
    value = { ref: parts.map(p => p.v).join('') }
  } else {
    const s = parts.find(p => p.t === 'str')
    value = { expr: true, str: s ? s.v : undefined }
  }
  return { value, next: j }
}

/** A table constructor at k ('{'): { value: { keys: Map, list: [] }, next }. */
function parseTable(toks, k) {
  const keys = new Map(), list = []
  let j = k + 1
  while (j < toks.length) {
    const t = toks[j]
    if (t.t === 'op' && t.v === '}') return { value: { keys, list }, next: j + 1 }
    if (t.t === 'op' && (t.v === ',' || t.v === ';')) { j++; continue }
    if (t.t === 'op' && t.v === '[') {
      const key = parseValue(toks, j + 1)
      j = key.next + 1                       // ]
      j++                                    // =
      const v = parseValue(toks, j)
      keys.set(String(typeof key.value === 'object' ? JSON.stringify(key.value) : key.value), v.value)
      j = v.next
      continue
    }
    if (t.t === 'name' && toks[j + 1] && toks[j + 1].t === 'op' && toks[j + 1].v === '=') {
      const v = parseValue(toks, j + 2)
      keys.set(t.v, v.value)
      j = v.next
      continue
    }
    const v = parseValue(toks, j)
    list.push(v.value)
    j = v.next
  }
  throw new Error('unterminated table')
}

/** The table assigned by `local NAME = {`. */
function localTable(toks, name, file) {
  for (let k = 0; k < toks.length - 3; k++) {
    if (toks[k].v === 'local' && toks[k + 1].v === name && toks[k + 2].v === '=' && toks[k + 3].v === '{') {
      return parseTable(toks, k + 3).value
    }
  }
  throw new Error(`${file}: no "local ${name} = {"`)
}

const read = rel => fs.readFileSync(path.join(FMP, rel), 'utf8')

// ------------------------------------------------
// WHAT THE CODE SAYS
// ------------------------------------------------

function readOps() {
  const toks = lex(read('client/api.lua'))
  const ops = []
  for (let k = 0; k < toks.length - 4; k++) {
    if (toks[k].v === 'Op' && toks[k + 1].v === '(' && toks[k + 2].t === 'str' && toks[k + 4].v === '{') {
      const def = parseTable(toks, k + 4).value.keys
      const args = def.get('args')
      ops.push({
        name: toks[k + 2].v,
        desc: def.get('desc'),
        args: args && args.keys ? [...args.keys].map(([a, d]) => [a, typeof d === 'string' ? d : '']) : [],
        free: def.get('free') === true,
        mutates: def.get('mutates') === true,
      })
    }
  }
  return ops
}

function readErrors() {
  const codes = new Map()
  const toks = lex(read('client/api.lua'))
  for (let k = 0; k < toks.length - 3; k++) {
    if (toks[k].v !== 'Err' || toks[k + 1].v !== '(' || toks[k + 2].t !== 'str') continue
    const code = toks[k + 2].v
    if (!/^[A-Z_]+$/.test(code)) continue
    // The call's arguments: message, then hint.
    const msg = toks[k + 3].v === ',' ? parseValue(toks, k + 4) : null
    let hint = null
    if (msg && toks[msg.next] && toks[msg.next].v === ',') hint = parseValue(toks, msg.next + 1)
    const text = v => ((typeof v === 'string' ? v : v && v.str) || '').replace(/%[-\d.]*[sdf]/g, '…')
    // Message and hint from the SAME call: pairing the first message with a
    // later call's hint gave a refusal advice meant for another one.
    const row = codes.get(code) || { code, message: '', hint: '', messages: new Set() }
    const m = msg ? text(msg.value) : ''
    if (m) row.messages.add(m)
    if (!row.message && m) { row.message = m; row.hint = hint ? text(hint.value) : '' }
    codes.set(code, row)
  }
  // A code given for many different reasons: its first message would mislead.
  for (const row of codes.values()) {
    if (row.messages.size > 2) { row.message = 'Varies: the message names the problem.'; row.hint = row.hint || 'Read the message and the hint.' }
  }
  // Codes zones.lua hands back as a third return value.
  for (const line of read('client/zones.lua').split('\n')) {
    const m = /return nil,\s*(.*),\s*'([A-Z_]+)'\s*$/.exec(line.trim())
    if (!m) continue
    const row = codes.get(m[2]) || { code: m[2], message: '', hint: '', messages: new Set() }
    if (!row.message) row.message = ((/'((?:[^'\\]|\\.)*)'/.exec(m[1]) || [, ''])[1]).replace(/%[-\d.]*[sdf]/g, '…')
    codes.set(m[2], row)
  }
  for (const row of codes.values()) if (!row.message) row.message = '—'
  return [...codes.values()].sort((a, b) => a.code.localeCompare(b.code))
}

function readZones() {
  const toks = lex(read('client/zones.lua'))
  const moods = localTable(toks, 'MOODS', 'zones.lua')
  const about = localTable(toks, 'MOOD_ABOUT', 'zones.lua')
  const pools = localTable(toks, 'POOLS', 'zones.lua')
  const rules = localTable(toks, 'RULES', 'zones.lua')
  return { moods, about, pools, rules }
}

// ------------------------------------------------
// THE BLOCKS
// ------------------------------------------------

const cell = s => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ')

function blockOps(ops) {
  const out = ['| Operation | Edition | Changes the scene | What it does |', '|---|---|---|---|']
  for (const o of ops) out.push(`| \`${o.name}\` | ${o.free ? 'Free + Pro' : 'Pro'} | ${o.mutates ? 'yes' : ''} | ${cell(o.desc)} |`)
  return out.join('\n')
}

function blockArgs(ops, name) {
  const o = ops.find(x => x.name === name)
  if (!o) throw new Error(`generated:args: no operation "${name}"`)
  if (!o.args.length) return `\`${name}\` takes no arguments.`
  return o.args.map(([a, d]) => `- \`${a}\` — ${d}`).join('\n')
}

function blockErrors(errors) {
  const out = ['| Code | What the tool says | What to do |', '|---|---|---|']
  for (const e of errors) out.push(`| \`${e.code}\` | ${cell(e.message)} | ${cell(e.hint)} |`)
  return out.join('\n')
}

function blockMoods({ moods, about }) {
  const names = [...moods.keys].map(([k]) => k).sort()
  const missing = names.filter(k => typeof about.keys.get(k) !== 'string')
  if (missing.length) throw new Error(`MOOD_ABOUT has no sentence for: ${missing.join(', ')}`)
  const out = ['| Mood | What they do, who, where |', '|---|---|']
  for (const k of names) out.push(`| \`${k}\` | ${cell(about.keys.get(k))} |`)
  return out.join('\n')
}

function blockPools({ pools }) {
  const out = ['| Pool | For | Models |', '|---|---|---|']
  for (const kind of ['ped', 'vehicle']) {
    const t = pools.keys.get(kind)
    for (const [name, list] of [...t.keys].sort(([a], [b]) => a.localeCompare(b))) {
      out.push(`| \`${name}\` | ${kind === 'ped' ? 'people (`pool`, `pedPool`)' : 'vehicles (`pool`)'} | ${list.list.join(', ')} |`)
    }
  }
  return out.join('\n')
}

function blockGenres({ rules }) {
  const out = []
  for (const [genre, t] of [...rules.keys].sort(([a], [b]) => a.localeCompare(b))) {
    const ref = v => (v && v.ref ? '`' + v.ref.replace(/^POOLS\.(ped|vehicle)\./, '') + '`' : '')
    out.push(`**\`${genre}\`** — people from ${ref(t.keys.get('peds'))}, vehicles from ${ref(t.keys.get('vehicles'))}.`, '')
    out.push('| Feature found | People | Placed | Mood | Armed | Facing |', '|---|---|---|---|---|---|')
    for (const [feature, r] of t.keys) {
      if (!r || !r.keys || ['peds', 'vehicles', 'parkNear'].includes(feature)) continue
      const g = k => r.keys.get(k)
      const facing = g('face') ? 'the feature' : g('outward') ? 'out of the zone' : 'loosely'
      out.push(`| ${feature} | ${g('n')} | ${g('place')} | \`${g('mood')}\` | ${g('weapon') ? g('weapon') : ''} | ${facing} |`)
    }
    const park = t.keys.get('parkNear')
    if (park) out.push('', `Vehicles park by: ${[...park.keys].map(([k]) => k).join(', ')}.`)
    out.push('')
  }
  return out.join('\n').trimEnd()
}

// ------------------------------------------------
// WRITE
// ------------------------------------------------

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(d =>
    d.isDirectory() ? walk(path.join(dir, d.name)) : d.name.endsWith('.md') ? [path.join(dir, d.name)] : [])
}

const ops = readOps()
const errors = readErrors()
const zones = readZones()
const MAKERS = {
  ops: () => blockOps(ops),
  args: p => blockArgs(ops, p),
  errors: () => blockErrors(errors),
  moods: () => blockMoods(zones),
  pools: () => blockPools(zones),
  genres: () => blockGenres(zones),
}

const BLOCK = /(<!-- generated:([\w-]+)(?: ([\w.]+))? -->\r?\n)([\s\S]*?)(<!-- \/generated -->)/g
let stale = 0, written = 0, blocks = 0
for (const file of walk(AI)) {
  const before = fs.readFileSync(file, 'utf8')
  const nl = before.includes('\r\n') ? '\r\n' : '\n'
  const after = before.replace(BLOCK, (_, open, kind, param, _old, close) => {
    const make = MAKERS[kind]
    if (!make) throw new Error(`${path.relative(ROOT, file)}: unknown block "generated:${kind}"`)
    blocks++
    return open + make(param).replace(/\n/g, nl) + nl + close
  })
  if (after !== before) {
    stale++
    if (!CHECK) { fs.writeFileSync(file, after); written++ }
    console.log(`${CHECK ? 'stale' : 'wrote'}  ${path.relative(ROOT, file)}`)
  }
}

// Every hub file must stay readable in one api.guide part and one sitting.
const LIMIT = 6 * 1024
for (const file of walk(AI)) {
  const size = fs.statSync(file).size
  if (size > LIMIT) console.log(`note   ${path.relative(ROOT, file)} is ${size} bytes (aim: under ${LIMIT})`)
}

console.log(`${blocks} block(s), ${ops.length} operations, ${errors.length} error codes; ${CHECK ? stale + ' stale' : written + ' file(s) rewritten'}`)
if (CHECK && stale) process.exit(1)
