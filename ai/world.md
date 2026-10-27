# Time, weather, wind

```lua
fmp('world.set', { hour = 19, minute = 30, weather = 'CLEAR', wind = 2 })
```

`hour` 0-23, `minute` 0-59, `wind` 0-12; `weather` one of `EXTRASUNNY`,
`CLEAR`, `CLOUDS`, `SMOG`, `FOGGY`, `OVERCAST`, `RAIN`, `THUNDER`, `CLEARING`,
`NEUTRAL`, `SNOW`, `BLIZZARD`, `SNOWLIGHT`, `XMAS`, `HALLOWEEN`.

## Moods

Starting points: set, screenshot through the shot camera, then move the hour by
30 minutes until it looks right.

| Mood | hour | weather | wind |
|---|---|---|---|
| Morning, golden | 6:30 | `EXTRASUNNY` | 1 |
| Foggy morning | 7:00 | `FOGGY` | 0 |
| Plain day | 13:00 | `CLEAR` | 2 |
| Grey day | 14:00 | `OVERCAST` | 3 |
| Smoggy city afternoon | 16:00 | `SMOG` | 1 |
| Evening, golden | 19:30 | `EXTRASUNNY` | 1 |
| Blue hour | 21:00 | `CLEAR` | 1 |
| Night | 23:30 | `CLEAR` | 1 |
| Rainy night | 23:00 | `RAIN` | 5 |
| Storm | 22:00 | `THUNDER` | 10 |
| Winter | 15:00 | `SNOWLIGHT` | 3 |

## Rules

- **"Try it and put it back"**: read the current world first (`scene.describe`,
  first page, `data.world`), and `world.set` it back afterwards — or let the
  director press Undo.
- A `warnings` line saying the timeline has its own weather or time keys means
  they take over while the timeline plays: **tell the director**, or what they
  see in playback will not be what you set.
- Night scenes need light: see `lights.md`.
