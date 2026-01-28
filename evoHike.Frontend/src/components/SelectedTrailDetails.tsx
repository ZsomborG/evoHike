import { Trail } from '../models/Trail';
import type { OverpassElement } from '../api/overpassApi';
import { Map } from 'leaflet';
import { MdLocationOn, MdPhotoCamera, MdMap } from 'react-icons/md';
import '../styles/RoutPageStyles.css';
import { useTranslation } from 'react-i18next';

// itt vannak a propsok amiket kapunk
interface SelectedTrailDetailsProps {
  trail: Trail; // a kiválasztott túra adatai
  pois: OverpassElement[]; // a közeli látnivalók listája
  map: Map | null; // a térkép objektum a zoomoláshoz
}

// ez a komponens mutatja a kiválasztott túra részleteit
export default function SelectedTrailDetails({
  trail,
  pois,
  map,
}: SelectedTrailDetailsProps) {
  const { t } = useTranslation();
  return (
    <div className="selected-trail-details">
      <h2 className="trail-header">
        <MdLocationOn
          size={32}
          style={{
            color: '#d9534f',
            marginRight: '8px',
            filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))',
          }}
        />{' '}
        {t('selectedTrail.selected')}: {trail.name}
      </h2>
      <p>
        <strong>{t('selectedTrail.location')}:</strong> {trail.location} |{' '}
        <strong>{t('selectedTrail.distance')}:</strong> {trail.length / 1000} km
        | <strong>{t('selectedTrail.elevation')}:</strong> {trail.elevationGain}
        m | <strong>{t('selectedTrail.time')}:</strong>{' '}
        {Math.floor(trail.time / 60)} {t('selectedTrail.hour')}{' '}
        {trail.time % 60} {t('selectedTrail.minute')}
      </p>
      <hr className="trail-divider" />
      <p className="trail-description">{trail.description}</p>
      <hr className="trail-divider" />

      {/* felhasználói fotók ha vannak */}
      {trail.userPhotos && trail.userPhotos.length > 0 && (
        <div className="trail-photos-section">
          <h3 className="trail-section-header">
            <MdPhotoCamera
              size={26}
              style={{
                marginRight: '8px',
                filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))',
              }}
            />{' '}
            {t('selectedTrail.user_photos')}:
          </h3>
          <div className="trail-photos-container">
            {trail.userPhotos.map((photoUrl, index) => (
              <img
                key={index}
                src={photoUrl}
                alt={`${t('selectedTrail.photo_alt')} ${index + 1}`}
                className="trail-photo"
              />
            ))}
          </div>
          <hr className="trail-divider" />
        </div>
      )}

      {/* közeli látnivalók listázása */}
      {pois.length > 0 && (
        <div>
          <h3 className="trail-section-header">
            <MdMap
              size={26}
              style={{
                color: '#8bbc68',
                marginRight: '8px',
                filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))',
              }}
            />{' '}
            {t('selectedTrail.nearby_pois')} ({pois.length}{' '}
            {t('selectedTrail.items')}):
          </h3>
          <ul className="trail-pois-list">
            {pois.map((poi) => (
              /* ha rákattintunk odarepül a térkép */
              <li key={poi.id} className="trail-poi-item">
                <button
                  type="button"
                  onClick={() => map?.flyTo([poi.lat, poi.lon], 18)}
                  className="trail-poi-btn"
                  title={t('selectedTrail.jump_to_map')}>
                  <span className="trail-poi-name">{poi.tags?.name}</span>{' '}
                  <small className="trail-poi-type">
                    (
                    {poi.tags?.tourism ||
                      poi.tags?.natural ||
                      poi.tags?.historic}
                    )
                  </small>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
