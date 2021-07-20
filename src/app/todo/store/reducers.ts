import { createReducer, on } from "@ngrx/store";
import { TodoActions } from "./actions";
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

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.addAction, (state, action) => ({
    ...state,
    data: todoEntityAdapter.addOne(
      {
        id: Math.random(),
        text: action.text,
        creationDate: new Date(),
        completed: false,
      },
      state.data
    ),
  })),
  on(TodoActions.loadAction, (state) => ({
    ...state,
    loading: true,
  })),
  on(TodoActions.loadSuccessAction, (state, action) => ({
    ...state,
    data: todoEntityAdapter.setAll(action.todos, state.data),
    loading: false,
  })),
  on(TodoActions.toggleAction, (state, action) => ({
    ...state,
    data: todoEntityAdapter.updateOne(
      {
        id: action.id,
        changes: {
          completed: !state.data.entities[action.id]?.completed,
        },
      },
      state.data
    ),
  })),
  on(TodoActions.deleteAction, (state, action) => ({
    ...state,
    data: todoEntityAdapter.removeOne(action.id, state.data),
  })),
  on(TodoActions.updateAction, (state, action) => ({
    ...state,
    data: todoEntityAdapter.updateOne(
      { id: action.id, changes: { text: action.text } },
      state.data
    ),
  })),
  on(TodoActions.clearCompletedAction, (state) => ({
    ...state,
    data: todoEntityAdapter.removeMany(
      state.data.ids.filter((id) => state.data.entities[id]?.completed),
      state.data
    ),
  }))
);
