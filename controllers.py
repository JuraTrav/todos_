from flask import Blueprint, request

import os.path
import json
import uuid

todos = Blueprint('todos', __name__)

path = 'data.json'

@todos.route('/')
def get_todos_list():
  with open('data.json', 'r') as f:
    file_data = json.load(f)
    if("todos" not in file_data):
      file_data["todos"] = []
  return file_data['todos']

@todos.route('/', methods=['POST'])
def add_todo_task():
  request_data = request.get_json()
  request_goal = request_data['goal']
  todos_id = uuid.uuid4()
  
  obj_to_save = {
    "id": str(todos_id),
    "goal": request_goal,
    "completed": False
  }
  
  data_json = {
    "todos": []
  }
  
  check_file = os.path.isfile(path)
  
  if not check_file:
    with open('data.json', 'w') as f:
      json.dump(data_json, f, indent=4)
  
  with open('data.json', 'r+') as f:
    file_data = json.load(f)
    
    if "todos" not in file_data:
      file_data.append(data_json)
      
    fd_todos = file_data['todos']
    fd_todos.append(obj_to_save)
    f.seek(0)
    json.dump(file_data, f, indent=4)
  
  return f'Item added to list!'

@todos.route('/', methods=['DELETE'])
def delete_todo_by_id():
  request_data = request.get_json()
  request_id = request_data['id']
  
  with open('data.json', 'r') as f:
    file_data = json.load(f)
    
    if("todos" not in file_data):
      return f'No items in list!'
    
    fd_todos = file_data['todos']
    
    if(type(request_id) == str):
      for obj in fd_todos:
        if obj['id'] == request_id:
          todo_item_index = fd_todos.index(obj)
          fd_todos.pop(todo_item_index)
          break
    else:
      for item in request_id:
        for obj in fd_todos:
          if obj['id'] == item:
            todo_item_index = fd_todos.index(obj)
            fd_todos.pop(todo_item_index)
            break
  
  with open('data.json', 'w') as f:
    json.dump(file_data, f, indent=4)
  
  return f'Item was remove from list!'

@todos.route('/', methods=['PUT'])
def todo_item_completed():
  request_data = request.get_json()
  request_id = request_data['id']
  
  with open('data.json', 'r+') as f:
    file_data = json.load(f)
    fd_todos = file_data['todos']
    
    if type(request_id) == str:
      for obj in fd_todos:
        if obj['id'] == request_id:
          obj['completed'] = not obj['completed']
          break
    else:
      for item in request_id:
        for obj in fd_todos:
          if obj['id'] == item:
            obj['completed'] = not obj['completed']
            break
    f.seek(0)
    
  with open('data.json', 'w') as f:
    json.dump(file_data, f, indent=4)  
    
  return f'Item status was changed!'
