// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: getEnvVariable('FIREBASE_API_KEY'),
    authDomain: "imdblike-angular2.firebaseapp.com",
    projectId: "imdblike-angular2",
    storageBucket: "imdblike-angular2.firebasestorage.app",
    messagingSenderId: "287572710694",
    appId: "1:287572710694:web:bbe0132fae549d35691de7",
    measurementId: "G-6BZ2V76E2Y"
  },
  tmdb: {
    apiKey: getEnvVariable('TMDB_API_KEY'),
    bearerToken: getEnvVariable('TMDB_BEARER_TOKEN')
  }
};

function getEnvVariable(key: string): string {
  return (window as any).__env__?.[key] || '';
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';
