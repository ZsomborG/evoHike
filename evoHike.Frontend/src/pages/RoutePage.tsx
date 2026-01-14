import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import {
  MapContainer,
  TileLayer,
  Popup,
  GeoJSON,
  useMap,
  Marker,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L, { divIcon, point } from 'leaflet';
import type { GeoJsonObject } from 'geojson';
import '../styles/RoutPageStyles.css';
import 'leaflet/dist/leaflet.css';
import TrailCard from '../components/TrailCard';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';
import { Trail } from '../models/Trail';
import {
  trailService,
  type TrailDto,
  type PoiDto,
} from '../services/trailService';
import type { DifficultyLevel } from '../types/difficulty';
import { useApi } from '../hooks/useApi';
import apiClient from '../api/axios';

const MAP_CENTER: [number, number] = [48.1007, 20.7897];
const DEFAULT_ZOOM = 11;
const CLUSTER_ICON_SIZE = point(33, 33, true);

interface MapCluster {
  getChildCount: () => number;
}

const createClusterCustomIcon = (cluster: MapCluster) => {
  return divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: 'custom-marker-cluster',
    iconSize: CLUSTER_ICON_SIZE,
  });
};

function usePois(selectedTrailId: string | null) {
  const [pois, setPois] = useState<PoiDto[]>([]);

  useEffect(() => {
    if (!selectedTrailId) {
      setPois([]);
      return;
    }

    let isMounted = true;

    trailService
      .getNearbyPois(selectedTrailId, 250)
      .then((data) => {
        if (isMounted) setPois(data);
      })
      .catch((err) => {
        console.error('Failed to fetch POIs', err);
        if (isMounted) setPois([]);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedTrailId]);

  return pois;
}

function useDataAdmin(onSuccess: () => void) {
  const [status, setStatus] = useState<{
    message: string | null;
    error: string | null;
  }>({ message: null, error: null });

  const handleAction = async (action: 'import' | 'clear') => {
    setStatus({ message: null, error: null });

    try {
      const endpoint =
        action === 'import' ? '/api/Data/import' : '/api/Data/clear';
      const method = action === 'import' ? apiClient.post : apiClient.delete;

      const response = await method(endpoint);

      const msg =
        action === 'import'
          ? JSON.stringify(response.data, null, 2)
          : response.data;

      setStatus({ message: msg, error: null });
      onSuccess();
    } catch (err) {
      const errorMessage =
        err instanceof AxiosError
          ? err.message
          : `An unexpected error occurred during ${action}.`;

      setStatus({ message: null, error: errorMessage });
    }
  };

  return { status, handleAction };
}

function MapController({ selectedTrail }: { selectedTrail: TrailDto | null }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedTrail?.routeLine) return;

    const geoJsonLayer = L.geoJSON(selectedTrail.routeLine as GeoJsonObject);
    const bounds = geoJsonLayer.getBounds();

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [selectedTrail, map]);

  return null;
}

interface DataAdminControlsProps {
  onImport: () => void;
  onClear: () => void;
  status: { message: string | null; error: string | null };
}

const DataAdminControls = ({
  onImport,
  onClear,
  status,
}: DataAdminControlsProps) => (
  <div className="admin-controls mb-4">
    <div className="button-group">
      <Button onClick={onImport}>Import Data</Button>
      <Button onClick={onClear}>Clear Data</Button>
    </div>
    {status.error && <ErrorMessage>{status.error}</ErrorMessage>}
    {status.message && <pre className="success-message">{status.message}</pre>}
  </div>
);

function RoutePage() {
  const { t } = useTranslation();
  const [selectedTrailId, setSelectedTrailId] = useState<string | null>(null);

  const {
    data: trailsDto,
    loading: trailsLoading,
    error: trailsError,
    refetch: refetchTrails,
  } = useApi<TrailDto[]>('/api/trails');

  const pois = usePois(selectedTrailId);
  const { status: adminStatus, handleAction: handleAdminAction } =
    useDataAdmin(refetchTrails);

  const trails = useMemo(() => {
    return (trailsDto || []).map(
      (t) => new Trail({ ...t, difficulty: t.difficulty as DifficultyLevel }),
    );
  }, [trailsDto]);

  const selectedTrailDto = useMemo(
    () => trailsDto?.find((t) => t.id === selectedTrailId) || null,
    [trailsDto, selectedTrailId],
  );

  const handlePlanClick = useCallback(
    (trail: Trail) => setSelectedTrailId(trail.id),
    [],
  );
  const handleResetMap = useCallback(() => setSelectedTrailId(null), []);

  return (
    <div className="route-page-wrapper">
      <h1 className="text-center">{t('routePageH1')}</h1>

      <DataAdminControls
        onImport={() => handleAdminAction('import')}
        onClear={() => handleAdminAction('clear')}
        status={adminStatus}
      />

      <div className="map-wrapper relative">
        {selectedTrailId && (
          <div className="map-reset-btn">
            <Button onClick={handleResetMap}>Reset Map</Button>
          </div>
        )}

        <MapContainer className="map" center={MAP_CENTER} zoom={DEFAULT_ZOOM}>
          <MapController selectedTrail={selectedTrailDto} />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {!trailsLoading && selectedTrailDto?.routeLine && (
            <GeoJSON
              key={selectedTrailDto.id}
              data={selectedTrailDto.routeLine as GeoJsonObject}
              style={{ weight: 6 }}>
              <Popup>
                <strong>{selectedTrailDto.name}</strong>
                <br />
                {selectedTrailDto.length}m
              </Popup>
            </GeoJSON>
          )}

          <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={createClusterCustomIcon}>
            {pois.map((poi) => {
              const [lng, lat] = poi.location?.coordinates || [];
              if (!lat || !lng) return null;

              return (
                <Marker key={poi.id} position={[lat, lng]}>
                  <Popup>
                    <strong>{poi.name}</strong>
                    <br />
                    <i>{poi.type}</i>
                  </Popup>
                </Marker>
              );
            })}
          </MarkerClusterGroup>
        </MapContainer>
      </div>

      {trailsError && <ErrorMessage>{trailsError}</ErrorMessage>}

      <div className="trail-container">
        {!trailsLoading &&
          trails.map((trail) => (
            <TrailCard
              key={trail.id}
              trail={trail}
              onPlan={handlePlanClick}
              onHover={() => {}}
            />
          ))}
      </div>
    </div>
  );
}

export default RoutePage;
