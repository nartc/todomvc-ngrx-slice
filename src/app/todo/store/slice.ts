import { createSelector } from "@ngrx/store";
import { createSlice, noopReducer, PayloadAction } from "ngrx-slice";
import { RouterSelectors } from "../../store/router.selectors";
import { TodoFilter } from "../models/todo-filter.type";
import { Todo } from "../models/todo.interface";

export interface TodoState {
  todos: Todo[];
  loading: boolean;
}

export const initialState: TodoState = {
  todos: [],
  loading: false,
};

export const {
  actions: TodoActions,
  selectors,
  ...TodoFeature
} = createSlice({
  name: "todo",
  initialState,
  reducers: {
    add: (state, action: PayloadAction<{ text: string }>) => {
      state.todos.push({
        id: Math.random(),
        text: action.text,
        creationDate: new Date(),
        completed: false,
      });
    },
    load: {
      trigger: (state) => void (state.loading = true),
      success: (state, action: PayloadAction<{ todos: Todo[] }>) => {
        state.todos = action.todos;
        state.loading = false;
      },
    },
    toggle: (state, action: PayloadAction<{ id: number }>) => {
      const todo = state.todos.find((todo) => todo.id === action.id);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    delete: (state, action: PayloadAction<{ id: number }>) => {
      const todoIndex = state.todos.findIndex((todo) => todo.id === action.id);
      if (todoIndex !== -1) {
        state.todos.splice(todoIndex, 1);
      }
    },
    update: (state, action: PayloadAction<{ id: number; text: string }>) => {
      const todo = state.todos.find((todo) => todo.id === action.id);
      if (todo) {
        todo.text = action.text;
      }
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter((todo) => !todo.completed);
    },
    setFilter: noopReducer<TodoState, { filter: TodoFilter }>(),
  },
});

// Calculated selectors

const selectTotalTodos = createSelector(
  selectors.selectTodos,
  (todos) => todos.length
);

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
  selectors.selectTodos,
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

const selectHasCompletedTodos = createSelector(
  selectors.selectTodos,
  (todos) => {
    return todos.filter((t) => t.completed).length > 0;
  }
);

const selectIncompleteTodosCount = createSelector(
  selectors.selectTodos,
  (todos) => {
    return todos.filter((t) => !t.completed).length;
  }
);

export const TodoSelectors = {
  ...selectors,
  selectTotalTodos,
  selectFilter,
  selectFilteredTodos,
  selectHasTodos,
  selectHasCompletedTodos,
  selectIncompleteTodosCount,
};
