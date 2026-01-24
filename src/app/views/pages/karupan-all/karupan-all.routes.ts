import { Routes } from "@angular/router";

export default [
    {
        path: '',
        loadComponent: () => import('./karupan-all.component').then(c => c.KarupanAllComponent)
    }
] as Routes;