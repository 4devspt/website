import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { YourHomepageComponent } from './pages/your-homepage/your-homepage.component';
import { ValidatorsGeneratorsComponent } from './pages/validators-generators/validators-generators.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'your-homepage', component: YourHomepageComponent },
  {
    path: 'validators-generators',
    component: ValidatorsGeneratorsComponent,
  },
  { path: '**', redirectTo: '/home' },
];
