import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Empty } from "src/components/Empty";
import { List } from "src/components/List";
import { deleteTask, tasksSelector, toggleTask } from "src/store/taskSlice";

export const TaskList = () => {
  const [filter, setFilter] = useState<boolean>(false)
  const items = useSelector(tasksSelector);
  const dispatch = useDispatch();

  

  const handleDelete = (id: Task["id"]) => {
    dispatch(deleteTask(id));
  };

  const handleToggle = (id: Task["id"]) => {
    dispatch(toggleTask(id));
  };

  const filtred = filter ? items.filter(item=> !item.done) : items

  return <>
  <label className="">
  <input
        type="checkbox"
        checked={filter}
        onChange={() => setFilter(!filter)}
      />
      Показать невыполненные
</label>
 { filtred.length > 0 ? (
    <List items={filtred} onDelete={handleDelete} onToggle={handleToggle} />
  ) : (
    <Empty />
  )}
  </>
};
