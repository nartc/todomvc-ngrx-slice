import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Todo } from "../models/todo.interface";

export interface TodoEntityState extends EntityState<Todo> {
  ids: string[];
}

export const todoEntityAdapter: EntityAdapter<Todo> = createEntityAdapter<Todo>(
  {
    selectId: (todo: Todo) => todo.id,
  }
);

export const entityInitialState: TodoEntityState =
  todoEntityAdapter.getInitialState({
    ids: [],
  });
