import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { Todo } from "../../models/todo.interface";

@Component({
  selector: "app-todo-list",
  template: `
    <section id="main" class="main" *ngIf="todos as todos">
      <div class="toogle-view" *ngIf="todos.length > 0"></div>
      <ul id="todo-list" class="todo-list">
        <app-todo-list-item
          *ngFor="let todo of todos; trackBy: todosTrackByFn"
          [todo]="todo"
          (toggle)="toggle.emit($event)"
          (update)="update.emit($event)"
          (delete)="delete.emit($event)"
        ></app-todo-list-item>
      </ul>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent {
  @Input() todos: Todo[] | null = null;
  @Output() toggle = new EventEmitter<number>();
  @Output() update = new EventEmitter<{ id: number; text: string }>();
  @Output() delete = new EventEmitter<number>();

  todosTrackByFn(index: number, item: Todo): number {
    return item.id;
  }
}
