import { PageNotFoundComponent } from './view/components/page-not-found/page-not-found.component';
import { CrudCategoriesComponent } from './view/board/crud-categories/crud-categories.component';
import { AuthGuard } from './services/guard/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './view/auth/login/login.component';
import { MainComponent } from './view/main/main/main.component';
import { LayoutComponent } from './view/layout/layout/layout.component';
import { BoardComponent } from './view/board/board/board.component';
import { HelpersComponent } from './view/helpers/helpers/helpers.component';
import { CrudSubcategoriesComponent } from './view/board/crud-subcategories/crud-subcategories.component';
import { CrudPictogramsComponent } from './view/board/crud-pictograms/crud-pictograms.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'not-found',
    component: PageNotFoundComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
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
        ],
      },
      {
        path: 'panel',
        component: BoardComponent,
        children: [
          {
            path: 'categorias',
            component: CrudCategoriesComponent,
          },
          {
            path: 'subcategorias/:id',
            component: CrudSubcategoriesComponent,
          },
          {
            path: 'pictogramas/:id',
            component: CrudPictogramsComponent,
          },
        ],
      },
      {
        path: 'ayudas',
        children: [
          {
            path: '',
            component: HelpersComponent,
          },
        ],
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'full',
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
