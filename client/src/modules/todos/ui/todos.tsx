import { 
  Button,
  Collapse,
  FormControl, 
  FormControlLabel, 
  FormLabel, 
  IconButton, 
  List,
  ListItem, 
  Switch, 
  TextField 
} from "@mui/material"
import { useEffect, useState } from "react"
import { TodosService } from "../services"
import { Todo } from "../types"
import DeleteIcon from '@mui/icons-material/Delete';
import { TransitionGroup } from "react-transition-group";
import ButtonGroup from "@mui/material-next/ButtonGroup";

const Todos = () => {
  const [todos, setTodos] = useState([])
  const [filterStatus, setFilterStatus] = useState<null | string>(null)
  const [todo, setTodo] = useState('')
  const todosService = new TodosService()

  const fetchGetRequest = async () => {
    todosService.getTodos().then(data => setTodos(data))
  }

  useEffect(() => {
    fetchGetRequest()
  }, []);

  const addTodo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodo(event.target.value)
  }

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.key === 'Enter') {
      todosService.fetchRequest({ goal: todo }, "POST").then(fetchGetRequest).then(() => setTodo(''))
    }
  }

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const id = event.target.id

    todosService.fetchRequest({id}, "PUT").then(fetchGetRequest)
  }

  const handleOnClickDeleteTask = (id: string) => {
    todosService.fetchRequest({id}, "DELETE").then(fetchGetRequest)
  }

  const handleClearFilter = () => {
    setFilterStatus(null)
  }

  const handleFilter = (event: React.SyntheticEvent): void => {
    event.preventDefault()
    const filter = (event.target as HTMLInputElement).name

    setFilterStatus(filter)
  }

  const handleSwitchCompletedStatuses = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const data = [...todos]
    const ids: string[] = []
    data.forEach((todo: Todo) => {
      if (todo.completed !== event.target.checked) {
        ids.push(todo.id)
      }
    })

    todosService.fetchRequest({id: ids}, "PUT").then(fetchGetRequest)
  }

  const handleRemoveCompleted = () => {
    const data = [...todos]
    const ids: string[] = []
    data.forEach((todo: Todo) => {
      if (todo.completed) {
        ids.push(todo.id)
      }
    })

    todosService.fetchRequest({id: ids}, "DELETE").then(fetchGetRequest)
  }

  const handleFilteredData = (status: string) => {
    const data = [...todos]
    const filter = status === 'active' ? false : true

    const filteredData = data.filter((todo: Todo) => {
      return todo.completed === filter
    })

    return filteredData
  }

  const data = filterStatus ? handleFilteredData(filterStatus) : todos
  const checked = todos.length > 0 && todos.filter((todo: Todo) => todo.completed === true).length === todos.length

  return (
    <FormControl sx={{
      width: "450px",
      alignItems: 'center',
    }}>
      <FormLabel>Todos</FormLabel>
      <TextField 
        value={todo} 
        onKeyUp={handleKeyUp} 
        onChange={addTodo} 
        id="outlined-basic" 
        variant="standard"
        inputProps={{
          maxLength: 50
        }}
        placeholder="What needs to be done? (max. 50 chars)" 
        sx={{
          width: "330px",
          marginBottom: "1rem",
        }} 
      />
        <List sx={{
          overflow: 'auto',
          minHeight: '57px',
          maxHeight: '460px'
        }}>
          <TransitionGroup>
          {data.map((todo: Todo) => (
            <Collapse key={todo.id}>
              <ListItem>
                <FormControlLabel 
                key={todo.id} 
                control={<Switch 
                  id={todo.id} 
                  checked={todo.completed} 
                  onChange={handleOnChange} />} 
                slotProps={{ 
                  typography: { 
                    variant: 'body1', 
                    sx: { 
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      color: todo.completed ? 'text.disabled' : 'text.primary',
                      textAlign: 'left',
                      width: '370px',
                      overflow: 'clip',
                      textOverflow: 'ellipsis',
                      pl: 1
                    } 
                  }
                }}
                label={todo.goal} />

                <IconButton onClick={() => handleOnClickDeleteTask(todo.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            </Collapse>
          ))}
          </TransitionGroup>
      </List>
      <ButtonGroup>
        <Button>
          <Switch checked={checked} onChange={handleSwitchCompletedStatuses}/>
        </Button>
        <Button onClick={handleClearFilter} variant={!filterStatus ? 'contained' : 'text' }>All</Button>
        <Button name='active' onClick={handleFilter} variant={filterStatus === "active" ? 'contained' : 'text' }>Active</Button>
        <Button name='completed' onClick={handleFilter} variant={filterStatus === "completed" ? 'contained' : 'text' }>Completed</Button>
        <Button name='remove-completed' onClick={handleRemoveCompleted} sx={{
          ml: 2
        }}>Clear completed</Button>
      </ButtonGroup>
    </FormControl>
  )
}

export { Todos }
