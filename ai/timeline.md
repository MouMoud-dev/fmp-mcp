# The timeline

You can play, stop and move the playhead. You **cannot** write blocks on the
timeline, build routes or curves, or record a vehicle or an actor's performance:
those are the director's (they need someone driving or acting). When a request
needs one of them, do the set-up you can, then say which step is theirs and
where it is in the guide (`docs/timeline.md`, `docs/vehicles.md`,
`docs/ped-recording.md`, `docs/curves.md`).

| Operation | Does |
|---|---|
| `timeline.play { from }` | play from `from` seconds (default: where the playhead is) |
| `timeline.stop` | stop and rewind |
| `timeline.seek { t }` | park the playhead at `t` seconds |

- **While it plays, the scene cannot change**: every change answers `BUSY`.
  `timeline.stop` before you edit.
- A **seek is not a play**: actors driven by the game's AI and physics only reach
  that moment when the timeline really plays. To show the director a moment,
  play from a little before it.
- Weather and time keys on the timeline take over from `world.set` while it plays.
- `api.info` → `state`: `playing`, `time`, `duration`.
- Recording a take (Rec) and Preview are the director's buttons. While a take
  records, nothing changes the scene.
