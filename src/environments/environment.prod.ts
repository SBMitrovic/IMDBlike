export const environment = {
  production: true,
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
    apiKey: getEnvVariable('TMDB_API_KEY')
    // NAPOMENA: bearerToken se NE koristi na frontend-u - ostaje samo na serverless funkciji (backend)
  }
};

function getEnvVariable(key: string): string {
  return (window as any).__env__?.[key] || '';
}
