import React, { useEffect, useState, useRef } from 'react';
import { db, doc, setDoc, onSnapshot } from './firebase';

const SHARED_DOC_PATH = ['shared', 'VoyagesDesDoudous'];

function useSharedData() {
  const [voyages, setVoyages] = useState([]);
  const [cagnotte, setCagnotte] = useState(0);
  const localWrite = useRef(false);
  const LOCAL_KEY = 'voyages_des_doudous_data';

  const loadLocal = () => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const saveLocal = (d) => {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(d));
    } catch {}
  };

  useEffect(() => {
    const local = loadLocal();
    if (local) {
      setVoyages(local.voyages || []);
      setCagnotte(local.cagnotte || 0);
    }

    const sharedDoc = doc(db, ...SHARED_DOC_PATH);
    const unsub = onSnapshot(
      sharedDoc,
      (snap) => {
        if (!snap.exists()) {
          const init = {
            cagnotte: local?.cagnotte ?? 0,
            voyages: local?.voyages ?? [],
            updatedAt: Date.now(),
          };
          setDoc(sharedDoc, init).catch(() => {});
          saveLocal(init);
          setVoyages(init.voyages);
          setCagnotte(init.cagnotte);
          return;
        }
        const data = snap.data();
        if (localWrite.current) {
          localWrite.current = false;
          return;
        }
        setVoyages(data.voyages || []);
        setCagnotte(data.cagnotte || 0);
        saveLocal({
          cagnotte: data.cagnotte || 0,
          voyages: data.voyages || [],
          updatedAt: data.updatedAt || Date.now(),
        });
      },
      (err) => console.warn(err)
    );

    return () => unsub();
  }, []);

  const pushShared = async (next) => {
    try {
      localWrite.current = true;
      const sharedDoc = doc(db, ...SHARED_DOC_PATH);
      await setDoc(sharedDoc, { ...next, updatedAt: Date.now() });
      saveLocal(next);
    } catch (e) {
      console.warn('push error', e);
      saveLocal(next);
    } finally {
      setTimeout(() => (localWrite.current = false), 500);
    }
  };

  return { voyages, setVoyages, cagnotte, setCagnotte, pushShared };
}

export default function App() {
  const { voyages, setVoyages, cagnotte, setCagnotte, pushShared } = useSharedData();
  const [nom, setNom] = useState('');
  const [date, setDate] = useState('');
  const [cost, setCost] = useState('');

  const ajouter = () => {
    if (!nom) return alert('Le nom du voyage est requis.');
    const t = {
      id: Date.now(),
      nom,
      date: date || null, // facultatif
      cost: cost ? Number(cost) : undefined,
      termine: false,
    };
    const next = { cagnotte, voyages: [...voyages, t] };
    setVoyages(next.voyages);
    pushShared(next);
    setNom('');
    setDate('');
    setCost('');
  };

  const supprimer = (id) => {
    const next = { cagnotte, voyages: voyages.filter((v) => v.id !== id) };
    setVoyages(next.voyages);
    pushShared(next);
  };

  const toggle = (id) => {
    const updated = voyages.map((v) => (v.id === id ? { ...v, termine: !v.termine } : v));
    const next = { cagnotte, voyages: updated };
    setVoyages(updated);
    pushShared(next);
  };

  const modifierCagnotte = () => {
    const input = prompt('Nouveau montant de la cagnotte (en €):', String(cagnotte));
    const val = Number(input);
    if (!isNaN(val)) {
      setCagnotte(val);
      pushShared({ cagnotte: val, voyages });
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-3xl font-bold text-center" style={{ color: '#0ea5e9' }}>
        Voyages des Doudous ✈️
      </h1>

      {/* --- Cagnotte --- */}
      <section className="mt-4 p-4 bg-blue-50 rounded">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-600">Cagnotte</div>
            <div className="text-2xl font-bold">{cagnotte} €</div>
          </div>
          <button onClick={modifierCagnotte} className="px-3 py-2 bg-sky-500 text-white rounded">
            Modifier
          </button>
        </div>
      </section>

      {/* --- Ajout voyage --- */}
      <section className="mt-4 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">➕ Ajouter un voyage</h2>
        <div className="space-y-2">
          <input
            className="w-full p-2 border rounded"
            placeholder="Nom du voyage"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
          <input
            className="w-full p-2 border rounded"
            type="number"
            placeholder="Année (optionnelle)"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            className="w-full p-2 border rounded"
            placeholder="Coût (optionnel)"
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
          <button onClick={ajouter} className="w-full bg-sky-500 text-white py-2 rounded">
            Ajouter
          </button>
        </div>
      </section>

      {/* --- Voyages en cours --- */}
      <section className="mt-4">
        <h2 className="text-xl font-semibold">🗺 Voyages en cours</h2>
        {voyages.filter((v) => !v.termine).length === 0 && <p>Aucun voyage en cours</p>}
        {voyages
          .filter((v) => !v.termine)
          .sort((a, b) => {
            if (!a.date) return 1;
            if (!b.date) return -1;
            return a.date - b.date;
          })
          .map((v) => (
            <div key={v.id} className="mt-2 p-3 bg-white rounded shadow flex justify-between items-center">
              <div>
                <div className="font-semibold">{v.nom}</div>
                <div className="text-sm text-gray-500">
                  {v.date ? v.date : '—'} {v.cost ? `• ${v.cost} €` : ''}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggle(v.id)} className="text-emerald-600">
                  ✔ Terminé
                </button>
                <button onClick={() => supprimer(v.id)} className="text-red-500">
                  🗑️
                </button>
              </div>
            </div>
          ))}
      </section>

      {/* --- Voyages terminés --- */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold">🏁 Voyages terminés</h2>
        {voyages.filter((v) => v.termine).length === 0 && <p>Aucun voyage terminé</p>}
        {voyages
          .filter((v) => v.termine)
          .sort((a, b) => {
            if (!a.date) return 1;
            if (!b.date) return -1;
            return a.date - b.date;
          })
          .map((v) => (
            <div key={v.id} className="mt-2 p-3 bg-gray-50 rounded flex justify-between items-center">
              <div>
                <div className="font-semibold">{v.nom}</div>
                <div className="text-sm text-gray-500">
                  {v.date ? v.date : '—'} {v.cost ? `• ${v.cost} €` : ''}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggle(v.id)} className="text-blue-600">
                  ↺ Remettre
                </button>
                <button onClick={() => supprimer(v.id)} className="text-red-500">
                  🗑️
                </button>
              </div>
            </div>
          ))}
      </section>

      <div className="mt-8 text-sm text-gray-500 text-center">
        <p>Les données sont synchronisées via Firebase et disponibles hors ligne.</p>
      </div>
    </div>
  );
}