# Recipe: two gangs facing off

**Story:** two crews meet on neutral ground, each in front of its own cars; the
front men aim, the rest back them up; a lookout watches the street.

Pick the two sides from the pools: `ballas`, `families`, `vagos`, `aztecas`,
`marabunta`, `lost`, `armenians`, `koreans`.

```lua
fmp('zone.compose', { zone = 'Zone A', groups = {
  { id = 'ballas_cars', kind = 'vehicle', count = 2, pool = 'gang_cars',
    where = 'left', layout = 'scatter', spacing = 5, facing = 'group:families',
    roles = { empty = 1, engine = 1 }, pedPool = 'ballas' },
  { id = 'ballas', kind = 'actor', count = 5, pool = 'ballas',
    where = 'left', layout = 'scatter', spacing = 1.2,
    facing = 'group:families', mood = 'hostile', weapon = 'WEAPON_PISTOL' },
  { id = 'ballas_back', kind = 'actor', count = 3, pool = 'ballas',
    where = 'left-back', layout = 'cluster', mood = 'dealer' },
  { id = 'families_cars', kind = 'vehicle', count = 2, pool = 'gang_cars',
    where = 'right', layout = 'scatter', spacing = 5, facing = 'group:ballas',
    roles = { empty = 1, engine = 1 }, pedPool = 'families' },
  { id = 'families', kind = 'actor', count = 5, pool = 'families',
    where = 'right', layout = 'scatter', spacing = 1.2,
    facing = 'group:ballas', mood = 'hostile', weapon = 'WEAPON_PISTOL' },
  { id = 'families_back', kind = 'actor', count = 3, pool = 'families',
    where = 'right-back', layout = 'cluster', mood = 'talk' },
} })
```

- Keep 8-12 m between the two front lines: close enough to read as a
  confrontation, far enough for a camera between them.
- Before it turns violent: `mood = 'idle'` or `'talk'` for the front men, guns
  still in hand (`weapon`).
- Biker gangs (`lost`): motorbikes from `catalog.search` (`kind = 'vehicle'`,
  query `bike`), not `gang_cars`.
