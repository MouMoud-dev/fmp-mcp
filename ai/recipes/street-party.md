# Recipe: a street party, a block party, a beach party

**Story:** people dance around one focal point (a sound system, a car with its
doors open, a fire on the beach); others drink and talk at the edges; a few film.

Read first: the focal point `F` (`view.pick`).

```lua
fmp('zone.compose', { zone = 'Zone A', groups = {
  -- First: groups are planned in order, and the dancers must plan around the car.
  { id = 'party_car', kind = 'vehicle', count = 1, pool = 'gang_cars',
    spots = { { x = F.x, y = F.y } }, roles = { doorOpen = 1 }, state = { lights = true } },
  { id = 'dancers', kind = 'actor', count = 12, pool = 'clubbers',
    near = { x = F.x, y = F.y, radius = 6 }, layout = 'cluster', mood = 'dance' },
  { id = 'dancers2', kind = 'actor', count = 8, pool = 'hipsters',
    near = { x = F.x, y = F.y, radius = 8 }, layout = 'cluster', mood = 'dance' },
  { id = 'drinkers', kind = 'actor', count = 8, pool = 'city',
    where = 'back', layout = 'cluster', mood = 'drink' },
  { id = 'talkers', kind = 'actor', count = 6, pool = 'southside',
    where = 'left', layout = 'cluster', mood = 'talk' },
  { id = 'filming', kind = 'actor', count = 3, pool = 'city',
    where = 'front', layout = 'scatter', spacing = 1.5, facing = F, mood = 'film' },
} })
```

- A beach: `pool = 'beach'` for everyone, `mood = 'party'` at the edges, and a
  `fire` mood ring if there is a fire.
- A neighbourhood: the gang or the area's pool (`families`, `southside`,
  `vagos`…) instead of clubbers.
- Drop `party_car` when the focal point is a stage or a fire.
