import { Routes } from '@angular/router';
import { ChatTextbarComponent } from './components/chat-textbar/chat-textbar.component';
import { ChatHistorialComponent } from './components/chat-historial/chat-historial.component';
import { PrincipalPageComponent } from './pages/principal-page/principal-page.component';

export const routes: Routes = [
  {
    path:'',
    component: PrincipalPageComponent,
    children:[
      {
        path: 'textbar',
        component: ChatTextbarComponent
      },
      {
        path: 'chat-historial',
        component: ChatHistorialComponent
      },
    ]
  },

  {
    path: '**',
    redirectTo: 'textbar',
  }
];
