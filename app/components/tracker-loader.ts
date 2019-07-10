import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import fetch from 'fetch';
import { action } from '@ember/object';
import Rider, { RiderPayload } from '../models/rider';
import { alias } from '@ember/object/computed';


const RIDERS_URL = 'https://fep-api.dimensiondata.com/v2/rider/33';
const ROUTE_URL = 'https://fep-api.dimensiondata.com/v2/stages/v2/328/route?reductionfactor=100';
const TELEMETRY_URL = 'https://fep-api.dimensiondata.com/v2/stages/328/rider-telemetry';
const MAP_ROUTE_URL = 'https://fep-api.dimensiondata.com/v2/map/route/328/2';
const STORAGE_KEY = 'tracker-loader:team';

export default class TrackerLoaderComponent extends Component {
  @tracked team: Rider[] = []

  @alias('fetchRiders.lastSuccessful.value')
  riders: Rider[] = [];

  constructor(owner: any, args: any) {
    super(owner, args);

    this.restoreTeam();
    (this.fetchRiders as any).perform();
  }

  @task
  *fetchRiders(): any {
    const response = yield fetch(RIDERS_URL);
    const riders: RiderPayload[] = yield response.json();
    return riders.map(r => Rider.fromJsonApi(r));
  }

  restoreTeam(): void {
    const storage = localStorage.getItem('tracker-loader:team');

    if (storage) {
      this.team = Rider.fromLocalStorage(storage);
    }
  }

  storeTeam(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.team));
  }

  @action
  onSelectRider(rider: Rider): void {
    this.team = [...this.team, rider];
    this.storeTeam();
  }

  @action
  onRemoveRider(rider: Rider): void {
    this.team = this.team.filter(r => r.id !== rider.id);
    this.storeTeam();
  }
}
