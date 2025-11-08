import { Routes } from "@angular/router";

export default[
    {
        path:'',
        loadComponent: ()=>import('./setting.component').then(c => c.SettingComponent)
    }
] as Routes;