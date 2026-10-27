# Lights

```lua
fmp('entity.place', { kind = 'light', x = X, y = Y, z = Z, label = 'Key',
  faceTo = { x = S.x, y = S.y, z = S.z + 0.6 },
  light = { type = 'spot', color = { r = 255, g = 184, b = 123 }, intensity = 10, range = 8 } })
```

- `type`: `spot` (a beam, aimed with `faceTo`; **Spot** on screen) or `point`
  (all around; **Ambient** on screen).
- Defaults: spot intensity 10, range 25 m; point intensity 10, range 15 m;
  colour warm white `(255, 244, 214)`.
- `range`: just past what it lights (distance to the subject + 3 m), or it
  spills over the whole set.
- The beam's width, softness, shadows, gobos and the rest are set by the
  director in the Lights panel: say so when the request needs them.
- Which system draws the lights (Live, or the Rockstar Editor) is the scene's
  choice, made by the director at the top of the Lights panel, not yours.
- **Intensity is not tied to an exposure.** Start from the values below, look
  through the shot camera, screenshot, and adjust by ×2 or ÷2.

## Colour temperature

| Light | Kelvin | `color` |
|---|---|---|
| Candle, fire | 2000 | 255, 137, 14 |
| Sodium street lamp | 2100 | 255, 142, 27 |
| Household bulb | 2700 | 255, 167, 87 |
| Film tungsten | 3200 | 255, 184, 123 |
| Office, neon | 4000 | 255, 206, 166 |
| Noon sun | 5000 | 255, 228, 206 |
| Film daylight | 5600 | 255, 239, 225 |
| Overcast | 6500 | 255, 254, 250 |
| Shade, blue hour | 7500 | 230, 235, 255 |

Police lights, neon signs: saturated `(255, 30, 30)`, `(30, 60, 255)`.

## Recipes

**Three-point light on a person** (positions from the subject `S`, the camera on
side `A`):

| Light | Where | Type | Intensity | Colour |
|---|---|---|---|---|
| Key | 30-45° off the camera's side, 2.5-3 m away, 0.5-1 m above the head, aimed at the face | spot | 10 | 3200 K or 5600 K |
| Fill | the other side of the camera, same distance, lower | point | 4 | a little cooler than the key |
| Back | behind the subject, opposite the camera, 1 m above the head, aimed at the shoulders | spot | 8 | 5600-7500 K |

**Night street**: sodium points 5-6 m high every 15-20 m along the pavement,
intensity 15, range 12; one cool back light on the actors.

**Interior**: warm points (2700 K) where the practical lamps are, 2-2.5 m high,
intensity 6, range 6; a soft key from the window side (5600 K).

**Fire, campfire**: a point at the fire, 0.5 m up, 2000 K, intensity 8, range 6.

In the free edition the number of lights is capped: a refused `entity.place`
says so. Tell the director.
