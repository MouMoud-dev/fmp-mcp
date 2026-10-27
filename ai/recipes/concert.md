# Recipe: a concert, a show, a speech

**Story:** a band (or a speaker) on the stage; a dense crowd in front of it, the
front rows cheering, the back dancing and drinking; security between the stage
and the crowd; press at the side.

Read first (`view.pick` on a low view): the stage's front edge `S`, its centre
`STAGE`, and one point per musician on the stage floor (`B1`…`B4`). The zone must
cover the stage too: a spot outside the zone is dropped. `H` is the heading from
the stage toward the crowd.

```lua
fmp('zone.compose', { zone = 'Zone A', groups = {
  -- One spot per musician, with the stage's own height.
  { id = 'band', kind = 'actor', count = 4, pool = 'hipsters', mood = 'band',
    spots = { { x = B1.x, y = B1.y, z = B1.z, heading = H }, { x = B2.x, y = B2.y, z = B2.z, heading = H },
              { x = B3.x, y = B3.y, z = B3.z, heading = H }, { x = B4.x, y = B4.y, z = B4.z, heading = H } } },
  { id = 'front', kind = 'actor', count = 20, pool = 'clubbers',
    near = { x = S.x, y = S.y, radius = 8 }, layout = 'scatter', spacing = 0.9,
    facing = STAGE, mood = 'cheer' },
  { id = 'crowd', kind = 'actor', count = 20, pool = 'city',
    where = 'back', layout = 'scatter', spacing = 1.0, facing = STAGE, mood = 'dance' },
  { id = 'edges', kind = 'actor', count = 8, pool = 'hipsters',
    where = 'left', layout = 'cluster', mood = 'drink' },
  { id = 'security', kind = 'actor', count = 4, pool = 'security',
    near = { x = S.x, y = S.y, radius = 3 }, layout = 'line', spacing = 3,
    facing = 'group:front', mood = 'guard' },
  { id = 'press', kind = 'actor', count = 3, pool = 'press',
    where = 'right-front', layout = 'scatter', spacing = 1.5, facing = STAGE, mood = 'press' },
} })
```

- 56 people here: with the drivers of any parked car, stay under 96. Tell the
  director the count.
- A speech: one speaker on a spot with `mood = 'idle'`, the crowd `wait` and
  `cheer`, `press` in front.
- **A TV crew** (any event, a sports meeting): a `prop` group of
  `p_tv_cam_02_s` (a TV camera on its tripod) and an `actor` group of `press`
  with `actions = { 'WORLD_HUMAN_GUARD_STAND' }`, one spot each, the operator
  0.9 m behind the camera, both facing the action (same heading). With the `press`
  mood instead, the operator films on a phone beside his own camera.
- No ball-game, no instrument other than `band`: what the moods offer is listed
  in `zone-groups.md`.
