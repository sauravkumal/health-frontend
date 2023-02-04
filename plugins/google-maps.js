import {Loader} from '@googlemaps/js-api-loader';

export default async (context, inject) => {
  const loader = new Loader({
    apiKey: context.$config.mapsApiKey,
    libraries: ["places"]
  });

  inject('GMaps', {loader, loaded: false})
}
