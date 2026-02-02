import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { useMap } from 'react-leaflet';

interface RoutingMachineProps {
  waypoints: [number, number][];
  onRouteFound?: (summary: {
    totalDistance: number;
    totalTime: number;
  }) => void;
}

export default function RoutingMachine({
  waypoints,
  onRouteFound,
}: RoutingMachineProps) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // létrehozzuk az útvonaltervező vezérlőt
    // l as any kell mert a ts nem ismeri a routing kiegészítést
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const routingControl = (L as any).Routing.control({
      waypoints: waypoints.map((p) => L.latLng(p[0], p[1])),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router: (L as any).Routing.osrmv1({
        serviceUrl: 'https://routing.openstreetmap.de/routed-foot/route/v1',
        profile: 'driving', // ez egy szenvedés volt minden dokumentációban csak a profilra hivatkoznak de közben más urlje van a footnak
      }),
      routeWhileDragging: false, // húzogatással módosítható az útvonal
      lineOptions: {
        styles: [{ color: '#6FA1EC', weight: 5 }], // kék útvonal
      },
      show: false, // az útvonal kiírás letiltása
      addWaypoints: false, // ne lehessen köztes pontokat hozzáadni
      draggableWaypoints: false,
      fitSelectedRoutes: false, // ne zoomoljon rá automatikusan minden kattintásnál mert zavaró
      showAlternatives: true, // mutassa meg az alternatív útvonalakat is
      createMarker: () => null, // kikapcsoljuk az alapértelmezett markereket mert sajátokat használunk
    }).addTo(map);

    // eseményfigyelő amikor az útvonal elkészült kinyerjük az adatokat
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    routingControl.on('routesfound', function (e: any) {
      const routes = e.routes;
      const summary = routes[0].summary;
      // visszaküldjük a szülőnek a távolságot és időt
      if (onRouteFound) {
        onRouteFound({
          totalDistance: summary.totalDistance,
          totalTime: summary.totalTime,
        });
      }
    });

    // takarítás ha a komponens megszűnik töröljük a térképről
    return () => {
      map.removeControl(routingControl);
    };
  }, [map, waypoints, onRouteFound]);

  return null;
}
