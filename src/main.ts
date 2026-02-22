import { provideZoneChangeDetection } from "@angular/core";
import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import {routes} from './app/app-routing.module';
import {provideRouter, withRouterConfig} from '@angular/router';

bootstrapApplication(AppComponent, {
    providers: [provideZoneChangeDetection(),provideHttpClient(), provideRouter(routes, withRouterConfig({paramsInheritanceStrategy: 'always'}))],
}).catch(err => {
    console.error(err);
});
