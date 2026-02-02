import axios from 'axios';

// Típusok a válaszhoz
export interface OverpassElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat: number;
  lon: number;
  tags?: {
    name?: string;
    tourism?: string; // pl. viewpoint, attraction
    natural?: string; // pl. peak, spring, cave_entrance
    historic?: string; // pl. ruins, castle
    amenity?: string; // pl. drinking_water, place_of_worship
    [key: string]: string | undefined;
  };
}

interface OverpassResponse {
  elements: OverpassElement[];
}

// Egyszerű in-memory cache a válaszok tárolására
const poiCache = new Map<string, OverpassElement[]>();
const CACHE_LIMIT = 50;

/**
 * Lekéri a nevezetességeket egy útvonal mentén (Around).
 * @param coordinates Az útvonal pontjai {lat, lon} formátumban
 * @param radius Keresési sugár méterben
 */
export const getNearbyPOIs = async (
  coordinates: { lat: number; lon: number }[],
  radius: number = 200,
): Promise<OverpassElement[]> => {
  // Az API gyorsítása érdekében 10 re állitottam a pontok számát
  const targetPoints = 10;
  const step = Math.ceil(coordinates.length / targetPoints);
  const sampledCoordinates = coordinates.filter(
    (_, index) => index % step === 0,
  );

  // Biztosítjuk hogy az utolsó pont is benne legyen ha a lépésköz miatt kimaradt volna
  if (
    coordinates.length > 0 &&
    sampledCoordinates[sampledCoordinates.length - 1] !==
      coordinates[coordinates.length - 1]
  ) {
    sampledCoordinates.push(coordinates[coordinates.length - 1]);
  }

  // Koordináták összefűzése stringgé az API számára: "lat1,lon1,lat2,lon2..."
  // Optimalizáció: toFixed(5) használata
  const coordString = sampledCoordinates
    .map((c) => `${c.lat.toFixed(5)},${c.lon.toFixed(5)}`)
    .join(',');

  // Cache ellenőrzése: Ha már lekértük ezt a sugarat ehhez az útvonalhoz, visszaadjuk a tárolt választ
  const cacheKey = `${radius}-${coordString}`;
  if (poiCache.has(cacheKey)) {
    const cachedData = poiCache.get(cacheKey)!;
    // frissítjük a sorrendet (vagyis elsőnek kötöröljük majd ujra hozzáadjuk) hogy ez legyen a legújabb
    poiCache.delete(cacheKey);
    poiCache.set(cacheKey, cachedData);
    return cachedData;
  }

  // Overpass QL lekérdezés összeállítása
  const query = `
    [out:json][timeout:90];
    node(around:${radius},${coordString})->.searchArea;
    (
      node.searchArea["natural"~"peak|spring|cave_entrance|saddle"];
      node.searchArea["tourism"~"viewpoint|attraction|museum"];
      node.searchArea["historic"~"ruins|castle|memorial|monument"];
      node.searchArea["amenity"~"drinking_water|place_of_worship"];
    );
    out body;
  `;

  try {
    const response = await axios.post<OverpassResponse>(
      'https://overpass-api.de/api/interpreter',
      `data=${encodeURIComponent(query)}`,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    // Cache limit ellenőrzése: ha elértük az 50-et, töröljük a legrégebbit
    if (poiCache.size >= CACHE_LIMIT) {
      const oldestKey = poiCache.keys().next().value;
      if (oldestKey) {
        console.log('Cache limit elérve, legrégebbi elem törlése:', oldestKey);
        poiCache.delete(oldestKey);
      }
    }

    // Eredmény mentése a cache-be
    poiCache.set(cacheKey, response.data.elements);
    return response.data.elements;
  } catch (error) {
    console.error('Hiba az Overpass API lekérdezésekor:', error);
    return [];
  }
};
