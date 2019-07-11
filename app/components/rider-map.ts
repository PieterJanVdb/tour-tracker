import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import Route, { LatLng } from 'tour-tracker/models/route';
import { task } from 'ember-concurrency-decorators';
import { timeout } from 'ember-concurrency';
import fetch from 'fetch';
import Stage from 'tour-tracker/models/stage';
import Rider from 'tour-tracker/models/rider';
import { setProperties } from '@ember/object';

interface RiderMapArguments {
  route: Route;
  stage: Stage;
  team: Rider[];
}

interface TelemetryPayload {
  Riders: RiderTelemetryPayload[];
}

interface RiderTelemetryPayload {
  Latitude: number;
  Longitude: number;
  CurrentSpeed: number;
  AverageSpeedR: number;
  Bib: number;
}

const TELEMETRY_URL = 'https://fep-api.dimensiondata.com/v2/stages/{stage}/rider-telemetry';
const FRANCE: LatLng = [46.228923, 2.212327];
const DEFAULT_ROUTE = new Route();
DEFAULT_ROUTE.markers = [FRANCE];

class RiderMarker {
  @tracked rider!: Rider;
  @tracked latlng!: LatLng;
  @tracked speed!: number;
  @tracked avgSpeed!: number;
}

export default class RiderMap extends Component<RiderMapArguments> {
  ARRIVAL_ICON_URL = '/assets/finish.png';
  ICON_SIZE = [30, 30];

  @tracked riderMarkers: RiderMarker[] = [];

  constructor(owner: any, args: RiderMapArguments) {
    super(owner, args);

    this.pollTelemetry.perform();
  }

  get route(): Route {
    return this.args.route || DEFAULT_ROUTE;
  }

  @task
  *pollTelemetry(): any {
    
    while (true) {
      const { stage, team } = this.args;

      if (stage && team) {
        const response = yield fetch(TELEMETRY_URL.replace('{stage}', `${stage.id}`));
        const telemetry: TelemetryPayload = yield response.json();
        this.updateOrCreateMarkersFromTelemetry(telemetry, team);
      }

      yield timeout(5000);
    }
  }


  updateOrCreateMarkersFromTelemetry(telemetry: TelemetryPayload, team: Rider[]): void {    
    telemetry.Riders.forEach((rt) => {
      const rider = team.find(r => r.id === rt.Bib);
      const oldRiderMarker = this.riderMarkers.find(m => m.rider.id === rt.Bib);

      if (rider) {
        const riderMarker = oldRiderMarker || new RiderMarker();
        setProperties(riderMarker, {
          rider,
          latlng: [rt.Latitude, rt.Longitude],
          speed: Math.round(rt.CurrentSpeed),
          avgSpeed: Math.round(rt.AverageSpeedR),
        });

        if (!oldRiderMarker) {
          this.riderMarkers.addObject(riderMarker);
        }
      } else if (oldRiderMarker) {
        this.riderMarkers.removeObject(oldRiderMarker);
      }
    });
  }
}
