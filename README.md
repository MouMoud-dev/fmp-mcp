# fmp-mcp — drive Film Maker Pro from an AI assistant

Instructions that let an AI assistant (tested with **Claude Code**) work in
**Film Maker Pro** for you, through the MCP server **dolu_fivem_mcp**. You ask in
plain words — *"put five marines in a line facing the hangar door"*, *"three
cameras on the two actors"*, *"fill Zone A: athletes warming up, a crowd cheering
in the stands"* — and the assistant does it in the tool.

> **Unofficial and separate from Film Maker Pro.** Film Maker Pro only exposes a
> neutral external control API (`exports.film_maker_pro:Api`). This repository is
> a free, personal-use companion: it is not sold, not part of the product, and
> not affiliated with Rockstar Games or Cfx.re.
>
> **Local creation server only.** dolu_fivem_mcp can run code on the whole server
> and has no password. Use it on a server running on your own PC that nobody
> else joins.

## What the assistant can do

| | |
|---|---|
| **Place** | props, actors, vehicles, cameras and lights, on the ground, facing a point or another entity |
| **Arrange** | move, turn, re-aim, rename and delete what it placed |
| **Fill a zone** | draw an area with the magic wand; it fills it in one go — a preview of stand-ins first, the real scene when you say ok |
| **Frame** | measure what a camera sees (who is in frame, how big, what cuts or hides them), look through it and take a screenshot |
| **World** | time of day, weather, wind |
| **Timeline** | play, stop, move the playhead |
| **Check** | list what is broken or risky in the scene |
| **Help** | answer questions about Film Maker Pro from its user guide |

It does **not** write blocks on the timeline, build routes or curves, or record a
vehicle or an actor's performance — those need you driving or acting.

## Setting it up

You need: Film Maker Pro **2.5.1 or later** on a FiveM server that runs on your
own PC, the game on the same PC, [Node.js](https://nodejs.org) and
[Claude Code](https://claude.com/claude-code).

1. **Install dolu_fivem_mcp** on that server:
   [github.com/DoluTattoo/dolu_fivem_mcp](https://github.com/DoluTattoo/dolu_fivem_mcp)
   (its README covers it). It listens on `http://127.0.0.1:3210/mcp`.
2. **Switch external control on** in `film_maker_pro/config.lua`:

   ```lua
   Config.ExternalApi = true
   ```

   Restart the server, open Film Maker Pro, and tick **Settings → External
   control**. The magic wand appears in the Free Mode view bar once it is on.
3. **Clone this repository** and connect Claude Code to dolu from inside it:

   ```
   git clone https://github.com/MouMoud-dev/fmp-mcp
   cd fmp-mcp
   claude mcp add --transport http dolu_fivem_mcp http://127.0.0.1:3210/mcp
   claude
   ```

   Always start Claude Code from this folder: its `CLAUDE.md` loads by itself and
   sends the assistant to `ai/README.md`.
4. **Check it**: ask *"Ask Film Maker Pro for api.info and tell me what it
   says."* It should answer with your version, your edition and `enabled` true on
   both sides.

Update this repository (`git pull`) when you update Film Maker Pro.

## Zones

Take the **magic wand** and draw a zone on the ground (free lasso, or polygon:
click each corner, Enter to close). It is listed in the Outliner and saved with
the project. Write what you want in its **Request** box and say *"go"*.

The assistant reads the place (map objects, ground, roofs), looks around it from
low angles, then plans the whole zone in one call. You first see **stand-ins** in
their real places and poses; say *"ok"* and the real people and vehicles appear,
or ask for changes. Anything you move by hand afterwards stays where you put it,
and one **Undo** takes the whole fill back.

## While it works

- Everything it does in one go is **one Undo**.
- A pill at the top of the screen says **External control working**, with a
  **Stop** button. Stop keeps what it did and refuses anything more until
  **Resume**.
- It waits while the timeline plays, a take records, a project loads or a video
  exports, and leaves alone anything you are dragging.
- It never moves or deletes what **you** placed unless you name it, never saves
  unless you ask, and never fills a zone before you said yes to the preview.

## Things to ask

- *"Put five marines in a line two metres apart, facing the hangar door."*
- *"Park three police cars across the road in front of me, angled like a roadblock."*
- *"In Zone A: a gang on the left, cops on the right facing them, people dancing at the back."*
- *"Set up three cameras on the two actors: a wide shot and a close-up on each face."*
- *"Look at camera 2 — is anyone cut by the edge of the frame? Fix it."*
- *"Add a warm spot light above the table, aimed at it."*
- *"Make it 6:30 in the evening, light rain."*
- *"Check my scene for problems before I record."*
- *"Why can't I add another camera?"*

## Free edition

With the free edition of Film Maker Pro the assistant can answer questions about
the tool and check your scene; changing the scene needs Pro.

## When it refuses

Every refusal comes with a code and a hint; the assistant reads them and tells
you. The full list is in [`ai/errors.md`](ai/errors.md).

## For maintainers

`ai/operations.md`, `ai/errors.md` and `ai/zone-groups.md` contain blocks
generated from Film Maker Pro's own Lua:

```
node tools/ai_hub.mjs --fmp ../film_maker_pro          # rewrite them
node tools/ai_hub.mjs --fmp ../film_maker_pro --check  # exit 1 if stale
```
