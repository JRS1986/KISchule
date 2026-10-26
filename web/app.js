import {escapeHTML as e, createMarkdown} from './markdown.js';
import {createProgressStore, pathStatus, stepKey, storageKey} from './progress.js';
import {makePlan, subjects, gradeRange} from './finder.js';

const main = document.querySelector('main');
const toastBox = document.querySelector('.toast');
let data, md, store, toastTimer;

const pathById = id => data.paths.find(p => p.id === id);
const resourceById = id => data.resources.find(r => r.id === id);
const projectById = id => data.projects.find(p => p.id === id);
const targetNames = {L: 'Lehrkräfte', S1: 'Kl. 5–7', S2: 'Kl. 8–10', S3: 'Kl. 11–13', E: 'Eltern'};
const areaClass = area => ({'Grundlagen für alle': 'grund', 'Schulentwicklung': 'grund', 'Fächer': 'fach', 'Klassenstufen': 'stufe', 'Für Eltern': 'eltern'}[area] || 'grund');
const fmtHours = h => `${String(h).replace('.', ',')} h`;
const routeFor = id => pathById(id) ? `#pfad/${id}` : projectById(id) ? `#werkstatt/${id}` : `#katalog/${id}`;
const titleFor = id => pathById(id)?.title || projectById(id)?.title || resourceById(id)?.title || id;

function toast(text) {
  toastBox.textContent = text; toastBox.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toastBox.classList.remove('show'), 2600);
}

function sheet(html, cls = '') { return `<div class="sheet ${cls}">${html}</div>`; }

function pageHead(kicker, title, text = '') {
  return `<header class="page-head"><p class="kicker">${e(kicker)}</p><h1>${e(title)}</h1>${text ? `<p class="lead">${text}</p>` : ''}</header>`;
}

function accessTag(r) {
  const cls = {'Frei': 'frei', 'Kostenlos mit Konto': 'konto', 'Teilweise kostenpflichtig': 'kosten', 'Hardware nötig': 'hardware'}[r.access];
  return `<span class="tag tag-${cls}">${e(r.access)}</span>`;
}

function statusLine(path) {
  const s = pathStatus(path, store.state);
  if (!s.done) return `<span class="status">${path.steps.length} Schritte, ${fmtHours(path.hours)}</span>`;
  return `<span class="status started">${s.complete ? 'Abgeschlossen' : `${s.done} von ${s.total} abgehakt`}</span>`;
}

// Eine Zeile im Stundenplan-Stil: Farbe = Bereich, rechts der Stand.
function lesson(path) {
  return `<a class="lesson lesson-${areaClass(path.area)}" href="#pfad/${path.id}"><span class="lesson-title">${e(path.title)}</span><span class="lesson-short">${e(path.short)}</span>${statusLine(path)}</a>`;
}

function timetable() {
  const col = (aud, label, extra) => `<div class="tt-col" role="list" aria-label="${e(label)}"><h2 class="tt-day"><a href="#${aud}">${e(label)}</a></h2>${extra.join('')}</div>`;
  const by = (aud, area) => data.paths.filter(p => p.audience === aud && (!area || p.area === area));
  const teacherSubjects = by('lehrkraefte', 'Fächer');
  return `<section class="timetable" aria-label="Alle Lernpfade im Überblick">
    ${col('lehrkraefte', 'Lehrkräfte', [...by('lehrkraefte', 'Grundlagen für alle').map(lesson),
      `<a class="lesson lesson-fach" href="#lehrkraefte?bereich=faecher"><span class="lesson-title">Ihr Fach</span><span class="lesson-short">${teacherSubjects.length} Fachpfade von Deutsch bis NwT</span><span class="status">Fach wählen</span></a>`])}
    ${col('schueler', 'Schülerinnen und Schüler', [...by('schueler').map(lesson),
      `<a class="lesson lesson-werk" href="#werkstatt"><span class="lesson-title">Werkstatt</span><span class="lesson-short">${data.projects.length} Projekte mit Calliope, LEGO, Arduino</span><span class="status">Projekte ansehen</span></a>`])}
    ${col('eltern', 'Eltern', [...by('eltern').map(lesson),
      `<a class="lesson lesson-eltern" href="#info/elternabend"><span class="lesson-title">Elternabend</span><span class="lesson-short">Ablauf und Material für 90 Minuten</span><span class="status">Leitfaden öffnen</span></a>`])}
  </section>`;
}

