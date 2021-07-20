import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { TodoFilter } from "./models/todo-filter.type";
import { TodoActions, TodoSelectors } from "./store/slice";

@Component({
  selector: "app-todo",
  template: `
    <header class="header">
      <h1>todos</h1>
      <app-new-todo
        *ngIf="(loading$ | async) === false; else loading"
        (addTodo)="onAddTodo($event)"
      ></app-new-todo>
    </header>
    <app-todo-list
      *ngIf="hasTodos$ | async"
      [todos]="filteredTodos$ | async"
      (toggle)="onToggle($event)"
      (update)="onUpdate($event)"
      (delete)="onDelete($event)"
    ></app-todo-list>
    <app-footer
      *ngIf="hasTodos$ | async"
      [hasCompletedTodos]="hasCompletedTodos$ | async"
      [incompleteTodosCount]="incompleteTodosCount$ | async"
      [currentFilter]="currentFilter$ | async"
      (filter)="onFilter($event)"
      (clearCompleted)="onClearCompleted()"
    ></app-footer>

    <ng-template #loading>
      <div>loading...</div>
    </ng-template>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent implements OnInit {
  readonly hasTodos$ = this.store.select(TodoSelectors.selectHasTodos);
  readonly loading$ = this.store.select(TodoSelectors.selectLoading);
  readonly filteredTodos$ = this.store.select(
    TodoSelectors.selectFilteredTodos
  );
  readonly hasCompletedTodos$ = this.store.select(
    TodoSelectors.selectHasCompletedTodos
  );
  readonly incompleteTodosCount$ = this.store.select(
    TodoSelectors.selectIncompleteTodosCount
  );
  readonly currentFilter$ = this.store.select(TodoSelectors.selectFilter);

  constructor(private readonly store: Store) {}

  ngOnInit() {
    this.store.dispatch(TodoActions.load.trigger());
  }

  onAddTodo(text: string): void {
    this.store.dispatch(TodoActions.add({ text }));
  }

  onToggle(id: number): void {
    this.store.dispatch(TodoActions.toggle({ id }));
  }

  onUpdate(event: { id: number; text: string }): void {
    this.store.dispatch(TodoActions.update(event));
  }

  onDelete(id: number): void {
    this.store.dispatch(TodoActions.delete({ id }));
  }

  onFilter(filter: TodoFilter): void {
    this.store.dispatch(TodoActions.setFilter({ filter }));
  }

  onClearCompleted(): void {
    this.store.dispatch(TodoActions.clearCompleted());
  }
}
