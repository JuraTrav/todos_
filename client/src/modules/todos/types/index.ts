export interface Todo {
  id: string;
  goal: string;
  completed: boolean;
}

export type TodosList = {
  todos: Todo[] | [];
};