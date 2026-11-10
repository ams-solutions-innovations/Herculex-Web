/**
 * Set types and training techniques, as explained on /training-techniques and in the landing page.
 *
 * Mirrors the app's registry (`SetTypeInfo.all` in
 * lib/features/workouts/presentation/widgets/set_type_menu.dart): same ids, badges, categories, colours and
 * volume / CNS factors. When a set type is added or its factors change in the app, change it here too.
 */

export type SetTypeCategory = 'basic' | 'hypertrophy' | 'timed';

export interface SetTypeEntry {
  /** The app's stable id; also the page anchor (`#drop`, `#myo_reps`). */
  id: string;
  label: string;
  /** Badge shown in the set-number cell of the active workout. */
  badge: string;
  category: SetTypeCategory;
  /** The app's accent colour for the technique. */
  accent: string;
  /** One line, used on cards. */
  short: string;
  /** What it is. */
  what: string;
  /** How to do it, step by step. */
  how: string[];
  /** When it earns its place. */
  when: string;
  /** What to be careful about. */
  watch?: string;
  /** How Herculex logs and counts it. */
  inHerculex: string;
  /** Tonnage multiplier per logged rep, relative to a standard rep. */
  volume: number;
  /** CNS load multiplier relative to a standard set. */
  cns: number;
}

export const setTypeCategories: Record<SetTypeCategory, { title: string; blurb: string; icon: string }> = {
  basic: {
    title: 'Basic & warm-up',
    blurb: 'The sets every session is built from.',
    icon: 'fitness_center_rounded',
  },
  hypertrophy: {
    title: 'Hypertrophy & intensity',
    blurb: 'Techniques that extend a set past the point where it would normally stop.',
    icon: 'local_fire_department_rounded',
  },
  timed: {
    title: 'Timed & functional',
    blurb: 'Work measured against the clock instead of a rep target.',
    icon: 'timer_outlined',
  },
};