function continueTarget() {
  const plan = store.state.plan ? makePlan(data, store.state.plan.answers).items : [];
  const candidates = [...plan.filter(id => pathById(id)), store.state.lastPath].filter(Boolean);
  for (const id of candidates) {
    const path = pathById(id); const s = pathStatus(path, store.state);
    if (!s.complete) return {path, step: s.next};
  }
  return null;
}

function home() {
  const next = continueTarget();
  main.innerHTML = `<div class="sheet home">
    <section class="hero">
      <h1>KI verstehen, sinnvoll nutzen, selbst bauen.</h1>
      <p class="lead">Lernpfade zu künstlicher Intelligenz für die ganze Schulgemeinschaft eines Gymnasiums in Baden-Württemberg: für Lehrkräfte aller Fächer, für Schülerinnen und Schüler von Klasse 5 bis 13 und für Eltern. Jeder Schritt verweist auf geprüftes, kostenloses Material, meist auf Deutsch.</p>
      <div class="hero-actions">${next ? `<a class="button primary" href="#pfad/${next.path.id}?schritt=${next.step.order}">Weiterlernen: ${e(next.path.title)}</a>` : `<a class="button primary" href="#finder">Passenden Pfad finden</a>`}<a class="button" href="#katalog">Material durchsuchen</a></div>
    </section>
    <h2 class="section-title">Der Stundenplan</h2>
    <p class="section-note">Jede Spalte ist eine Zielgruppe, jedes Feld ein Lernpfad mit Schritten zum Abhaken. Die Haken bleiben in diesem Browser gespeichert.</p>
    ${timetable()}
    <section class="principles">
      <div><h3>Für den DBG-Alltag gedacht</h3><p>Pfade orientieren sich am Bildungsplan 2016 und an der G9-Stundentafel in Baden-Württemberg, mit Fächern wie NwT, IMP und dem Aufbaukurs Informatik.</p></div>
      <div><h3>Rechtssicher statt einfach drauflos</h3><p>Datenschutz, Urheberrecht, Altersgrenzen und Prüfungsrecht sind eigene Schritte. Der <a href="#info/recht">Rechtsrahmen</a> fasst den Stand für BW mit Quellen zusammen.</p></div>
      <div><h3>Selbst bauen</h3><p>In der <a href="#werkstatt">Werkstatt</a> trainieren Kinder eigene Modelle mit Calliope mini, LEGO SPIKE oder Arduino. Für jedes Projekt gibt es eine Variante ohne Hardware-Kauf.</p></div>
    </section>
  </div>`;
}

const audienceIntro = {
  lehrkraefte: ['Für Lehrkräfte', 'Erst die Grundlagen, dann das eigene Fach.', 'Die vier Grundlagenpfade sind für alle Lehrkräfte gedacht, unabhängig vom Fach. Danach führen Fachpfade zu Unterrichtsideen, die zum Bildungsplan passen. Für Fachschaften und den Pädagogischen Tag gibt es einen <a href="#info/schule">Leitfaden für die Schule</a>.'],
  schueler: ['Für Schülerinnen und Schüler', 'Dein Pfad hängt von deiner Klasse ab.', 'Unterstufe: KI entdecken und ausprobieren. Mittelstufe: verstehen, wie Maschinen lernen, und eigene Modelle bauen. Oberstufe: die Mathematik dahinter, eigene Projekte und Wettbewerbe. Die <a href="#werkstatt">Werkstatt</a> hat Projekte zum Anfassen.'],
  eltern: ['Für Eltern', 'Mitreden, begleiten, schützen.', 'Drei kurze Pfade ohne Technikvorwissen: verstehen, was KI ist, das Lernen Ihres Kindes begleiten und Risiken wie Deepfakes oder KI-Begleiter einschätzen. Dazu eine <a href="#info/elternabend">Vorlage für einen Elternabend</a>.'],
};

