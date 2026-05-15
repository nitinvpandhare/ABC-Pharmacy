// main.ts
// Entry point for the Angular application.
// bootstrapApplication is the Angular 19 standalone way — no AppModule needed.

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
