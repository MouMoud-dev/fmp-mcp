# Recipe: a crime scene after the fact

**Story:** the police hold a cordon around the scene; detectives look things over
inside it; press and onlookers press against the cordon from outside.

Read first: the centre of the scene `X`, and one point per officer along the
cordon line, 3-4 m apart (`L1`…`L5`, from `view.pick`).

```lua
fmp('zone.compose', { zone = 'Zone A', groups = {
  -- One officer per spot.
  { id = 'cordon', kind = 'actor', count = 5, pool = 'cops', mood = 'cop', facing = 'group:onlookers',
    spots = { { x = L1.x, y = L1.y }, { x = L2.x, y = L2.y }, { x = L3.x, y = L3.y },
              { x = L4.x, y = L4.y }, { x = L5.x, y = L5.y } } },
  { id = 'detectives', kind = 'actor', count = 3, pool = 'agents',
    near = { x = X.x, y = X.y, radius = 4 }, layout = 'cluster', mood = 'inspect' },
  { id = 'police_cars', kind = 'vehicle', count = 3, pool = 'police_cars',
    near = { x = X.x, y = X.y, radius = 15 }, layout = 'scatter', spacing = 6,
    colours = 'model', state = { siren = 'lights' }, roles = { empty = 1 } },
  { id = 'press', kind = 'actor', count = 4, pool = 'press',
    where = 'front', layout = 'scatter', spacing = 1.2, facing = X, mood = 'press' },
  { id = 'onlookers', kind = 'actor', count = 8, pool = 'city',
    where = 'front', layout = 'scatter', spacing = 1.0, facing = X, mood = 'film' },
} })
```

- A cordon tape is a prop: `catalog.search { kind = 'prop', query = 'tape' }`,
  and barriers `prop_barrier_work05` along the cordon line.
- An unmarked car for the detectives: `pool = 'unmarked'`.
- Sheriff territory (outside the city): `sheriffs` and `sheriff_cars`.
