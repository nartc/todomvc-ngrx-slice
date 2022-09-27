import { Route } from "@angular/router";
import { provideEffects } from "@ngrx/effects";
import { provideState } from "@ngrx/store";
import { TodosEffects } from "./store/effects";
import { TodoFeature } from "./store/slice";
import { TodoComponent } from "./todo.component";

export const todoRoutes: Route[] = [
  {
    path: "",
    providers: [provideState(TodoFeature), provideEffects([TodosEffects])],
    component: TodoComponent,
  },
];