function audience(aud, params) {
  const [kicker, title, text] = audienceIntro[aud];
  const paths = data.paths.filter(p => p.audience === aud);
  const areas = [...new Set(paths.map(p => p.area))];
  main.innerHTML = sheet(`${pageHead(kicker, title, text)}
    <p><a class="button" href="#finder?rolle=${aud}">Pfad mit drei Fragen auswählen</a></p>
    ${areas.map(area => `<section class="area" id="bereich-${area === 'Fächer' ? 'faecher' : 'x' + areas.indexOf(area)}"><h2 class="section-title">${e(area)}</h2><div class="lesson-list ${area === 'Fächer' ? 'grid' : ''}">${paths.filter(p => p.area === area).map(lesson).join('')}</div></section>`).join('')}
    ${aud === 'schueler' ? `<section class="area"><h2 class="section-title">Werkstatt-Projekte</h2><div class="lesson-list grid">${data.projects.map(projectCard).join('')}</div></section>` : ''}`);
  if (params.get('bereich') === 'faecher') document.getElementById('bereich-faecher')?.scrollIntoView();
}

function resourceRow(id) {
  const r = resourceById(id); if (!r) return '';
  return `<li class="resource-row"><a href="#katalog/${r.id}"><span class="resource-title">${e(r.title)}</span></a><span class="resource-meta">${e(r.provider)}${r.format ? `, ${e(r.format)}` : ''}</span>${accessTag(r)}${store.state.resources[r.id] ? '<span class="tick-mini" aria-label="erledigt">✓</span>' : ''}</li>`;
}

function projectCard(p) {
  const done = store.state.projects[p.id];
  return `<a class="lesson lesson-werk" href="#werkstatt/${p.id}"><span class="lesson-title">${e(p.title)}</span><span class="lesson-short">${e(p.short)}</span><span class="status${done ? ' started' : ''}">${done ? 'Gebaut' : `Kl. ${e(p.grades)}, ${e(p.hardware)}`}</span></a>`;
}

function pathPage(id, params) {
  const path = pathById(id);
  if (!path) return notFound();
  store.setLastPath(id);
  const s = pathStatus(path, store.state);
  const audienceName = data.audiences[path.audience];
  main.innerHTML = sheet(`${pageHead(`${audienceName}, ${path.area}`, path.title, e(path.short))}
    <p class="path-meta"><span>${fmtHours(path.hours)} insgesamt</span><span>${s.done} von ${s.total} Schritten abgehakt</span><button class="link-button" data-action="print">Drucken oder als PDF sichern</button></p>
    <div class="prose">${md.render(path.intro, 'docs/LERNPFADE.md')}</div>
    <ol class="steps">${path.steps.map(step => {
      const done = !!store.state.steps[stepKey(path.id, step.order)];
      const current = s.next && s.next.order === step.order;
      return `<li class="step${done ? ' done' : ''}${current ? ' current' : ''}" id="schritt-${step.order}">
        <span class="margin" aria-hidden="true">${done ? '<span class="tick">✓</span>' : step.order}</span>
        <div class="step-body"><p>${md.inline(step.text, 'docs/LERNPFADE.md')}</p><p class="step-meta">${fmtHours(step.hours)}${current ? ', als Nächstes dran' : ''}</p></div>
        <button class="check" data-action="step" data-path="${path.id}" data-order="${step.order}" aria-pressed="${done}">${done ? 'Haken entfernen' : 'Abhaken'}</button>
      </li>`; }).join('')}</ol>
    <div class="prose outcome">${md.render(path.outcome, 'docs/LERNPFADE.md')}</div>
    ${path.resources.length ? `<section class="area"><h2 class="section-title">Material in diesem Pfad</h2><ul class="resource-list">${path.resources.map(resourceRow).join('')}</ul></section>` : ''}
    ${path.projects.length ? `<section class="area"><h2 class="section-title">Passende Werkstatt-Projekte</h2><div class="lesson-list grid">${path.projects.map(pid => projectCard(projectById(pid))).join('')}</div></section>` : ''}
    <p class="back"><a href="#${path.audience}">Alle Pfade für ${e(audienceName)}</a></p>`);
  const target = params.get('schritt');
  if (target) document.getElementById('schritt-' + target)?.scrollIntoView({block: 'center'});
}

