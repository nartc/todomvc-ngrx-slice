import { NgIf } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { RouterLinkWithHref } from "@angular/router";
import { TodoFilter } from "../../models/todo-filter.type";

@Component({
  selector: "app-footer",
  standalone: true,
  template: `
    <footer id="footer" class="footer">
      <span id="todo-count" class="todo-count"
        >{{ incompleteTodosCount }} items left</span
      >
      <ul id="filters" class="filters">
        <li>
          <a
            [routerLink]="[]"
            [class.selected]="currentFilter === 'SHOW_ALL'"
            (click)="filter.emit('SHOW_ALL')"
          >
            All
          </a>
        </li>
        <li>
          <a
            [routerLink]="[]"
            [class.selected]="currentFilter === 'SHOW_ACTIVE'"
            (click)="filter.emit('SHOW_ACTIVE')"
          >
            Active
          </a>
        </li>
        <li>
          <a
            [routerLink]="[]"
            [class.selected]="currentFilter === 'SHOW_COMPLETED'"
            (click)="filter.emit('SHOW_COMPLETED')"
          >
            Completed
          </a>
        </li>
      </ul>
      <button
        id="clear-completed"
        *ngIf="hasCompletedTodos"
        class="clear-completed"
        (click)="clearCompleted.emit()"
      >
        Clear completed
      </button>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLinkWithHref, NgIf],
})
export class FooterComponent {
  @Input() hasCompletedTodos: boolean | null = false;
  @Input() incompleteTodosCount: number | null = 0;
  @Input() currentFilter: TodoFilter | null = 'SHOW_ALL';
  @Output() filter = new EventEmitter<TodoFilter>();
  @Output() clearCompleted = new EventEmitter();
}
