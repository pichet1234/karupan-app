import { Routes } from "@angular/router";

export default[
    {
        path:'borrow',
        loadComponent: () => import('./borrow.component').then(c => c.BorrowComponent)
    }
] as Routes;