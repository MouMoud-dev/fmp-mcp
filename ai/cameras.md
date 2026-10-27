# Cameras

## Lens

GTA's field of view is **vertical**. A director speaking of a lens in millimetres
means a full-frame camera:

| Lens | 18 mm | 24 mm | 35 mm | 50 mm | 85 mm | 135 mm |
|---|---|---|---|---|---|---|
| `fov` | 67 | 53 | 38 | 27 | 16 | 10 |

"A 35° lens" is ambiguous: degrees are `fov` directly, millimetres go through the
table. When unsure, use millimetres (that is how people talk about lenses).
The tool accepts `fov` 5 to 130.

## Distance for a shot

To frame a height `H` (metres) with a lens of `f` mm: **`distance = H × f / 24`**.

| Shot | Frames (H) | 24 mm | 35 mm | 50 mm | 85 mm |
|---|---|---|---|---|---|
| Wide (the set around them) | 6 m | 6 m | 8.8 m | 12.5 m | — |
| Full (head to toe) | 2.2 m | 2.2 m | 3.2 m | 4.6 m | 7.8 m |
| Medium (waist up) | 1.1 m | — | 1.6 m | 2.3 m | 3.9 m |
| Close-up (head and shoulders) | 0.5 m | — | 0.7 m | 1.0 m | 1.8 m |

Wide shots: 18-24 mm. People: 35-50 mm. Faces: 85 mm, from further away: it
flatters the face and keeps the camera out of the actors' way.

## Height and aim

- An actor's `z` (from `scene.describe`) is its body's origin, about 1 m above
  its feet. Approximate heights from it: feet `z - 1.0`, eyes `z + 0.6`.
  *Not measured on every model: confirm with `camera.frame`* (in a close-up the
  face sits in the top third).
- Camera at eye level: `z + 0.6`. Low angle (power, threat): `z - 0.4`. High
  angle (smallness, overview): 3-4 m above the ground.
- `faceTo` an actor aims at its origin (the hips): for a face, aim at
  `{ x, y, z = actor z + 0.6 }` instead.
- No roll: its sign is not checked yet.

## Placing a camera on a subject

From the subject `S` (actor position) and the direction the camera looks from,
heading `a` (the camera stands on that side): position =
`S + (-sin a, cos a) × distance`, then `faceTo` the aim point.

```lua
local a, d = math.rad(A), 3.2           -- full shot on 35 mm
local cam = fmp('entity.place', { kind = 'camera', label = 'CAM 1 - Full',
  x = S.x - math.sin(a) * d, y = S.y + math.cos(a) * d, z = S.z + 0.6,
  fov = 38, faceTo = { x = S.x, y = S.y, z = S.z + 0.2 } })
```

Name each camera `CAM <n> - <shot>` (ASCII dash): Wide, Full, Medium, Close A,
OTS B…

## Coverage

**The line.** Between two people facing each other runs the line of action. Every
camera of the scene stays on **one side** of it, or their cuts flip who looks left
and who looks right.

| Scene | Cameras |
|---|---|
| Two people talking | Wide: both, 90° to the line, 35 mm full shot · OTS A: behind B's shoulder, 0.5 m off the line, 50 mm medium on A · OTS B: the mirror · Close A, Close B: 85 mm, beside the OTS positions |
| One person, a speech | Medium front, 50 mm · Close, 85 mm · Wide from the back of the crowd, 24 mm, high |
| Establishing a place | One wide, 18-24 mm, 20-40 m away, 4-8 m high, the action in a third |
| A vehicle | Low behind, 0.6 m high, 4 m back, 24 mm · Side, 90°, 35 mm · Front three-quarter, 50 mm |
| A group (a stand-off, a briefing) | Wide over the whole, 24 mm · a medium on each side, from behind the other side |

## Checking a shot

`camera.frame` per camera, never a screenshot first:

- **No `hidden`** on a subject.
- **`cut`**: none in a wide or full shot; only `bottom` in a medium or close-up.
- **`thirds`**: one person sits in a left or right column with room on the side
  they look toward; two people share the frame left and right.
- **`share`**: the subject should dominate a close-up, not a speck in it.

Fix by moving the camera (distance, angle) or the lens, then measure again. To
show the director: `camera.view { uid }`, `game_screenshot` with
`includeNui = false`, then `camera.view { uid, on = false }`.

In the free edition the number of cameras is capped: a refused `entity.place`
says so. Tell the director.
