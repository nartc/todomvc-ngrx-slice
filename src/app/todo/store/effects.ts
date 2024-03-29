import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, switchMap, tap } from "rxjs/operators";
import { TodosService } from "../services/todos.service";
import { TodoActions } from "./slice";

@Injectable()
export class TodosEffects {
  loadTodos$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodoActions.load.trigger),
      switchMap(() => this.todosService.getTodos()),
      map((todos) => TodoActions.load.success({ todos }))
      // delay(1000), // Simulate network latency for loading animation
    );
  });

  filter$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(TodoActions.setFilter),
        tap((action) => {
          switch (action.filter) {
            case "SHOW_ACTIVE": {
              void this.router.navigate(["/", "active"]);
              break;
            }
            case "SHOW_COMPLETED": {
              void this.router.navigate(["/", "completed"]);
              break;
            }
            default: {
              void this.router.navigate(["/", "all"]);
              break;
            }
          }
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private todosService: TodosService
  ) {}
}
