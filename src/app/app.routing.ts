import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './view/auth/login/login.component';
import { MainComponent } from './view/main/main/main.component';
import { LayoutComponent } from './view/layout/layout/layout.component';
import { BoardComponent } from './view/board/board/board.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'main',
        children: [
          {
            path: '',
            component: MainComponent,
          },
        ]
      },
      {
        path: 'board',
        children: [
          {
            path: '',
            component: BoardComponent
          }
        ]
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  }
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
