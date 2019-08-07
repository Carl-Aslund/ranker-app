const { app, BrowserWindow, Menu, dialog } = require('electron');
// const ipc = require('electron').ipcRenderer;
const fs = require('fs'); // Load the File System to execute our common tasks (CRUD)

let win;
var entryText = "";
var comparisons = 0;

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function sortEntries(){
  // TODO: Connect to a button
  // TODO: Implement the whole function
  // Split entries by newline
  let entries = entryText.split('\n')
  // Mergesort them in helper function
  let sortedEntries = mergeSort(entries)
  // TODO: Render popup list of results
  console.log(sortedEntries);
  console.log(comparisons);
}

function mergeSort(entries){
  // Helper method for merge-sorting an array of entries
  if(entries.length <= 1){
    return entries;
  }

  // In order to divide the array in half, we need to figure out the middle
  const middle = Math.floor(entries.length / 2);

  // This is where we will be dividing the array into left and right
  const left = entries.slice(0, middle);
  const right = entries.slice(middle);

  // Using recursion to combine the left and right
  return merge(
    mergeSort(left), mergeSort(right)
  );
}

function merge(left, right){
  // Merge two sorted lists of entries
  let resultArray = [], leftIndex = 0, rightIndex = 0;

  // We will concatenate values into the resultArray in order
  while (leftIndex < left.length && rightIndex < right.length) {
    // if (left[leftIndex] < right[rightIndex]) {
    if (compare(left[leftIndex], right[rightIndex])) {
      resultArray.push(left[leftIndex]);
      leftIndex++; // move left array cursor
    } else {
      resultArray.push(right[rightIndex]);
      rightIndex++; // move right array cursor
    }
  }

  // We need to concat here because there will be one element remaining
  // from either left OR the right
  return resultArray
          .concat(left.slice(leftIndex))
          .concat(right.slice(rightIndex));
}

function compare(entry1, entry2){
  // Determine if entry1 is greater than entry2 by asking the user to decide
  // TODO: Instead of popup, modify window
  comparisons++;
  const options = {
    type: 'question',
    buttons: [entry2, entry1],
    message: 'Choice',
    detail: 'Which option do you prefer?'
  }
  const response = dialog.showMessageBoxSync(options);
  return (response == 1);
}

function createWindow(){
  // Create Menu
  var menu = Menu.buildFromTemplate([
    {
      label: 'Menu',
      submenu: [
        {
          label: 'Exit',
          click() {
            app.quit()
          }
        }
      ]
    },
    {
      label: 'Upload',
      submenu: [
        {
          label: 'From File',
          // Select a file, then copy down the data
          click() {
            dialog.showOpenDialog({properties: ['openFile','multiSelections']}, (filePaths) => {
              (fs.readFile(filePaths[0], 'utf-8', (err, data) => {
                if(err){
                    alert("An error ocurred reading the file :" + err.message);
                    return;
                }
        
                // Change how to handle the file content
                console.log("The file content is : " + data);
                entryText = data;
          }))})}
        },
        {
          label: 'Manual Entry (WIP)'
          // TODO: Open a window with a textbox for manual entry
        }
      ]
    },
    {
      label: 'Sort',
      submenu: [
        {
          label: 'Begin Sorting',
          click() {
            sortEntries()
          }
        }
      ]
    }
  ])
  Menu.setApplicationMenu(menu);

  // Create browser window
  win = new BrowserWindow({
    width: 500, 
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Load index.html
  win.loadFile('views/index.html');

  // Unload window when closed
  win.on('closed', () => {
      win = null;
  });
}

// Run create window function
app.on('ready', createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin'){
        app.quit(); 
    }
});