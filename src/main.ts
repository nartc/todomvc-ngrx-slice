import { HttpClientModule } from "@angular/common/http";
import { enableProdMode, importProvidersFrom } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { provideRouterStore, routerReducer } from "@ngrx/router-store";
import { ActionReducer, provideStore } from "@ngrx/store";
import { provideStoreDevtools } from "@ngrx/store-devtools";
import { AppComponent } from "./app/app.component";
import { CustomRouterStateSerializer } from "./app/store/router.serializer";
import { environment } from "./environments/environment";

if (environment.production) {
  enableProdMode();
}

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

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule),
    provideRouter([
      {
        path: ":filter",
        loadChildren: () =>
          import("./app/todo/todo.routes").then((m) => m.todoRoutes),
      },
      { path: "**", redirectTo: "all", pathMatch: "full" },
    ]),
    provideStore(
      { router: routerReducer },
      { metaReducers: environment.production ? [] : [logger] }
    ),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: environment.production,
      name: "TodoMVC app using Angular & NgRx w/ Slice",
    }),
    provideRouterStore({
      serializer: CustomRouterStateSerializer
    })
  ],
}).catch((err) => console.error(err));

