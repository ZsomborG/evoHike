import React from 'react';
import { useRouteForm } from '../hooks/useRouteForm';
import { useTranslation } from 'react-i18next';
import '../styles/RouteForm.css';

function RouteForm() {
  const {
    tourName,
    setTourName,
    description,
    setDescription,
    stops,
    addStop,
    removeStop,
    updateStop,
    photo,
    handleChangeFile,
    handleRemovePhoto,
    fileInputRef,
    triggerFileInput,
    submitForm,
    gpxFile,
    triggerGpxInput,
    handleGpxChange,
    clearGpx,
    gpxInputRef,
  } = useRouteForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitForm();
  };

  const { t } = useTranslation();

  return (
    <div className="route-form-container">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChangeFile}
        className="route-form-ref"
        accept="image/*"
      />
      <input
        type="file"
        ref={gpxInputRef}
        onChange={handleGpxChange}
        className="route-form-ref"
        accept=".gpx"
      />

      <form className="route-form-card" onSubmit={handleSubmit}>
        <div className="route-form-top-row">
          <div className="route-form-main-info">
            <input
              type="text"
              className="route-form-input"
              placeholder={t('routeForm.route_name')}
              value={tourName}
              onChange={(e) => setTourName(e.target.value)}
            />
            <button
              type="button"
              className="route-upload-gpx-btn"
              onClick={triggerGpxInput}
              style={{ position: 'relative' }}>
              {gpxFile ? `📄 ${gpxFile.name}` : t('routeForm.upload_file')}

              {gpxFile && (
                <button
                  className="route-form-photo-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearGpx();
                  }}>
                  ✕
                </button>
              )}
            </button>
          </div>
          <button className="route-form-photo-box" onClick={triggerFileInput}>
            {photo && (
              <button
                type="button"
                className="route-form-photo-remove"
                onClick={handleRemovePhoto}>
                ✕
              </button>
            )}
            <div className="route-form-photo-icon">{photo ? '✅' : '📷+'}</div>
            <span className="route-form-photo-name">
              {photo ? photo.name : t('routeForm.add_photo')}
            </span>
          </button>
        </div>

        <textarea
          className="route-form-textarea"
          placeholder={t('routeForm.trail_description')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="route-form-dynamic-section">
          <label className="route-form-section-label">
            {t('routeForm.poi.poi')} ({stops.length}/5)
          </label>
          {stops.map((stop) => (
            <div key={stop.id} className="route-form-stop-pair">
              <div className="route-form-pair-inputs">
                <input
                  className="route-form-input"
                  placeholder={t('routeForm.poi.name')}
                  value={stop.name}
                  onChange={(e) => updateStop(stop.id, 'name', e.target.value)}
                />
                <input
                  className="route-form-input-small"
                  placeholder={t('routeForm.poi.description')}
                  value={stop.note}
                  onChange={(e) => updateStop(stop.id, 'note', e.target.value)}
                />
              </div>
              {stops.length > 1 && (
                <button
                  type="button"
                  className="route-form-remove-btn"
                  onClick={() => removeStop(stop.id)}>
                  ✕
                </button>
              )}
            </div>
          ))}

          {stops.length < 5 && (
            <button
              type="button"
              className="route-form-add-btn"
              onClick={addStop}>
              {t('routeForm.poi.new')}
            </button>
          )}
        </div>

        <div className="route-form-controll-buttons">
          <button type="submit" className="route-form-save-btn">
            {t('routeForm.save')}
          </button>
          <button type="button" className="route-form-cancel-btn">
            {t('routeForm.cancel')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RouteForm;
