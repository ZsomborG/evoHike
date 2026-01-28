import type { FeatureCollection } from 'geojson';

export const parseGpxToGeoJSON = (
  gpxString: string,
): FeatureCollection | null => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(gpxString, 'text/xml');
    const trackPoints = Array.from(xmlDoc.getElementsByTagName('trkpt'));

    if (trackPoints.length === 0) return null;

    const coordinates = trackPoints.map((pt) => [
      parseFloat(pt.getAttribute('lon')!),
      parseFloat(pt.getAttribute('lat')!),
    ]);

    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates,
          },
        },
      ],
    };
  } catch (e) {
    console.error('Hiba a GPX feldolgozása közben:', e);
    return null;
  }
};