function catalog(params) {
  const filter = {fuer: params.get('fuer') || '', zugang: params.get('zugang') || '', q: params.get('q') || ''};
  const options = (name, values, current, all) => `<select name="${name}" aria-label="${all}"><option value="">${all}</option>${values.map(([v, l]) => `<option value="${e(v)}"${v === current ? ' selected' : ''}>${e(l)}</option>`).join('')}</select>`;
  const words = filter.q.toLowerCase().split(/\s+/).filter(Boolean);
  const hits = data.resources.filter(r => (!filter.fuer || r.targets.includes(filter.fuer)) && (!filter.zugang || r.access === filter.zugang)
    && words.every(w => `${r.title} ${r.provider} ${r.category} ${r.format} ${r.scope} ${r.notes}`.toLowerCase().includes(w)));
  const categories = [...new Set(hits.map(r => r.category))];
  main.innerHTML = sheet(`${pageHead('Material', 'Alles, worauf die Pfade verweisen.', `${data.resources.length} geprüfte Kurse, Unterrichtsmaterialien, Leitfäden und Werkzeuge. Stand der Prüfung: ${new Date(data.reviewed).toLocaleDateString('de-DE', {day: 'numeric', month: 'long', year: 'numeric'})}.`)}
    <form class="filters" role="search">
      <input type="search" name="q" value="${e(filter.q)}" placeholder="Suchen, z. B. Deepfake, Mathe, Calliope" aria-label="Material durchsuchen">
      ${options('fuer', Object.entries(targetNames), filter.fuer, 'Für alle')}
      ${options('zugang', ['Frei', 'Kostenlos mit Konto', 'Teilweise kostenpflichtig', 'Hardware nötig'].map(a => [a, a]), filter.zugang, 'Jeder Zugang')}
    </form>
    <p class="count" aria-live="polite">${hits.length} von ${data.resources.length} Einträgen</p>
    ${categories.map(c => `<section class="area"><h2 class="section-title">${e(c)}</h2><ul class="resource-list">${hits.filter(r => r.category === c).map(r => resourceRow(r.id)).join('')}</ul></section>`).join('') || '<p class="empty">Kein Eintrag passt. Entfernen Sie einen Filter oder suchen Sie nach einem allgemeineren Begriff.</p>'}
    <section class="area"><h2 class="section-title">Zugang auf einen Blick</h2><p><span class="tag tag-frei">Frei</span> ohne Konto nutzbar. <span class="tag tag-konto">Kostenlos mit Konto</span> Registrierung nötig, für Schüler Altersgrenzen beachten. <span class="tag tag-kosten">Teilweise kostenpflichtig</span> Grundangebot frei, Rest kostet. <span class="tag tag-hardware">Hardware nötig</span> Material ist frei, Geräte müssen vorhanden sein.</p></section>`);
  const form = main.querySelector('.filters');
  const apply = () => { const p = new URLSearchParams([...new FormData(form)].filter(([, v]) => v)); history.replaceState(null, '', '#katalog' + (p.size ? '?' + p : '')); catalog(p); const q = main.querySelector('[name=q]'); q.focus(); q.setSelectionRange(q.value.length, q.value.length); };
  form.addEventListener('submit', ev => { ev.preventDefault(); apply(); });
  form.querySelectorAll('select').forEach(s => s.addEventListener('change', apply));
  let typing; form.querySelector('[name=q]').addEventListener('input', () => { clearTimeout(typing); typing = setTimeout(apply, 250); });
}

function resourcePage(id) {
  const r = resourceById(id);
  if (!r) return notFound();
  const usedIn = [...data.paths.filter(p => p.resources.includes(id)), ...data.projects.filter(p => p.resources.includes(id))];
  const done = !!store.state.resources[id];
  main.innerHTML = sheet(`${pageHead(r.category, r.title, e(r.provider))}
    <p class="path-meta">${accessTag(r)}<span>${e(r.targets.map(t => targetNames[t]).join(', '))}</span><span>${e([r.format, r.scope].filter(Boolean).join(', '))}</span></p>
    <div class="prose"><p>${md.inline(r.notes, 'docs/KATALOG.md')}</p></div>
    <p class="hero-actions"><a class="button primary" href="${e(r.url)}" target="_blank" rel="noopener noreferrer">Beim Anbieter öffnen</a><button class="button" data-action="resource" data-id="${r.id}" aria-pressed="${done}">${done ? 'Als offen markieren' : 'Als erledigt markieren'}</button></p>
    ${usedIn.length ? `<section class="area"><h2 class="section-title">Kommt vor in</h2><div class="lesson-list grid">${usedIn.map(p => pathById(p.id) ? lesson(p) : projectCard(p)).join('')}</div></section>` : ''}
    <p class="back"><a href="#katalog">Zum gesamten Material</a></p>`);
}

