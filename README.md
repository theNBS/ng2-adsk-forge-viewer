# Angular Autodesk Forge Viewer

[![Build Status](https://travis-ci.com/theNBS/ng2-adsk-forge-viewer.svg?branch=master)](https://travis-ci.com/theNBS/ng2-adsk-forge-viewer)

Angular wrapper for the [Autodesk Forge Viewer](https://developer.autodesk.com).

The wrapper was designed to meet the following requirements:

- A viewer component that can be dropped in to an angular anywhere; the component would take care of loading required Scripts and CSS from Autodesk's servers, rather than requiring these to be declared in the index.html.
  - Ensure the viewer can be displayed and removed from the DOM via *ngIf 
- A basic viewer extension to subscribe to common viewer events - such as Seletion changed, object tree loaded etc. and expose these events on the component
- TypeScript typings - which are now provided via Autodesk's official forge-viewer typings.
- A component that can be dropped in to display a document thumbnail.

## Dependencies

The library targets Angular 5 (and also works with Angular 6 and 7).

## Using the viewer component

Follow these steps to get the viewer working in your app.

A full demonstration of how to use the the library can be found on StackBlitz - https://stackblitz.com/edit/angular-forge-viewer.

### Step 1
Add the ng2-adsk-forge-viewer NPM package to your app - npm install `ng2-adsk-forge-viewer --save` or `yarn add ng2-adsk-forge-viewer`

### Step 2
Add `<adsk-forge-viewer></adsk-forge-viewer>` element to your component html

component.html:
```html
<adsk-forge-viewer [viewerOptions]="viewerOptions3d">
</adsk-forge-viewer>
```

### Step 3
There is a specific flow of logic to initialize the viewer:

1. Set viewerOptions
2. The viewer is constructed, loads scripts/resources from Autodesk's servers
2. The onViewerScriptsLoaded callback (optional) is called to indicate all viewer resources have been loaded
3. A onViewingApplicationInitialized callback is called indicating the ViewingApplication is ready (i.e. Autodesk.Viewing.Initializer has been called) and a document can be loaded
4. The `onViewingApplicationInitialized` event is emitted and you can now load a document. The event arguments contain a reference to the viewer which can be used to set the documentId to load. E.g.:
  ```typescript
  public loadDocument(event: ViewingApplicationInitializedEvent) {
    event.viewerComponent.DocumentId = 'DOCUMENT_URN_GOES_HERE';
  }
  ```
  - A helper method `getDefaultViewerOptions` can be used to get the most basic viewer options

### Step 4
When the document has been loaded the `onDocumentChanged` event is emitted. This event can be used to define the view to display (by default, the viewer will load the first 3D viewable it can find).

An example of displaying a 2D viewable:

component.html:
```html
<adsk-forge-viewer [viewerOptions]="viewerOptions2d"
                    (onDocumentChanged)="documentChanged($event)"></adsk-forge-viewer>
```

component.ts:
```typescript
public documentChanged(event: DocumentChangedEvent) {
    const viewerApp = event.viewingApplication;
    if (!viewerApp.bubble) return;

    // Use viewerApp.bubble to get a list of 2D obecjts
    const viewables = viewerApp.bubble.search({ type: 'geometry', role: '2d' });
    if (viewables && viewables.length > 0) {
      event.viewerComponent.selectItem(viewables[0].data);
    }
  }
```

## FAQ

### 1. What ViewerOptions can be used to initialise the Viewer Component?

The ViewerOptions interface is as follows:

```typescript
interface ViewerOptions {
  initializerOptions: Autodesk.Viewing.InitializerOptions;
  viewerApplicationOptions?: Autodesk.Viewing.ViewingApplicationOptions;
  viewerConfig?: Autodesk.Viewing.ViewerConfig;
  headlessViewer?: boolean;
  showFirstViewable?: boolean;
  debugMessages?: boolean;
  onViewerScriptsLoaded?: () => void;
  onViewingApplicationInitialized: (args: ViewingApplicationInitializedEvent) => void;
}
```

`initializerOptions` allows you to provide arguments for the [Autodesk.Viewing.Initializer](https://developer.autodesk.com/en/docs/viewer/v2/reference/javascript/initializer/). One of the most important settings is how the Forge viewer is to obtain it's access token.

You can provide an access key as a string, but I'd recommend using the function - the viewer will call the function you provide to obtain a new token when required - e.g. when the viewer first initialises or when the current token held by the viewer is shortly expiring.

Your viewer options code would look something like this:

```typescript
this.viewerOptions3d = {
  initializerOptions: {
    env: 'AutodeskProduction',
    getAccessToken: (onGetAccessToken: (token: string, expire: number) => void) => {
      // Call back-end API endpoint to get a new token
      // Pass new token and expire time to Viewer's callback method
      onGetAccessToken(ACCESS_TOKEN, EXPIRE_TIME);
    },
  },
  onViewingApplicationInitialized: (args: ViewingApplicationInitializedEvent) => {
    // Load document in the viewer
    args.viewerComponent.DocumentId = 'DOCUMENT_URN_HERE';
  },
};
```

The viewer component creates a Forge Viewer Application. The `viewerApplicationOptions` setting allows you to provide additional options to the viewering application. (https://developer.autodesk.com/en/docs/viewer/v2/reference/javascript/viewingapplication/).

`viewerConfig` allows you to provide additional options to Viewer3D's registered with the viewing application. Such as whether to ues the light or dark theme, any extensions to register with the viewer etc.

### 2. How do I configure a 'headless' viewer?

By default, the viewer component will intialise a 'full' `ViewingApplication` with toolbar, navigation controls etc. If you want a 'headless viewer' without these additional bits of UI, set the `headlessViewer` of the ViewOptions to true:

```typescript
this.viewerOptions3d = {
  initializerOptions: {
    env: 'AutodeskProduction',
    getAccessToken: (onGetAccessToken: (token: string, expire: number) => void) => {
      // Call back-end API endpoint to get a new token
      // Pass new token and expire time to Viewer's callback method
      onGetAccessToken(ACCESS_TOKEN, EXPIRE_TIME);
    },
  },
  headlessViewer: true,
  onViewingApplicationInitialized: (args: ViewingApplicationInitializedEvent) => {
    // Load document in the viewer
    args.viewerComponent.DocumentId = 'DOCUMENT_URN_HERE';
  },
};
```

### 3. My model doesn't load

Some users have reported that the default viewable is not rendered and have had to resort to using the onDocumentChanged changed event to load a model in the viewer.

An implementation might look like the following:

app.component.html

```html
<adsk-forge-viewer [viewerOptions]="viewerOptions2d"
                    (onDocumentChanged)="documentChanged($event)"></adsk-forge-viewer>
```

app.component.ts

```typescript
public documentChanged(event: DocumentChangedEvent) {
  const viewerApp = event.viewingApplication;
  if (!viewerApp.bubble) return;
  const viewables = viewerApp.bubble.search({ type: 'geometry', role: '3d' });

  if (viewables && viewables.length > 0) {
    event.viewerComponent.selectItem(viewables[0].data);
  }
}
```

## Extensions

### BasicExtension

The viewer component comes with a `BasicExtension` that it registers against all viewers. The basic extension captures a handful of events including:

- Autodesk.Viewing.FIT_TO_VIEW_EVENT,
- Autodesk.Viewing.FULLSCREEN_MODE_EVENT,
- Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
- Autodesk.Viewing.HIDE_EVENT,
- Autodesk.Viewing.ISOLATE_EVENT,
- Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
- Autodesk.Viewing.OBJECT_TREE_UNAVAILABLE_EVENT,
- Autodesk.Viewing.RESET_EVENT,
- Autodesk.Viewing.SELECTION_CHANGED_EVENT,
- Autodesk.Viewing.SHOW_EVENT,

The viewer emits these events and should support most use cases. It's possible to obtain a reference to the BasicExtension via the viewer's `basicExtension` getter. 

### Creating your own extension

The `BasicExtension` is derived from an `Extension` that wraps up all the logic to register and unregister extensions with the Forge Viewer. It also contains logic to cast Forge Viewer event arguments to strongly typed TypeScript classes.

Your extension should derive from `Extension` and have a few basic properties and methods.

```typescript
export class MyExtension extends Extension {
  // Extension must have a name
  public static extensionName: string = 'MyExtension';

  public load() {
    // Called when Forge Viewer loads your extension
  }

  public unload() {
    // Called when Forge Viewer unloads your extension
  }
}
```

Example viewer options to register and load the above extension:

```typescript
this.viewerOptions3d = {
  initializerOptions: {
    env: 'AutodeskProduction',
    getAccessToken: (onGetAccessToken: (token: string, expire: number) => void) => {
      // Call back-end API endpoint to get a new token
      // Pass new token and expire time to Viewer's callback method
      onGetAccessToken(ACCESS_TOKEN, EXPIRE_TIME);
    },
  },
  onViewerScriptsLoaded: () => {
    Extension.registerExtension(MyExtension.extensionName, MyExtension);
  },
  onViewingApplicationInitialized: (args: ViewingApplicationInitializedEvent) => {
    // Load document in the viewer
    args.viewerComponent.DocumentId = 'DOCUMENT_URN_HERE';
  },
};
```

Most of the methods in the abstract `Extension` class are protected. So they can be overriden in derived classes if required. For example, the BasicExtension overrides the `registerExtension` method to take a callback to let the viewer component know when the Extension has been registered.

## Building the component

For instructions on how to develop the component (build, debug, test etc.), see (README-dev.md).
