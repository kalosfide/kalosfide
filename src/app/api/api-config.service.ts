import { Injectable } from '@angular/core';
import { AppRoutes } from '../app-pages';

@Injectable()
export class ApiConfigService {

    private config: { [key: string]: string };

    constructor() {
        this.config = {
            UrlAPI: 'https://localhost:44391/api/'
        };
    }

    get setting(): { [key: string]: string } {
        return this.config;
    }

    get(key: any) {
        return this.config[key];
    }

    route(controller: string, action?: string, keyUrl?: string): string {
        let route = this.config.UrlAPI + controller + AppRoutes.séparateur + action;
        if (keyUrl) {
            route += AppRoutes.séparateur + keyUrl;
        }
        console.log(route);
        return route;
    }
}
