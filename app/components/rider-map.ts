import Component from '@glimmer/component';
import Route, { LatLng } from 'tour-tracker/models/route';

interface RiderMapArguments {
  route: Route;
}

const FRANCE: LatLng = [46.228923, 2.212327];
const DEFAULT_ROUTE = new Route();
DEFAULT_ROUTE.markers = [FRANCE];

export default class RiderMap extends Component<RiderMapArguments> {
  get route(): Route {
    return this.args.route || DEFAULT_ROUTE;
  }
}
