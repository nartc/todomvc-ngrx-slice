import { createSelector } from "@ngrx/store";
import { createSlice, noopReducer, PayloadAction } from "ngrx-slice";
import { createSliceEntityAdapter } from "ngrx-slice/entity";
import { RouterSelectors } from "../../store/router.selectors";
import { TodoFilter } from "../models/todo-filter.type";
import { Todo } from "../models/todo.interface";

export const todoAdapter = createSliceEntityAdapter<Todo>();

export const todoAdapterSelectors = todoAdapter.getSelectors();

export const {
  actions: TodoActions,
  selectors,
  ...TodoFeature
} = createSlice({
  name: "todo",
  initialState: todoAdapter.getInitialState({
    loading: false,
  }),
  reducers: {
    add: (state, action: PayloadAction<{ text: string }>) => {
      todoAdapter.addOne(state, {
        id: Math.random(),
        text: action.text,
        creationDate: new Date(),
        completed: false,
      });
    },
    load: {
      trigger: (state) => void (state.loading = true),
      success: (state, action: PayloadAction<{ todos: Todo[] }>) => {
        todoAdapter.setAll(state, action.todos);
        state.loading = false;
      },
    },
    toggle: (state, action: PayloadAction<{ id: number }>) => {
      todoAdapter.updateOne(state, {
        id: action.id,
        changes: {
          completed: !state.entities[action.id]!.completed,
        },
      });
    },
    delete: todoAdapter.removeOne,
    update: todoAdapter.updateOne,
    clearCompleted: (state) => {
      todoAdapter.removeMany(
        state,
        state.ids.filter((id) => state.entities[id]!.completed)
      );
    },
    setFilter: noopReducer<
      ReturnType<typeof todoAdapter.getInitialState>,
      { filter: TodoFilter }
    >(),
  },
});

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

const selectAll = createSelector(
  selectors.selectTodoState,
  todoAdapterSelectors.selectAll
);

const selectTotal = createSelector(
  selectors.selectTodoState,
  todoAdapterSelectors.selectTotal
);

const selectFilteredTodos = createSelector(
  selectAll,
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

const selectHasTodos = createSelector(
  selectTotal,
  (totalTodos) => totalTodos > 0
);

const selectHasCompletedTodos = createSelector(selectAll, (todos) => {
  return todos.filter((t) => t.completed).length > 0;
});

const selectIncompleteTodosCount = createSelector(selectAll, (todos) => {
  return todos.filter((t) => !t.completed).length;
});

export const TodoSelectors = {
  ...selectors,
  selectAll,
  selectTotal,
  selectFilter,
  selectFilteredTodos,
  selectHasTodos,
  selectHasCompletedTodos,
  selectIncompleteTodosCount,
};
