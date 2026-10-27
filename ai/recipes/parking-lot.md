# Recipe: a car park, a fuel station, cars in their bays

**Story:** most bays taken, a few free; a couple of people walking to or from
their cars; one car with its door open, one with the engine running.

## Reading the bays

1. `view.set` straight above the painted lines: `pitch = -89`, 15-25 m up, the
   lines filling the picture. `game_screenshot`.
2. On the screenshot, find the **entrance of each bay** (the middle of its open
   end) and the **back** (the middle of its closed end, a kerb or a wall).
3. `view.pick` all of them in one call, before the camera moves:

   ```lua
   local p = fmp('view.pick', { points = { { u = 0.31, v = 0.42 }, { u = 0.31, v = 0.55 }, … } })
   ```

4. For each bay, centre = midpoint of entrance and back; heading = from the
   entrance toward the back (nose in): `GetHeadingFromVector_2d(back.x - entry.x,
   back.y - entry.y)`. Reverse it for a car parked nose out.
5. One `spots` entry per bay you fill, with the ground `z` from the pick when
   anything overhangs (a fuel canopy).

## The groups

```lua
fmp('zone.compose', { zone = 'Zone A', groups = {
  { id = 'parked', kind = 'vehicle', count = #BAYS, pool = 'street_cars', spots = BAYS,
    roles = { empty = 8, engine = 1, doorOpen = 1 }, pedPool = 'city' },
  { id = 'parked_suvs', kind = 'vehicle', count = #BAYS2, pool = 'suvs', spots = BAYS2,
    roles = { empty = 1 } },
  { id = 'walkers', kind = 'actor', count = 4, pool = 'city',
    where = 'all', layout = 'scatter', spacing = 4, mood = 'phone' },
} })
```

- Leave 1 bay in 5 empty: a full car park reads as a placement.
- A fuel station: one car per pump, alongside its island (`positioning.md`),
  read from the pumps' own positions; a car or two waiting behind.
- An upmarket place: `luxury` and `suvs`; a rural one: `rural_cars`; a garage:
  `work_vehicles` and `mechanics` with `mood = 'work'`.
