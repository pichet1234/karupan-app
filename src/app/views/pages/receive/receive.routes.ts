import { Routes } from "@angular/router";

export default[
    {
        path:'',
        loadComponent: () => import('./receive.component').then(c=>c.ReceiveComponent)
    }
] as Routes;