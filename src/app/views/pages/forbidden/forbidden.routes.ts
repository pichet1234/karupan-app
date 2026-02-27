import { Routes } from '@angular/router';

export default [
    {
        path:'',
        loadComponent: () => import('./forbidden.component').then(c=> c.ForbiddenComponent),
    }
] as Routes;