import { useState } from 'react';
import {
  MdEdit,
  MdTimer,
  MdStraighten,
  MdDescription,
  MdAdd,
} from 'react-icons/md';

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

  const isFormValid = name.trim().length > 0 && description.trim().length > 0;

  const handleMouseEnter = () => {
    if (!isFormValid) {
      // ha nincs kitöltve akkor ugrál a gomb
      setButtonOffset((prev) => (prev === 0 ? 300 : 0));
    } else {
      setButtonOffset(0);
    }
  };

  return (
    <div
      style={{
        padding: '1.5rem',
        margin: '1rem 0',
        border: '2px solid #FF9800',
        borderRadius: '8px',
        backgroundColor: '#fff8e1',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      }}>
      <h2
        style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: 0,
          color: '#E65100',
        }}>
        <MdEdit style={{ marginRight: '10px' }} /> Útvonal tervező
      </h2>

      <div
        style={{
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
          marginBottom: '15px',
        }}>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <label
            htmlFor="route-name"
            style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold',
            }}>
            Útvonal neve:
          </label>
          <input
            id="route-name"
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Pl. A kincshez vezető túra"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
        </div>

        <div style={{ flex: 2, minWidth: '250px' }}>
          <label
            htmlFor="route-desc"
            style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold',
            }}>
            <MdDescription style={{ verticalAlign: 'middle' }} /> Leírás:
          </label>
          <input
            id="route-desc"
            type="text"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Pl. EXTRÉÉÉÉM DE NAGYON vigyázzni kell mert sok a kalóz errefelé !!4"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '20px',
          padding: '10px',
          backgroundColor: 'rgba(255,255,255,0.6)',
          borderRadius: '4px',
        }}>
        <div
          style={{ display: 'flex', alignItems: 'center', fontSize: '1.1rem' }}>
          <MdStraighten style={{ marginRight: '5px', color: '#1976D2' }} />{' '}
          <strong>Távolság:</strong>&nbsp;{formatDistance(distance)}
        </div>
        <div
          style={{ display: 'flex', alignItems: 'center', fontSize: '1.1rem' }}>
          <MdTimer style={{ marginRight: '5px', color: '#1976D2' }} />{' '}
          <strong>Idő:</strong>&nbsp;{formatTime(time)}
        </div>
      </div>

      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'flex-start',
        }}>
        <button
          type="button"
          onClick={isFormValid ? onSave : undefined}
          onMouseEnter={handleMouseEnter}
          style={{
            transform: `translateX(${buttonOffset}px)`,
            transition: 'transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
            backgroundColor: isFormValid ? '#4CAF50' : '#FF5722',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '10px 20px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: isFormValid ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          }}>
          <MdAdd style={{ marginRight: '8px' }} /> Útvonal hozzáadása
        </button>
      </div>
    </div>
  );
}
