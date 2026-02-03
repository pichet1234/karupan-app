import { Routes } from "@angular/router";

export default [
    {
        path: '',
        loadComponent: () => import('./regit-karupan-borrow.component').then(c => c.RegitKarupanBorrowComponent)
    }
] as Routes;