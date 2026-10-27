# Zone groups: arguments, moods, pools, genres

Everything below is written from the tool's code.

## `zone.compose` arguments

<!-- generated:args zone.compose -->
- `zone` — its name ("Zone A"), uid, or nothing when there is only one
- `groups` — list of { id, kind = actor|vehicle|prop, count, pool = a ready-made pool (zone.pools: cops, ballas, street_cars...) or catalogue words, OR models = {names}, where = left|centre|right|front|middle|back|"left-back"|all, near = {x,y,radius} (only ground around a point: an exit, a door), spots = {{x,y,heading},...} (EXACT places, one member each: a car per fuel pump), layout = cluster|line|scatter|rows, facing = "group:<id>"|camera|centre|{x,y,z}, mood (zone.moods), actions = {scenario names or {dict,clip}} (actors: exactly these instead of a mood — a band, a mechanic), weapon, spacing, roles = {empty,engine,lights,driver,passengers,doorOpen} (vehicles, weights), pedPool (vehicles: who drives / stands by), colours = realistic|model|{PAINT_KEY=weight}, state = {siren=lights|full, engine, lights} (vehicles: all of the group) }
- `seed` — optional: a number; the same groups and seed plan the same scene
<!-- /generated -->

## Moods

What an actor group is doing. Each mood is a set of animations, varied per
person. Pick by the sentence, not by the name.

<!-- generated:moods -->
| Mood | What they do, who, where |
|---|---|
| `band` | playing an instrument; musicians on a stage or a pavement |
| `cheer` | cheering; a crowd in front of a stage, a fight, a race |
| `cop` | police on duty, standing; a cordon, a traffic stop, a crime scene |
| `court` | players between two plays (no ball-game clip exists); a basketball or tennis court |
| `dance` | dancing; a club, a party, a street party (clusters round one point) |
| `dealer` | dealing on a corner; gangs, street dealers |
| `drink` | drinking (a bottle or a coffee); a bar, a party, a bench, a break |
| `film` | filming on a phone; onlookers at a crash, a fight, an arrest |
| `fire` | warming at a fire, drinking, smoking; round a fire or a barrel |
| `guard` | standing guard; soldiers, security, sentries at a gate or a door |
| `handsup` | standing with hands raised; a hold-up, an arrest, a surrender |
| `homeless` | begging or slumped; homeless people under a bridge, in an alley |
| `hostile` | gun in hand, aiming at what the group faces; gunmen, police in a stand-off |
| `idle` | standing around, waiting for nothing in particular; anyone, anywhere |
| `inspect` | checking a clipboard, looking things over; stores, a wreck, a desk, an inspection |
| `kneel` | kneeling, hands on the head; hostages, arrested suspects |
| `party` | partying, cheering, drinking; a party, a club, a beach |
| `phone` | on the phone; passers-by, people waiting |
| `press` | photographing and filming; journalists at an event or a crime scene |
| `scared` | cowering, crouched; civilians in a hold-up, a shooting |
| `smoke` | smoking; a break outside a door, a cabin, a car |
| `talk` | chatting in small groups, a drink or a phone in hand; anyone at rest |
| `train` | push-ups, sit-ups, weights, flexing; a gym, a training ground |
| `wait` | waiting impatiently; a queue, a bus stop, a door |
| `work` | clipboard, hammering, welding; mechanics and building sites ONLY, never soldiers or guards |
<!-- /generated -->

## Ready-made pools

Write `pool = '<name>'` (people and vehicles) or `pedPool = '<name>'` (who
drives or stands by a vehicle). Outside these, `catalog.search`.

