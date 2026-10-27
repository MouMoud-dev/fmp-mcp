# Calling Film Maker Pro

## Answers

Every call returns `{ ok = true, data }` or
`{ ok = false, error = { code, message, hint } }`. Read `hint`: it says what to
do. When `message` is about the director (Stop pressed, editor closed, Pro
needed), tell them what it says. `errors.md` lists every code.

Return only what you need from a snippet. dolu refuses a result over 128 KB, cuts
strings at 8 KB and tables at 100 entries.

## One snippet, several calls

Each `execute_client` round trip costs about a second plus your thinking. Make
several calls in one snippet and return what you need from all of them:

```lua
local function fmp(op, args) args = args or {}; args.wait = true
  return exports.film_maker_pro:Api(op, args) end

local Z = { zone = 'Zone A' }
fmp('zone.working', Z)
local d = fmp('zone.describe', Z)
local s = fmp('zone.survey', Z)
fmp('view.push')
local v = fmp('view.orbit', { zone = 'Zone A', angle = 0, height = 8 })
return { zone = d.data, survey = s.data, view = v.data }
```

A screenshot is a separate tool call (`game_screenshot`), so a snippet that moves
the view ends with the view call. Take the screenshot **right after**: your next
`fmp()` call brings the zone outlines back into the picture.

Do not re-read what you already know. Reuse the description, the survey and the
points you computed between steps.

## Addressing

- Entities by **`uid`** (from `scene.describe` or the answer that created them),
  never by `id`: ids change on every project load.
- Zones by name (`"Zone A"`), or nothing when there is only one.
- `scene.describe` comes in pages of 40: pass `offset = next` for the rest, and
  `near = { x, y, z, radius }` to read only one area.

## Coordinates

- World metres. `z` is height: give the real ground height, never 0.
- **Heading is anticlockwise**: 0 = north, 90 = west, 180 = south, 270 = east.
  A heading `h` points along `(-sin h, cos h)`; its right-hand side is
  `(cos h, sin h)`.
- `snap = 'ground'` looks for the ground just below `z + 2`: give `z` close to
  the real height (from `zone.describe`, `view.pick`, or something nearby).
- To turn a point of a screenshot into a world point, use `view.pick` from the
  same view. Never compute it by hand.

## One Undo for your work

Wrap each request in a batch, so the director takes it all back in one Undo:

```lua
fmp('tx.begin', { label = 'Hold-up in Zone A' })
-- … the changes …
fmp('tx.commit')
```

The label is what the Undo history shows: say what was done, in English, in a few
words. Changes made less than 2.5 s apart are batched anyway; a batch you forgot
to close closes itself after 60 s. `tx.rollback` takes the open batch back now.
A zone fill is already one Undo by itself.

## While you work

- A pill at the top of the director's screen says the assistant is working, with
  a **Stop** button. After Stop, every change answers `STOPPED_BY_USER`: stop and
  ask before going on.
- The scene cannot change while the timeline plays, a take records, a project
  loads or a video exports (`BUSY`). `api.info` → `state` says which.
- At most 8 spawns a second (`RATE_LIMITED`): a zone fill paces itself, a loop of
  `entity.place` must `Wait(150)` between calls.
- Something the director is dragging answers `USER_ACTIVE`: try again in a moment.

## No dolu tools in the session

A session can start without dolu_fivem_mcp's tools although its server runs. Do
not stop and do not ask the director: call dolu over HTTP. The endpoint
(`http://127.0.0.1:3210/mcp` by default) is stateless, one POST per call.
Save this as `dolu.mjs` in a scratch folder and run it with Node:

```js
// node dolu.mjs status | lua <file.lua> <playerId> | shot <out.jpg> <playerId>
import fs from 'node:fs'
const call = async (name, args) => {
  const r = await fetch('http://127.0.0.1:3210/mcp', { method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }) })
  const t = await r.text(), l = t.split('\n').find(x => x.startsWith('data:'))
  return JSON.parse(l ? l.slice(5) : t)
}
const flat = v => Array.isArray(v) ? v.map(flat) : v && typeof v === 'object'
  ? (v.$type === 'table' ? (v.entries.every((e, i) => e.key === i + 1) ? v.entries.map(e => flat(e.value))
    : Object.fromEntries(v.entries.map(e => [e.key, flat(e.value)])))
    : Object.fromEntries(Object.entries(v).map(([k, x]) => [k, flat(x)]))) : v
const [cmd, a, id] = process.argv.slice(2)
if (cmd === 'status') console.log(JSON.stringify((await call('status', {})).result.structuredContent.result.players))
if (cmd === 'lua') {
  const r = await call('execute_client', { language: 'lua', code: fs.readFileSync(a, 'utf8'), playerId: +id, compact: true })
  for (const c of r.result?.content ?? []) if (c.type === 'text') console.log(JSON.stringify(flat(JSON.parse(c.text)).result?.outcome, null, 1))
}
if (cmd === 'shot') {
  const r = await call('game_screenshot', { includeNui: false, playerId: +id })
  fs.writeFileSync(a, Buffer.from(r.result.content.find(c => c.type === 'image').data, 'base64'))
}
```

1. `node dolu.mjs status`: the `playerId` of the director.
2. Write each snippet to a `.lua` file (never inline in a shell command) and run
   `node dolu.mjs lua s.lua <playerId>`: it prints what the snippet returns.
3. `node dolu.mjs shot view.jpg <playerId>`, then open the image.

Everything else in these files works the same way.

## Saving

Only when asked. `project.save { name }` saves like the Save button. A project
with no name answers `NO_NAME`: ask the director what to call it.
