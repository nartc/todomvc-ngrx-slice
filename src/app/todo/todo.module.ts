import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { FooterComponent } from "./components/footer/footer.component";
import { NewTodoComponent } from "./components/new-todo/new-todo.component";
import { TodoListItemComponent } from "./components/todo-list-item/todo-list-item.component";
import { TodoListComponent } from "./components/todo-list/todo-list.component";
import { TodosEffects } from "./store/effects";
import { TodoFeature } from "./store/slice";
import { TodoComponent } from "./todo.component";

@NgModule({
  declarations: [
    TodoComponent,
    FooterComponent,
    NewTodoComponent,
    TodoListItemComponent,
    TodoListComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: "", component: TodoComponent }]),
    StoreModule.forFeature(TodoFeature),
    EffectsModule.forFeature([TodosEffects]),
  ],
})
export class TodoModule {}