export const setTypes: SetTypeEntry[] = [
  // ── Basic & warm-up ──────────────────────────────────────────────────────
  {
    id: 'standard',
    label: 'Standard set',
    badge: '—',
    category: 'basic',
    accent: '#42a5f5',
    short: 'A normal working set through the full range of motion.',
    what: 'A set with a fixed weight and rep target, performed with controlled tempo and full range of motion. It is the foundation of your training volume.',
    how: [
      'Pick a weight you can lift for the target reps with good form.',
      'Lower under control, drive up, and stop the set at your planned effort (RPE).',
      'Rest, then repeat for the planned number of sets.',
    ],
    when: 'Always. Most of your sets, and every heavy main lift, should be standard sets.',
    inHerculex: 'Weight and reps count in full towards working volume and tonnage.',
    volume: 1,
    cns: 1,
  },
  {
    id: 'warmup',
    label: 'Warm-up set',
    badge: 'W',
    category: 'basic',
    accent: '#ffa726',
    short: 'A light set that prepares your joints and nervous system.',
    what: 'A lighter set performed before your working sets to raise temperature, rehearse the movement and groove the pattern, without causing fatigue.',
    how: [
      'Start with an empty bar or a light weight for 8–10 reps.',
      'Add weight in steps while dropping the reps (for example 50% × 5, 70% × 3, 85% × 1).',
      'Stop well short of fatigue, then move on to your first working set.',
    ],
    when: 'Before the first heavy exercise for a muscle group. Later exercises for the same muscle need fewer warm-ups.',
    inHerculex: 'Marked with a flame or a “W” badge and excluded from working volume and tonnage, so it never skews your heavy-set stats.',
    volume: 0,
    cns: 0,
  },

  // ── Hypertrophy & intensity ──────────────────────────────────────────────
  {
    id: 'drop',
    label: 'Drop set',
    badge: 'D',
    category: 'hypertrophy',
    accent: '#e57373',
    short: 'Hit failure, cut the weight, keep going.',
    what: 'You take a set to (or very near) failure, immediately reduce the weight by 10–30% and keep lifting to the next failure, with no rest in between. Usually one to three “drops” in a row.',
    how: [
      'Lift your normal working weight until you cannot complete another clean rep.',
      'Reduce the weight straight away, by about 20%, with no rest beyond the time it takes to change the load.',
      'Lift to failure again. Repeat once or twice more if you planned several drops.',
    ],
    when: 'On the last set of an isolation exercise or machine movement, where changing the weight takes seconds: cable work, leg extensions, lateral raises, curls, pec deck.',
    watch: 'Very fatiguing for the time it takes. Keep it for the final set of an exercise; one drop set per muscle per session is plenty to start with. Avoid it on heavy barbell compounds, where a fast weight change is awkward and technique breaks down.',
    inHerculex: 'Pick the drop percentage (10, 20 or 30%) when you choose the set type. Herculex rounds each drop to a weight your equipment can actually load. Every rep you log counts, at the weight you actually lifted.',
    volume: 1,
    cns: 1,
  },
  {
    id: 'down_sets',
    label: 'Down sets',
    badge: 'DN',
    category: 'hypertrophy',
    accent: '#ba68c8',
    short: 'Same weight, one rep fewer each set.',
    what: 'A chain of sets at one constant weight where each set has one rep fewer than the one before (10 → 9 → 8 → 7 …). They are labelled D1, D2, D3 …',
    how: [
      'Choose a weight and a starting rep number you can reach on the first set.',
      'Rest your usual time, then do the next set with one rep fewer at the same weight.',
      'Continue until you reach the reps you planned to stop at.',
    ],
    when: 'To accumulate quality volume at a heavy weight without grinding every set to failure. Works well for strength-focused accessory work.',
    inHerculex: 'Long-press the Down Set badge and Herculex fills the whole chain for you. Each set is counted as full working volume.',
    volume: 1,
    cns: 1,
  },
  {
    id: 'rest_pause',
    label: 'Rest-pause',
    badge: 'RP',
    category: 'hypertrophy',
    accent: '#ffb74d',
    short: 'Go to failure, breathe for 15–20 seconds, squeeze out more reps.',
    what: 'A main set taken to or near failure, followed by a very short rest (15–20 seconds) and a few more reps, often repeated two or three times. The brief pause lets you recover just enough to keep the muscle working under load.',
    how: [
      'Do a set to or near failure.',
      'Rest 15–20 seconds, racking the weight if you need to.',
      'Lift the same weight again for as many reps as you can (typically 2–4).',
      'Repeat the pause once or twice more.',
    ],
    when: 'To get a lot of hard reps into a short time on a machine or dumbbell movement, when you are short on time or one all-out set is all you plan.',
    watch: 'It is demanding on the nervous system. Do not stack it across every exercise in a session.',
    inHerculex: 'Records the total reps and the pause length. Counted as 1.0× tonnage, with 1.2× CNS load in the recovery model.',
    volume: 1,
    cns: 1.2,
  },
  {
    id: 'pause',
    label: 'Pause reps',
    badge: 'PA',
    category: 'hypertrophy',
    accent: '#4fc3f7',
    short: 'Hold the hardest position for 2–5 seconds on every rep.',
    what: 'Each rep includes a deliberate stop, usually in the stretched or bottom position, for two to five seconds. It removes the bounce out of the bottom, so the muscle has to produce the force on its own.',
    how: [
      'Lower under control to the hardest point of the movement, such as the chest on a bench press.',
      'Hold still for the planned 2, 3 or 5 seconds, staying tight.',
      'Drive up without bouncing and repeat for every rep.',
    ],
    when: 'To build strength out of the bottom position, clean up technique, or get more from lighter weights.',
    watch: 'Use lighter loads than for touch-and-go reps. Pausing makes the same weight feel much heavier.',
    inHerculex: 'Pick 2, 3 or 5 seconds when you choose the set type. Counted as 1.0× tonnage, with 1.1× CNS load.',
    volume: 1,
    cns: 1.1,
  },
  {
    id: 'myo_reps',
    label: 'Myo reps',
    badge: 'MY',
    category: 'hypertrophy',
    accent: '#81c784',
    short: 'One activation set, then short mini-sets with five breaths of rest.',
    what: 'You do one “activation” set of 10–15 reps close to failure, rest for about five deep breaths (10–20 seconds), then do several mini-sets of 3–5 reps with the same weight. The mini-sets are performed while the muscle is already fatigued, so nearly every rep is a hard, effective rep.',
    how: [
      'Activation set: 10–15 reps to failure or RPE 9, with a weight you could normally do about 12 reps with.',
      'Rest for five deep breaths, around 10–20 seconds.',
      'Do a mini-set of 3–5 reps with the same weight.',
      'Repeat the breaths and mini-sets for 3–5 rounds, or until you can no longer reach 3 reps.',
    ],
    when: 'When time is short. One myo-rep set takes a few minutes and replaces several normal sets. Best on cables, machines and isolation work where you can reset instantly.',
    watch: 'Stay with stable movements that are safe to take close to failure. Heavy free-weight compounds and anything that loads the lower back are poor choices.',
    inHerculex: 'Tracks the activation set and every mini-set, with a counter for the planned mini-sets. All effective reps count towards volume.',
    volume: 1,
    cns: 1,
  },
  {
    id: 'partials',
    label: 'Partials',
    badge: 'P½',
    category: 'hypertrophy',
    accent: '#ff8a65',
    short: 'Half-range reps after you can no longer finish full ones.',
    what: 'Reps through only part of the range of motion, such as the bottom half of a curl, performed once full-range reps are no longer possible. Partials in the stretched (lengthened) position are especially popular for growth.',
    how: [
      'Take a set to failure with full-range reps.',
      'Without resting, keep going with half-range reps in the strongest or the most stretched part of the movement.',
      'Stop when even partial reps stall.',
    ],
    when: 'To squeeze extra work out of a muscle on the end of a set, particularly on machines and cables.',
    inHerculex: 'Because the mechanical work per rep is about half, Herculex counts partial reps at 0.5× tonnage so they do not inflate your volume.',
    volume: 0.5,
    cns: 1,
  },
  {
    id: 'negatives',
    label: 'Negatives',
    badge: 'N',
    category: 'hypertrophy',
    accent: '#9575cd',
    short: 'Lift with help, lower slowly for 3–5 seconds.',
    what: 'Reps that emphasise the eccentric (lowering) phase. Muscles are stronger when lengthening than when shortening, so you can lower more than you can lift. A negative is a slow, controlled lowering of 3–5 seconds, often with a weight above your normal limit.',
    how: [
      'Get the weight to the top, with a spotter, a machine, or by using both limbs to lift it.',
      'Lower it slowly and under full control, taking 3–5 seconds.',
      'Reset and repeat for a few reps.',
    ],
    when: 'To break through a strength plateau or to build size with fewer reps, usually near the end of a session.',
    watch: 'Heavy negatives cause a lot of muscle damage and soreness. Use a spotter for anything heavy, and do not use them every session.',
    inHerculex: 'Counted at 0.75× tonnage, with a high 1.3× CNS load so recovery advice accounts for the extra fatigue.',
    volume: 0.75,
    cns: 1.3,
  },
  {
    id: 'forced',
    label: 'Forced reps',
    badge: 'F',
    category: 'hypertrophy',
    accent: '#e53935',
    short: 'A spotter helps you finish extra reps after failure.',
    what: 'When you reach failure under your own strength, a spotter gives just enough help to get past the sticking point so you can complete a few more reps.',
    how: [
      'Perform the set until you cannot complete another rep unassisted.',
      'Your spotter lifts just enough for you to finish two or three extra reps.',
      'Control the lowering on every forced rep.',
    ],
    when: 'Occasionally, on safe movements with a trusted spotter, such as a machine press or a dumbbell press.',
    watch: 'Needs a competent spotter, and is very taxing. Do not use it on a regular basis or on lifts where failure is dangerous.',
    inHerculex: 'Log your unassisted reps as normal; the assisted reps are added as “+ Forced”. Counted at 1.0× tonnage, with 1.3× CNS load.',
    volume: 1,
    cns: 1.3,
  },
  {
    id: 'cheat',
    label: 'Cheat reps',
    badge: 'CR',
    category: 'hypertrophy',
    accent: '#ff7043',
    short: 'A little controlled body swing to get past the sticking point.',
    what: 'When strict reps stop, you use a small amount of body momentum to get past the hardest part and then lower the weight slowly and strictly.',
    how: [
      'Do strict reps to failure.',
      'Use a small, controlled swing to start the lift past the sticking point.',
      'Lower the weight slowly. The lowering is where the muscle works.',
    ],
    when: 'On safe isolation movements, such as curls or lateral raises, as a finishing technique.',
    watch: 'Keep the swing small. Using the lower back to heave the weight is how people get hurt.',
    inHerculex: 'Log your strict reps as normal; the momentum reps are added as “+ Cheat”. Cheat reps count at 0.85× tonnage, with 1.25× CNS load.',
    volume: 0.85,
    cns: 1.25,
  },
  {
    id: 'pyramid',
    label: 'Pyramid set',
    badge: 'PY',
    category: 'hypertrophy',
    accent: '#4dd0e1',
    short: 'Weight goes up while reps come down (or the reverse).',
    what: 'A series of sets in which weight goes up and reps go down from set to set (a pyramid), or weight goes down and reps go up (a reverse pyramid).',
    how: [
      'Start with a lighter weight and higher reps.',
      'Add weight and reduce reps on every set, finishing on your heaviest set.',
      'For a reverse pyramid, start with the heaviest set and reduce the weight each time.',
    ],
    when: 'To combine heavy and moderate work in one exercise, and to warm up progressively into the top set.',
    inHerculex: 'Each step is logged as its own set with its own weight and reps, at 1.0× tonnage.',
    volume: 1,
    cns: 1,
  },
  {
    id: 'twenty_ones',
    label: '21s',
    badge: '21',
    category: 'hypertrophy',
    accent: '#aed581',
    short: '7 bottom-half reps, 7 top-half reps, 7 full reps, no rest.',
    what: 'A classic biceps-curl finisher done as one continuous set of 21 reps: 7 reps in the lower half of the range, 7 reps in the upper half and 7 full-range reps.',
    how: [
      'Do 7 reps in the bottom half of the movement.',
      'Straight away do 7 reps in the top half.',
      'Finish with 7 full-range reps.',
    ],
    when: 'As a pump-focused finisher on curls, leg extensions or triceps pushdowns.',
    watch: 'Use around 50–60% of your normal curl weight.',
    inHerculex: 'Recorded as one set of 21 reps at the chosen weight.',
    volume: 1,
    cns: 1,
  },
  {
    id: 'mechanical_drop',
    label: 'Mechanical drop set',
    badge: 'MD',
    category: 'hypertrophy',
    accent: '#ffd54f',
    short: 'Change the leverage instead of the weight.',
    what: 'A drop set without touching the weights. At failure you switch to a variation that is easier to lift, such as a different grip, angle or stance, and continue with the same load.',
    how: [
      'Start with the hardest variation of the exercise, for example an incline dumbbell press.',
      'At failure, move straight to an easier position, such as a flat press, with the same dumbbells.',
      'Finish in the easiest variation if you planned a third step.',
    ],
    when: 'When there is no time or room to change the weights, such as with fixed dumbbells or a loaded barbell.',
    inHerculex: 'The full load is tracked through the variation. Counted at 1.0× tonnage.',
    volume: 1,
    cns: 1,
  },
  {
    id: 'pre_exhaustion',
    label: 'Pre-exhaustion',
    badge: 'PE',
    category: 'hypertrophy',
    accent: '#90a4ae',
    short: 'An isolation exercise first, then the compound lift.',
    what: 'You fatigue a target muscle with an isolation movement and go straight to a compound exercise that trains it, so the muscle is the limiting factor and not a weaker helper.',
    how: [
      'Do a set of the isolation exercise, such as a pec deck fly.',
      'Move to the compound exercise straight away, such as a chest press.',
      'Expect to use less weight on the compound than usual.',
    ],
    when: 'When a smaller muscle (like the triceps in a bench press) tends to fail before the muscle you are trying to train.',
    inHerculex: 'Both movements are logged as normal sequential sets, at 1.0× tonnage.',
    volume: 1,
    cns: 1,
  },
  {
    id: 'volume_20x60',
    label: '20 sets @ 60%',
    badge: '20x',
    category: 'hypertrophy',
    accent: '#7986cb',
    short: 'Twenty sets at 60% of your 1RM with short, strict rest.',
    what: 'A high-volume density protocol in the spirit of German Volume Training: 20 sets of the same lift at 60% of your one-rep max, with strict rest intervals.',
    how: [
      'Work out 60% of your estimated 1RM for the lift.',
      'Do all 20 sets with that weight, resting for the same short, timed interval every time.',
      'Keep every rep clean. If form breaks down, stop.',
    ],
    when: 'In a short, dedicated block for one lift, when you want to push volume.',
    watch: 'A great deal of work for a single lift. Do not run it alongside other heavy training for the same muscles.',
    inHerculex: 'Stores the percentage and the accumulated volume. Every set counts towards tonnage.',
    volume: 1,
    cns: 1,
  },

  // ── Timed & functional ───────────────────────────────────────────────────
  {
    id: 'amrap',
    label: 'AMRAP',
    badge: 'AM',
    category: 'timed',
    accent: '#26a69a',
    short: 'As many reps (or rounds) as possible in a set time.',
    what: 'Complete as many repetitions or rounds as you can inside a fixed time cap, for example 60 seconds or 10 minutes. The result is your score.',
    how: [
      'Set the time cap and start the clock.',
      'Work through the prescribed movements, at a pace you can sustain.',
      'When time is up, record your reps or rounds.',
    ],
    when: 'For conditioning, benchmark tests, and finishing a session. Also as the last set of an exercise to test progress.',
    inHerculex: 'Stores the time cap and the completed reps or rounds. Tonnage is calculated from all completed reps.',
    volume: 1,
    cns: 1,
  },
  {
    id: 'emom',
    label: 'EMOM',
    badge: 'EM',
    category: 'timed',
    accent: '#00acc1',
    short: 'Every minute on the minute, do the same work and rest what is left.',
    what: 'At the start of every minute you perform a prescribed number of reps. Whatever time is left in that minute is your rest. As the work takes longer, rest shrinks.',
    how: [
      'Pick the movement, the reps per minute and the total number of minutes.',
      'Start the clock and complete the reps as fast as you can with good form.',
      'Rest until the next minute starts, then repeat.',
    ],
    when: 'To control pacing and rest, to practise a skill under mild fatigue, or to do a fixed amount of work in a fixed time.',
    inHerculex: 'Tracks the total minutes and the reps per minute; each minute is logged as a mini-set.',
    volume: 1,
    cns: 1,
  },
  {
    id: 'for_time',
    label: 'For time',
    badge: 'FT',
    category: 'timed',
    accent: '#00897b',
    short: 'Finish the prescribed work as fast as you can.',
    what: 'The work is fixed (for example 100 reps or a set list of movements) and you try to complete it in the shortest possible time. The stopwatch is your score.',
    how: [
      'Define the exact work to be done.',
      'Start the stopwatch and begin.',
      'Stop the clock when the last rep is done.',
    ],
    when: 'For conditioning and for measuring progress: repeat the same workout later and try to beat your time.',
    inHerculex: 'Records the elapsed time and whether you completed the work. Tonnage is counted as normal, with the time as the score.',
    volume: 1,
    cns: 1,
  },
];

