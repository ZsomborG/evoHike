import React, { useState } from 'react';
import {
  MdWaterDrop,
  MdTerrain,
  MdPlace,
  MdMuseum,
  MdRestaurant,
  MdLocalDrink,
  MdVisibility,
  MdChurch,
  MdClose,
  MdLayers,
} from 'react-icons/md';
import {
  GiCastle,
  GiBrokenWall,
  GiCaveEntrance,
  GiWaterfall,
} from 'react-icons/gi';
import '../styles/RoutPageStyles.css';

// ez a jelmagyarázat komponens
export default function MapLegend() {
  // ez tárolja hogy nyitva van e a menü
  const [isOpen, setIsOpen] = useState(false);

  // ez egy sor a listában ikonnal és szöveggel
  const LegendItem = ({
    icon,
    color,
    label,
  }: {
    icon: React.ReactNode;
    color: string;
    label: string;
  }) => (
    <div className="legend-item">
      <div className="legend-item-icon" style={{ color: color }}>
        {icon}
      </div>
      <span className="legend-item-label">{label}</span>
    </div>
  );

  // ha zárva van akkor csak egy gombot mutatunk
  if (!isOpen) {
    return (
      <button
        className="map-legend-toggle-btn"
        onClick={() => setIsOpen(true)}
        title="Jelmagyarázat">
        {/* becsomagoljuk egy divbe az ikont mert a button flexbox néha összenyomja a közvetlen svgt */}
        <div className="map-legend-icon-wrapper">
          <MdLayers size={28} color="#333" />
        </div>
      </button>
    );
  }

  // ha nyitva van akkor jön a teljes lista
  return (
    <div className="map-legend-container">
      <div className="legend-header">
        <h3 className="legend-title">
          <MdLayers style={{ marginRight: '8px' }} /> Jelmagyarázat
        </h3>
        <button className="legend-close-btn" onClick={() => setIsOpen(false)}>
          <MdClose size={20} color="#666" />
        </button>
      </div>

      {/* természeti dolgok */}
      <div className="legend-section">
        <h4 className="legend-section-title">Természeti</h4>
        <LegendItem icon={<MdTerrain />} color="#795548" label="Csúcs" />
        <LegendItem icon={<MdWaterDrop />} color="#2196F3" label="Forrás" />
        <LegendItem icon={<GiCaveEntrance />} color="#424242" label="Barlang" />
        <LegendItem icon={<GiWaterfall />} color="#00BCD4" label="Vízesés" />
      </div>

      {/* turista dolgok */}
      <div className="legend-section">
        <h4 className="legend-section-title">Turizmus</h4>
        <LegendItem icon={<MdVisibility />} color="#FF9800" label="Kilátó" />
        <LegendItem icon={<MdPlace />} color="#F44336" label="Nevezetesség" />
        <LegendItem icon={<MdMuseum />} color="#8D6E63" label="Múzeum" />
      </div>

      {/* történelmi cuccok */}
      <div className="legend-section">
        <h4 className="legend-section-title">Történelmi</h4>
        <LegendItem icon={<GiCastle />} color="#9C27B0" label="Vár" />
        <LegendItem icon={<GiBrokenWall />} color="#757575" label="Rom" />
        <LegendItem icon={<MdChurch />} color="#607D8B" label="Emlékmű" />
      </div>

      {/* szolgáltatások */}
      <div>
        <h4 className="legend-section-title">Szolgáltatás</h4>
        <LegendItem icon={<MdLocalDrink />} color="#03A9F4" label="Ivóvíz" />
        <LegendItem icon={<MdChurch />} color="#673AB7" label="Templom" />
        <LegendItem icon={<MdRestaurant />} color="#E91E63" label="Étterem" />
      </div>
    </div>
  );
}
