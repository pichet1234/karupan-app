import { Routes } from "@angular/router";

export default[
    {
        path:'',
        loadComponent: () => import('./kreturn.component').then(c =>c.KreturnComponent)
    }
] as Routes;