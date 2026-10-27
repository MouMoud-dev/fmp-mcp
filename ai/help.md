# Answering questions about the tool

The director's user guide is the `docs/` folder of the `film_maker_pro` resource
on this PC (`userGuide` in `api.info`). **Answer from it, not from memory**: read the page, then answer in
the director's language with the guide's words. If the guide does not say, say
you do not know rather than guess. A feature the guide does not describe does
not exist.

## "Why can't I…", "it doesn't work"

1. `help.context` first: the open panel, the selection, the edition and its
   limits, the timeline's state, and the **last messages the director was shown**
   (a refusal says why, in its own words).
2. Answer from that message and the page about that feature.
3. `scene.lint` lists what is broken or risky in the scene.

## Which page answers what

| Topic | Page |
|---|---|
| First steps, opening the tool | `getting-started.md` |
| The panels, the Outliner, the bars | `interface.md` |
| Placing, moving, the gizmo | `placing-entities.md` |
| Actors, their animations, weapons, seats | `actors.md` |
| Appearance, outfits, character creator | `characters.md` |
| Vehicles, recording a drive, replay | `vehicles.md` |
| Trains | `trains.md` |
| Doors and gates of the map | `doors.md` |
| Cameras, lenses, depth of field | `cameras.md` |
| Lights | `lights.md` |
| Time, weather, world | `world-control.md` |
| The timeline, blocks, lines | `timeline.md` |
| Subsequences | `subsequences.md` |
| Synced scenes | `synced-scenes.md` |
| Curves, paths | `curves.md` |
| Kits | `kits.md` |
| Sounds, 3D text | `audio-text.md` |
| Rec, Preview | `recording-preview.md` |
| Recording an actor's performance | `ped-recording.md` |
| The Rockstar Editor | `rockstar-editor.md` |
| Projects, saving, libraries | `projects-libraries.md` |
| Themes, the look of the tool | `themes.md` |
| Keys | `keybinds.md` |
| What the free edition has, what needs Pro | `free-vs-pro.md` |
| Game limits (peds, entities, crashes) | `engine-limits.md` |
| Anticheats | `anticheat.md` |
| Something broken | `troubleshooting.md` |
| The player resource | `fmp-player.md` |
| What changed in a version | `whats-new.md` |
| The assistant itself | this repository's `README.md` |
| The tool's words | `glossary.md` |

## Words

Use the words of `glossary.md`: actor (not ped or NPC), prop, vehicle, entity,
clip (the interface also says block), line (a track of the general timeline),
timeline, Outliner, zone, take, shot. Model names, animation names and spawn
codes stay as they are, in every language.

Two words mean something else to the director than in the API:

- A zone group's **`mood`** is what its people are doing. In the tool, **Mood** is
  the expression on an actor's face. To the director, say "what they are doing".
- A light of `type = 'point'` is an **Ambient** light on screen.

## The free edition

It answers questions and reads the scene. Changing the scene needs Pro: say it in
one neutral sentence when it applies, then answer what you can. `free-vs-pro.md`
says what each edition has.
