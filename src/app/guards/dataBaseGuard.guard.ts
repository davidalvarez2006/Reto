import type { CanActivateFn } from '@angular/router';

export const dataBaseGuardGuard: CanActivateFn = (route, state) => {
  return true;
};
