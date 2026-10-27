# Recipe: a military base, a checkpoint, a camp

**Use `zone.autofill`, genre `military`.** It reads the zone's features and puts
soldiers where the place gives them a reason to be: training at the gym, sentries
at the gate facing out, a ring round a fire, stock-taking by the stores, a guard
on the containers and the defences, vehicles parked by the buildings.

```lua
local r = fmp('zone.autofill', { zone = 'Zone A', genre = 'military', density = 1 })
```

- `density`: 0.6 for a quiet camp at night, 1 by default, 1.5 for a busy base.
- `skip = { 'defense' }` leaves a kind of feature empty (the list of kinds is in
  `zone-groups.md`).
- `add` for what the request asks and the map does not show. A briefing:

  ```lua
  add = {
    { id = 'officer', kind = 'actor', count = 1, pool = 'marines',
      spots = { { x = OX, y = OY, heading = H } }, mood = 'inspect' },
    { id = 'squad', kind = 'actor', count = 8, pool = 'marines',
      near = { x = SX, y = SY, radius = 4 }, layout = 'scatter', spacing = 1.2,
      facing = { x = OX, y = OY, z = OZ }, mood = 'guard' },
  }
  ```

  A game on a court the survey cannot see: a group with `mood = 'court'` near the
  court's centre, read with `view.pick`.
- Special forces instead of marines: compose with `pool = 'blackops'` rather than
  autofill.

Then `zone.validate`, low orbits, show the director.
