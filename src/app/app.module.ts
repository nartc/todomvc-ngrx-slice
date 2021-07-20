import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { EffectsModule } from "@ngrx/effects";
import { routerReducer, StoreRouterConnectingModule } from "@ngrx/router-store";
import { ActionReducer, StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { environment } from "../environments/environment";

import { AppComponent } from "./app.component";
import { CustomRouterStateSerializer } from "./store/router.serializer";

// console.log actions and state
export function logger(reducer: ActionReducer<{}>): ActionReducer<{}> {
  return (state, action) => {
    const result = reducer(state, action);
    console.groupCollapsed(action.type);
    console.log("prev state", state);
    console.log("action", action);
    console.log("next state", result);
    console.groupEnd();

    return result;
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path: ":filter",
        loadChildren: () =>
          import("./todo/todo.module").then((m) => m.TodoModule),
      },
      { path: "**", redirectTo: "all", pathMatch: "full" },
    ]),
    StoreModule.forRoot(
      {
        router: routerReducer,
      },
      {
        metaReducers: environment.production ? [] : [logger],
      }
    ),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
      name: "TodoMVC app using Angular & NgRx w/ Slice",
    }),
    StoreRouterConnectingModule.forRoot({
      serializer: CustomRouterStateSerializer,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
