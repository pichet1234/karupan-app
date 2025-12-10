import { Routes } from "@angular/router";

export default [
  {
    path: '',
    redirectTo: 'receive',
    pathMatch: 'full'
  },
  {
    path: 'receive',
    loadComponent: () =>
      import('./receive.component').then(c => c.ReceiveComponent)
  },
  {
    path: 'donat',
    loadComponent: () =>
      import('./donat/donat.component').then(c => c.DonatComponent)
  }
] as Routes;
