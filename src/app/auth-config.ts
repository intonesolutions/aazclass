/**
 * This file contains authentication parameters. Contents of this file
 * is roughly the same across other MSAL.js libraries. These parameters
 * are used to initialize Angular and MSAL Angular configurations in
 * in app.module.ts file.
 */

 import { LogLevel, Configuration, BrowserCacheLocation } from '@azure/msal-browser'; 

 const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;
 
 /**
  * Configuration object to be passed to MSAL instance on creation. 
  * For a full list of MSAL.js configuration parameters, visit:
  * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md 
  */
 export const msalConfig: Configuration = {
     auth: {
         clientId: 'b5a35f99-ec05-4e1b-86ce-37a879e4bcbd', // This is the ONLY mandatory field that you need to supply.
         authority: 'https://traderbot.b2clogin.com/traderbot.onmicrosoft.com/b2c_1_default', // Defaults to "https://login.microsoftonline.com/common"
         redirectUri: '/user/bank', // Points to window.location.origin. You must register this URI on Azure portal/App Registration.
         postLogoutRedirectUri: '/', // Indicates the page to navigate after logout.
         navigateToLoginRequestUrl: true, // If "true", will navigate back to the original request location before processing the auth code response.
         knownAuthorities: ["traderbot.b2clogin.com"], // array of URIs that are known to be valid,

     },
     cache: {
         cacheLocation: BrowserCacheLocation.LocalStorage, // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
         storeAuthStateInCookie: isIE, // Set this to "true" if you are having issues on IE11 or Edge
     },
     system: {
         loggerOptions: {
             loggerCallback(logLevel: LogLevel, message: string) {
                 console.log(message);
             },
             logLevel: LogLevel.Verbose,
             piiLoggingEnabled: false
         }
     }
 }
 
 /**
  * An optional silentRequest object can be used to achieve silent SSO
  * between applications by providing a "login_hint" property.
  */
 export const silentRequest = {
     scopes: ["openid", "profile"],
     loginHint: "example@domain.net"
 };