<!-- generated:pools -->
| Pool | For | Models |
|---|---|---|
| `agents` | people (`pool`, `pedPool`) | s_m_m_ciasec_01 |
| `armenians` | people (`pool`, `pedPool`) | g_m_m_armgoon_01, g_m_y_armgoon_02 |
| `aztecas` | people (`pool`, `pedPool`) | g_m_y_azteca_01 |
| `ballas` | people (`pool`, `pedPool`) | g_m_y_ballaeast_01, g_m_y_ballaorig_01, g_m_y_ballasout_01, g_f_y_ballas_01 |
| `beach` | people (`pool`, `pedPool`) | a_m_y_beach_01, a_m_y_beach_02, a_m_y_beach_03, a_f_y_beach_01, a_f_m_beach_01, a_m_m_beach_01 |
| `blackops` | people (`pool`, `pedPool`) | s_m_y_blackops_01, s_m_y_blackops_02, s_m_y_blackops_03 |
| `builders` | people (`pool`, `pedPool`) | s_m_y_construct_01, s_m_y_construct_02 |
| `business` | people (`pool`, `pedPool`) | a_m_y_business_01, a_m_y_business_02, a_m_m_business_01, a_f_y_business_01, a_f_y_business_02 |
| `city` | people (`pool`, `pedPool`) | a_m_y_downtown_01, a_f_m_downtown_01, a_m_y_genstreet_01, a_m_y_genstreet_02, a_m_y_stwhi_01, a_m_y_stbla_01, a_f_y_tourist_01, a_m_m_tourist_01 |
| `clubbers` | people (`pool`, `pedPool`) | a_m_y_clubcust_01, a_m_y_clubcust_02, a_m_y_clubcust_03, a_f_y_clubcust_01, a_f_y_clubcust_02, a_f_y_clubcust_03 |
| `cops` | people (`pool`, `pedPool`) | s_m_y_cop_01, s_f_y_cop_01, s_m_y_hwaycop_01 |
| `dockers` | people (`pool`, `pedPool`) | s_m_m_dockwork_01, s_m_y_dockwork_01 |
| `doctors` | people (`pool`, `pedPool`) | s_m_m_doctor_01, s_f_y_scrubs_01 |
| `families` | people (`pool`, `pedPool`) | g_m_y_famca_01, g_m_y_famdnf_01, g_m_y_famfor_01, g_f_y_families_01 |
| `firefighters` | people (`pool`, `pedPool`) | s_m_y_fireman_01 |
| `gunmen` | people (`pool`, `pedPool`) | hc_gunman |
| `hipsters` | people (`pool`, `pedPool`) | a_m_y_hipster_01, a_m_y_hipster_02, a_f_y_hipster_01, a_f_y_hipster_02, a_f_y_hipster_03 |
| `homeless` | people (`pool`, `pedPool`) | a_m_m_tramp_01, a_f_m_tramp_01, a_m_o_tramp_01, a_m_m_trampbeac_01 |
| `koreans` | people (`pool`, `pedPool`) | g_m_y_korean_01, g_m_y_korean_02, g_m_y_korlieut_01 |
| `lost` | people (`pool`, `pedPool`) | g_m_y_lost_01, g_m_y_lost_02, g_m_y_lost_03, g_f_y_lost_01 |
| `marabunta` | people (`pool`, `pedPool`) | g_m_y_salvagoon_01, g_m_y_salvagoon_02, g_m_y_salvagoon_03, g_m_y_salvaboss_01 |
| `marines` | people (`pool`, `pedPool`) | s_m_y_marine_01, s_m_y_marine_03, s_m_m_marine_01 |
| `mechanics` | people (`pool`, `pedPool`) | s_m_m_autoshop_01, s_m_m_autoshop_02, s_m_y_xmech_01, s_m_y_xmech_02 |
| `paramedics` | people (`pool`, `pedPool`) | s_m_m_paramedic_01 |
| `press` | people (`pool`, `pedPool`) | a_m_m_paparazzi_01 |
| `prisoners` | people (`pool`, `pedPool`) | s_m_y_prisoner_01 |
| `rural` | people (`pool`, `pedPool`) | a_m_m_hillbilly_01, a_m_m_hillbilly_02, a_m_m_salton_01, a_m_m_salton_02, a_f_m_salton_01, a_m_m_farmer_01 |
| `security` | people (`pool`, `pedPool`) | s_m_m_security_01, s_m_m_bouncer_01 |
| `sheriffs` | people (`pool`, `pedPool`) | s_m_y_sheriff_01, s_f_y_sheriff_01 |
| `southside` | people (`pool`, `pedPool`) | a_m_y_soucent_01, a_m_y_soucent_02, a_m_m_soucent_01, a_f_y_soucent_01, a_f_y_soucent_02 |
| `sport` | people (`pool`, `pedPool`) | a_m_y_runner_01, a_f_y_runner_01, a_f_y_fitness_01, a_f_y_fitness_02 |
| `swat` | people (`pool`, `pedPool`) | s_m_y_swat_01 |
| `vagos` | people (`pool`, `pedPool`) | g_m_y_mexgoon_01, g_m_y_mexgoon_02, g_m_y_mexgoon_03, g_f_y_vagos_01 |
| `vinewood` | people (`pool`, `pedPool`) | a_m_y_vinewood_01, a_m_y_vinewood_02, a_f_y_vinewood_01, a_f_y_vinewood_02, a_f_y_vinewood_03 |
| `ambulances` | vehicles (`pool`) | ambulance |
| `buses` | vehicles (`pool`) | bus, coach |
| `fire_trucks` | vehicles (`pool`) | firetruk |
| `gang_cars` | vehicles (`pool`) | buccaneer, chino, faction, voodoo2, moonbeam, tornado, manana |
| `luxury` | vehicles (`pool`) | cog55, windsor, exemplar, felon, superd, stretch |
| `military` | vehicles (`pool`) | crusader, mesa3, barracks |
| `police_cars` | vehicles (`pool`) | police, police2, police3 |
| `police_vans` | vehicles (`pool`) | policet, riot |
| `rural_cars` | vehicles (`pool`) | rebel, sadler, bobcatxl, emperor2, tornado3, voodoo2, manana, peyote, journey, bfinjection |
| `sheriff_cars` | vehicles (`pool`) | sheriff, sheriff2 |
| `street_cars` | vehicles (`pool`) | asea, premier, stanier, ingot, emperor, primo, tailgater, washington, fugitive, oracle, schafter2, surge, dilettante, blista, issi2, prairie, asterope, intruder, glendale, regina, felon, sentinel, zion, jackal |
| `suvs` | vehicles (`pool`) | baller, cavalcade, granger, landstalker, rocoto, seminole, dubsta, huntley, serrano, fq2, patriot |
| `taxis` | vehicles (`pool`) | taxi |
| `trucks` | vehicles (`pool`) | mule, benson, pounder, boxville |
| `unmarked` | vehicles (`pool`) | police4, fbi |
| `vans` | vehicles (`pool`) | burrito3, speedo, rumpo, minivan, youga, bison |
| `work_vehicles` | vehicles (`pool`) | utillitruck, utillitruck3, towtruck, flatbed, bobcatxl, sadler |
<!-- /generated -->

## Autofill genres

`zone.autofill { genre }` reads the zone's features (`zone.survey`) and fills
each one by these rules, every spot cleared against the map.

<!-- generated:genres -->
**`military`** — people from `marines`, vehicles from `military`.

| Feature found | People | Placed | Mood | Armed | Facing |
|---|---|---|---|---|---|
| sport | 3 | ring | `train` |  | the feature |
| gate | 2 | flank | `guard` | WEAPON_CARBINERIFLE | out of the zone |
| fire | 4 | ring | `fire` |  | the feature |
| cabin | 2 | beside | `smoke` |  | loosely |
| storage | 2 | beside | `inspect` |  | the feature |
| cargo | 1 | beside | `guard` | WEAPON_CARBINERIFLE | out of the zone |
| defense | 1 | inside | `guard` | WEAPON_CARBINERIFLE | out of the zone |
| obstacle | 2 | beside | `train` |  | loosely |
| wreck | 2 | ring | `inspect` |  | the feature |
| seat | 1 | beside | `drink` |  | loosely |
| desk | 1 | beside | `inspect` |  | the feature |

Vehicles park by: cabin, storage, cargo.
<!-- /generated -->
