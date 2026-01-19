import { useState, useRef } from 'react';
import type { ChangeEvent } from 'react';
import {
  MdEdit,
  MdTimer,
  MdStraighten,
  MdDescription,
  MdAdd,
  MdClose,
} from 'react-icons/md';
import { BiLeftArrow, BiRightArrow, BiUpload } from 'react-icons/bi';
import '../styles/RoutPageStyles.css';
import { useRouteForm } from '../hooks/useRouteForm';
import { useTranslation } from 'react-i18next';

// itt vannak a propsok amiket kapunk
interface RouteEditorPanelProps {
  name: string;
  description: string;
  distance: number; // ez a távolság méterben
  time: number; // ez az idő másodpercben
  onNameChange: (value: string) => void; // ez fut le ha írunk a névbe
  onDescriptionChange: (value: string) => void; // ez fut le ha írunk a leírásba
  onSave: () => void; // ez menti el az útvonalat
  closeRouteEditor: () => void; // Editor bezarasa gombbal
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
  closeRouteEditor,
}: RouteEditorPanelProps) {
  // idő formázása
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h} ó ${m} p`;
    return `${m} p`;
  };

  // távolság formázása
  const formatDistance = (meters: number) => {
    return (meters / 1000).toFixed(2) + ' km';
  };

  const { t } = useTranslation();
  const { gpxInputRef, handleGpxChange, triggerGpxInput, gpxFile, clearGpx } =
    useRouteForm();

  const [images, setImages] = useState<File[]>([]);
  const totalSlots = Math.max(3, images.length + 1);

  const isFormValid =
    name.trim().length > 0 &&
    description.trim().length > 0 &&
    distance > 0 &&
    time > 0;

  const carouselRef = useRef<HTMLDivElement>(null);
  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newFile = e.target.files[0];
      if (newFile) {
        // Csak 5MB alatti képek
        if (newFile.size > 5 * 1024 * 1024) {
          alert('A kép túl nagy! Max 5MB megengedett.');
          return;
        }
        setImages((prev) => [...prev, newFile]);
      }
      setTimeout(() => scrollCarousel(120), 100);
    }
  };
  const scrollCarousel = (offset: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: offset,
        behavior: 'smooth',
      });
    }
  };
  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="route-editor-panel">
      <h2 className="editor-header">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <MdEdit style={{ marginRight: '10px' }} /> Útvonal tervező
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
          <MdClose
            style={{ cursor: 'pointer' }}
            title="Menü bezárása"
            onClick={closeRouteEditor}
          />
        </div>
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
          <strong className="route-data">Távolság:</strong>&nbsp;
          {formatDistance(distance)}
        </div>
        <div className="editor-stat-item">
          <MdTimer style={{ marginRight: '5px', color: '#1976D2' }} />{' '}
          <strong className="route-data">Idő:</strong>&nbsp;{formatTime(time)}
        </div>
      </div>
      <div className="pics-container">
        <div id="carousel" className="slider">
          <div
            id="carousel-slides"
            className="slides"
            ref={carouselRef}
            style={{ display: 'flex', overflowX: 'auto' }}>
            {[...Array(totalSlots)].map((_, index) => {
              const image = images[index];

              return (
                <div className="slide" key={index}>
                  {image ? (
                    // Ha van kép ezen az indexen, megjelenítjük az előnézetet
                    <div className="image-preview">
                      <img src={URL.createObjectURL(image)} alt="túra kép" />
                      <button
                        onClick={() => removeImage(index)}
                        className="delete-btn">
                        ×
                      </button>
                    </div>
                  ) : (
                    // Ha nincs kép, ez egy feltöltő placeholder
                    <label className="upload-placeholder">
                      {index === images.length ? (
                        <>
                          <span>+</span>
                          <input
                            type="file"
                            hidden
                            onChange={(e) => handleUpload(e)}
                            accept="image/*"
                          />
                        </>
                      ) : null}
                    </label>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="buttons">
          <button className="btn-prev" onClick={() => scrollCarousel(-120)}>
            <BiLeftArrow size={18} />
          </button>
          <button className="btn-next" onClick={() => scrollCarousel(120)}>
            <BiRightArrow size={18} />
          </button>
        </div>
      </div>
      <div className="editor-actions">
        <button
          className={`editor-add-btn ${isFormValid ? 'valid' : 'invalid'}`}
          type="button"
          onClick={isFormValid ? onSave : undefined}>
          <MdAdd style={{ marginRight: '8px' }} /> Útvonal hozzáadása
        </button>
      </div>

      <div className="separator">
        <span>VAGY</span>
      </div>

      <div
        className="uploadTrailBtn"
        style={{ position: 'relative', width: '100%' }}>
        <input
          type="file"
          ref={gpxInputRef}
          onChange={handleGpxChange}
          style={{ display: 'none' }}
          accept=".gpx"
        />

        <button
          type="button"
          className="route-upload-gpx-btn"
          onClick={triggerGpxInput}>
          {gpxFile ? (
            `📄 ${gpxFile.name}`
          ) : (
            <>
              <BiUpload style={{ marginRight: '8px' }} />
              {t('routeForm.upload_file')}
            </>
          )}
        </button>
        {gpxFile && (
          <button
            type="button"
            className="route-form-gpx-remove"
            onClick={(e) => {
              e.stopPropagation();
              clearGpx();
            }}>
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
