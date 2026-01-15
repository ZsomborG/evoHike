import { useState } from 'react';
import {
  MdEdit,
  MdTimer,
  MdStraighten,
  MdDescription,
  MdAdd,
} from 'react-icons/md';
import '../styles/RoutPageStyles.css';

// itt vannak a propsok amiket kapunk
interface RouteEditorPanelProps {
  name: string;
  description: string;
  distance: number; // ez a távolság méterben
  time: number; // ez az idő másodpercben
  onNameChange: (value: string) => void; // ez fut le ha írunk a névbe
  onDescriptionChange: (value: string) => void; // ez fut le ha írunk a leírásba
  onSave: () => void; // ez menti el az útvonalat
}

// ez a szerkesztő panel a térkép alatt
export default function RouteEditorPanel({
  name,
  description,
  distance,
  time,
  onNameChange,
  onDescriptionChange,
  onSave,
}: RouteEditorPanelProps) {
  const [buttonOffset, setButtonOffset] = useState(0);

  // idő formázása
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h} óra ${m} perc`;
    return `${m} perc`;
  };

  // távolság formázása
  const formatDistance = (meters: number) => {
    return (meters / 1000).toFixed(2) + ' km';
  };

  const isFormValid =
    name.trim().length > 0 &&
    description.trim().length > 0 &&
    distance > 0 &&
    time > 0;

  const handleMouseEnter = () => {
    if (!isFormValid) {
      // ha nincs kitöltve akkor ugrál a gomb
      setButtonOffset((prev) => (prev === 0 ? 100 : 0));
    } else {
      setButtonOffset(0);
    }
  };

  return (
    <div className="route-editor-panel">
      <h2 className="editor-header">
        <MdEdit style={{ marginRight: '10px' }} /> Útvonal tervező
      </h2>

      <div className="editor-form-row">
        <div className="editor-input-group">
          <label htmlFor="route-name" className="editor-label">
            Útvonal neve:
          </label>
          <input
            id="route-name"
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Pl. A kincshez vezető túra"
            className="editor-input"
          />
        </div>

        <div className="editor-input-group large">
          <label htmlFor="route-desc" className="editor-label">
            <MdDescription style={{ verticalAlign: 'middle' }} /> Leírás:
          </label>
          <input
            id="route-desc"
            type="text"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Pl. EXTRÉÉÉÉM DE NAGYON vigyázzni kell mert sok a kalóz errefelé !!4"
            className="editor-input"
          />
        </div>
      </div>

      <div className="editor-stats-row">
        <div className="editor-stat-item">
          <MdStraighten style={{ marginRight: '5px', color: '#1976D2' }} />{' '}
          <strong>Távolság:</strong>&nbsp;{formatDistance(distance)}
        </div>
        <div className="editor-stat-item">
          <MdTimer style={{ marginRight: '5px', color: '#1976D2' }} />{' '}
          <strong>Idő:</strong>&nbsp;{formatTime(time)}
        </div>
      </div>

      <div className="editor-actions">
        <button
          className={`editor-add-btn ${isFormValid ? 'valid' : 'invalid'}`}
          type="button"
          onClick={isFormValid ? onSave : undefined}
          onMouseEnter={handleMouseEnter}
          style={{
            transform: `translateY(${buttonOffset}px)`,
          }}>
          <MdAdd style={{ marginRight: '8px' }} /> Útvonal hozzáadása
        </button>
      </div>
    </div>
  );
}
