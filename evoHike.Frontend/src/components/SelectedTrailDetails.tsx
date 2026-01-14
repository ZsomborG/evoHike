import { Trail } from '../models/Trail';
import type { OverpassElement } from '../api/overpassApi';
import { Map } from 'leaflet';
import { MdLocationOn, MdPhotoCamera, MdMap } from 'react-icons/md';

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
  return (
    <div
      style={{
        padding: '1rem',
        margin: '1rem 0',
        border: '2px solid #6FA1EC',
        borderRadius: '8px',
        backgroundColor: '#eef6ff',
      }}>
      <h2 style={{ display: 'flex', alignItems: 'center' }}>
        <MdLocationOn
          size={32}
          style={{
            color: '#d9534f',
            marginRight: '8px',
            filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))',
          }}
        />{' '}
        Kiválasztva: {trail.name}
      </h2>
      <p>
        <strong>Helyszín:</strong> {trail.location} | <strong>Táv:</strong>{' '}
        {trail.length / 1000} km | <strong>Szint:</strong> {trail.elevationGain}
        m | <strong>Idő:</strong> {Math.floor(trail.time / 60)} óra{' '}
        {trail.time % 60} perc
      </p>
      <hr
        style={{ margin: '10px 0', border: '0', borderTop: '1px solid #ccc' }}
      />
      <p style={{ fontStyle: 'italic', lineHeight: '1.5' }}>
        {trail.description}
      </p>
      <hr
        style={{ margin: '10px 0', border: '0', borderTop: '1px solid #ccc' }}
      />

      {/* felhasználói fotók ha vannak */}
      {trail.userPhotos && trail.userPhotos.length > 0 && (
        <div style={{ marginBottom: '15px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center' }}>
            <MdPhotoCamera
              size={26}
              style={{
                marginRight: '8px',
                filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))',
              }}
            />{' '}
            Felhasználói fotók:
          </h3>
          <div
            style={{
              display: 'flex',
              gap: '10px',
              overflowX: 'auto',
              padding: '10px 0',
            }}>
            {trail.userPhotos.map((photoUrl, index) => (
              <img
                key={index}
                src={photoUrl}
                alt={`Túra fotó ${index + 1}`}
                style={{
                  height: '120px',
                  borderRadius: '8px',
                  objectFit: 'cover',
                  border: '1px solid #ddd',
                }}
              />
            ))}
          </div>
          <hr
            style={{
              margin: '10px 0',
              border: '0',
              borderTop: '1px solid #ccc',
            }}
          />
        </div>
      )}

      {/* közeli látnivalók listázása */}
      {pois.length > 0 && (
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center' }}>
            <MdMap
              size={26}
              style={{
                color: '#8bbc68',
                marginRight: '8px',
                filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))',
              }}
            />{' '}
            Közeli látnivalók az útvonal mentén ({pois.length} db):
          </h3>
          <ul style={{ paddingLeft: '30px', marginTop: '10px' }}>
            {pois.map((poi) => (
              /* ha rákattintunk odarepül a térkép */
              <li key={poi.id} style={{ marginBottom: '4px' }}>
                <button
                  type="button"
                  onClick={() => map?.flyTo([poi.lat, poi.lon], 18)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: '#3388ff',
                    textAlign: 'left',
                    font: 'inherit',
                  }}
                  title="Ugrás a térképen">
                  <span style={{ textDecoration: 'underline' }}>
                    <strong>{poi.tags?.name}</strong>
                  </span>{' '}
                  <small style={{ color: 'black', textDecoration: 'none' }}>
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
