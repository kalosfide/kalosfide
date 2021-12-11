import { Routeur } from "../commun/routeur";
import { AppPages } from "../app-pages";
import { AppRouteur } from "../app-routeur";

export class SiteRouteur extends Routeur {
    urlSite: string;

    constructor(appRouter: AppRouteur) {
        super(appRouter, AppPages.site.path);
    }

    public fixeSite(urlSite: string) {
        this.urlSite = urlSite;
    }

    public url(...segments: string[]): string {
        return [this.urlBase, this.urlSite].concat(segments).join('/')
    }
}