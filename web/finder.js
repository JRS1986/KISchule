// Pfadfinder: wenige Fragen, nachvollziehbare Regeln, keine Bewertung von Personen.
export const subjects = [
  ['FD', 'Deutsch'], ['FS', 'Fremdsprachen'], ['FM', 'Mathematik'], ['FI', 'Informatik, IMP, Medienbildung'],
  ['FN', 'Biologie, Chemie, Physik, NwT'], ['FG', 'Geschichte, Geographie, Gemeinschaftskunde, WBS'],
  ['FK', 'Kunst und Musik'], ['FR', 'Religion, Ethik, Philosophie'],
];

export const gradeBand = grade => grade <= 7 ? 'S1' : grade <= 10 ? 'S2' : 'S3';

// "5–7", "8–13" oder "11–13" → [von, bis]
export function gradeRange(text) {
  const found = String(text).match(/(\d+)\s*[–-]\s*(\d+)/);
  return found ? [Number(found[1]), Number(found[2])] : [5, 13];
}

export function projectsForGrade(data, grade) {
  return data.projects.filter(p => { const [from, to] = gradeRange(p.grades); return grade >= from && grade <= to; });
}

export function makePlan(data, answers) {
  const known = id => data.paths.some(p => p.id === id) || data.projects.some(p => p.id === id);
  const items = [];
  const reasons = {};
  const add = (id, reason) => { if (known(id) && !items.includes(id)) { items.push(id); reasons[id] = reason; } };
  if (answers.rolle === 'lehrkraefte') {
    if (answers.erfahrung !== 'sicher') add('L1', 'Grundlage: wie KI-Werkzeuge arbeiten und wo sie scheitern.');
    add('L2', 'Pflicht für alle: Datenschutz, Urheberrecht und Prüfungsrecht in Baden-Württemberg.');
    if (answers.erfahrung !== 'sicher') add('L3', 'Unterricht vorbereiten und differenzieren, Schritt für Schritt.');
    for (const id of answers.faecher || []) add(id, 'Ihr Fach: konkrete Unterrichtsideen und Material.');
    add('L4', 'Aufgaben und Leistungsnachweise so gestalten, dass Lernen sichtbar bleibt.');
    if (answers.leitung) add('L5', 'KI-Leitlinie, Pädagogischer Tag und Fortbildungsplan für die Schule.');
    if (answers.werkstatt) for (const id of ['W2', 'W4', 'W6']) add(id, 'Werkstatt-Projekt ohne Hardware-Kauf oder mit vorhandenen Geräten.');
  } else if (answers.rolle === 'schueler') {
    const grade = Number(answers.klasse) || 5;
    add(gradeBand(grade), `Dein Pfad für Klasse ${grade}.`);
    if (answers.interesse === 'bauen') for (const p of projectsForGrade(data, grade).slice(0, 3)) add(p.id, 'Selbst bauen und ausprobieren.');
    if (answers.interesse === 'wettbewerb' && grade >= 8) add('S3', 'Wettbewerbe und Vertiefung, wenn du schneller weiter willst.');
  } else if (answers.rolle === 'eltern') {
    const wishes = answers.anliegen?.length ? answers.anliegen : ['verstehen', 'begleiten', 'sicherheit'];
    if (wishes.includes('verstehen')) add('E1', 'Verstehen, was KI ist: vom Navi über den Feed bis zum Chatbot.');
    if (wishes.includes('begleiten')) add('E2', 'Lernen mit KI begleiten: Hausaufgaben, Regeln, Gespräche.');
    if (wishes.includes('sicherheit')) add('E3', 'Deepfakes, Betrug und KI-Begleiter: Risiken erkennen und handeln.');
    if (answers.klasse) add(answers.klasse, 'Zum Mitlesen: was Ihr Kind in seiner Stufe lernen kann.');
  }
  return {items, reasons};
}
