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
import TrailCard from '../components/TrailCard';
import type { Trail } from '../types/Trail';

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
  const mockTrails: Trail[] = [
    {
      id: '1',
      name: 'Bükk - Bükkinyúlsz',
      location: 'Bükk',
      length: 4300,
      difficulty: 0,
      coverPhotoPath: '',
      elevationGain: 431,
      rating: 4.2,
      reviewCount: 7,
    },
    {
      id: '2',
      name: 'Kékes Csúcs-túra',
      location: 'Mátra',
      length: 12500,
      difficulty: 2,
      coverPhotoPath: '',
      elevationGain: 850,
      rating: 4.8,
      reviewCount: 24,
    },
    {
      id: '3',
      name: 'Nagymaros - Prédikálószék',
      location: 'Dunakanyar',
      length: 9200,
      difficulty: 1,
      coverPhotoPath: '',
      elevationGain: 560,
      rating: 4.5,
      reviewCount: 15,
    },
    {
      id: '4',
      name: 'Rám-szakadék kaland',
      location: 'Pilis',
      length: 7100,
      difficulty: 2,
      coverPhotoPath: '',
      elevationGain: 320,
      rating: 4.9,
      reviewCount: 42,
    },
    {
      id: '5',
      name: 'Spartacus-ösvény',
      location: 'Visegrádi-hegység',
      length: 14000,
      difficulty: 1,
      coverPhotoPath:
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=250&fit=crop',
      elevationGain: 410,
      rating: 4,
      reviewCount: 11,
    },
    {
      id: '6',
      name: 'Vörös-kő extrém kör',
      location: 'Bükk',
      length: 18500,
      difficulty: 3,
      coverPhotoPath:
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=250&fit=crop',
      elevationGain: 1150,
      rating: 4.7,
      reviewCount: 5,
    },
  ];

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
      <div className="trail-container">
        {mockTrails.map((trail) => (
          <TrailCard key={trail.id} trail={trail} />
        ))}
      </div>
    </div>
  );
}
