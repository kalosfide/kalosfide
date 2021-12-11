import { AppPages } from "../app-pages";
import { AppRouteur } from "../app-routeur";
import { Routeur } from "../commun/routeur";
import { AdminPages } from "./admin-pages";

export class AdminRouteur extends Routeur {
    sites: Routeur;
    constructor(appRouteur: AppRouteur) {
        super(appRouteur, AppPages.admin.path);
        this.sites = new Routeur(this, AdminPages.fournisseurs.path);
    }
}