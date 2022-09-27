import { createSelector } from "@ngrx/store";
import { createSlice, noopReducer, PayloadAction } from "ngrx-slice";
import { createSliceEntityAdapter } from "ngrx-slice/entity";
import { RouterSelectors } from "../../store/router.selectors";
import { TodoFilter } from "../models/todo-filter.type";
import { Todo } from "../models/todo.interface";

const todoAdapter = createSliceEntityAdapter<Todo>();

const {
  actions: TodoActions,
  selectors,
  ...TodoFeature
} = createSlice({
  name: "todo",
  initialState: todoAdapter.getInitialState({ loading: false }),
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
          completed: !state.entities[action.id].completed,
        },
      });
    },
    delete: todoAdapter.removeOne,
    update: todoAdapter.updateOne,
    clearCompleted: (state) => {
      todoAdapter.removeMany(
        state,
        state.ids.filter((id) => state.entities[id].completed)
      );
    },
    setFilter: noopReducer<{ filter: TodoFilter }>(),
  },
});

// Calculated selectors
const todoAdapterSelectors = todoAdapter.getSelectors(
  selectors.selectTodoState
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
  todoAdapterSelectors.selectAll,
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
  todoAdapterSelectors.selectTotal,
  (totalTodos) => totalTodos > 0
);

const selectHasCompletedTodos = createSelector(
  todoAdapterSelectors.selectAll,
  (todos) => todos.filter((t) => t.completed).length > 0
);

const selectIncompleteTodosCount = createSelector(
  todoAdapterSelectors.selectAll,
  (todos) => todos.filter((t) => !t.completed).length
);

export const TodoSelectors = {
  selectLoading: selectors.selectLoading,
  selectFilter,
  selectFilteredTodos,
  selectHasTodos,
  selectHasCompletedTodos,
  selectIncompleteTodosCount,
};

export { TodoActions, TodoFeature };
