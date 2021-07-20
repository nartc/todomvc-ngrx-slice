import { createFeatureSelector, createSelector } from "@ngrx/store";
import { RouterSelectors } from "../../store/router.selectors";
import { TodoFilter } from "../models/todo-filter.type";
import { todoEntityAdapter } from "./entities";
import { TodoState } from "./reducers";

const selectTodoState = createFeatureSelector<TodoState>("todos");

// Raw selectors

const { selectAll, selectTotal } = todoEntityAdapter.getSelectors();

const selectAllTodos = createSelector(selectTodoState, (state) =>
  selectAll(state.data)
);

const selectTotalTodos = createSelector(selectTodoState, (state) =>
  selectTotal(state.data)
);

const selectLoading = createSelector(selectTodoState, (state) => state.loading);

// Calculated selectors

const selectFilter = createSelector(
  RouterSelectors.selectRouteParamFilter,
  (routeFilter): TodoFilter => {
    switch (routeFilter) {
      case "active": {
        return "SHOW_ACTIVE";
      }
      case "completed": {
        return "SHOW_COMPLETED";
      }
      default: {
        return "SHOW_ALL";
      }
    }
  }
);

const selectFilteredTodos = createSelector(
  selectAllTodos,
  selectFilter,
  (todos, filter) => {
    switch (filter) {
      default:
      case "SHOW_ALL":
        return todos;
      case "SHOW_COMPLETED":
        return todos.filter((t) => t.completed);
      case "SHOW_ACTIVE":
        return todos.filter((t) => !t.completed);
    }
  }
);

const selectHasTodos = createSelector(selectTotalTodos, (totalTodos) => {
  return totalTodos > 0;
});

const selectHasCompletedTodos = createSelector(selectAllTodos, (todos) => {
  return todos.filter((t) => t.completed).length > 0;
});

const selectIncompleteTodosCount = createSelector(selectAllTodos, (todos) => {
  return todos.filter((t) => !t.completed).length;
});

export const TodoSelectors = {
  selectTodoState,
  selectAllTodos,
  selectTotalTodos,
  selectLoading,
  selectFilter,
  selectFilteredTodos,
  selectHasTodos,
  selectHasCompletedTodos,
  selectIncompleteTodosCount,
};
