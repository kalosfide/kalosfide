import { Injectable } from '@angular/core';
import { AppRoutes } from '../app-pages';

@Injectable()
export class ApiConfigService {

    private _config: { [key: string]: string };

    constructor() {
        this._config = {
            UrlAPI: 'https://localhost:44391/api/'
        };
    }

    get setting(): { [key: string]: string } {
        return this._config;
    }

    get(key: any) {
        return this._config[key];
    }

    route(controller: string, action?: string, keyUrl?: string): string {
        let route = this._config['UrlAPI'] + controller + AppRoutes.séparateur + action;
        if (keyUrl) {
            route += AppRoutes.séparateur + keyUrl;
        }
        return route;
    }
}
