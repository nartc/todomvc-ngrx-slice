import { createAction, props } from "@ngrx/store";
import { TodoFilter } from "../models/todo-filter.type";
import { Todo } from "../models/todo.interface";

const addAction = createAction("[TODO] add", props<{ text: string }>());

const loadAction = createAction("[TODO] load");

const loadSuccessAction = createAction(
    "[TODO] load success",
    props<{ todos: Todo[] }>()
);

const deleteAction = createAction("[TODO] delete", props<{ id: number }>());

const toggleAction = createAction("[TODO] toggle", props<{ id: number }>());

const updateAction = createAction(
    "[TODO] update",
    props<{ id: number; text: string }>()
);

const clearCompletedAction = createAction("[TODO] clear completed");

const setFilterAction = createAction(
    "[TODO] Set filter",
    props<{ filter: TodoFilter }>()
);

export const TodoActions = {
    addAction,
    loadAction,
    loadSuccessAction,
    deleteAction,
    toggleAction,
    updateAction,
    clearCompletedAction,
    setFilterAction,
};
