import '../styles/RoutPageStyles.css';
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import routeData from '../data/routes.json' assert { type: 'json' };
import type { FeatureCollection, Feature } from 'geojson';
import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  useMapEvents,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import {
  type Layer,
  Map,
  latLngBounds,
  type PathOptions,
  type LeafletMouseEvent,
} from 'leaflet';
import { useTranslation } from 'react-i18next';
import TrailCard from '../components/TrailCard';
import { Trail } from '../models/Trail';
import trailData from '../data/mockTrails.json';
import { getNearbyPOIs, type OverpassElement } from '../api/overpassApi';
import RoutingMachine from '../components/RoutingMachine';
import type { DifficultyLevel } from '../types/difficulty';
import {
  createClusterCustomIcon,
  getIconForPoi,
  startIcon,
  endIcon,
  waypointIcon,
} from '../utils/mapIcons';
import MapContextMenu from '../components/MapContextMenu';
import SelectedTrailDetails from '../components/SelectedTrailDetails';
import MapLegend from '../components/MapLegend';
import MapNavigationControls from '../components/MapNavigationControls';
import RouteEditorPanel from '../components/RouteEditorPanel';
import { MdDelete } from 'react-icons/md';
import TrailListPanel from '../components/TrailListPanel';
import { calculateGeoJsonLength } from '../utils/geoUtils';

const geojson = routeData as FeatureCollection;

// statikus adatok kiemelése hogy ne generálódjon újra
const mockTrails = trailData.map(
  (t) =>
    new Trail({
      ...t,
      difficulty: t.difficulty as DifficultyLevel,
    }),
);

// stílusok stabilizálása hogy ne jöjjön létre új objektum
const visualLayerStyle: PathOptions = {
  weight: 5,
  color: '#3388ff',
  interactive: false,
};
const interactionLayerStyle: PathOptions = {
  weight: 30,
  opacity: 0,
  lineCap: 'round',
  lineJoin: 'round',
};

// segéd komponens a térkép események elkapására
const MapEvents = ({
  onContextMenu,
  onMapClick,
}: {
  onContextMenu: (e: LeafletMouseEvent) => void;
  onMapClick: (e: LeafletMouseEvent) => void;
}) => {
  useMapEvents({
    contextmenu: (e) => onContextMenu(e), // jobb klikk
    click: (e) => onMapClick(e), // bal klikk
  });
  return null;
};

