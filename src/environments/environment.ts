// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //apiUrl: window.location.hostname=='localhost'?'http://localhost:3000':window.location.protocol+'//'+window.location.hostname+(window.location.port?':'+window.location.port:''),
  apiServiceUrl:window.location.hostname=='localhost'?'http://localhost:3102/api/':
  window.location.hostname.indexOf('192.168.')==0? 'https://'+window.location.hostname+':3543/api/'
  :window.location.protocol+'//'+window.location.hostname+(window.location.port?':3102':'')+'/api/',
}; 

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.