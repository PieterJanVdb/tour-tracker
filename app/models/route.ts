import { tracked } from '@glimmer/tracking';

const ARRIVAL_POI_TYPE = 3;

interface ProfilePointPayload {
  Latitude: number;
  Longitude: number;
}

interface PointOfInterest extends ProfilePointPayload {
  PointOfInterestType: number;
}

export type LatLng = [number, number];

export interface RoutePayload {
  profilePoints: ProfilePointPayload[];
  PointsOfInterest: PointOfInterest[];
}

export default class Route {
  @tracked markers?: LatLng[];
  @tracked arrival?: LatLng;

  static fromJsonApi(payload: RoutePayload): Route {
    const route = new Route();

    const arrival = payload.PointsOfInterest.find(p => p.PointOfInterestType === ARRIVAL_POI_TYPE);

    if (arrival) {
      route.arrival = [arrival.Latitude, arrival.Longitude];
    }

    route.markers = payload.profilePoints.map(p => ([p.Latitude, p.Longitude]));

    return route;
  }
}
