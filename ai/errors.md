# Errors

A refusal is `{ ok = false, error = { code, message, hint } }`. The hint says
what to do; these rules come first:

- **Never loop on an error.** Retry once when the hint says so, then tell the
  director.
- **`BUSY`**: check `api.info` → `state`, wait for it to end, or ask.
- **`STOPPED_BY_USER`**: stop at once and ask the director before going on.
- **`OWNED`**: leave that entity. Only the director naming it allows
  `confirm = true`.
- **`NOT_FOUND`** on a model: take a ready-made pool or `catalog.search`; on an
  entity, `scene.describe` again (ids change, uids do not).
- **`GROUND_UNKNOWN`**: the ground there is not loaded. `view.set` closer to the
  spot, then try again, or give `z` yourself.
- **`PED_BUDGET`**: lower the counts or clear a group; tell the director.
- **`RATE_LIMITED`**: `Wait(1000)` and go on.
- **`UNSUPPORTED_EDITION`**: the free edition. Say in one sentence that this
  needs Pro, and answer what you can.
- **`INTERNAL`**: tell the director the message; do not retry the same call.

## Every code

Written from the tool's code. "What the tool says" is the first message it gives
for that code; some codes carry other messages too.

<!-- generated:errors -->
| Code | What the tool says | What to do |
|---|---|---|
| `ATTACHED` | It is attached to something, which owns its position. | Move what it is attached to. |
| `BAD_ARGS` | Varies: the message names the problem. | Read the message and the hint. |
| `BUSY` | A recording take is in progress. |  |
| `DISABLED` | The director has not switched external control on. | Ask them: Settings → External control. |
| `DISABLED_BY_SERVER` | The server has external control switched off. | Set Config.ExternalApi = true in film_maker_pro/config.lua and restart the resource. |
| `EDITOR_CLOSED` | Film Maker Pro is closed. | Ask the director to open it (F7 by default). |
| `EMPTY` | No ground point in … of …. | zone.describe gives the point count per region; the ground there may not be loaded yet. |
| `GROUND_UNKNOWN` | No ground found under that point — its collision is probably not loaded this far from the player. | Give z yourself (from scene.describe of something nearby), or ask the director to fly the camera there first. |
| `IN_KIT` | It is part of a packed kit, which moves as one. | Ask the director to unpack the kit, or move the kit by hand. |
| `INTERNAL` | — |  |
| `NO_NAME` | The project has no name yet. | Ask the director what to call it, then pass name. |
| `NOT_FOUND` | Varies: the message names the problem. | Call scene.describe: ids change on every project load, uids do not. |
| `NOT_FREE_MODE` | The director is not in Free Mode, so there is no free camera to move. | Ask them to enter Free Mode (G by default). |
| `NOT_UNDOABLE` | A … carries more than Undo can bring back, so this API only deletes the ones it placed in this batch. | Ask the director to delete it. |
| `OWNED` | This … was placed by the director, not through this API. | Leave it, or ask the director; pass confirm = true only when they named this very one. |
| `PAGE_SILENT` | The interface did not answer the search. | Retry once; if it persists, the NUI page is not loaded. |
| `PED_BUDGET` | … peds are already live. | Hide or delete extras before adding more. |
| `RATE_LIMITED` | At most … spawns per second. | Wait one second and continue. |
| `REFUSED` | Varies: the message names the problem. | Read the message and the hint. |
| `STOPPED_BY_USER` | The director pressed Stop. | Ask them before going on; they resume it from the same button. |
| `THROTTLED` | — |  |
| `UNKNOWN_OP` | No operation "…". | Did you mean …? api.ops lists them all. |
| `UNSUPPORTED` | Varies: the message names the problem. | Read the message and the hint. |
| `UNSUPPORTED_EDITION` | This needs Film Maker Pro. The free edition can only read (api.info, api.ops, help.context, scene.lint). | Tell the director this part needs Pro. |
| `USER_ACTIVE` | The director is dragging this one right now. | Try again in a moment. |
<!-- /generated -->
