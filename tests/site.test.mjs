import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createMarkdown} from '../web/markdown.js';
import {makePlan, gradeBand, projectsForGrade} from '../web/finder.js';
import {createProgressStore, normalizeProgress, pathStatus, stepKey} from '../web/progress.js';

const data = JSON.parse(readFileSync(new URL('../_site/data.json', import.meta.url)));
const md = createMarkdown(data);

function memoryStorage() {
  const map = new Map();
  return {getItem: k => map.get(k) ?? null, setItem: (k, v) => map.set(k, String(v)), map};
}

test('jede Zielgruppe hat Pfade, jeder Pfad Schritte und gültige Verweise', () => {
  for (const audience of Object.keys(data.audiences)) assert.ok(data.paths.some(p => p.audience === audience), audience);
  const resources = new Set(data.resources.map(r => r.id));
  for (const path of data.paths) {
    assert.ok(path.steps.length >= 3, path.id);
    assert.ok(path.short, 'Kurztext fehlt: ' + path.id);
    assert.match(path.outcome, /Abschluss-Check/, path.id);
    for (const id of path.resources) assert.ok(resources.has(id), id);
  }
  for (const r of data.resources) assert.match(r.url, /^https:\/\//, r.id);
});

test('Lehrkräfte haben Grundlagen und alle Fachpfade, Schüler alle drei Stufen, Eltern drei Pfade', () => {
  const ids = new Set(data.paths.map(p => p.id));
  for (const id of ['L1', 'L2', 'L3', 'L4', 'FD', 'FS', 'FM', 'FI', 'FN', 'FG', 'FK', 'FR', 'S1', 'S2', 'S3', 'E1', 'E2', 'E3']) assert.ok(ids.has(id), id);
  for (const grade of [5, 6, 7, 8, 9, 10, 11, 12, 13]) assert.ok(projectsForGrade(data, grade).length >= 2, `Werkstatt Klasse ${grade}`);
});

test('Pfadfinder schlägt nur vorhandene Pfade vor und berücksichtigt Rolle, Fach und Klasse', () => {
  const teacher = makePlan(data, {rolle: 'lehrkraefte', erfahrung: 'neu', faecher: ['FM', 'FN'], werkstatt: true});
  assert.deepEqual(teacher.items.slice(0, 5), ['L1', 'L2', 'L3', 'FM', 'FN']);
  assert.ok(teacher.items.includes('L4'));
  assert.ok(!makePlan(data, {rolle: 'lehrkraefte', erfahrung: 'sicher', faecher: []}).items.includes('L1'));
  for (const grade of [5, 7, 8, 10, 11, 13]) {
    const plan = makePlan(data, {rolle: 'schueler', klasse: grade, interesse: 'bauen'});
    assert.equal(plan.items[0], gradeBand(grade));
    assert.ok(plan.items.length > 1, 'Werkstatt für Klasse ' + grade);
  }
  const parents = makePlan(data, {rolle: 'eltern', klasse: 'S2', anliegen: ['sicherheit']});
  assert.deepEqual(parents.items, ['E3', 'S2']);
  for (const plan of [teacher, parents]) for (const id of plan.items) assert.ok(plan.reasons[id]);
});

test('Fortschritt verwirft unbekannte IDs und überlebt kaputten Speicher', () => {
  const path = data.paths[0];
  const raw = {version: 1, steps: {[stepKey(path.id, 1)]: true, 'XX:1': true}, resources: {K999: true}, projects: {}, plan: {items: ['L1', 'gibtsnicht'], answers: {rolle: 'lehrkraefte'}}, lastPath: 'nope'};
  const state = normalizeProgress(raw, data);
  assert.deepEqual(Object.keys(state.steps), [stepKey(path.id, 1)]);
  assert.deepEqual(state.resources, {});
  assert.deepEqual(state.plan.items, ['L1']);
  assert.equal(state.lastPath, null);
  assert.equal(pathStatus(path, state).done, 1);
  const storage = memoryStorage();
  storage.setItem('kischule.fortschritt.v1', '{kaputt');
  const store = createProgressStore(data, storage);
  assert.equal(store.available, false);
  store.toggle('steps', stepKey(path.id, 2));
  assert.equal(store.available, true);
  assert.ok(JSON.parse(storage.map.get('kischule.fortschritt.v1')).steps[stepKey(path.id, 2)]);
});

test('Markdown verlinkt intern auf die Website und führt kein HTML aus', () => {
  assert.equal(md.hrefFor('KATALOG.md#k01', 'docs/LERNPFADE.md'), '#katalog/K01');
  assert.equal(md.hrefFor(`LERNPFADE.md#${data.paths[0].anchor}`, 'docs/KATALOG.md'), `#pfad/${data.paths[0].id}`);
  assert.equal(md.hrefFor('javascript:alert(1)'), null);
  assert.ok(!md.render('<script>alert(1)</script>').includes('<script>'));
  for (const guide of Object.values(data.guides)) assert.ok(md.render(guide.body, guide.source).length > 100, guide.source);
});