export const setTypeById = Object.fromEntries(setTypes.map((t) => [t.id, t])) as Record<string, SetTypeEntry>;

/** The techniques people ask about most; they get the cards on the landing page. */
export const featuredSetTypeIds = ['drop', 'myo_reps', 'rest_pause', 'down_sets', 'partials', 'forced'] as const;

export interface TermEntry {
  term: string;
  meaning: string;
}

/** Words the techniques lean on. */
export const trainingTerms: TermEntry[] = [
  {
    term: 'Failure',
    meaning: 'The point where you cannot complete another clean rep with good form. “Near failure” means one or two reps short of it.',
  },
  {
    term: 'RPE',
    meaning: 'Rate of perceived exertion, from 1 to 10. RPE 9 means you could have done one more rep; RPE 10 is failure.',
  },
  {
    term: 'RIR',
    meaning: 'Reps in reserve: how many reps you had left. RIR 1 is the same as RPE 9.',
  },
  {
    term: '1RM',
    meaning: 'Your one-rep max, the heaviest weight you can lift once. Herculex estimates it from your sets.',
  },
  {
    term: 'Eccentric / concentric',
    meaning: 'The eccentric phase is the lowering, where the muscle lengthens under load. The concentric phase is the lifting.',
  },
  {
    term: 'Tonnage',
    meaning: 'Weight × reps added up across sets. Herculex uses it as one measure of training volume, adjusted per set type.',
  },
  {
    term: 'CNS load',
    meaning: 'How demanding a set is on your central nervous system. Herculex feeds it into the recovery model and deload advice.',
  },
];
