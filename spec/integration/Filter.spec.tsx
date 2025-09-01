import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { TaskList } from "src/modules/TaskList";
import taskListReducer from "src/store/taskSlice";

const initial = [
  { id: "1", header: "Task 1", done: false },
  { id: "2", header: "Task 2", done: true },
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
        <TaskList />
      </Provider>
    ),
    store,
  };
}

describe("Список задач", () => {
  // не содержит выполненные задачи
  // после нажатия на кнопку фильтрации
  it("с включенным фильтром", async () => {
    const user = userEvent.setup();

    renderList(initial);

    expect(screen.getAllByRole("listitem")).toHaveLength(2);

    const filterCheck = screen.getByRole("checkbox", {
      name: /Невыполненные/i,
    });
    expect(filterCheck).not.toBeChecked();

    await user.click(filterCheck);
    expect(filterCheck).toBeChecked();

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(1);
    expect(screen.getByText(/Task 1/)).toBeInTheDocument();
  });

  // показывает как выполненные, так и не выполненные задачи
  // после повторного нажатия на кнопку фильтрации
  it("с выключенным фильтром", async () => {
    const user = userEvent.setup();

    renderList(initial);

    const filterCheck = screen.getByRole("checkbox", {
      name: /Невыполненные/i,
    });

    await user.click(filterCheck);
    expect(screen.getAllByRole("listitem")).toHaveLength(1);

    await user.click(filterCheck);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText(/Task 1/)).toBeInTheDocument();
    expect(screen.getByText(/Task 2/)).toBeInTheDocument();
  });

  it("показывает пустое состояние, если задач нет", () => {
    renderList([]);
    expect(
      screen.getByText(/Вы пока не создали ни одной задачи/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Давайте что-нибудь запланируем/i)
    ).toBeInTheDocument();
  });
});