function workshop(params) {
  const stufe = params.get('stufe') || '';
  const bands = [['5', 'Klasse 5–7'], ['8', 'Klasse 8–10'], ['11', 'Klasse 11–13']];
  const shown = data.projects.filter(p => { if (!stufe) return true; const [from, to] = gradeRange(p.grades); const g = Number(stufe); return to >= g && from <= g + 2; });
  main.innerHTML = sheet(`${pageHead('Werkstatt', 'KI zum Anfassen.', 'Projekte, bei denen Schülerinnen und Schüler selbst Daten sammeln, Modelle trainieren und sehen, wo sie versagen. Geeignet für NwT, IMP, Informatik, Physik, AGs und Projekttage. Jedes Projekt nennt Kosten und eine Variante ohne Hardware.')}
    <div class="chips" role="group" aria-label="Nach Klassenstufe filtern"><a class="chip${!stufe ? ' active' : ''}" href="#werkstatt">Alle</a>${bands.map(([v, l]) => `<a class="chip${stufe === v ? ' active' : ''}" href="#werkstatt?stufe=${v}">${l}</a>`).join('')}</div>
    <div class="lesson-list grid">${shown.map(projectCard).join('')}</div>
    <p class="section-note">Welche Ausstattung sich für eine Schule lohnt, steht im <a href="#info/schule">Leitfaden für die Schule</a>.</p>`);
}

function projectPage(id) {
  const p = projectById(id);
  if (!p) return notFound();
  const done = !!store.state.projects[id];
  main.innerHTML = sheet(`${pageHead(`Werkstatt, Klasse ${p.grades}`, p.title, e(p.short))}
    <dl class="facts"><div><dt>Klassenstufe</dt><dd>${e(p.grades)}</dd></div><div><dt>Wo es passt</dt><dd>${e(p.place)}</dd></div><div><dt>Hardware</dt><dd>${e(p.hardware)}</dd></div><div><dt>Kosten</dt><dd>${e(p.cost)}</dd></div><div><dt>Dauer</dt><dd>${e(p.duration)}</dd></div></dl>
    <div class="prose">${md.render(p.body, 'docs/WERKSTATT.md')}</div>
    <p class="hero-actions"><button class="button primary" data-action="project" data-id="${p.id}" aria-pressed="${done}">${done ? 'Doch noch nicht gebaut' : 'Haben wir gebaut'}</button><button class="button" data-action="print">Drucken</button></p>
    ${p.resources.length ? `<section class="area"><h2 class="section-title">Anleitungen und Werkzeuge</h2><ul class="resource-list">${p.resources.map(resourceRow).join('')}</ul></section>` : ''}
    <p class="back"><a href="#werkstatt">Alle Werkstatt-Projekte</a></p>`);
}

