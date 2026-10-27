# Recipe: a road accident

**Story:** two cars stopped at an angle after a crash, one door open; onlookers at
a distance, some filming, some shocked; police and an ambulance arriving with
their lights on.

Read first: the crash point `C` and the road's heading `H` (top view, `view.pick`).

```lua
local h = math.rad(H)
-- The second car 4 m further along the road and 1.5 m across it.
local C2 = { x = C.x - math.sin(h) * 4 + math.cos(h) * 1.5, y = C.y + math.cos(h) * 4 + math.sin(h) * 1.5 }
fmp('zone.compose', { zone = 'Zone A', groups = {
  { id = 'crashed', kind = 'vehicle', count = 2, pool = 'street_cars',
    spots = { { x = C.x, y = C.y, heading = H + 35 }, { x = C2.x, y = C2.y, heading = H - 60 } },
    roles = { doorOpen = 1, empty = 1 } },
  { id = 'onlookers', kind = 'actor', count = 8, pool = 'city',
    near = { x = C.x, y = C.y, radius = 15 }, layout = 'scatter', spacing = 1.5,
    facing = C, mood = 'film' },
  { id = 'shocked', kind = 'actor', count = 4, pool = 'city',
    near = { x = C.x, y = C.y, radius = 12 }, layout = 'cluster', mood = 'scared' },
  { id = 'police', kind = 'vehicle', count = 1, pool = 'police_cars',
    where = 'back', layout = 'scatter', facing = C, colours = 'model',
    state = { siren = 'lights' }, roles = { doorOpen = 1 }, pedPool = 'cops' },
  { id = 'ambulance', kind = 'vehicle', count = 1, pool = 'ambulances',
    where = 'front', layout = 'scatter', facing = C, colours = 'model',
    state = { siren = 'lights' }, pedPool = 'paramedics' },
  { id = 'paramedics', kind = 'actor', count = 2, pool = 'paramedics',
    near = { x = C.x, y = C.y, radius = 4 }, layout = 'scatter', facing = C, mood = 'inspect' },
} })
```

- Check the two crashed cars from a low angle: they must touch or nearly, not
  overlap (`zone.validate` reports `overlap`).
- Onlookers stay 8-15 m away and on the pavement, not in the lane.
- A fire truck on a bigger crash: `pool = 'fire_trucks'`, `pedPool = 'firefighters'`.
