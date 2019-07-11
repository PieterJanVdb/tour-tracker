import { tracked } from '@glimmer/tracking';
import { setProperties, getProperties } from '@ember/object';

export interface RiderPayload {
  Id: number;
  FirstName: string;
  LastName: string;
  TeamName: string;
  PhotoUri: string;
}

export default class Rider {
  @tracked id?: number;
  @tracked firstName?: string;
  @tracked lastName?: string;
  @tracked teamName?: string;
  @tracked photoUri?: string;
  @tracked color?: string;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
  
  static fromJsonApi(payload: RiderPayload): Rider {
    const rider = new Rider();

    setProperties(rider, {
      id: payload.Id,
      firstName: payload.FirstName,
      lastName: payload.LastName,
      teamName: payload.TeamName,
      photoUri: `https://racecenter.letour.fr/${payload.PhotoUri}`,
    });

    return rider;
  }

  static fromLocalStorage(json: string): Rider[] {
    try {
      const payload: Rider[] = JSON.parse(json);
      return payload.map((r): Rider => {
        const rider = new Rider();
        setProperties(rider, r);
        return rider;
      }); 
    } catch (err) {
      console.error('Failed parsing localStorage payload: ', err);
      return [];
    }
  }

  toJSON(): object {
    return getProperties(this, [
      'id',
      'firstName',
      'lastName',
      'teamName',
      'photoUri',
      'color',
    ]);
  }
}