# Where things go

## Story first

Before choosing any group, write what is happening in one sentence: *"an officer
briefs a squad while sentries hold the gate and two men smoke in the shade."*
Every person and every vehicle needs a reason to be where it is. If you cannot
say why something stands there, leave it out.

## Spacing

| Between | Distance |
|---|---|
| Two people side by side | 1 m (0.5 m only if they touch: a hug, a fight, an arrest) |
| A knot of 2-3 talking | 0.9 m from its centre (`cluster` does it) |
| People in a cordon or a line | 1.2-1.5 m |
| Sentries | 4-8 m apart, each with a view |
| Cars side by side | 1-1.2 m gap (a painted bay is 2.5-3 m wide) |
| Cars nose to tail along a kerb | 1.5 m |
| A car door you open | 1.2 m free on that side |
| A lane a car could still drive through | 3 m free |

## Facing tells the story

| Who | Faces |
|---|---|
| Police at a scene | the threat or the building |
| Gunmen | the police |
| Hostages | away from the gunmen, or kneeling toward the police |
| A crowd | its focal point: a stage, a crash, a fight |
| Onlookers filming | the event, from a distance |
| Sentries, guards | outward, away from what they guard |
| People talking | each other (`cluster`) |
| Someone working | the thing they work on |

No parade-ground lines unless the story is a parade or an inspection: a loose
arc, uneven spacing and a slight turn read as people; a grid reads as a placement.

## Align on the set

- Cars run **along** kerbs, parking lines and fuel islands, never across them;
  never in the middle of a lane, never across the hatching in front of a door.
- A fuel pump stands on its own island: a car stops alongside the island,
  parallel to its long side. The line from one pump to the next is not the
  island's direction: look at an island from a low angle before deciding.
- People stand **around** a bench, not on it (there is no seated mood).
- A cordon of barriers or cones runs along a line, not in a heap.
- Check every axis from a low angle: seen from above, a car easily ends up
  across its island or its bay.
- But judge **which way something points** (a camera on its tripod, a person
  behind it, a car's nose) from straight above (`view.set`, `pitch = -89`): an
  oblique view foreshortens it and can make something pointing at the target look
  turned aside.
- Stands and terraces: the steps are not in the survey. `view.set` facing the
  stand, then `view.pick` a grid of points over the steps: each lands on its own
  step, at its own height. Drop the points that land on the ground in front, and
  one in four for gaps, then give them to the crowd as `spots`.

## Heights

- Give `spots` their ground `z` wherever something overhangs them (a canopy, a
  balcony, a bridge). Without it the spot can be found on the roof.
- `zone.validate` reports `raised` for a member standing well above the zone's
  ground: it is on a roof or a platform.

## Density

- Fill as the place and the story allow, not sparsely: a lived-in scene has
  people in the foreground, in the middle and at the back of the director's view
  (the zone's drawing camera is that view).
- Tight in the foreground, looser behind.
- 2-3 models per group at least; for a crowd, two groups from two pools.
- Under 96 live peds in the whole scene, drivers included; say the count to the
  director from 60.

## Reading the set

1. **`zone.survey` first.** It names the features of the place from the map's
   own objects (with their position and size) and its ground.
2. **Exact positions of map objects** (pumps, benches, doors, barriers) when a
   placement depends on them: read them in a snippet, never guess them from a
   picture.

   ```lua
   local out = {}
   for _, o in ipairs(GetGamePool('CObject')) do
     local c = GetEntityCoords(o)
     if #(c - vector3(CX, CY, CZ)) < 40.0 and GetEntityModel(o) == GetHashKey('prop_gas_pump_1a') then
       out[#out + 1] = { x = c.x, y = c.y, z = c.z, heading = GetEntityHeading(o) }
     end
   end
   return out
   ```

   Fuel pumps: `prop_gas_pump_1a` to `_1d`, `prop_gas_pump_old2`, `_old3`,
   `prop_vintage_pump`. Barriers: `prop_barrier_work05`; cones:
   `prop_roadcone02a`. When a heading is ambiguous, look from a low angle.
3. **Built geometry** (a court, a stand, a stage floor, painted lines) is not an
   object: you see it on the views. Turn it into points with `view.pick`.

## Without a zone

A few things placed by hand: `entity.place` with `snap = 'ground'` and `faceTo`.

- A point you see on a screenshot: `view.pick` it.
- A row from a start point `(x0, y0)` along heading `h`, every `d` metres:
  `x = x0 - sin(h)·i·d`, `y = y0 + cos(h)·i·d`.
- Something to the right of a point facing `h`: `x + cos(h)·d`, `y + sin(h)·d`.
- Wrap it in `tx.begin` / `tx.commit` and `Wait(150)` between spawns.
- Ten or more people: draw a zone instead (ask the director to draw one with the
  magic wand) and compose it.
