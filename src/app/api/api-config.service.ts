import { Injectable } from '@angular/core';

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
        let route = this.config.UrlAPI + controller + '/' + action;
        if (keyUrl) {
            route += '/' + keyUrl;
        }
        return route;
    }
}
