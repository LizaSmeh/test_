import { render, screen } from "@testing-library/react";
import { List } from "src/components/List";
import { JestStoreProvider } from "../utils/JestStoreProvider";
import { NewTaskBar } from "src/modules/NewTaskBar";
import { canAddTask } from "src/store/taskSlice";



it("отображение списка задач", () => {
  const onDelete = jest.fn();
  const onToggle = jest.fn();

  const items: Task[] = [
    {
      id: "1",
      header: "купить хлеб",
      done: false,
    },
    {
      id: "2",
      header: "купить молоко",
      done: false,
    },
    {
      id: "3",
      header: "выгулять собаку",
      done: true,
    },
  ];

  const { rerender, asFragment } = render(
    <List items={items} onDelete={onDelete} onToggle={onToggle} />
  );
  const firstRender = asFragment();
  
  items.pop();

  rerender(<List items={items} onDelete={onDelete} onToggle={onToggle} />);
  const secondRender = asFragment();

  expect(firstRender).toMatchDiffSnapshot(secondRender);
});

it("Список содержит не больше 10 невыполненных задач", () => {
  const { getByRole } = render(<NewTaskBar />, {
    wrapper: JestStoreProvider,
  });

  const buttonElement = getByRole("button", { name: /добавить задачу/i });

  expect(buttonElement).toBeDisabled();
});

it("canAddTask возвращает false, если 10 невыполненных задач", () => {
  const state = {
    taskList: {
      list: Array.from({length: 10}, (item, i) => ({
        id: String(i),
        header: `Task ${i+1}`,
        done: false
      })), notification: '',
    }
  }

  expect(canAddTask(state)).toBe(false)
})
it("canAddTask возвращает true, если меньше 10 невыполненных задач", () => {
  const state = {
    taskList: {
      list: Array.from({length: 9}, (item, i) => ({
        id: String(i),
        header: `Task ${i+1}`,
        done: false
      })), notification: '',
    }
  }

  expect(canAddTask(state)).toBe(true)
})
