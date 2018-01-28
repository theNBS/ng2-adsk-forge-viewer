// export interface ViewerOptions {
//   env?: String;
//   getAccessToken?: Function;
//   useADP?: boolean;
//   accessToken?: string;
//   webGLHelpLink?: string;
//   language?: string;
// }
//
//
// var options = {
//             env: 'AutodeskProduction',
//             getAccessToken: function(onGetAccessToken) {
//                 //
//                 // TODO: Replace static access token string below with call to fetch new token from your backend
//                 // Both values are provided by Forge's Authentication (OAuth) API.
//                 //
//                 // Example Forge's Authentication (OAuth) API return value:
//                 // {
//                 //    "access_token": "<YOUR_APPLICATION_TOKEN>",
//                 //    "token_type": "Bearer",
//                 //    "expires_in": 86400
//                 // }
//                 //
//                 var accessToken = '<YOUR_APPLICATION_TOKEN>';
//                 var expireTimeSeconds = 60 * 30;
//                 onGetAccessToken(accessToken, expireTimeSeconds);
//             }
//
//         };
//         var documentId = 'urn:<YOUR_URN_ID>';
//         Autodesk.Viewing.Initializer(options, function onInitialized(){
//             viewerApp = new Autodesk.Viewing.ViewingApplication('MyViewerDiv');
//             viewerApp.registerViewer(viewerApp.k3D, Autodesk.Viewing.Private.GuiViewer3D);
//             viewerApp.loadDocument(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
//         });
