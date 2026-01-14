import { useEffect, useState } from 'react';
import { useMap, Polyline } from 'react-leaflet';

// ez a komponens számolja a vonal vastagságát hogy mindig ugyanakkora területet fedjen le
export default function RouteRadiusVisualizer({
  path,
  radius,
}: {
  path: [number, number][];
  radius: number;
}) {
  const map = useMap();
  const [weight, setWeight] = useState(0);

  useEffect(() => {
    const updateWeight = () => {
      const centerLat = map.getCenter().lat;
      const zoom = map.getZoom();

      // föld kerülete az egyenlítőnél
      // kiszámoljuk hány méter egy pixel ezen a zoom szinten
      const metersPerPixel =
        (40075016 * Math.cos((centerLat * Math.PI) / 180)) /
        Math.pow(2, zoom + 8);

      // beállítjuk a vonal vastagságát pixelben
      setWeight((radius * 2) / metersPerPixel);
    };

    updateWeight(); // első futás

    map.on('zoomend', updateWeight);
    map.on('moveend', updateWeight); // ha mozog a térkép újraszámolunk

    return () => {
      map.off('zoomend', updateWeight);
      map.off('moveend', updateWeight);
    };
  }, [map, radius]);

  return (
    <Polyline
      positions={path}
      pathOptions={{
        color: 'red',
        weight: weight,
        opacity: 0.2,
        lineCap: 'round',
        lineJoin: 'round',
      }}
    />
  );
}
