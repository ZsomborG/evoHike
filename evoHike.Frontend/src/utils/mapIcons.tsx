import { divIcon, point } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import {
  MdWaterDrop,
  MdTerrain,
  MdPlace,
  MdMuseum,
  MdRestaurant,
  MdLocalDrink,
  MdVisibility,
  MdPark,
  MdChurch,
  MdLocationOn,
  MdFlag,
} from 'react-icons/md';
import {
  GiCastle,
  GiBrokenWall,
  GiCaveEntrance,
  GiWaterfall,
} from 'react-icons/gi';
import type { OverpassElement } from '../api/overpassApi';
import '../styles/RoutPageStyles.css';

interface Cluster {
  getChildCount: () => number;
}

// ez a cluster ikon
export const createClusterCustomIcon = (cluster: Cluster) => {
  return divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: 'custom-marker-cluster',
    iconSize: point(33, 33, true),
  });
};

// segédfüggvény a react ikonok leaflet diviconná alakításához
const createReactIcon = (icon: React.ReactElement, color: string) => {
  const iconHtml = renderToStaticMarkup(
    <div className="custom-react-icon-container" style={{ color: color }}>
      {icon}
    </div>,
  );

  return divIcon({
    html: iconHtml,
    className: 'custom-react-marker', // egyedi osztály hogy ne legyen alapértelmezett fehér négyzet
    iconSize: point(40, 40, true),
    iconAnchor: [20, 40], // az ikon alja legyen a ponton
    popupAnchor: [0, -40],
  });
};

// navigációs ikonok start és cél
export const startIcon = createReactIcon(<MdLocationOn />, '#5cb85c'); // zöld
export const endIcon = createReactIcon(<MdFlag />, '#d9534f'); // piros
export const waypointIcon = createReactIcon(<MdPlace />, '#FF9800'); // narancs köztes pont

// ez választja ki az ikont a poi típusa alapján
export const getIconForPoi = (poi: OverpassElement) => {
  const tags = poi.tags || {};

  if (tags.natural === 'peak' || tags.natural === 'saddle')
    return createReactIcon(<MdTerrain />, '#795548');
  if (tags.natural === 'spring')
    return createReactIcon(<MdWaterDrop />, '#2196F3');
  if (tags.natural === 'cave_entrance')
    return createReactIcon(<GiCaveEntrance />, '#424242');
  if (tags.waterway === 'waterfall' || tags.natural === 'waterfall')
    return createReactIcon(<GiWaterfall />, '#00BCD4');

  if (tags.tourism === 'viewpoint')
    return createReactIcon(<MdVisibility />, '#FF9800');
  if (tags.tourism === 'attraction')
    return createReactIcon(<MdPlace />, '#F44336');
  if (tags.tourism === 'museum')
    return createReactIcon(<MdMuseum />, '#8D6E63');

  if (tags.historic === 'castle')
    return createReactIcon(<GiCastle />, '#9C27B0');
  if (tags.historic === 'ruins')
    return createReactIcon(<GiBrokenWall />, '#757575');
  if (tags.historic === 'memorial' || tags.historic === 'monument')
    return createReactIcon(<MdChurch />, '#607D8B');

  if (tags.amenity === 'drinking_water')
    return createReactIcon(<MdLocalDrink />, '#03A9F4');
  if (tags.amenity === 'place_of_worship')
    return createReactIcon(<MdChurch />, '#673AB7');
  if (tags.amenity === 'restaurant')
    return createReactIcon(<MdRestaurant />, '#E91E63');

  // fallback kategóriák szerint ha nincs specifikus találat
  if (tags.natural) return createReactIcon(<MdPark />, '#4CAF50');
  if (tags.historic) return createReactIcon(<MdMuseum />, '#795548');
  if (tags.tourism) return createReactIcon(<MdPlace />, '#FFC107');

  return createReactIcon(<MdPlace />, '#2196F3'); // alapértelmezett
};
