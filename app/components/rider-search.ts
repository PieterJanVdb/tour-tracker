import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { alias } from '@ember/object/computed';
import { restartableTask, Task } from 'ember-concurrency-decorators';
import { timeout } from 'ember-concurrency';
import Rider from '../models/rider';
import { later } from '@ember/runloop';

const AUTOCOMPLETE_BEGIN_LENGTH = 3;
const DEBOUNCE_MS = 250;

interface RiderSearchArguments {
  riders: Rider[];
  team: Rider[];
  onSelectRider(rider: Rider): void;
}

export default class RiderSearch extends Component<RiderSearchArguments> {
  @tracked value: string = '';
  @tracked show: boolean = false;

  @alias('searchRider.lastSuccessful.value') results: Rider[] = [];

  get riders(): Rider[] {
    const riders: Rider[] = this.args.riders;
    const team: Rider[] = this.args.team;
    return riders.filter(r => !team.find(t => t.id === r.id));
  }

  @restartableTask(function*(this: RiderSearch, search: string): any {
    if (!search || search.length < AUTOCOMPLETE_BEGIN_LENGTH) {
      return [];
    }

    yield timeout(DEBOUNCE_MS);

    const searchRegex = new RegExp(search, 'gi');
    return this.riders.filter((rider: Rider) => {
      const matches = rider.fullName.match(searchRegex);

      if (matches) {
        return matches.length;
      }

      return false;
    });
  }) searchRider!: Task;

  @action
  onSearch(value: string): void {
    this.value = value;
    this.show = true;
    this.searchRider.perform(value);
  }

  @action
  onSelect(rider: Rider): void {
    this.value = '';
    this.searchRider.perform('');
    this.args.onSelectRider(rider);
  }

  @action
  onBlur(): void {
    // SMELL: delay hiding the results until the onSelect
    // action has completed
    later(() => {
      if (!this.isDestroyed) {
        this.show = false;
      }
    }, 100);
  }
}
