"use client";

import { useState, useEffect } from "react";

interface Trip {
  name: string;
  cost: number;
}

export default function Home() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [newTrip, setNewTrip] = useState({ name: "", cost: "" });
  const [savings, setSavings] = useState<number>(0);

  // Charger les données depuis localStorage au démarrage
  useEffect(() => {
    const savedTrips = localStorage.getItem("trips");
    const savedSavings = localStorage.getItem("savings");
    if (savedTrips) setTrips(JSON.parse(savedTrips));
    if (savedSavings) setSavings(Number(savedSavings));
  }, []);

  // Sauvegarder les voyages à chaque modification
  useEffect(() => {
    localStorage.setItem("trips", JSON.stringify(trips));
  }, [trips]);

  // Sauvegarder la cagnotte à chaque modification
  useEffect(() => {
    localStorage.setItem("savings", savings.toString());
  }, [savings]);

  const handleAddTrip = () => {
    if (!newTrip.name || !newTrip.cost) return;
    setTrips([...trips, { name: newTrip.name, cost: Number(newTrip.cost) }]);
    setNewTrip({ name: "", cost: "" });
  };

  const handleDeleteTrip = (index: number) => {
    const updatedTrips = trips.filter((_, i) => i !== index);
    setTrips(updatedTrips);
  };

  const getProgress = (cost: number) => {
    if (savings >= cost) return 100;
    return Math.round((savings / cost) * 100);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-200 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-sky-800">🌍 Voyages des Doudous</h1>

      {/* Section cagnotte */}
      <div className="bg-white rounded-2xl shadow-md p-4 w-full max-w-md mb-6">
        <h2 className="text-xl font-semibold mb-2">💰 Cagnotte actuelle</h2>
        <input
          type="number"
          placeholder="Montant mis de côté (€)"
          value={savings === 0 ? "" : savings}
          onChange={(e) => setSavings(Number(e.target.value))}
          className="border rounded-lg p-2 w-full mb-2"
        />
        <p className="text-sky-700 text-sm">
          Vous avez <strong>{savings.toLocaleString()} €</strong> de côté.
        </p>
      </div>

      {/* Section ajout de voyage */}
      <div className="bg-white rounded-2xl shadow-md p-4 w-full max-w-md mb-6">
        <h2 className="text-xl font-semibold mb-2">✈️ Ajouter un voyage</h2>
        <input
          type="text"
          placeholder="Destination"
          value={newTrip.name}
          onChange={(e) => setNewTrip({ ...newTrip, name: e.target.value })}
          className="border rounded-lg p-2 w-full mb-2"
        />
        <input
          type="number"
          placeholder="Coût (€)"
          value={newTrip.cost}
          onChange={(e) => setNewTrip({ ...newTrip, cost: e.target.value })}
          className="border rounded-lg p-2 w-full mb-2"
        />
        <button
          onClick={handleAddTrip}
          className="bg-sky-600 text-white rounded-lg px-4 py-2 w-full hover:bg-sky-700"
        >
          Ajouter
        </button>
      </div>

      {/* Liste des voyages */}
      <div className="w-full max-w-md space-y-4">
        {trips.map((trip, index) => (
          <div key={index} className="bg-white rounded-2xl shadow p-4 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-sky-800">{trip.name}</h3>
              <button
                onClick={() => handleDeleteTrip(index)}
                className="text-red-500 hover:text-red-700 font-bold"
              >
                ❌
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Objectif : {trip.cost.toLocaleString()} €
            </p>
            <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
              <div
                className={`h-4 rounded-full ${
                  getProgress(trip.cost) === 100 ? "bg-green-500" : "bg-sky-500"
                }`}
                style={{ width: `${getProgress(trip.cost)}%` }}
              ></div>
            </div>
            <p className="text-right text-sm text-gray-700 mt-1">
              {getProgress(trip.cost)}%
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}