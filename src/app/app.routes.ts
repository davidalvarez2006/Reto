import { Routes } from '@angular/router';
import { ChatTextbarComponent } from './components/chat-textbar/chat-textbar.component';

export const routes: Routes = [
  {
    path: 'textbar',
    component: ChatTextbarComponent
  },
  {
    path: '**',
    redirectTo: 'textbar',
  }
];
