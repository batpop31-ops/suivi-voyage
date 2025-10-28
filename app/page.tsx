"use client";

import { useState, useEffect } from "react";

interface Trip {
  name: string;
  cost: number;
}

export default function Page() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [newTrip, setNewTrip] = useState({ name: "", cost: "" });
  const [savings, setSavings] = useState<number>(0);

  useEffect(() => {
    const savedTrips = localStorage.getItem("trips");
    const savedSavings = localStorage.getItem("savings");
    if (savedTrips) setTrips(JSON.parse(savedTrips));
    if (savedSavings) setSavings(Number(savedSavings));
  }, []);

  useEffect(() => {
    localStorage.setItem("trips", JSON.stringify(trips));
    localStorage.setItem("savings", String(savings));
  }, [trips, savings]);

  const handleAddTrip = () => {
    if (!newTrip.name || !newTrip.cost) return;
    setTrips([...trips, { name: newTrip.name, cost: Number(newTrip.cost) }]);
    setNewTrip({ name: "", cost: "" });
  };

  const handleDeleteTrip = (index: number) => {
    const updated = [...trips];
    updated.splice(index, 1);
    setTrips(updated);
  };

  const handleSavingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSavings(Number(e.target.value));
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Voyages des Doudous</h1>

      <label className="block mb-2 font-semibold">Montant mis de côté (€)</label>
      <input
        type="number"
        placeholder="Montant mis de côté (€)"
        value={savings === 0 ? "" : savings}
        onChange={handleSavingsChange}
        className="border rounded-lg p-2 w-full mb-4 text-black placeholder-gray-400"
      />

      <div className="mb-4">
        <input
          type="text"
          placeholder="Nom du voyage"
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
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Ajouter le voyage
        </button>
      </div>

      <div>
        {trips.map((trip, index) => {
          const progress = Math.min((savings / trip.cost) * 100, 100);
          return (
            <div key={index} className="mb-4 border p-2 rounded">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold">{trip.name}</span>
                <button
                  onClick={() => handleDeleteTrip(index)}
                  className="text-red-500 font-bold"
                >
                  X
                </button>
              </div>
              <div className="w-full bg-gray-200 h-4 rounded">
                <div
                  className="bg-green-500 h-4 rounded"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-sm mt-1">
                {progress.toFixed(0)}% du voyage financé
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}