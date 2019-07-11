import { tracked } from '@glimmer/tracking';
import { setProperties } from '@ember/object';

interface ProfilePointPayload {
  Latitude: number;
  Longitude: number;
}

export type LatLng = [number, number];

export interface RoutePayload {
  profilePoints: ProfilePointPayload[];
}

export default class Route {
  @tracked markers?: LatLng[];

  static fromJsonApi(payload: RoutePayload): Route {
    const route = new Route();

    setProperties(route, {
      markers: payload.profilePoints.map(p => ([p.Latitude, p.Longitude])),
    });

    return route;
  }
}
