// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_BASE_URL: '/api',
  firebase: {
    apiKey: "AIzaSyA_o3I1Q05fNoyE-o6NuV6r8r3l6fOMlvc",
    authDomain: "simphysic-654fb.firebaseapp.com",
    databaseURL: "https://simphysic-654fb.firebaseio.com",
    projectId: "simphysic-654fb",
    storageBucket: "simphysic-654fb.appspot.com",
    messagingSenderId: "519565277227",
    appId: "1:519565277227:web:f32010470301134115926e"
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
