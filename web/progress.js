// Lernstand lokal im Browser. Kein Konto, kein Server, keine Übertragung.
export const storageKey = 'kischule.fortschritt.v1';
export const stepKey = (pathId, order) => `${pathId}:${order}`;

export function emptyProgress() {
  return {version: 1, steps: {}, resources: {}, projects: {}, plan: null, lastPath: null};
}

// Übernimmt nur bekannte IDs, damit alte oder fremde Daten nichts kaputtmachen.
export function normalizeProgress(raw, data) {
  const result = emptyProgress();
  if (!raw || typeof raw !== 'object' || raw.version !== 1) return result;
  const steps = new Set(data.paths.flatMap(p => p.steps.map(s => stepKey(p.id, s.order))));
  const resources = new Set(data.resources.map(r => r.id));
  const projects = new Set(data.projects.map(p => p.id));
  const paths = new Set(data.paths.map(p => p.id));
  for (const [key, set, target] of [['steps', steps, result.steps], ['resources', resources, result.resources], ['projects', projects, result.projects]])
    for (const [id, done] of Object.entries(raw[key] || {})) if (set.has(id) && done === true) target[id] = true;
  if (Array.isArray(raw.plan?.items)) {
    const items = raw.plan.items.filter(id => paths.has(id) || projects.has(id));
    if (items.length) result.plan = {items, summary: String(raw.plan.summary || '').slice(0, 300), answers: raw.plan.answers && typeof raw.plan.answers === 'object' ? raw.plan.answers : {}};
  }
  if (paths.has(raw.lastPath)) result.lastPath = raw.lastPath;
  return result;
}

export function createProgressStore(data, storage = globalThis.localStorage) {
  let available = true;
  let state;
  try { state = normalizeProgress(JSON.parse(storage.getItem(storageKey) || 'null'), data); }
  catch { available = false; state = emptyProgress(); }
  const save = () => {
    try { storage.setItem(storageKey, JSON.stringify(state)); available = true; }
    catch { available = false; }
  };
  return {
    get state() { return state; },
    get available() { return available; },
    toggle(kind, id) { if (state[kind][id]) delete state[kind][id]; else state[kind][id] = true; save(); return !!state[kind][id]; },
    setPlan(plan) { state.plan = plan; save(); },
    setLastPath(id) { state.lastPath = id; save(); },
    replace(raw) { state = normalizeProgress(raw, data); save(); return state; },
    reset() { state = emptyProgress(); save(); },
    reload() { try { state = normalizeProgress(JSON.parse(storage.getItem(storageKey) || 'null'), data); } catch { /* bleibt */ } },
  };
}

export function pathStatus(path, state) {
  const done = path.steps.filter(s => state.steps[stepKey(path.id, s.order)]).length;
  const next = path.steps.find(s => !state.steps[stepKey(path.id, s.order)]) || null;
  return {done, total: path.steps.length, complete: done === path.steps.length, next};
}
