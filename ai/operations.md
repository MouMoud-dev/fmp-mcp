# Operations

Every operation, written from the tool's own code. Their arguments come from
`fmp('api.ops')`; when this page and `api.ops` disagree, `api.ops` is right.

<!-- generated:ops -->
| Operation | Edition | Changes the scene | What it does |
|---|---|---|---|
| `api.info` | Free + Pro |  | Version, edition, whether external control is enabled, what the tool is doing right now, and where the user guide is on this PC. |
| `api.ops` | Free + Pro |  | Every operation, its arguments and its gates. When ai/*.md and this list disagree, this list is right. |
| `help.context` | Free + Pro |  | What the director is looking at, what is selected, the limits reached and the last messages they were shown. Call it before answering a "why can't I…" question. |
| `scene.describe` | Pro |  | The scene as flat records (kind, id, uid, label, model, position, heading), 40 per page. |
| `scene.lint` | Free + Pro |  | What is wrong or risky in the scene: blocks pointing at nothing, too many peds, no camera, an unnamed project, a free-edition ceiling reached. |
| `catalog.search` | Pro |  | Search the tool's catalogues for a model name. Use it before entity.place: a guessed model name is the commonest failure. |
| `entity.place` | Pro | yes | Place a prop, actor, vehicle, camera or light. Returns its uid. |
| `entity.move` | Pro | yes | Move, turn or re-aim something already in the scene. Only what you placed, unless the director named it (confirm). |
| `entity.delete` | Pro | yes | Delete something you placed (or the director named: confirm). Props, actors and vehicles come back with Undo (model and pose; an actor's outfit does not). A camera or light can only be deleted in the batch that placed it. |
| `entity.label` | Pro | yes | Name something as the Outliner shows it ("" puts the model name back). |
| `camera.lens` | Pro | yes | Set a camera's field of view. |
| `camera.view` | Pro |  | Look through a camera (on = true), or hand the view back (on = false). Then a screenshot of the game shows the shot. |
| `camera.frame` | Pro |  | What a camera sees, measured: for each prop, actor and vehicle in frame, its share of the frame, where it sits (thirds), which edges cut it and whether something hides it. Cheaper and more exact than a screenshot for framing. |
| `world.set` | Pro | yes | Set the time of day, the weather and the wind (what the World panel sets). |
| `timeline.play` | Pro |  | Play the timeline from a time (default: where the playhead is). |
| `timeline.stop` | Pro |  | Stop the timeline and rewind it. |
| `timeline.seek` | Pro |  | Park the playhead at a time. A seek is not a play: AI-driven peds and physics only reach that frame when the timeline really plays. |
| `tx.begin` | Pro |  | Open a batch: everything until tx.commit is ONE undo step for the director. Without it, changes made within 2.5 s of each other are batched anyway. |
| `tx.commit` | Pro |  | Close the batch: it becomes one undo step, and the director is told. |
| `tx.rollback` | Pro |  | Take back everything in the open batch, now. |
| `project.save` | Pro |  | Save the project, exactly as the Save button does (same cooldown, same wait after a recording). |
| `zone.list` | Pro |  | The zones the director drew with the magic wand: name, uid, area, ground points per region, and `brief` — what the director wrote they want in it. When told to "go" without more, the brief is the request. |
| `zone.describe` | Pro |  | One zone: its outline, the camera it was drawn from (so you know where "left" and "back" are), its regions, and what of the scene already stands in it. |
| `zone.points` | Pro |  | Ground points inside a zone where something can stand, spread apart: place actors, vehicles or props on them with entity.place. |
| `zone.working` | Pro |  | Show that a zone is being worked on: marching hatching until zone.commit, or until on = false (hidden by itself after view.set / view.orbit, until the next call). |
| `zone.survey` | Pro |  | What the zone IS, read from the game: its features (gym, checkpoint, fire, storage, containers, defences, cabins, wreck... from the map objects in it, with position and size) and its ground (roofed share, collision materials). Do this before composing: place people where the place gives them a reason to be. |
| `zone.autofill` | Pro |  | Fill a zone by the rules of a genre around what zone.survey found — people at each feature doing what that place is for (training at the gym, sentries at a gate facing out, a ring round a fire), vehicles parked by the buildings — every spot cleared against the map. Previews as stand-ins; then look, adjust with zone.compose if needed, and zone.commit. |
| `zone.moods` | Pro |  | What an actor group can be doing (zone.compose mood), each with who it suits and where: { mood, about }. A mood is a set of scenarios or clips, varied per actor. |
| `zone.compose` | Pro |  | Plan a zone in ONE call: a list of groups (who, how many, where, facing what, doing what). FMP places them on real ground and draws a PREVIEW; nothing is spawned until zone.commit. |
| `zone.validate` | Pro |  | Check the previewed plan, measured: members overlapping each other, crossing the map (a car into a container or a fence, a person in a wall), standing raised on a roof the ground runs under, a car on soft ground. Answers member by member; fix with a second zone.compose. It does not judge actions or a car's axis along its kerb: look at those. |
| `zone.pools` | Pro |  | The ready-made model pools by role (cops, ballas, marines, street_cars, police_cars...), for a group's pool or pedPool. `missing` lists any model this game build lacks. |
| `zone.commit` | Pro | yes | Spawn the previewed plan of a zone. One Undo takes the whole fill back; the members are named after their group in the Outliner. |
| `zone.reroll` | Pro | yes | Redo one group of a filled zone: its members go (except the ones the director moved by hand) and a new preview of it is drawn. Then zone.commit. |
| `zone.clear` | Pro | yes | Remove what was spawned in a zone (one group, or all) — never what the director moved by hand. |
| `zone.cancel` | Pro |  | Drop the preview of a zone without spawning it. |
| `view.get` | Pro |  | Where the free camera is and where it looks. |
| `view.set` | Pro |  | Put the free camera at a position, aimed by heading (0 = north) and pitch (negative looks down). Waits for the world there to load. |
| `view.orbit` | Pro |  | Look at a zone (or an entity, or a point) from one side: the camera stands at `angle` around it (compass, 0 = from the north), `distance` away and `height` up, aimed at its centre. Go round in 4-6 angles, low (6-12 m), and screenshot each before placing anything. |
| `view.pick` | Pro |  | Screen points of the current view (a screenshot you just took, 0..1 from the top-left) -> the world points they show, on the map. Use it for painted bays, a door, the end of a kerb: never convert a screenshot by hand. Pick before the camera moves again. |
| `view.push` | Pro |  | Remember the director's view before moving the camera around. view.pop puts it back. |
| `view.pop` | Pro |  | Give the director back the view saved by view.push. Always do this when done looking around. |
| `job.get` | Free + Pro |  | The result of an operation that answered { pending = true, job }. Loop on it with Wait(50). |
<!-- /generated -->
