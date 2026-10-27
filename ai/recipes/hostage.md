# Recipe: a hold-up, a hostage situation

**Story:** gunmen hold a building with hostages at the door; the police have
blocked every exit and aim at the entrance; civilians cower further away and a
few film from behind the cars.

Read first: the entrance (`DOOR`, from `view.pick` on a low view) and each road
in (`EXIT1`, `EXIT2`…).

```lua
fmp('zone.compose', { zone = 'Zone A', groups = {
  { id = 'police_cars', kind = 'vehicle', count = 4, pool = 'police_cars',
    near = { x = EXIT1.x, y = EXIT1.y, radius = 10 }, layout = 'scatter', spacing = 6,
    facing = DOOR, colours = 'model', state = { siren = 'lights' },
    roles = { empty = 3, doorOpen = 1 }, pedPool = 'cops' },
  { id = 'cops', kind = 'actor', count = 8, pool = 'cops',
    near = { x = EXIT1.x, y = EXIT1.y, radius = 8 }, layout = 'line', spacing = 1.5,
    facing = DOOR, mood = 'hostile', weapon = 'WEAPON_PISTOL' },
  { id = 'gunmen', kind = 'actor', count = 3, pool = 'gunmen',
    near = { x = DOOR.x, y = DOOR.y, radius = 4 }, layout = 'scatter', spacing = 1.5,
    facing = 'group:cops', mood = 'hostile', weapon = 'WEAPON_CARBINERIFLE' },
  { id = 'hostages', kind = 'actor', count = 3, pool = 'city',
    near = { x = DOOR.x, y = DOOR.y, radius = 3 }, layout = 'scatter',
    facing = 'group:cops', mood = 'kneel' },
  { id = 'civilians', kind = 'actor', count = 6, pool = 'city',
    where = 'back', layout = 'cluster', mood = 'scared' },
  { id = 'onlookers', kind = 'actor', count = 5, pool = 'city',
    where = 'front', layout = 'scatter', spacing = 1.2, facing = DOOR, mood = 'film' },
} })
```

- One police group per exit (copy `police_cars` and `cops` with `EXIT2`…).
- Police cars stand **angled**, across the road in, never parked in a row.
- A fuel station or a shop car park: the parked cars still stand at the pumps
  and in the painted bays (`recipes/parking-lot.md`), a couple with the door
  open or the engine running, abandoned.
- SWAT arriving: a group from `swat` behind the police cars, `mood = 'hostile'`,
  `weapon = 'WEAPON_CARBINERIFLE'`.
