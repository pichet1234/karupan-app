import { Routes } from "@angular/router";

export default[
    {
        path:'receive',
        loadComponent: () => import('./receive.component').then(c=>c.ReceiveComponent)
    }
] as Routes;