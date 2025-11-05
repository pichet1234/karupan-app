import { Routes } from "@angular/router";

export default[
    {
        path:'',
        loadComponent: () => import('./borrow.component').then(c => c.BorrowComponent)
    }
] as Routes;