function finder(params) {
  const saved = store.state.plan?.answers || {};
  const a = {rolle: params.get('rolle') || saved.rolle || '', ...saved};
  if (params.get('rolle')) a.rolle = params.get('rolle');
  const radio = (name, value, label, current) => `<label class="option"><input type="radio" name="${name}" value="${value}"${current === value ? ' checked' : ''}> ${e(label)}</label>`;
  const check = (name, value, label, list = []) => `<label class="option"><input type="checkbox" name="${name}" value="${value}"${list.includes(value) ? ' checked' : ''}> ${e(label)}</label>`;
  main.innerHTML = sheet(`${pageHead('Pfadfinder', 'Welcher Pfad passt?', 'Zwei bis drei Fragen. Die Antworten bleiben in diesem Browser und dienen nur dazu, eine Reihenfolge vorzuschlagen. Es gibt keine Bewertung.')}
    <form class="finder">
      <fieldset><legend>Ich bin …</legend>${radio('rolle', 'lehrkraefte', 'Lehrkraft', a.rolle)}${radio('rolle', 'schueler', 'Schülerin oder Schüler', a.rolle)}${radio('rolle', 'eltern', 'Mutter, Vater oder erziehungsberechtigt', a.rolle)}</fieldset>
      <div data-for="lehrkraefte" ${a.rolle === 'lehrkraefte' ? '' : 'hidden'}>
        <fieldset><legend>Wie vertraut sind Sie mit KI-Werkzeugen?</legend>${radio('erfahrung', 'neu', 'Kaum ausprobiert', a.erfahrung || 'neu')}${radio('erfahrung', 'etwas', 'Gelegentlich genutzt', a.erfahrung)}${radio('erfahrung', 'sicher', 'Nutze ich regelmäßig für den Unterricht', a.erfahrung)}</fieldset>
        <fieldset><legend>Welche Fächer unterrichten Sie?</legend>${subjects.map(([id, l]) => check('faecher', id, l, a.faecher)).join('')}</fieldset>
        <fieldset><legend>Was trifft außerdem zu?</legend>${check('werkstatt', 'ja', 'Mich interessieren Projekte mit Calliope, LEGO oder Arduino', a.werkstatt ? ['ja'] : [])}${check('leitung', 'ja', 'Ich bin in Schulleitung, Steuergruppe oder KI-Gruppe', a.leitung ? ['ja'] : [])}</fieldset>
      </div>
      <div data-for="schueler" ${a.rolle === 'schueler' ? '' : 'hidden'}>
        <fieldset><legend>In welcher Klasse bist du?</legend><select name="klasse" aria-label="Klasse">${[5,6,7,8,9,10,11,12,13].map(k => `<option value="${k}"${Number(a.klasse) === k ? ' selected' : ''}>Klasse ${k}</option>`).join('')}</select></fieldset>
        <fieldset><legend>Was willst du am liebsten?</legend>${radio('interesse', 'verstehen', 'Verstehen, wie KI funktioniert', a.interesse || 'verstehen')}${radio('interesse', 'bauen', 'Selbst etwas bauen oder programmieren', a.interesse)}${radio('interesse', 'wettbewerb', 'Richtig tief einsteigen, vielleicht bei einem Wettbewerb', a.interesse)}</fieldset>
      </div>
      <div data-for="eltern" ${a.rolle === 'eltern' ? '' : 'hidden'}>
        <fieldset><legend>In welcher Stufe ist Ihr Kind?</legend>${radio('kind', 'S1', 'Klasse 5–7', a.kind || 'S1')}${radio('kind', 'S2', 'Klasse 8–10', a.kind)}${radio('kind', 'S3', 'Klasse 11–13', a.kind)}</fieldset>
        <fieldset><legend>Was ist Ihnen wichtig?</legend>${check('anliegen', 'verstehen', 'Selbst verstehen, was KI ist', a.anliegen)}${check('anliegen', 'begleiten', 'Mein Kind beim Lernen mit KI begleiten', a.anliegen)}${check('anliegen', 'sicherheit', 'Risiken kennen und mein Kind schützen', a.anliegen)}</fieldset>
      </div>
      <button class="button primary" type="submit">Reihenfolge vorschlagen</button>
    </form>
    <div id="plan-result">${store.state.plan ? planList(store.state.plan.answers) : ''}</div>`);
  const form = main.querySelector('.finder');
  form.addEventListener('change', ev => { if (ev.target.name === 'rolle') form.querySelectorAll('[data-for]').forEach(div => div.hidden = div.dataset.for !== ev.target.value); });
  form.addEventListener('submit', ev => {
    ev.preventDefault();
    const fd = new FormData(form);
    const answers = {rolle: fd.get('rolle')};
    if (!answers.rolle) { toast('Bitte zuerst auswählen, wer Sie sind.'); return; }
    if (answers.rolle === 'lehrkraefte') Object.assign(answers, {erfahrung: fd.get('erfahrung'), faecher: fd.getAll('faecher'), werkstatt: fd.get('werkstatt') === 'ja', leitung: fd.get('leitung') === 'ja'});
    if (answers.rolle === 'schueler') Object.assign(answers, {klasse: Number(fd.get('klasse')), interesse: fd.get('interesse')});
    if (answers.rolle === 'eltern') Object.assign(answers, {klasse: fd.get('kind'), anliegen: fd.getAll('anliegen')});
    const plan = makePlan(data, answers);
    store.setPlan({items: plan.items, answers});
    main.querySelector('#plan-result').innerHTML = planList(answers);
    main.querySelector('#plan-result').scrollIntoView({behavior: 'smooth', block: 'start'});
    toast('Vorschlag gespeichert. Er steht auch unter „Mein Heft“.');
  });
}

