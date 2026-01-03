import '../styles/RoutPageStyles.css';
import routeData from '../data/routes.json' assert { type: 'json' };
import type { FeatureCollection } from 'geojson';
import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  GeoJSON,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { divIcon, point } from 'leaflet';
import { useTranslation } from 'react-i18next';

interface Cluster {
  getChildCount: () => number;
}
const geojson = routeData as FeatureCollection;

// custom cluster icon
const createClusterCustomIcon = (cluster: Cluster) => {
  return divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: 'custom-marker-cluster',
    iconSize: point(33, 33, true),
  });
};
{
  /* Beégetett koordináta adatok */
}
const routeCoordinates: [number, number][] = [
  [37.7749, -122.4194], // San Francisco
  [36.7783, -119.4179], // California center
  [34.0522, -118.2437], // Los Angeles
];

export default function App() {
  const { t } = useTranslation();
  return (
    <div className="route-page-wrapper">
      <h1 style={{ textAlign: 'center' }}>{t('routePageH1')}</h1>
      <MapContainer className="map" center={[48.1007, 20.7897]} zoom={13}>
        {/* OPEN STREEN MAPS TILES */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={routeCoordinates} />{' '}
        {/* Beégetett koordináta adatok megjelenitése */}
        <GeoJSON data={geojson} />{' '}
        {/* Fájlból koordináta adatok beolvásasa és megjelenitése */}
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}>
          {/* Hard coded markers */}
          <Marker position={[51.505, -0.09]}>
            <Popup>This is popup 1</Popup>
          </Marker>
          <Marker position={[51.504, -0.1]}>
            <Popup>This is popup 2</Popup>
          </Marker>
          <Marker position={[51.5, -0.09]}>
            <Popup>This is popup 3</Popup>
          </Marker>
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
