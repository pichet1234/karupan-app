import { Routes } from "@angular/router";

export default[
    {
        path:'',redirectTo: 'setting', pathMatch: 'full'
    },
    {
        path:'setting',
        loadComponent: ()=>import('./setting.component').then(c => c.SettingComponent)
    },
    {
        path:'user',
        loadComponent: ()=>import('./user/user.component').then(c =>c.UserComponent)
    },
    {
        path: 'karupan',
        loadComponent: ()=> import('./karupan/karupan.component').then(c => c.KarupanComponent)
    }
] as Routes;