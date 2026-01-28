import { useState } from 'react';
import '../styles/RoutPageStyles.css';
import {
  MdSearch,
  MdFilterList,
  MdAddLocation,
  MdOutlineStar,
} from 'react-icons/md';
import trailData from '../data/mockTrails.json';
import { Trail } from '../models/Trail';
import type { DifficultyLevel } from '../types/difficulty';
import { useTranslation } from 'react-i18next';

interface TrailListPanelProps {
  onSelectTrail: (trailId: string) => void;
  onStartCreateRoute: () => void;
}

export default function TrailListPanel({
  onSelectTrail,
  onStartCreateRoute,
}: TrailListPanelProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  // átalakítjuk a nyers json adatokat trail objektumokká
  const trails = trailData.map((rawData) => {
    // létrehozunk egy új trail objektumot
    const trailObjektum = new Trail({
      id: rawData.id,
      name: rawData.name,
      location: rawData.location,
      length: rawData.length,
      elevationGain: rawData.elevationGain,
      time: rawData.time,
      rating: rawData.rating,
      reviewCount: rawData.reviewCount,
      coverPhotoPath: rawData.coverPhotoPath,
      difficulty: rawData.difficulty as DifficultyLevel,
    });
    return trailObjektum;
  });

  // létrehozunk egy új tömböt amiben csak azok vannak amik megfelelnek a keresésnek
  const filteredTrails = trails.filter((trail) => {
    if (searchTerm === '') return true;
    return trail.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="trail-list-panel">
      <h2 className="trail-list-header">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <MdSearch style={{ marginRight: '10px' }} />{' '}
          {t('trailList.search_title')}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
          <MdFilterList
            style={{ cursor: 'pointer' }}
            title={t('trailList.filter')}
          />
          <MdAddLocation
            style={{ cursor: 'pointer' }}
            title={t('routeForm.add_route')}
            onClick={onStartCreateRoute}
          />
        </div>
      </h2>
      <div className="editor-form-row">
        <div className="editor-input-group">
          <label htmlFor="route-name" className="editor-label">
            {t('routeForm.route_name')}:
          </label>
          <input
            id="route-name"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('routeForm.name_placeholder')}
            className="editor-input"
          />
        </div>
      </div>

      <div className="trail-list-cards">
        {filteredTrails.map((trail) => (
          <div
            key={trail.id}
            className="trail-list-card"
            onClick={() => onSelectTrail(trail.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onSelectTrail(trail.id);
            }}>
            <div
              className="trail-list-card-header"
              title={t('trailList.difficulty_level')}>
              <span className="trail-list-card-title">{trail.name}</span>
              <span className="trail-list-card-difficulty">
                {trail.difficulty + 1}
                <MdOutlineStar style={{ marginLeft: '5px', color: 'red' }} />
              </span>
            </div>
            <div className="trail-list-card-info">
              <span>{trail.location}</span>
              <span>•</span>
              <span>{(trail.length / 1000).toFixed(1)} km</span>
              <span>•</span>
              <span>
                {Math.floor(trail.time / 60)}
                {t('routeForm.hours')} {trail.time % 60}
                {t('routeForm.minutes')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
