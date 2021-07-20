import { createSelector } from "@ngrx/store";
import { createSlice, noopReducer, PayloadAction } from "ngrx-slice";
import { RouterSelectors } from "../../store/router.selectors";
import { TodoFilter } from "../models/todo-filter.type";
import { Todo } from "../models/todo.interface";
import {
  entityInitialState,
  todoEntityAdapter,
  TodoEntityState,
} from "./entities";

export interface TodoState {
  data: TodoEntityState;
  loading: boolean;
}

export const initialState: TodoState = {
  data: entityInitialState,
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
      state.data = todoEntityAdapter.addOne(
        {
          id: Math.random(),
          text: action.text,
          creationDate: new Date(),
          completed: false,
        },
        state.data
      );
    },
    load: {
      trigger: (state) => void (state.loading = true),
      success: (state, action: PayloadAction<{ todos: Todo[] }>) => {
        state.data = todoEntityAdapter.setAll(action.todos, state.data);
        state.loading = false;
      },
    },
    toggle: (state, action: PayloadAction<{ id: number }>) => {
      state.data = todoEntityAdapter.updateOne(
        {
          id: action.id,
          changes: {
            completed: !state.data.entities[action.id]?.completed,
          },
        },
        state.data
      );
    },
    delete: (state, action: PayloadAction<{ id: number }>) => {
      state.data = todoEntityAdapter.removeOne(action.id, state.data);
    },
    update: (state, action: PayloadAction<{ id: number; text: string }>) => {
      state.data = todoEntityAdapter.updateOne(
        {
          id: action.id,
          changes: { text: action.text },
        },
        state.data
      );
    },
    clearCompleted: (state) => {
      state.data = todoEntityAdapter.removeMany(
        state.data.ids.filter((id) => state.data.entities[id]?.completed),
        state.data
      );
    },
    setFilter: noopReducer<TodoState, { filter: TodoFilter }>(),
  },
});

const { selectAll, selectTotal } = todoEntityAdapter.getSelectors();

const selectAllTodos = createSelector(selectors.selectTodoState, (state) =>
  selectAll(state.data)
);

const selectTotalTodos = createSelector(selectors.selectTodoState, (state) =>
  selectTotal(state.data)
);

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
  ...selectors,
  selectAllTodos,
  selectTotalTodos,
  selectFilter,
  selectFilteredTodos,
  selectHasTodos,
  selectHasCompletedTodos,
  selectIncompleteTodosCount,
};
