export interface LocationPoint {
  id: string;
  lat: number;
  lng: number;
  customerName: string;
  address: string;
}

const CENTRAL_HUB = { lat: 28.4595, lng: 77.0266 }; // Gurugram central hub coordinates

/**
 * Calculates Haversine distance between two sets of coordinates in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Solves Traveling Salesperson Problem (TSP) using Nearest Neighbor heuristic
 */
export function optimizeRoute(points: LocationPoint[]): {
  optimizedRoute: LocationPoint[];
  totalDistanceKm: number;
} {
  if (points.length === 0) {
    return { optimizedRoute: [], totalDistanceKm: 0 };
  }

  const unvisited = [...points];
  const optimizedRoute: LocationPoint[] = [];
  let currentLat = CENTRAL_HUB.lat;
  let currentLng = CENTRAL_HUB.lng;
  let totalDistanceKm = 0;

  while (unvisited.length > 0) {
    let closestIndex = -1;
    let minDistance = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const dist = calculateDistance(
        currentLat,
        currentLng,
        unvisited[i].lat,
        unvisited[i].lng
      );
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = i;
      }
    }

    if (closestIndex !== -1) {
      const nextPoint = unvisited[closestIndex];
      totalDistanceKm += minDistance;
      currentLat = nextPoint.lat;
      currentLng = nextPoint.lng;
      optimizedRoute.push(nextPoint);
      unvisited.splice(closestIndex, 1);
    }
  }

  // Add return path distance back to hub
  totalDistanceKm += calculateDistance(
    currentLat,
    currentLng,
    CENTRAL_HUB.lat,
    CENTRAL_HUB.lng
  );

  return { optimizedRoute, totalDistanceKm };
}
