# Recipe: a traffic stop, an arrest

**Story:** a car pulled over at the kerb, its driver out with hands up beside the
open door; a police car stopped behind it with its lights on; one officer by the
driver, one covering from behind the police car's door.

Read first, from a top view and `view.pick`: a point `K` on the kerb where the
car stops, and `H`, the heading a car drives in that lane.

Traffic drives on the right, so a stopped car has the kerb on its right. With
`h = math.rad(H)`: ahead is `(-sin h, cos h)`, the kerb side is `(cos h, sin h)`.
Put the cars' centres 1 m from the kerb, on the road side.

```lua
local h = math.rad(H)
local function at(p, ahead, side)   -- metres ahead along the lane, metres toward the kerb
  return { x = p.x - math.sin(h) * ahead + math.cos(h) * side,
           y = p.y + math.cos(h) * ahead + math.sin(h) * side }
end
local car    = at(K, 0, -1)          -- 1 m off the kerb
local police = at(K, -7, -1)         -- 7 m behind it
local driver = at(K, 0.4, -2.6)      -- by the open driver's door (road side)
fmp('zone.compose', { zone = 'Zone A', groups = {
  { id = 'suspect_car', kind = 'vehicle', count = 1, pool = 'street_cars',
    spots = { { x = car.x, y = car.y, heading = H } }, state = { engine = true } },
  { id = 'police_car', kind = 'vehicle', count = 1, pool = 'police_cars',
    spots = { { x = police.x, y = police.y, heading = H } }, colours = 'model',
    state = { siren = 'lights' }, roles = { doorOpen = 1 }, pedPool = 'cops' },
  { id = 'suspect', kind = 'actor', count = 1, pool = 'city',
    spots = { { x = driver.x, y = driver.y, heading = H + 180 } }, mood = 'handsup' },   -- facing the police
  { id = 'officer', kind = 'actor', count = 1, pool = 'cops',
    near = { x = driver.x, y = driver.y, radius = 3 }, layout = 'scatter',
    facing = 'group:suspect', mood = 'hostile', weapon = 'WEAPON_PISTOL' },
} })
```

- The police car's `doorOpen` role puts the second officer at its open door.
- An arrest further on: the suspect `kneel` instead of `handsup`, two officers.
- Traffic passing in the other lane: a `vehicle` group with `layout = 'rows'`
  and `roles = { driver = 1 }`, `where` on that side.
