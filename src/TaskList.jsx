import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemIcon,
  Checkbox,
  ListItemText,
  IconButton,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask.trim() === "") return;
    const now = new Date();
    const dateWithoutTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const newTaskItem = {
      id: Date.now(),
      text: newTask,
      completed: false,
      createdDate: dateWithoutTime.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }),
    };
    setTasks((prevTasks) => [...prevTasks, newTaskItem]);
    setNewTask("");
  };

  const handleDelete = (taskId) => {
    setTasks((prevTasks) => {
      if (editingTask === taskId) {
        setEditingTask(null);
      }
      return prevTasks.filter((task) => task.id !== taskId);
    });
  };

  const handleToggleCompletion = (taskId) => {
    if (editingTask !== taskId) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId && !editingTask
            ? { ...task, completed: !task.completed }
            : task
        )
      );
    }
  };

  const handleEdit = (taskId) => {
    setEditingTask(taskId);
  };

  const handleSave = (taskId) => {
    setEditingTask(null);
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  };

  return (
    <Container className="container" maxWidth="sm">
      <h2>MI LISTA</h2>
      <hr />
      <form onSubmit={handleSubmit}>
        <TextField
          label="Ingresa una tarea"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Listar Tarea
        </Button>
      </form>
      <List className="task-list">
        {tasks.map((task, index) => (
          <React.Fragment key={task.id}>
            <ListItem
              dense
              button
              onClick={() => handleToggleCompletion(task.id)}
            >
              <ListItemIcon>
                {task.completed ? (
                  <CheckCircleIcon style={{ color: "green" }} />
                ) : (
                  <Checkbox
                    edge="start"
                    checked={task.completed}
                    disableRipple
                  />
                )}
              </ListItemIcon>
              {editingTask === task.id ? (
                <TextField
                  autoFocus
                  value={task.text}
                  onChange={(e) =>
                    setTasks((prevTasks) =>
                      prevTasks.map((t) =>
                        t.id === task.id ? { ...t, text: e.target.value } : t
                      )
                    )
                  }
                  fullWidth
                  margin="normal"
                />
              ) : (
                <ListItemText
                  style={{
                    textDecoration: task.completed ? "line-through" : "none",
                  }}
                >
                  {task.text} - {task.createdDate}
                </ListItemText>
              )}
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDelete(task.id)}
              >
                <DeleteIcon />
              </IconButton>
              {editingTask === task.id ? (
                <IconButton
                  edge="end"
                  aria-label="save"
                  onClick={() => handleSave(task.id)}
                >
                  <SaveIcon />
                </IconButton>
              ) : (
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleEdit(task.id)}
                >
                  <EditIcon />
                </IconButton>
              )}
            </ListItem>
            {index !== tasks.length - 1 && <hr />}
          </React.Fragment>
        ))}
      </List>
      <div style={styles.container}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setTasks([])}
        >
          borrar todo
        </Button>
      </div>
    </Container>
  );
};

export default TaskList;
