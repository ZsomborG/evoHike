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
import RouteRadiusVisualizer from '../components/RouteRadiusVisualizer';
import MapContextMenu from '../components/MapContextMenu';
import SelectedTrailDetails from '../components/SelectedTrailDetails';
import MapLegend from '../components/MapLegend';
import MapNavigationControls from '../components/MapNavigationControls';
import RouteEditorPanel from '../components/RouteEditorPanel';
import { MdDelete } from 'react-icons/md';
import RouteForm from '../components/RouteForm';
import TrailListPanel from '../components/TrailListPanel';

const geojson = routeData as FeatureCollection;

// statikus adatok kiemelése hogy ne generálódjon újra
// mivel az adatok nem változnak felesleges újra mapelni
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
  // itt tároljuk a keresési sávot a vizualizációhoz
  const [searchPath, setSearchPath] = useState<[number, number][] | null>(null);

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

  // ref a navigációs állapot követésére
  const isNavigationActiveRef = useRef(false);

  // ref a térkép konténerhez a görgetéshez
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    isNavigationActiveRef.current = !!(
      selectionMode ||
      navStart ||
      navEnd ||
      navIntermediates.length > 0
    );
  }, [selectionMode, navStart, navEnd, navIntermediates]);

  // ez fut le ha kiválasztunk egy útvonalat
  const handleRouteSelect = useCallback(
    async (coordinates: [number, number][]) => {
      // geojson konverzió leaflethez
      // fontos mert a geojson fordítva tárolja a koordinátákat
      const apiCoordinates = coordinates.map(([lon, lat]) => ({ lat, lon }));

      // a vizualizációhoz is lat lon kell
      const leafletCoordinates = coordinates.map(
        ([lon, lat]) => [lat, lon] as [number, number],
      );

      // beállítjuk a keresési útvonalat
      setSearchPath(leafletCoordinates);

      // lekérjük az adatokat az apitól
      // 200 méteres sugárban keresünk
      const results = await getNearbyPOIs(apiCoordinates, 200);

      // csak a nevesített pontokat tartjuk meg
      const namedPois = results.filter((p) => p.tags && p.tags.name);
      setPois(namedPois);
    },
    [],
  );

  // eseménykezelő a geojson réteghez
  const onEachFeature = useCallback(
    (feature: Feature, layer: Layer) => {
      layer.on({
        click: () => {
          // ha navigálunk ne engedjük a túra kiválasztását
          if (isNavigationActiveRef.current) return;

          if (feature.geometry.type === 'LineString') {
            // kiolvassuk az idt a geojsonból
            const trailId = feature.properties?.id;

            // megkeressük a hozzá tartozó adatokat
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
    // megakadályozzuk az alapértelmezett menüt
    e.originalEvent.preventDefault();
    setContextMenu({
      x: e.originalEvent.clientX,
      y: e.originalEvent.clientY,
      lat: e.latlng.lat,
      lng: e.latlng.lng,
    });
  }, []);

  const handleNavFrom = useCallback(() => {
    if (contextMenu) {
      setNavStart([contextMenu.lat, contextMenu.lng]);
      setContextMenu(null);
      setSelectedTrail(null);
      setPois([]);
      setSearchPath(null);
    }
  }, [contextMenu]);

  const handleNavTo = useCallback(() => {
    if (contextMenu) {
      setNavEnd([contextMenu.lat, contextMenu.lng]);
      setContextMenu(null);
      setSelectedTrail(null);
      setPois([]);
      setSearchPath(null);
    }
  }, [contextMenu]);

  const handleAddWaypoint = useCallback(() => {
    if (contextMenu) {
      setNavIntermediates((prev) => [
        ...prev,
        [contextMenu.lat, contextMenu.lng],
      ]);
      setContextMenu(null);
      setSelectedTrail(null);
      setPois([]);
      setSearchPath(null);
    }
  }, [contextMenu]);

  const handleClearNav = useCallback(() => {
    setNavStart(null);
    setNavEnd(null);
    setNavIntermediates([]);
    setCustomRouteStats({ distance: 0, time: 0 }); // statisztika nullázása
    setCustomRouteName('');
    setContextMenu(null);
  }, []);

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

  // ez fut le ha kész a számítás
  const handleRouteFound = useCallback(
    (summary: { totalDistance: number; totalTime: number }) => {
      setCustomRouteStats({
        distance: summary.totalDistance,
        time: summary.totalTime,
      });
    },
    [],
  );

  // térképre kattintás kezelése
  const handleMapClick = useCallback(
    (e: LeafletMouseEvent) => {
      if (selectionMode === 'start') {
        // ha start módban vagyunk lerakjuk a kezdőpontot
        setNavStart([e.latlng.lat, e.latlng.lng]);
        setSelectionMode(null); // kilépünk a módból
      } else if (selectionMode === 'end') {
        // ha cél módban vagyunk lerakjuk a végpontot
        setNavEnd([e.latlng.lat, e.latlng.lng]);
        setSelectionMode(null); // kilépünk a módból
      } else if (selectionMode === 'waypoint') {
        // ha köztes pont módban vagyunk
        setNavIntermediates((prev) => [...prev, [e.latlng.lat, e.latlng.lng]]);
        setSelectionMode(null);
      } else {
        // alapértelmezett bezárjuk a menüt
        setContextMenu(null);
      }
    },
    [selectionMode],
  );

  // kártya gombjának kezelése
  const handleTrailCardSelect = useCallback(
    (trailId: string) => {
      // megkeressük a geometriát id alapján
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
          map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
        }

        // felgörgetés a térképhez
        if (mapContainerRef.current) {
          const yCoordinate =
            mapContainerRef.current.getBoundingClientRect().top +
            window.scrollY;
          const yOffset = -100; // navbar magassága + kis ráhagyás
          window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' });
        }
      }
    },
    [map, handleRouteSelect],
  );

  // waypoints memorizálása
  // fontos hogy ne renderelődjön újra feleslegesen
  // különben végtelen ciklust okoz
  const waypoints = useMemo(() => {
    return navStart && navEnd ? [navStart, ...navIntermediates, navEnd] : [];
  }, [navStart, navEnd, navIntermediates]);

  // szűrt geojson adat a kiválasztott túra alapján
  const filteredGeoJson = useMemo(() => {
    if (!selectedTrail) return null;

    const feature = geojson.features.find(
      (f) => f.properties?.id === selectedTrail.id,
    );

    // ha megtaláltuk a vonalat becsomagoljuk egy szabványos geojson objektumba
    if (feature) {
      const collection: FeatureCollection = {
        type: 'FeatureCollection',
        features: [feature],
      };
      return collection;
    }
    return null;
  }, [selectedTrail]);

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
      <div className="form-container">
        <RouteForm />
      </div>

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

            {/* keresési sáv megjelenítése */}
            {searchPath && (
              <RouteRadiusVisualizer path={searchPath} radius={200} />
            )}

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
                key={`visual-${selectedTrail?.id}`} // a key miatt újrarajzolja ha változik az id
                data={filteredGeoJson}
                style={visualLayerStyle}
              />
            )}

            {/* interakciós réteg */}
            {filteredGeoJson && (
              <GeoJSON
                key={`interaction-${selectedTrail?.id}`} // ide is kell a key
                data={filteredGeoJson}
                onEachFeature={onEachFeature}
                style={interactionLayerStyle}
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
              setSelectionMode('start');
              setSelectedTrail(null);
              setPois([]);
              setSearchPath(null);
            }}
            onSelectEndMode={() => {
              setSelectionMode('end');
              setSelectedTrail(null);
              setPois([]);
              setSearchPath(null);
            }}
            onSelectWaypointMode={() => {
              setSelectionMode('waypoint');
              setSelectedTrail(null);
              setPois([]);
              setSearchPath(null);
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