function planList(answers) {
  const plan = makePlan(data, answers);
  if (!plan.items.length) return '';
  return `<section class="area plan"><h2 class="section-title">Ihr Vorschlag</h2><ol class="plan-list">${plan.items.map(id => {
    const path = pathById(id); const s = path ? pathStatus(path, store.state) : null;
    return `<li><a href="${routeFor(id)}">${e(titleFor(id))}</a><span>${e(plan.reasons[id])}</span>${path ? `<span class="status${s.done ? ' started' : ''}">${s.complete ? 'Abgeschlossen' : `${fmtHours(path.hours)}, ${s.done} von ${s.total} abgehakt`}</span>` : ''}</li>`;
  }).join('')}</ol></section>`;
}

function progressPage() {
  const started = data.paths.filter(p => pathStatus(p, store.state).done);
  const resources = Object.keys(store.state.resources);
  const projects = Object.keys(store.state.projects);
  const next = continueTarget();
  main.innerHTML = sheet(`${pageHead('Mein Heft', 'Was schon abgehakt ist.', 'Alles auf dieser Seite liegt nur in diesem Browser. Wer das Gerät wechselt, sichert das Heft als Datei und lädt es dort wieder.')}
    ${next ? `<p><a class="button primary" href="#pfad/${next.path.id}?schritt=${next.step.order}">Weiterlernen: ${e(next.path.title)}, Schritt ${next.step.order}</a></p>` : '<p class="empty">Noch nichts begonnen. Der <a href="#finder">Pfadfinder</a> schlägt eine Reihenfolge vor.</p>'}
    ${store.state.plan ? planList(store.state.plan.answers) : ''}
    <section class="area"><h2 class="section-title">Begonnene Pfade</h2>${started.length ? `<div class="lesson-list grid">${started.map(lesson).join('')}</div>` : '<p class="empty">Noch kein Schritt abgehakt.</p>'}</section>
    <section class="area"><h2 class="section-title">Erledigtes Material</h2>${resources.length ? `<ul class="resource-list">${resources.map(resourceRow).join('')}</ul>` : '<p class="empty">Noch nichts als erledigt markiert.</p>'}</section>
    ${projects.length ? `<section class="area"><h2 class="section-title">Gebaute Projekte</h2><div class="lesson-list grid">${projects.map(id => projectCard(projectById(id))).join('')}</div></section>` : ''}
    <section class="area"><h2 class="section-title">Sichern und übertragen</h2>
      <p class="hero-actions"><button class="button" data-action="export">Heft als Datei sichern</button><label class="button">Gesichertes Heft laden<input type="file" accept="application/json,.json" data-action="import" hidden></label><button class="button danger" data-action="reset">Alles löschen</button></p>
      <p class="section-note">Die Datei enthält Haken, Pfadfinder-Antworten und erledigte Einträge, keine persönlichen Angaben.</p></section>`);
}

function guide(id, params) {
  const g = data.guides[id];
  if (!g) return notFound();
  main.innerHTML = sheet(`<article class="prose guide">${md.render(g.body, g.source)}</article><p class="back"><a href="${data.repository}/blob/main/${g.source}" target="_blank" rel="noopener noreferrer">Quelle auf GitHub bearbeiten</a></p>`);
  const section = params.get('abschnitt');
  if (section) document.getElementById(section)?.scrollIntoView();
}

function notFound() {
  main.innerHTML = sheet(`${pageHead('Nicht gefunden', 'Diese Seite gibt es nicht.', 'Der Link ist vielleicht veraltet. Auf der <a href="#start">Startseite</a> sind alle Pfade im Stundenplan.')}`);
}

