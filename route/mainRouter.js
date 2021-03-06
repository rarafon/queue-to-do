/**
 * Handles events regarding ipcMain and routes
 * to correct location.
 */
const { ipcMain }  = require('electron');

const mkdirp = require('mkdirp');
const getDirName = require('path').dirname;
const fs = require('fs');

module.exports.loadRouter = loadRouter;

function loadRouter(dbService) {  
  ipcMain.on("get-todo", (event, arg) => {
    dbService.get_todos(arg.container_id, (data)=> {
      if (!data) {
        event.reply("get-todo", []);
      } else {
        event.reply("get-todo", data);
      }
    });
  });

  ipcMain.on("edit-todo", (event, arg) => {
    dbService.edit_todo(arg.todo_id, arg.property, arg.value);
  });
  
  ipcMain.on("create-task", (event, arg) => {
    if (arg.todo_id) {
      dbService.create_task(arg.todo_id, arg.name, (data) => {
        event.reply("create-task", data)
      });
    }
  });
  
  ipcMain.on("edit-task", (event, arg) => {
    dbService.edit_task(arg.task_id, arg.property, arg.value);
  });
  
  ipcMain.on("create-todo", (event, arg) => {
    if (arg.name && arg.name.length > 0) {
      dbService.create_todo(arg.name, arg.container_id, (data) => {
        event.reply("create-todo", data);
      });
    }
  });
  
  ipcMain.on("delete-task", (event, arg) => {
    if (arg.task_id)
      dbService.delete_task(arg.task_id);
    event.reply("delete-task", "OK");
  });
  
  ipcMain.on("delete-todo", (event, arg) => {
    if (arg.todo_id) {
      dbService.delete_todo(arg.todo_id);
      event.reply("delete-todo", {todo_id: arg.todo_id});
    }
  });
  
  ipcMain.on("switch-task-order", (event, arg) => {
    console.log(arg);
    dbService.switch_tasks(arg.task1, arg.task2, ()=> {
      event.reply("switch-task-order", "OK");
    });
  });
  
  ipcMain.on("complete-task", (event, arg) => {
    dbService.complete_task(arg.task_id, arg.task_done, () =>{
      event.reply("complete-task");
    });
  });

  // Save to data/data/json
  ipcMain.on("save-file", (event, arg) => {
    dbService.get_todos((data)=> {
      if (data) {
        const path = "data/data.json";
        mkdirp(getDirName(path), function(err) {
          if (err) {
            event.reply("save-file", err);
            return;
          }
          
          let saveData = {
            settings: arg.settings,
            data_list: data,
          };

          fs.writeFile("data/data.json", JSON.stringify(saveData), 'utf8', ()=>{
            event.reply("save-file", "OK");
          });
        });
      }
    });
    
  });

  ipcMain.on("load-file", (event, arg) => {
    const path = "data/data.json";
    fs.readFile(path, {encoding: 'utf-8'}, function(err, jsonData) {
      if (err) {
        console.log(err);
        event.reply("load-file", err);
        return;
      }

      let data = JSON.parse(jsonData);
      dbService.load_data(data.data_list, ()=> {
        event.reply("load-file", data);
      });
    });
  });

  ipcMain.on("get-containers", (event, arg) => {
    dbService.getContainers((containers)=>{
      event.reply("get-containers", containers);
    })
  });

  ipcMain.on("create-container", (event, arg) => {
    dbService.createContainer(arg.name, (container)=> {
      event.reply("create-container", container);
    });
  })
}