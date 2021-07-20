import { RouterReducerState } from "@ngrx/router-store";
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { CustomRouterState } from "./router.serializer";

const selectRouter =
  createFeatureSelector<RouterReducerState<CustomRouterState>>("router");

const selectRouteParamFilter = createSelector(
  selectRouter,
  (router) => router.state.params.filter
);

export const RouterSelectors = { selectRouter, selectRouteParamFilter };
