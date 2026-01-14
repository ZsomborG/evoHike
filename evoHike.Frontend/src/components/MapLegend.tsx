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
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
      <div
        style={{
          color: color,
          fontSize: '24px',
          marginRight: '10px',
          filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '30px',
        }}>
        {icon}
      </div>
      <span style={{ fontSize: '14px', color: '#333' }}>{label}</span>
    </div>
  );

  // ha zárva van akkor csak egy gombot mutatunk
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          zIndex: 1000,
          backgroundColor: 'white',
          border: '2px solid rgba(0,0,0,0.2)',
          borderRadius: '50%',
          width: '44px',
          height: '44px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
        }}
        title="Jelmagyarázat">
        {/* becsomagoljuk egy divbe az ikont mert a button flexbox néha összenyomja a közvetlen svgt */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <MdLayers size={28} color="#333" />
        </div>
      </button>
    );
  }

  // ha nyitva van akkor jön a teljes lista
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        zIndex: 1000,
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        maxWidth: '250px',
        maxHeight: '400px',
        overflowY: 'auto',
        border: '1px solid #ccc',
      }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px',
          borderBottom: '1px solid #eee',
          paddingBottom: '5px',
        }}>
        <h3
          style={{
            margin: 0,
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
          }}>
          <MdLayers style={{ marginRight: '8px' }} /> Jelmagyarázat
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
          }}>
          <MdClose size={20} color="#666" />
        </button>
      </div>

      {/* természeti dolgok */}
      <div style={{ marginBottom: '15px' }}>
        <h4
          style={{
            fontSize: '12px',
            textTransform: 'uppercase',
            color: '#888',
            margin: '0 0 8px 0',
            fontWeight: 'bold',
          }}>
          Természeti
        </h4>
        <LegendItem icon={<MdTerrain />} color="#795548" label="Csúcs" />
        <LegendItem icon={<MdWaterDrop />} color="#2196F3" label="Forrás" />
        <LegendItem icon={<GiCaveEntrance />} color="#424242" label="Barlang" />
        <LegendItem icon={<GiWaterfall />} color="#00BCD4" label="Vízesés" />
      </div>

      {/* turista dolgok */}
      <div style={{ marginBottom: '15px' }}>
        <h4
          style={{
            fontSize: '12px',
            textTransform: 'uppercase',
            color: '#888',
            margin: '0 0 8px 0',
            fontWeight: 'bold',
          }}>
          Turizmus
        </h4>
        <LegendItem icon={<MdVisibility />} color="#FF9800" label="Kilátó" />
        <LegendItem icon={<MdPlace />} color="#F44336" label="Nevezetesség" />
        <LegendItem icon={<MdMuseum />} color="#8D6E63" label="Múzeum" />
      </div>

      {/* történelmi cuccok */}
      <div style={{ marginBottom: '15px' }}>
        <h4
          style={{
            fontSize: '12px',
            textTransform: 'uppercase',
            color: '#888',
            margin: '0 0 8px 0',
            fontWeight: 'bold',
          }}>
          Történelmi
        </h4>
        <LegendItem icon={<GiCastle />} color="#9C27B0" label="Vár" />
        <LegendItem icon={<GiBrokenWall />} color="#757575" label="Rom" />
        <LegendItem icon={<MdChurch />} color="#607D8B" label="Emlékmű" />
      </div>

      {/* szolgáltatások */}
      <div>
        <h4
          style={{
            fontSize: '12px',
            textTransform: 'uppercase',
            color: '#888',
            margin: '0 0 8px 0',
            fontWeight: 'bold',
          }}>
          Szolgáltatás
        </h4>
        <LegendItem icon={<MdLocalDrink />} color="#03A9F4" label="Ivóvíz" />
        <LegendItem icon={<MdChurch />} color="#673AB7" label="Templom" />
        <LegendItem icon={<MdRestaurant />} color="#E91E63" label="Étterem" />
      </div>
    </div>
  );
}
