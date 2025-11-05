import { Routes } from "@angular/router";

export default[
    {
        path: '',
        loadComponent: () => import('./reports.component').then( c => c.ReportsComponent)
    }
] as Routes;