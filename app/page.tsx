"use client";

import React, { useState, useEffect } from "react";

export default function TravelBudgetApp() {
  const [totalSavings, setTotalSavings] = useState(0);
  const [trips, setTrips] = useState([]);
  const [newTrip, setNewTrip] = useState({ name: "", cost: "" });

  useEffect(() => {
    const savedTrips = localStorage.getItem("trips");
    const savedSavings = localStorage.getItem("totalSavings");
    if (savedTrips) setTrips(JSON.parse(savedTrips));
    if (savedSavings) setTotalSavings(Number(savedSavings));
  }, []);

  useEffect(() => {
    localStorage.setItem("trips", JSON.stringify(trips));
    localStorage.setItem("totalSavings", totalSavings.toString());
  }, [trips, totalSavings]);

  const handleAddTrip = () => {
    if (!newTrip.name || !newTrip.cost) return;
    setTrips([...trips, { name: newTrip.name, cost: Number(newTrip.cost) }]);
    setNewTrip({ name: "", cost: "" });
  };

  const handleDeleteTrip = (index: number) => {
    setTrips(trips.filter((_, i) => i !== index));
  };

  const handleSavingsChange = (value: number) => {
    setTotalSavings(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">🌍 Suivi de vos voyages</h1>

      <div className="max-w-md mx-auto mb-6">
        <label className="block mb-2 font-medium">Montant total épargné (€)</label>
        <input
          type="number"
          placeholder="Ex : 6000"
          value={totalSavings}
          onChange={(e) => handleSavingsChange(Number(e.target.value))}
          className="w-full p-2 rounded border"
        />
      </div>

      <div className="max-w-md mx-auto mb-4 p-4 bg-white rounded-2xl shadow">
        <h2 className="font-semibold mb-3">Ajouter un voyage</h2>
        <div className="flex gap-2">
          <input
            placeholder="Nom du voyage"
            value={newTrip.name}
            onChange={(e) => setNewTrip({ ...newTrip, name: e.target.value })}
            className="flex-1 p-2 rounded border"
          />
          <input
            type="number"
            placeholder="Coût (€)"
            value={newTrip.cost}
            onChange={(e) => setNewTrip({ ...newTrip, cost: e.target.value })}
            className="w-28 p-2 rounded border"
          />
          <button
            onClick={handleAddTrip}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            +
          </button>
        </div>
      </div>

      <div className="grid gap-4 max-w-md mx-auto">
        {trips.map((trip, index) => {
          const percentage = Math.min(100, (totalSavings / trip.cost) * 100);

          return (
            <div key={index} className="bg-white rounded-2xl shadow p-4">
              <div className="flex justify-between mb-2 items-center">
                <span className="font-semibold">{trip.name}</span>
                <span className="text-sm text-gray-600">{trip.cost.toLocaleString()} €</span>
              </div>

              <div className="h-3 bg-gray-200 rounded">
                <div
                  className="h-3 bg-green-500 rounded"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>

              <div className="flex justify-between mt-2 text-sm font-medium">
                <span>{percentage.toFixed(0)}%</span>
                <button
                  onClick={() => handleDeleteTrip(index)}
                  className="text-red-500 hover:underline"
                >
                  Supprimer
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}