import { useState } from 'react';

export function SummaryButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} style={S.fab} title="Samenvatting">📚</button>

      {open && (
        <div style={S.overlay} onClick={() => setOpen(false)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <button onClick={() => setOpen(false)} style={S.close}>✖</button>

            <h1 style={S.h1}>📚 Hoofdstuk 3 — Eindcheck</h1>
            <p style={S.sub}>Alles wat je moet weten voor de toets 💪</p>

            <div style={{ ...S.section, ...S.sectionMust }}>
              <h2 style={S.sectionTitle}>✅ ZEKER KENNEN</h2>

              <h3 style={S.h3}>Definities</h3>
              <div style={S.deflist}>
                <div style={S.defItem}><b>Soort</b> = organismen die samen <i>vruchtbare</i> nakomelingen krijgen</div>
                <div style={S.defItem}><b>Biodiversiteit</b> = verscheidenheid aan leven op aarde</div>
                <div style={S.defItem}><b>Evolutie</b> = verandering van soorten over generaties</div>
                <div style={S.defItem}><b>Natuurlijke selectie</b> = omgeving 'kiest' wie overleeft</div>
                <div style={S.defItem}><b>Mutatie</b> = toevallige verandering in DNA</div>
                <div style={S.defItem}><b>Fossiel</b> = versteende rest van organisme uit het verleden</div>
                <div style={S.defItem}><b>Stamboom</b> = laat zien hoe soorten verwant zijn</div>
                <div style={S.defItem}><b>Massa-extinctie</b> = veel soorten tegelijk uitsterven</div>
              </div>

              <h3 style={S.h3}>🔑 Formules</h3>
              <div style={S.formula}>Evolutie = Mutatie + Natuurlijke selectie + Tijd</div>
              <div style={S.formula}>Nieuwe soort = Isolatie + Tijd + Selectie (I-T-S)</div>
              <div style={S.formula}>Diepere aardlaag = ouder fossiel</div>

              <h3 style={S.h3}>Volgorde van leven (oud → nieuw)</h3>
              <ol style={S.list}>
                <li>Bacteriën in zee (3,8 miljard jaar)</li>
                <li>Planten op land</li>
                <li>Dinosaurussen (~230 → 66 milj. jaar)</li>
                <li>Mensen (~300.000 jaar)</li>
              </ol>

              <h3 style={S.h3}>5 Rijken</h3>
              <p style={S.text}>Planten · Dieren · Schimmels · Bacteriën · Protisten</p>

              <h3 style={S.h3}>Bewijzen voor evolutie (noem er minstens 2)</h3>
              <ul style={S.list}>
                <li>Fossielen tonen geleidelijke verandering</li>
                <li>DNA-overeenkomsten tussen soorten</li>
                <li>Homologe organen (mens/walvis/vleermuis = zelfde botten)</li>
                <li>Levende evolutie (resistente bacteriën, berkenspanner)</li>
              </ul>
            </div>

            <div style={{ ...S.section, ...S.sectionBonus }}>
              <h2 style={S.sectionTitle}>⭐ EXTRA WETEN (hogere punten)</h2>

              <h3 style={S.h3}>⚠️ Klassieke valkuilen</h3>
              <ul style={S.list}>
                <li>❌ Mens stamt af van apen → ✅ gemeenschappelijke voorouder</li>
                <li>❌ Mutaties ontstaan dóór omgeving (Lamarck) → ✅ toevallig, selectie kiest</li>
                <li>❌ 'Survival of the fittest' = sterkste → ✅ best aangepast</li>
                <li>❌ Ander uiterlijk = andere soort → ✅ telt alleen vruchtbare nakomelingen</li>
              </ul>

              <h3 style={S.h3}>📝 Stappen voor "leg uit"-vragen</h3>
              <div style={S.step}>
                <b>Antibiotica / insecticide resistentie:</b><br />
                mutatie → resistente overleven → planten zich voort → na generaties iedereen resistent
              </div>
              <div style={S.step}>
                <b>Eutrofiëring (sloot):</b><br />
                mest → algenbloei → troebel → planten dood → afbraak verbruikt zuurstof → dieren dood
              </div>
              <div style={S.step}>
                <b>Soortvorming (nieuwe soort):</b><br />
                isolatie → andere selectiedruk + mutaties → veranderingen → geen vruchtbare nakomelingen → 2 soorten
              </div>

              <h3 style={S.h3}>Begrippen voor een 9+</h3>
              <ul style={S.list}>
                <li><b>Convergente evolutie</b> — walvis vs vis: lijken door zelfde omgeving</li>
                <li><b>Genetische diversiteit</b> — laag = kwetsbaar (Gros Michel banaan, panda's)</li>
                <li><b>6e massa-extinctie</b> — veroorzaakt door 1 soort: de mens</li>
                <li><b>Lege niches</b> — geven ruimte voor nieuwe soorten (zoogdieren na dino's)</li>
                <li><b>Fossiel leeftijd</b> — aardlaag (relatief) + radioactief verval (absoluut)</li>
              </ul>
            </div>

            <div style={S.tip}>
              🎯 <b>Toets-tip:</b> bij "leg uit"-vragen → noem ALLE stappen. Punten worden per stap gegeven.
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const S: Record<string, React.CSSProperties> = {
  fab: { position: 'fixed', bottom: 20, right: 20, width: 56, height: 56, borderRadius: '50%', border: 'none', background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: 'white', fontSize: 26, cursor: 'pointer', boxShadow: '0 8px 24px rgba(124,58,237,0.4)', zIndex: 100, fontFamily: 'inherit' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 999, padding: 20, overflowY: 'auto' },
  modal: { background: 'white', borderRadius: 20, padding: 24, paddingTop: 32, maxWidth: 700, width: '100%', position: 'relative', fontFamily: '"Comic Sans MS", "Segoe UI", system-ui, sans-serif', color: '#1f2937', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', margin: '20px auto' },
  close: { position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: '50%', border: 'none', background: '#f3f4f6', fontSize: 16, cursor: 'pointer', color: '#4b5563' },
  h1: { fontSize: 26, color: '#5b21b6', fontWeight: 900, margin: '0 0 4px', textAlign: 'center' },
  sub: { color: '#6b7280', textAlign: 'center', marginBottom: 20, marginTop: 0 },
  section: { borderRadius: 16, padding: 16, marginBottom: 16 },
  sectionMust: { background: '#d1fae5', border: '2px solid #34d399' },
  sectionBonus: { background: '#fef3c7', border: '2px solid #fbbf24' },
  sectionTitle: { fontSize: 18, fontWeight: 800, marginTop: 0, marginBottom: 12 },
  h3: { fontSize: 15, fontWeight: 800, color: '#5b21b6', marginTop: 16, marginBottom: 8 },
  deflist: { display: 'flex', flexDirection: 'column', gap: 8 },
  defItem: { padding: 8, background: 'white', borderRadius: 8, fontSize: 14, lineHeight: 1.5 },
  formula: { padding: '10px 14px', background: 'linear-gradient(135deg, #ddd6fe, #fbcfe8)', borderRadius: 10, fontWeight: 700, color: '#5b21b6', marginBottom: 8, fontSize: 15, textAlign: 'center' },
  list: { margin: '4px 0 0', paddingLeft: 20, fontSize: 14, lineHeight: 1.7 },
  text: { fontSize: 15, fontWeight: 600, color: '#374151', margin: '4px 0 0' },
  step: { padding: 12, background: 'white', borderRadius: 10, marginBottom: 10, fontSize: 14, lineHeight: 1.6 },
  tip: { background: 'linear-gradient(135deg, #fef3c7, #fde68a)', border: '2px dashed #f59e0b', borderRadius: 12, padding: 14, fontSize: 14, color: '#78350f' },
};
