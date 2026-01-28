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
import { useTranslation } from 'react-i18next';

// ez a jelmagyarázat komponens
export default function MapLegend() {
  // ez tárolja hogy nyitva van e a menü
  const { t } = useTranslation();
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
        title={t('mapLegend.title')}>
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
          <MdLayers style={{ marginRight: '8px' }} /> {t('mapLegend.title')}
        </h3>
        <button className="legend-close-btn" onClick={() => setIsOpen(false)}>
          <MdClose size={20} color="#666" />
        </button>
      </div>

      {/* természeti dolgok */}
      <div className="legend-section">
        <h4 className="legend-section-title">{t('mapLegend.natural')}</h4>
        <LegendItem
          icon={<MdTerrain />}
          color="#795548"
          label={t('mapLegend.peak')}
        />
        <LegendItem
          icon={<MdWaterDrop />}
          color="#2196F3"
          label={t('mapLegend.spring')}
        />
        <LegendItem
          icon={<GiCaveEntrance />}
          color="#424242"
          label={t('mapLegend.cave')}
        />
        <LegendItem
          icon={<GiWaterfall />}
          color="#00BCD4"
          label={t('mapLegend.waterfall')}
        />
      </div>

      {/* turista dolgok */}
      <div className="legend-section">
        <h4 className="legend-section-title">{t('mapLegend.tourism')}</h4>
        <LegendItem
          icon={<MdVisibility />}
          color="#FF9800"
          label={t('mapLegend.viewpoint')}
        />
        <LegendItem
          icon={<MdPlace />}
          color="#F44336"
          label={t('mapLegend.attraction')}
        />
        <LegendItem
          icon={<MdMuseum />}
          color="#8D6E63"
          label={t('mapLegend.museum')}
        />
      </div>

      {/* történelmi cuccok */}
      <div className="legend-section">
        <h4 className="legend-section-title">{t('mapLegend.historic')}</h4>
        <LegendItem
          icon={<GiCastle />}
          color="#9C27B0"
          label={t('mapLegend.castle')}
        />
        <LegendItem
          icon={<GiBrokenWall />}
          color="#757575"
          label={t('mapLegend.ruins')}
        />
        <LegendItem
          icon={<MdChurch />}
          color="#607D8B"
          label={t('mapLegend.monument')}
        />
      </div>

      {/* szolgáltatások */}
      <div>
        <h4 className="legend-section-title">{t('mapLegend.service')}</h4>
        <LegendItem
          icon={<MdLocalDrink />}
          color="#03A9F4"
          label={t('mapLegend.drinking_water')}
        />
        <LegendItem
          icon={<MdChurch />}
          color="#673AB7"
          label={t('mapLegend.church')}
        />
        <LegendItem
          icon={<MdRestaurant />}
          color="#E91E63"
          label={t('mapLegend.restaurant')}
        />
      </div>
    </div>
  );
}
