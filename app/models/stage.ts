import { tracked } from '@glimmer/tracking'
import { setProperties } from '@ember/object';

export interface StagePayload {
  StageId: number;
  StageNumber: string;
  DepartingTown: string;
  ArrivingTown: string;
  TotalDistance: number;
}

export default class Stage {
  @tracked id?: number;
  @tracked stageNumber?: string;
  @tracked departingTown?: string;
  @tracked arrivingTown?: string;
  @tracked totalDistance?: number;

  static fromJsonApi(payload: StagePayload): Stage {
    const stage = new Stage();

    setProperties(stage, {
      id: payload.StageId,
      stageNumber: payload.StageNumber,
      departingTown: payload.DepartingTown,
      arrivingTown: payload.ArrivingTown,
      totalDistance: payload.TotalDistance,
    });

    return stage;
  }
}