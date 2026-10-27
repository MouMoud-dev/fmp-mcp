# Working in a zone

A **zone** is an area the director drew on the ground with the magic wand
(*Zone A*, *Zone B*…). It is how they say "here". It remembers the camera it was
drawn from, so its regions (`left`, `centre`, `right` × `front`, `middle`,
`back`) mean what the director **saw**. Never invent coordinates for a zone:
read it.

A zone is filled in **one plan**: FMP works out every spot on the real ground,
shows a **preview** of stand-ins (each person as the model it will be, in its
real pose; each vehicle as a stand-in of its size painted its group's colour),
and spawns it all on `zone.commit`. One Undo takes the whole fill back. Never
place a crowd one `entity.place` at a time.

## The order of work

1. **`zone.working`**, at once. The zone shows moving stripes and the top of the
   screen says the assistant is working, until you commit or switch it off.
2. **Read the place**: `zone.describe` (size, regions, the drawing camera, what
   already stands in it) and `zone.survey` (its features: gym, gate, fire,
   storage, containers, defences, cabins, wreck…, and its ground: roofed share,
   surfaces). In the same snippet: `view.push`.
3. **Look around** with `view.orbit` at 6 angles (0, 60, 120, 180, 240, 300),
   `height` 6 to 12, and a `game_screenshot` right after each one.
   - A zone wider than 60 m: orbit each part (`target = { x, y, z }`) rather than
     the whole.
   - A bad view (too far, inside a wall, on a roof, half hidden): move closer,
     back off, go higher or take another angle, and shoot again. Never plan from
     a view you could not read. Around a building, stand on its open side.
   - Look under roofs and canopies: a view from above hides what is under them.
4. **Painted lines** (parking bays, hatching, kerbs): `view.set` straight above
   them, `pitch = -89`, screenshot, then `view.pick` the corners of each bay.
   Those world points become `spots`. The method is in `recipes/parking-lot.md`.
5. **Choose the path**:
   - The request matches an autofill **genre** (`zone-groups.md`) → `zone.autofill`
     with that genre; add what the request asks and the map does not show with
     `add`, leave features empty with `skip`.
   - Otherwise → the **recipe** for that kind of scene, adapted to what you saw,
     in **one `zone.compose`** with every group.
   - "Go" with nothing more → the zone's `brief` (`zone.list`) is the request.
6. **`zone.validate`**. Fix what it reports with a second `zone.compose`: move the
   group (`where`, `near`, `spots`), lower its `count`, or widen its `spacing`.
7. **Check the preview from low angles**: `view.orbit` over each group, `height`
   3 to 6, screenshot. Go through *Before you show anything* in `README.md`.
8. **Show the director** a screenshot and say what you planned. Wait for their
   answer. A change → compose again, or `zone.reroll` for one group.
9. **Yes** → `zone.commit`, then `view.pop`.
   **Giving up** → `zone.cancel`, `zone.working { on = false }`, `view.pop`.

## Choosing each group

| Who | `layout` | `facing` | `spacing` |
|---|---|---|---|
| People at rest, talking, smoking | `cluster` (knots of 2-3 facing each other) | — | — |
| A crowd watching something | `scatter` | the focal point `{ x, y, z }` | 0.9-1.2 |
| A cordon, a firing line, a queue | `line` | what they face | 1.2-1.5 |
| Guards, sentries | `spots`, or `scatter` | a point outside the zone, or the door | 4-8 |
| Two sides facing off | `scatter` or `line` per side | `group:<other side>` | 1.2 |
| Parked vehicles, side by side | `rows` (default) or one `spots` per bay | — | 1.2 |
| Vehicles stopped anyhow (a crash, a roadblock) | `scatter` | the scene's centre | 5-6 |

- `where` puts a group in a region; `near = { x, y, radius }` keeps it around a
  point (a door, an exit, a pump); `spots` are exact places, one member each.
- Moods: pick the one whose sentence fits the person **and** the place
  (`zone-groups.md`). A soldier does not weld; a guest at a party does not stand
  guard. `actions` replaces a mood with exact scenarios when none fits.
- `pool`: a ready-made pool (`zone-groups.md`). Mix pools for variety (two
  groups) rather than writing model names.
- Vehicles:
  - `colours = 'model'` for police, ambulances, fire trucks, military, taxis and
    buses: their paint is their livery. `'realistic'` (the default) for
    everyone else.
  - `roles`: parked cars `{ empty = 8, engine = 1, doorOpen = 1 }`; cars that
    just arrived `{ empty = 2, engine = 1, doorOpen = 1 }`; a queue in traffic
    `{ driver = 1 }`. Only a few cars get a role.
  - `pedPool` (who drives or stands by it): `cops` for police cars,
    `paramedics` for ambulances, `firefighters` for fire trucks, the gang's own
    pool for its cars, `city` for street cars.
  - `state = { siren = 'lights' }` for emergency vehicles at a scene;
    `'full'` only when they are still arriving.
- Remember the `seed`: the same groups and seed give the same plan, another seed
  another arrangement.

## Limits

- 24 groups in one compose, 60 members in one group.
- **96 peds live** in the whole scene, drivers and people by the cars included
  (`passengers` counts 2). `zone.compose` answers `actors`: add the drivers.
  Tell the director the count from 60.
- Ground the game has not loaded yet has no points: fly the view there first.
- Anything the director moved by hand in a filled zone is theirs: a reroll and a
  clear leave it where it is, and plans go around it.
