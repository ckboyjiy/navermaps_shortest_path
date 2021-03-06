import {animate, state, style, transition, trigger} from '@angular/animations';

export const routerAnimation = trigger('routeAnimation', [
  state('*',
      style({
        opacity: 1,
        position: 'absolute'
      })
  ),
  transition(':enter', [
    style({
      opacity: 0,
      position: 'absolute',
      transform: 'translateX(100%)'
    }),
    animate('0.2s ease-in')
  ]),
  transition(':leave', [
    animate('0.2s ease-out', style({
      opacity: 0,
      position: 'absolute',
      transform: 'translateX(-100%)'
    }))
  ])
]);
