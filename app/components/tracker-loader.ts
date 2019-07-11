import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import fetch from 'fetch';
import { action } from '@ember/object';
import Rider, { RiderPayload } from '../models/rider';
import { alias } from '@ember/object/computed';
import Stage, { StagePayload } from 'tour-tracker/models/stage';
import Route, { RoutePayload } from 'tour-tracker/models/route';

const RIDERS_URL = 'https://fep-api.dimensiondata.com/v2/rider/33';
const ROUTE_URL = 'https://fep-api.dimensiondata.com/v2/map/route/{stage}/2';
const STAGE_URL = 'https://fep-api.dimensiondata.com/v2/race/33/stages/current';
const STORAGE_KEY = 'tracker-loader:team';

const COLORS = [
  'e6194b',
  'ffe119',
  'bfef45',
  '3cb44b',
  '42d4f4',
  '4363d8',
  '800000',
  '911eb4',
  'f032e6',
  'f58231',
  '469990',
  '000000',
  '9a6324',
];

export default class TrackerLoaderComponent extends Component {
  @tracked team: Rider[] = []

  @alias('fetchRiders.lastSuccessful.value')
  riders: Rider[] = [];

  @alias('fetchStage.lastSuccessful.value')
  stage?: Stage;

  @alias('fetchRoute.lastSuccessful.value')
  route?: Route;

  constructor(owner: any, args: any) {
    super(owner, args);

    this.restoreTeam();
    
    (this.initData as any).perform();
  }

  @task
  *initData(): any {
    yield (this.fetchRiders as any).perform();
    const stage = yield (this.fetchStage as any).perform();
    yield (this.fetchRoute as any).perform(stage);
  }

  @task
  *fetchRiders(): any {
    const response = yield fetch(RIDERS_URL);
    const riders: RiderPayload[] = yield response.json();
    return riders.map(r => Rider.fromJsonApi(r));
  }

  @task
  *fetchStage(): any {
    const response = yield fetch(STAGE_URL);
    const stage: StagePayload = yield response.json();
    return Stage.fromJsonApi(stage);
  }

  @task
  *fetchRoute(stage: Stage): any {
    if (stage.id) {
      const response = yield fetch(ROUTE_URL.replace('{stage}', stage.id.toString()));
      const route: RoutePayload = yield response.json();
      return Route.fromJsonApi(route);
    }
  }

  getColor(): string {
    const result = COLORS.find((color) => {
      return !this.team.find(r => r.color === color);
    });

    return result || '#ffffff';
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
    rider.color = this.getColor();
    this.team = [...this.team, rider];
    this.storeTeam();
  }

  @action
  onRemoveRider(rider: Rider): void {
    this.team = this.team.filter(r => r.id !== rider.id);
    this.storeTeam();
  }
}
