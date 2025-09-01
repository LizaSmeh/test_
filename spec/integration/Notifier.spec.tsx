import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import taskListReducer from "src/store/taskSlice";
import { Provider } from "react-redux";
import { TaskList } from "src/modules/TaskList";
import { NewTaskBar } from "src/modules/NewTaskBar";
import { NotifierContainer } from "src/modules/NotifierContainer";
import userEvent from "@testing-library/user-event";

const initial = [
  { id: "1", header: "Task 1", done: false },
  { id: "2", header: "Task 2", done: false },
  ];

beforeEach(() => {
  jest.useRealTimers();
});

export function renderList(initialList: any[]) {
  const store = configureStore({
    reducer: { taskList: taskListReducer },
    preloadedState: {
      taskList: { list: initialList, notification: "" },
    },
  });

  return {
    ...render(
      <Provider store={store}>
        <NewTaskBar />
        <TaskList />
        <NotifierContainer />
      </Provider>
    ),
    store,
  };
}
describe('Оповещение при вополнении задачи', () => {
    it('появляется и содержит заголовок задачи', async () => {
        renderList(initial);
        const checkbox = screen.getByRole("checkbox", { name: /Task 1/i });
        await userEvent.click(checkbox);
        expect(screen.getByText(/завершена/i)).toBeInTheDocument();
    });
    it('одновременно может отображаться только одно', async () => {
        renderList(initial);
        const checkbox1 = screen.getByRole("checkbox", { name: /Task 1/i });
        await userEvent.click(checkbox1);
        await userEvent.click(checkbox1);
        expect(screen.getByText(/завершена/i)).toBeInTheDocument();

        const checkbox2 = screen.getByRole("checkbox", { name: /Task 2/i });
        await userEvent.click(checkbox2);
        await userEvent.click(checkbox2);
        expect(screen.getByText(/завершена/i)).toBeInTheDocument();

        expect(screen.queryByText(/Задача "Task 1" завершена/i)).toBeNull();
    });
});