function RoutePage() {
  const { t } = useTranslation();

  const [map, setMap] = useState<Map | null>(null);
  // itt tároljuk a lekért nevezetességeket
  const [pois, setPois] = useState<OverpassElement[]>([]);

  // navigációs állapotok
  const [navStart, setNavStart] = useState<[number, number] | null>(null);
  const [navEnd, setNavEnd] = useState<[number, number] | null>(null);
  const [navIntermediates, setNavIntermediates] = useState<[number, number][]>(
    [],
  );
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    lat: number;
    lng: number;
  } | null>(null);
  // a kiválasztott túra adatai
  const [selectedTrail, setSelectedTrail] = useState<Trail | null>(null);

  // navigációs kiválasztási mód
  const [selectionMode, setSelectionMode] = useState<
    'start' | 'end' | 'waypoint' | null
  >(null);

  // egyedi útvonal szerkesztő állapotok
  const [customRouteName, setCustomRouteName] = useState('');
  const [customRouteDesc, setCustomRouteDesc] = useState('');
  const [customRouteStats, setCustomRouteStats] = useState({
    distance: 0,
    time: 0,
  });

  //Utvonal hozzadasa sidebar allapot valtozo
  const [createStartButton, setCreateStartButton] = useState(false);

  // Feltöltött GPX útvonal tárolása
  const [uploadedGpxGeoJson, setUploadedGpxGeoJson] =
    useState<FeatureCollection | null>(null);

  // ref a navigációs állapot követésére
  const isNavigationActiveRef = useRef(false);

  // ref a térkép konténerhez a görgetéshez
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // ref az utolsó API kérés azonosításához
  const lastRequestIdRef = useRef<number>(0);

  const isManualNavigationActive = !!(
    navStart ||
    navEnd ||
    navIntermediates.length > 0
  );

  useEffect(() => {
    isNavigationActiveRef.current = !!(
      selectionMode ||
      navStart ||
      navEnd ||
      navIntermediates.length > 0
    );
  }, [selectionMode, navStart, navEnd, navIntermediates]);

  const handleRouteSelect = useCallback(
    async (coordinates: [number, number][]) => {
      const requestId = Date.now();
      lastRequestIdRef.current = requestId;

      const apiCoordinates = coordinates.map(([lon, lat]) => ({ lat, lon }));

      const results = await getNearbyPOIs(apiCoordinates, 200);

      if (lastRequestIdRef.current === requestId) {
        const namedPois = results.filter((p) => p.tags && p.tags.name);
        setPois(namedPois);
      }
    },
    [],
  );

  // eseménykezelő a geojson réteghez
  const onEachFeature = useCallback(
    (feature: Feature, layer: Layer) => {
      layer.on({
        click: () => {
          if (isNavigationActiveRef.current) return;

          if (feature.geometry.type === 'LineString') {
            const trailId = feature.properties?.id;

            if (trailId) {
              const foundTrail = mockTrails.find((t) => t.id === trailId);
              if (foundTrail) {
                setSelectedTrail(foundTrail);
              }
            }

            handleRouteSelect(
              feature.geometry.coordinates as [number, number][],
            );
          }
        },
      });
    },
    [handleRouteSelect],
  );

  // jobb klikk kezelése
  const handleContextMenu = useCallback((e: LeafletMouseEvent) => {
    e.originalEvent.preventDefault();
    setContextMenu({
      x: e.originalEvent.clientX,
      y: e.originalEvent.clientY,
      lat: e.latlng.lat,
      lng: e.latlng.lng,
    });
  }, []);

  const handleNavFrom = useCallback(() => {
    if (uploadedGpxGeoJson) {
      alert(
        'GPX fájl be van töltve. Töröld a navigációt a manuális tervezéshez!',
      );
      return;
    }
    if (contextMenu) {
      setNavStart([contextMenu.lat, contextMenu.lng]);
      setContextMenu(null);
      setSelectedTrail(null);
      setPois([]);
    }
  }, [contextMenu, uploadedGpxGeoJson]);

  const handleNavTo = useCallback(() => {
    if (uploadedGpxGeoJson) {
      alert(
        'GPX fájl be van töltve. Töröld a navigációt a manuális tervezéshez!',
      );
      return;
    }
    if (contextMenu) {
      setNavEnd([contextMenu.lat, contextMenu.lng]);
      setContextMenu(null);
      setSelectedTrail(null);
      setPois([]);
    }
  }, [contextMenu, uploadedGpxGeoJson]);

  const handleAddWaypoint = useCallback(() => {
    if (uploadedGpxGeoJson) {
      alert(
        'GPX fájl be van töltve. Töröld a navigációt a manuális tervezéshez!',
      );
      return;
    }
    if (contextMenu) {
      setNavIntermediates((prev) => [
        ...prev,
        [contextMenu.lat, contextMenu.lng],
      ]);
      setContextMenu(null);
      setSelectedTrail(null);
      setPois([]);
    }
  }, [contextMenu, uploadedGpxGeoJson]);

  const handleClearNav = useCallback(() => {
    setNavStart(null);
    setNavEnd(null);
    setNavIntermediates([]);

    if (!uploadedGpxGeoJson) {
      setCustomRouteStats({ distance: 0, time: 0 });
      setCustomRouteName('');
    }
    setContextMenu(null);
  }, [uploadedGpxGeoJson]);

  // egyedi pontok törlése
  const handleRemoveStart = useCallback(() => {
    setNavStart(null);
  }, []);

  const handleRemoveEnd = useCallback(() => {
    setNavEnd(null);
  }, []);

  const handleRemoveWaypoint = useCallback((index: number) => {
    setNavIntermediates((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleRouteFound = useCallback(
    (summary: { totalDistance: number; totalTime: number }) => {
      setCustomRouteStats({
        distance: summary.totalDistance,
        time: summary.totalTime,
      });
    },
    [],
  );

  const handleMapClick = useCallback(
    (e: LeafletMouseEvent) => {
      if (contextMenu) {
        setContextMenu(null);
        return;
      }

      if (uploadedGpxGeoJson) {
        alert(
          'GPX fájl be van töltve. Töröld a navigációt a manuális tervezéshez!',
        );
        return;
      }

      if (selectionMode === 'start') {
        setNavStart([e.latlng.lat, e.latlng.lng]);
        setSelectionMode(null);
      } else if (selectionMode === 'end') {
        setNavEnd([e.latlng.lat, e.latlng.lng]);
        setSelectionMode(null);
      } else if (selectionMode === 'waypoint') {
        setNavIntermediates((prev) => [...prev, [e.latlng.lat, e.latlng.lng]]);
        setSelectionMode(null);
      }
    },
    [selectionMode, uploadedGpxGeoJson, contextMenu],
  );

  // kártya gombjának kezelése
  const handleTrailCardSelect = useCallback(
    (trailId: string) => {
      const feature = geojson.features.find(
        (f) => f.properties?.id === trailId && f.geometry.type === 'LineString',
      );

      if (feature && feature.geometry.type === 'LineString') {
        const coordinates = feature.geometry.coordinates as [number, number][];

        // logika futtatása
        handleRouteSelect(coordinates);

        // kiválasztott túra beállítása
        const foundTrail = mockTrails.find((t) => t.id === trailId);
        if (foundTrail) setSelectedTrail(foundTrail);

        // térkép mozgatása
        if (map) {
          // konverzió a határokhoz
          const leafletCoords = coordinates.map(
            ([lon, lat]) => [lat, lon] as [number, number],
          );
          const bounds = latLngBounds(leafletCoords);
          map.fitBounds(bounds, { padding: [50, 50], animate: false });
        }

        // felgörgetés a térképhez
        if (mapContainerRef.current) {
          const yCoordinate =
            mapContainerRef.current.getBoundingClientRect().top +
            window.scrollY;
          const yOffset = -100;
          window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' });
        }
      }
    },
    [map, handleRouteSelect],
  );

  // waypoints memorizálása
  const waypoints = useMemo(() => {
    return navStart && navEnd ? [navStart, ...navIntermediates, navEnd] : [];
  }, [navStart, navEnd, navIntermediates]);

  // szűrt geojson adat a kiválasztott túra alapján
  const filteredGeoJson = useMemo(() => {
    if (!selectedTrail) return null;

    const feature = geojson.features.find(
      (f) => f.properties?.id === selectedTrail.id,
    );

    if (feature) {
      const collection: FeatureCollection = {
        type: 'FeatureCollection',
        features: [feature],
      };
      return collection;
    }
    return null;
  }, [selectedTrail]);

  // GPX betöltés kezelése és zoomolás
  const handleGpxLoaded = useCallback(
    async (data: FeatureCollection | null) => {
      setUploadedGpxGeoJson(data);

      if (!data) {
        setPois([]);
        setCustomRouteStats({ distance: 0, time: 0 });
        return;
      }

      if (navStart || navEnd || navIntermediates.length > 0) {
        return;
      }

      // Biztosítjuk, hogy a szerkesztő panel nyitva maradjon
      setCreateStartButton(true);

      // Ha van adat, zoomoljunk rá
      if (data.features && data.features.length > 0 && map) {
        const feature = data.features[0];
        if (feature.geometry.type === 'LineString') {
          const coordinates = feature.geometry.coordinates as [
            number,
            number,
          ][];

          const leafletCoords = coordinates.map(
            ([lon, lat]) => [lat, lon] as [number, number],
          );
          map.fitBounds(latLngBounds(leafletCoords), { padding: [50, 50] });

          const distanceMeters = calculateGeoJsonLength(coordinates);

          const estimatedTimeSeconds = distanceMeters / (4000 / 3600);

          setCustomRouteStats({
            distance: distanceMeters,
            time: estimatedTimeSeconds,
          });

          // POI-k lekérése a feltöltött útvonal mentén
          const requestId = Date.now();
          lastRequestIdRef.current = requestId;

          const apiCoordinates = coordinates.map(([lon, lat]) => ({
            lat,
            lon,
          }));

          const results = await getNearbyPOIs(apiCoordinates, 200);

          if (lastRequestIdRef.current === requestId) {
            const namedPois = results.filter((p) => p.tags && p.tags.name);
            setPois(namedPois);
          }
        }
      }
    },
    [map, navStart, navEnd, navIntermediates],
  );

  // segédfüggvény a sidebar tartalmának kiválasztására
  const renderSidebarContent = () => {
    // utvonal tervezes menu
    if (navStart || navEnd || createStartButton) {
      return (
        <RouteEditorPanel
          name={customRouteName}
          description={customRouteDesc}
          distance={customRouteStats.distance}
          time={customRouteStats.time}
          onNameChange={setCustomRouteName}
          onDescriptionChange={setCustomRouteDesc}
          onSave={() => alert(`Útvonal mentve: ${customRouteName}`)}
          closeRouteEditor={() => {
            setCreateStartButton(false);
          }}
          onGpxLoaded={handleGpxLoaded}
          disableGpxUpload={isManualNavigationActive}
        />
      );
    }

    // alapertelmezetten megjeleniti az utvonalak listajat
    return (
      <TrailListPanel
        onSelectTrail={handleTrailCardSelect}
        onStartCreateRoute={() => {
          setCreateStartButton(true);
        }}
      />
    );
  };

  return (
    <div className="route-page-wrapper">
      <h1 className="route-page-title">{t('routePageH1')}</h1>
      <div className="map-section-container">
        {/* bal oldali sáv tartalma a segédfüggvény alapján */}
        <div className="map-sidebar">{renderSidebarContent()}</div>

        {/* ha választunk a kurzor legyen célkereszt */}
        <div
          ref={mapContainerRef}
          className={`map-container-wrapper ${selectionMode ? 'selection-mode-active' : ''}`}
          style={{ flexGrow: 1 }}>
          <MapContainer
            className="map"
            center={[48.1007, 20.7897]}
            zoom={13}
            ref={setMap}>
            {/* eseményfigyelő a klikkekhez */}
            <MapEvents
              onContextMenu={handleContextMenu}
              onMapClick={handleMapClick}
            />

            {/* open street maps csempék */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* útvonaltervező megjelenítése */}
            {navStart && navEnd && (
              <RoutingMachine
                waypoints={waypoints}
                onRouteFound={handleRouteFound}
              />
            )}

            {/* köztes pontok megjelenítése */}
            {navIntermediates.map((pos, idx) => (
              <Marker
                key={`waypoint-${idx}`}
                position={pos}
                icon={waypointIcon}>
                <Popup>
                  <div className="popup-content-wrapper">
                    <strong>Köztes pont {idx + 1}</strong>
                    <br />
                    <button
                      onClick={() => handleRemoveWaypoint(idx)}
                      className="popup-delete-btn">
                      <MdDelete style={{ marginRight: '4px' }} /> Törlés
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* start pont megjelenítése */}
            {navStart && (
              <Marker position={navStart} icon={startIcon}>
                <Popup>
                  <div className="popup-content-wrapper">
                    <strong>Start pont</strong>
                    <br />
                    <button
                      onClick={handleRemoveStart}
                      className="popup-delete-btn">
                      <MdDelete style={{ marginRight: '4px' }} /> Törlés
                    </button>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* célpont megjelenítése */}
            {navEnd && (
              <Marker position={navEnd} icon={endIcon}>
                <Popup>
                  <div className="popup-content-wrapper">
                    <strong>Cél pont</strong>
                    <br />
                    <button
                      onClick={handleRemoveEnd}
                      className="popup-delete-btn">
                      <MdDelete style={{ marginRight: '4px' }} /> Törlés
                    </button>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* vizuális réteg */}
            {filteredGeoJson && (
              <GeoJSON
                key={`visual-${selectedTrail?.id}`}
                data={filteredGeoJson}
                style={visualLayerStyle}
              />
            )}

            {/* interakciós réteg */}
            {filteredGeoJson && (
              <GeoJSON
                key={`interaction-${selectedTrail?.id}`}
                data={filteredGeoJson}
                onEachFeature={onEachFeature}
                style={interactionLayerStyle}
              />
            )}

            {/* Feltöltött GPX útvonal megjelenítése (kék szaggatott vonal) */}
            {uploadedGpxGeoJson && (
              <GeoJSON
                key="uploaded-gpx"
                data={uploadedGpxGeoJson}
                style={{ ...visualLayerStyle, dashArray: '10, 10' }}
              />
            )}

            <MarkerClusterGroup
              chunkedLoading
              iconCreateFunction={createClusterCustomIcon}>
              {pois.length > 0 &&
                pois.map((poi) => (
                  <Marker
                    key={poi.id}
                    position={[poi.lat, poi.lon]}
                    icon={getIconForPoi(poi)}>
                    <Popup>{poi.tags?.name}</Popup>
                  </Marker>
                ))}
            </MarkerClusterGroup>
          </MapContainer>
          <MapLegend />

          {/* jobb oldali navigációs panel */}
          <MapNavigationControls
            onSelectStartMode={() => {
              if (uploadedGpxGeoJson) {
                alert(
                  'GPX fájl be van töltve. Töröld a navigációt a manuális tervezéshez!',
                );
                return;
              }
              setSelectionMode('start');
              setSelectedTrail(null);
              setPois([]);
            }}
            onSelectEndMode={() => {
              if (uploadedGpxGeoJson) {
                alert(
                  'GPX fájl be van töltve. Töröld a navigációt a manuális tervezéshez!',
                );
                return;
              }
              setSelectionMode('end');
              setSelectedTrail(null);
              setPois([]);
            }}
            onSelectWaypointMode={() => {
              if (uploadedGpxGeoJson) {
                alert(
                  'GPX fájl be van töltve. Töröld a navigációt a manuális tervezéshez!',
                );
                return;
              }
              setSelectionMode('waypoint');
              setSelectedTrail(null);
              setPois([]);
            }}
            onClear={handleClearNav}
            selectionMode={selectionMode}
          />
        </div>
      </div>

      {/* saját jobb klikk menü */}
      {contextMenu && (
        <MapContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onNavFrom={handleNavFrom}
          onNavTo={handleNavTo}
          onAddWaypoint={handleAddWaypoint}
          onClearNav={handleClearNav}
        />
      )}

      {/* kiválasztott túra részletei */}
      {selectedTrail && (
        <SelectedTrailDetails trail={selectedTrail} pois={pois} map={map} />
      )}

      <div className="trail-container">
        {mockTrails.map((trail) => (
          <TrailCard
            key={trail.id}
            trail={trail}
            onSelect={handleTrailCardSelect}
          />
        ))}
      </div>
    </div>
  );
}
export default RoutePage;