function route() {
  const [hash, query] = (location.hash.slice(1) || 'start').split('?');
  const [page, id] = hash.split('/');
  const params = new URLSearchParams(query || '');
  document.querySelectorAll('[data-nav]').forEach(a => a.toggleAttribute('aria-current', a.dataset.nav === page || (page === 'pfad' && pathById(id)?.audience === a.dataset.nav)));
  document.body.classList.remove('menu-open');
  document.querySelector('.menu-toggle').setAttribute('aria-expanded', 'false');
  const views = {
    start: home, lehrkraefte: () => audience('lehrkraefte', params), schueler: () => audience('schueler', params), eltern: () => audience('eltern', params),
    pfad: () => pathPage(id, params), katalog: () => id ? resourcePage(decodeURIComponent(id)) : catalog(params),
    werkstatt: () => id ? projectPage(id) : workshop(params), finder: () => finder(params), fortschritt: progressPage, info: () => guide(id, params),
  };
  (views[page] || notFound)();
  const heading = main.querySelector('h1')?.textContent;
  document.title = heading && page !== 'start' ? `${heading} – KI-Schule` : 'KI-Schule – Lernpfade für die Schulgemeinschaft';
  if (!params.get('schritt') && !params.get('abschnitt') && !(page === 'katalog' && !id && query)) { window.scrollTo(0, 0); main.focus({preventScroll: true}); }
}

main.addEventListener('click', ev => {
  const el = ev.target.closest('[data-action]');
  if (!el || el.tagName === 'INPUT') return;
  const action = el.dataset.action;
  if (action === 'print') return window.print();
  if (action === 'step') {
    const done = store.toggle('steps', stepKey(el.dataset.path, Number(el.dataset.order)));
    const path = pathById(el.dataset.path);
    pathPage(path.id, new URLSearchParams(`schritt=${el.dataset.order}`));
    toast(pathStatus(path, store.state).complete ? 'Pfad abgeschlossen. Prima!' : done ? 'Abgehakt.' : 'Haken entfernt.');
    main.querySelector(`[data-order="${el.dataset.order}"]`)?.focus();
  }
  if (action === 'resource' || action === 'project') {
    const done = store.toggle(action === 'resource' ? 'resources' : 'projects', el.dataset.id);
    route(); toast(done ? 'Gespeichert.' : 'Markierung entfernt.');
  }
  if (action === 'export') {
    const blob = new Blob([JSON.stringify({...store.state, exported: new Date().toISOString(), app: 'KI-Schule'}, null, 2)], {type: 'application/json'});
    const link = Object.assign(document.createElement('a'), {href: URL.createObjectURL(blob), download: `ki-schule-heft-${new Date().toISOString().slice(0, 10)}.json`});
    link.click(); URL.revokeObjectURL(link.href); toast('Heft gesichert.');
  }
  if (action === 'reset' && confirm('Alle Haken, Markierungen und Pfadfinder-Antworten in diesem Browser löschen?')) { store.reset(); route(); toast('Heft geleert.'); }
});

main.addEventListener('change', async ev => {
  if (ev.target.dataset.action !== 'import' || !ev.target.files[0]) return;
  try {
    const raw = JSON.parse(await ev.target.files[0].text());
    if (raw.app !== 'KI-Schule') throw new Error('fremd');
    if (!confirm('Das gesicherte Heft ersetzt den aktuellen Stand in diesem Browser. Fortfahren?')) return;
    store.replace(raw); route(); toast('Heft geladen.');
  } catch { toast('Diese Datei ist kein gesichertes KI-Schule-Heft.'); }
});

document.querySelector('.menu-toggle').addEventListener('click', ev => {
  const open = document.body.classList.toggle('menu-open');
  ev.currentTarget.setAttribute('aria-expanded', String(open));
});

window.addEventListener('storage', ev => { if (ev.key === storageKey) { store.reload(); route(); } });

async function start() {
  try {
    data = await (await fetch('./data.json')).json();
  } catch {
    main.innerHTML = sheet('<p class="empty">Die Inhalte konnten nicht geladen werden. Bitte die Seite neu laden.</p>');
    return;
  }
  md = createMarkdown(data);
  store = createProgressStore(data);
  document.getElementById('storage-warning').hidden = store.available;
  window.addEventListener('hashchange', route);
  route();
}
start();
