const { app, BrowserWindow, ipcMain }  = require('electron');

const sqlite3 = require('sqlite3').verbose();
// const db = new sqlite3.Database(':memory:');
const db = new sqlite3.Database('todo_db.db');

const  dbService = require('./dbService')(db);

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    }
  });
  win.loadFile('index.html');
  dbService.check_db();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { // Mac - returns darwin
    app.quit();
    db.close();
  }
});

ipcMain.on('test-it', (event, ... args) => {
  // console.log(args);
  console.log("test-it");
  event.reply('test-it', {1: 11,});
});

ipcMain.on("get-todo", (event, arg) => {
  dbService.get_todos((data)=> {
    event.reply("get-todo", data);
  });
});

ipcMain.on("edit-todo", (event, arg) => {
  dbService.edit_todo(arg.todo_id, arg.property, arg.value);
});

ipcMain.on("create-task", (event, arg) => {
  if (arg.todo_id) {
    console.log(arg);
    dbService.create_task(arg.todo_id);
  }
});

ipcMain.on("create-todo", (event, ...args) => {
  if (args.length > 0) {
    dbService.create_todo(args[0].name);
  }
  console.log("create", args);
  event.reply("create-todo", {name: args.name,})
});

ipcMain.on("delete-todo", (event, arg) => {
  if (arg.todo_id) {
    dbService.delete_todo(arg.todo_id);
    event.reply("delete-todo", {todo_id: arg.todo_id});
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0)  {
    createWindow();
  }
});