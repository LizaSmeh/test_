import { render, screen } from "@testing-library/react";
import { Input } from "src/components/Input";
import { NewTaskBar } from "src/modules/NewTaskBar";
import { JestStoreProvider } from "../utils/JestStoreProvider";
import { List } from "src/components/List";
import userEvent from "@testing-library/user-event";
import { Item } from "src/components/Item";

beforeEach(() => {
  jest.useRealTimers();
});

describe('Элемент списка задач', () => {
    it('название не должно быть больше 32 символов', () => {
        const mok =  jest.fn();

    render(
      <Input value="Эта строка длиннее чем 32 символа!!!!!!!!!!!!!!" onChange={mok} />
    );

    const hintElement = screen.getByTestId("input-hint-text");

    expect(hintElement).toHaveTextContent(
      "Длина заголовка не должна превышать 32 символа"
    );
    }
    );
    it('название не должно быть пустым', () => {
          render(<NewTaskBar />, {
      wrapper: JestStoreProvider,
    });

    const buttonElement = screen.getByLabelText("добавить задачу");

    expect(buttonElement).toBeDisabled();
    });
    it("нельзя удалять невыполненные задачи", () => {
    const onDelete = jest.fn();
    const onToggle = jest.fn();

    const items: Task[] = [
      {
        id: "1",
        header: "погладить кота",
        done: false,
      },
    ];

    render(<List items={items} onDelete={onDelete} onToggle={onToggle} />);

    const deleteBtn = screen.getByRole("button", { name: /удалить/i });

    expect(deleteBtn).toBeDisabled();
  });

  it('нельзя отмечать повторно выполненную задачу', async () => {
       const onDelete = jest.fn();
    const onToggle = jest.fn();

    render(<Item id = "1" header="погладить кота" done= {true} onDelete={onDelete} onToggle={onToggle} />);

    const checkbox = screen.getByRole("checkbox");
    await userEvent.click(checkbox);

    expect(onToggle).toBeCalledTimes(1);})

});