import { Routes } from "@angular/router";

export default[
    {
        path:'',redirectTo: 'kreturn', pathMatch: 'full'
    },
    {
        path:'kreturn',
        loadComponent: () => import('./kreturn.component').then(c =>c.KreturnComponent)
    }
] as Routes;