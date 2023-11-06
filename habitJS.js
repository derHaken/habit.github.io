localStorage.clear()

let currentDate = new Date()
currentDate = currentDate.setHours(0, 0, 0, 0) + 0*(86400000)

let habitProgramHTML = document.querySelector('.habitProgram-HTML').innerHTML;


let changeHTML;
let habitProgram = [];
let habitsDone =[currentDate]; 
let neededHabits = [];
let habitNames = [];
const storedNeededHabits  = localStorage.getItem("SavedNeededHabits");
if(storedNeededHabits) {
    neededHabits = JSON.parse(storedNeededHabits);
}

let storedHabitNames = localStorage.getItem("SavedHabitNames");
if(storedHabitNames) {
    habitNames = JSON.parse(storedHabitNames);
}

function daysChecker(){
    let status = [];

    if(document.querySelector(".habitSheets").querySelectorAll(".sheetBox")) {

        document.querySelector(".habitSheets").querySelectorAll(".sheetBox").forEach(sheetBox => {

    
            let boxDate = sheetBox.getAttribute('data-date')

            let parentElement = sheetBox.parentNode;

            

            if((parseInt(boxDate) === currentDate) && (window.getComputedStyle(parentElement).getPropertyValue('display') === 'flex')){
                
                status.push(sheetBox.getAttribute('data-statu'))

                console.log(status)
            
                if(status.includes('NotDone') || status.length === 0){

                    console.log("gri")

                    let box = document.querySelector('[data-name="30daysSheet"][data-date="' + currentDate + '"]');
                    box.setAttribute('data-statu', 'NotDone')
                    box.style.backgroundColor = 'rgb(80, 85, 84)'
                    box.style.boxShadow= 'none'

                }else{

                    console.log('yeş')
                    let box = document.querySelector('[data-name="30daysSheet"][data-date="' + currentDate + '"]');
                    box.setAttribute('data-statu', 'Done')
                    box.style.backgroundColor = 'rgb(110, 187, 62)';
                    box.style.boxShadow = 'inset 0 0 0 3px rgb(71, 163, 14)';
                }
            }
    

        })
    }
}

programPage()


let storedDate = localStorage.getItem("SavedDate")
if (storedDate) {
    storedDate = JSON.parse(storedDate) 

    if( storedDate === currentDate){
        const storedHTML = localStorage.getItem("SavedHTML");
        if (storedHTML) {
            document.body.innerHTML = JSON.parse(storedHTML);
        }

        const storedHabitsDone  = localStorage.getItem("SavedHabitsDone");
        if(storedHabitsDone) {
            habitsDone = JSON.parse(storedHabitsDone);
        }

        const storedHabitProgram = localStorage.getItem("SavedHabitProgram");
        if (storedHabitProgram) {
            habitProgram = JSON.parse(storedHabitProgram);
        }
    }else {
        const storedHabitProgram = localStorage.getItem("SavedHabitProgram");
        if (storedHabitProgram) {
            habitProgram = JSON.parse(storedHabitProgram);
        }
        programPage()
    }
}




// swipe
function swipeChange(){
    let habitElements = document.querySelectorAll('.habit');

    habitElements.forEach((swipeElement) => {
        let isDragging = false;
        let startX;
        let currentX = 0;
    
        swipeElement.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].clientX - currentX;
    
            // Remove transition while swiping
            swipeElement.style.transition = 'none';
        });
    
        swipeElement.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
    
            const newCurrentX = e.touches[0].clientX - startX;
    
            currentX = newCurrentX;
            swipeElement.style.transform = `translateX(${currentX}px)`;
            
            e.preventDefault(); // Prevent default touchmove events
        });
    
        swipeElement.addEventListener('touchend', () => {
            isDragging = false;
    
            if (currentX <= -200) {

                let buttonElement = swipeElement.querySelector('.checkBox')


                if(buttonElement.classList.contains("clicked")) {
                    let indexToRemove = habitsDone.indexOf(buttonElement.dataset.btnid);
                    if (indexToRemove !== -1) {
                        habitsDone.splice(indexToRemove, 1);
                    }

                }
                
                habitProgram.forEach( (habit, index) => {
                    if(habit.habitName === swipeElement.dataset.habitname && (habit.habitHour + ':' + habit.habitMin) === swipeElement.dataset.habittime) {
                        
                        habitProgram.splice(index,1)

                        console.log(habitProgram)
                    }
                })
    
                swipeElement.remove();

                habitProgram.forEach(function (habit) {
                    if (habit.habitName === buttonElement.dataset.btnid) {
                        habit.neededHabit = habit.neededHabit - 1;
                    }
                });
    
                const uniqueHabits = new Map();
                habitProgram.forEach((habit) => {
                    const key = habit.habitName + habit.neededHabit;
                    if (!uniqueHabits.has(key)) {
                        uniqueHabits.set(key, {
                            habitName: habit.habitName,
                            neededHabit: habit.neededHabit
                        });
                    }
                });
                const doneHabitsMap = countStrings(habitsDone).reduce((map, habit) => {
                    map[habit.doneHabitName] = habit.doneHabitCount;
                    return map;
                }, {});
                neededHabits = Array.from(uniqueHabits.values());

                // habitProgram.forEach(function (habit) {
                //     if (habit.habitName === name) {
                //         habit.neededHabit = nameCount;
                //     }
                // });


                neededHabits.forEach((neededHabit) => {
                    const doneCount = doneHabitsMap[neededHabit.habitName];
                    if (doneCount === neededHabit.neededHabit) {
                      console.log(`${neededHabit.habitName} has the same count: ${doneCount}`);
            
                      let date = habitsDone[0];
            
                      var divElements = document.querySelectorAll('.sheetBox');
            
                      divElements.forEach(function(div) {
                            let dataName = div.getAttribute('data-name');
                            let dataDate = parseInt(div.getAttribute('data-date'));
            
                            if (dataName === neededHabit.habitName && dataDate === date) {
                                div.setAttribute('data-statu','Done');  
                            }
                            if(div.getAttribute('data-statu') === 'Done') {
                                div.style.backgroundColor = 'rgb(110, 187, 62)';
                                div.style.boxShadow = 'inset 0 0 0 3px rgb(71, 163, 14)';
        
                            }else {
                                div.style.backgroundColor = 'rgb(80, 85, 84)'
                                div.style.boxShadow= 'none';
            
                            }
                        }
                      )
                    } else {
                      console.log(`${neededHabit.habitName} count does not match.`);
            
                      let date = habitsDone[0];
            
                      var divElements = document.querySelectorAll('.sheetBox');
            
                      divElements.forEach(function(div) {
                            let dataName = div.getAttribute('data-name');
                            let dataDate = parseInt(div.getAttribute('data-date'));
            
                            if (dataName === neededHabit.habitName && dataDate === date) {
                                div.setAttribute('data-statu','NotDone');  
                            }
                            if(div.getAttribute('data-statu') === 'Done') {
                                div.style.backgroundColor = 'rgb(110, 187, 62)';
                                div.style.boxShadow = 'inset 0 0 0 3px rgb(71, 163, 14)';
        
                            }else {
                                div.style.backgroundColor = 'rgb(80, 85, 84)'
                                div.style.boxShadow= 'none';
                            }
            
                            
                        }
                      )
            
                    }
                });
    
                habitNames = [],
                habitProgram.forEach(habit => {
                    habitNames.push(habit.habitName)
                })

                // Sheet edit
    
                let sheets = document.querySelectorAll('.sheet');

                sheets.forEach( (sheet) => {
                    if(!(habitNames.includes(sheet.dataset.habitname))) {
                        if(!(sheet.getAttribute('data-30days') === "30daysSheet")) {
                            sheet.style.display = "none"
                        }
                        
                    }
                    
                })

    
    
                localStorage.setItem("SavedHabitsDone", JSON.stringify(habitsDone));
                historyHTML = document.querySelector('.history-page').innerHTML;
                localStorage.setItem("SavedHistoryHTML", JSON.stringify(historyHTML));
                localStorage.setItem("SavedNeededHabits", JSON.stringify(neededHabits));
                localStorage.setItem("SavedHabitProgram", JSON.stringify(habitProgram));

                changeHTML = document.body.innerHTML
                localStorage.setItem("SavedHTML", JSON.stringify(changeHTML));
    
            } else if (currentX >= 200) {

                checkBtn(swipeElement.querySelector('.checkBox'))
                
            }
    
            // Smoothly transition back to the starting position
            swipeElement.style.transition = 'transform 0.5s ease-in-out';
            currentX = 0; // Reset the position to 0px
            swipeElement.style.transform = `translateX(${currentX}px)`;
        });
    
        // Reset transition property after the transition has ended
        swipeElement.addEventListener('transitionend', () => {
            swipeElement.style.transition = 'none';
        });
    });
}
swipeChange()


localStorage.setItem("SavedDate", JSON.stringify(currentDate));

let historyHTML;
const storedHistoryHTML = localStorage.getItem("SavedHistoryHTML");
if (storedHistoryHTML) {
    document.querySelector('.history-page').innerHTML = JSON.parse(storedHistoryHTML)
}




let monthlySheet = [];
let habitSheets = [];

const storedHabitSheets = localStorage.getItem("SavedHabitSheets");
if (storedHabitSheets) {
    habitSheets = JSON.parse(storedHabitSheets);
}


// Page buttons
document.getElementById('mainBtn').classList.add("active")

document.querySelector('.main-page').style.display = "flex"
document.querySelector('.history-page').style.display = "none"
document.querySelector('.read-page').style.display = "none"

document.getElementById('mainBtn').addEventListener('click', function activatePage(){
    document.getElementById('mainBtn').classList.add("active")

    document.getElementById('historyBtn').classList.remove("active")
    document.getElementById('readBtn').classList.remove("active")

    document.querySelector('.main-page').style.display = "flex"
    document.querySelector('.history-page').style.display = "none"
    document.querySelector('.read-page').style.display = "none"
    
} );
document.getElementById('historyBtn').addEventListener('click', function activatePage(){
    document.getElementById('historyBtn').classList.add("active")

    document.getElementById('mainBtn').classList.remove("active")
    document.getElementById('readBtn').classList.remove("active")

    document.querySelector('.main-page').style.display = "none"
    document.querySelector('.history-page').style.display = "flex"
    document.querySelector('.read-page').style.display = "none"
    
} );
document.getElementById('readBtn').addEventListener('click', function activatePage(){
    document.getElementById('readBtn').classList.add("active")

    document.getElementById('mainBtn').classList.remove("active")
    document.getElementById('historyBtn').classList.remove("active")

    document.querySelector('.main-page').style.display = "none"
    document.querySelector('.history-page').style.display = "none"
    document.querySelector('.read-page').style.display = "flex"
} );

// Current Program List Function

function programPage(){
    habitProgramHTML = '';
    habitProgram.forEach(function(item){
        habitProgramHTML = habitProgramHTML +
        `
        <div class="habit" data-habitTime ="${item.habitHour}:${item.habitMin}" data-habitName ="${item.habitName}">
            <div class="habitTime">
                ${item.habitHour}:${item.habitMin}
            </div>
            <div class="habitName">
                ${item.habitName} 
            </div>
            <button onclick="checkBtn(this)" data-btnID="${item.habitName}" class="checkBox">&#10004</button>

        </div>
        `;

        document.querySelector('.habitProgram-HTML').innerHTML = habitProgramHTML 
    })
}


let habitInputActive = document.querySelector('.habitInput').style.display;
let addHabitBtn = document.querySelector(".add-habit-btn");
// Add a Habit Input Section
addHabitBtn.addEventListener("click", function(){

    if(habitInputActive === ''){

        document.querySelector('.habitInput').style.display ='flex';
        habitHour.focus()      
    }
});

// Cancel button
let habitNameNV = document.getElementById('habitName') 
let habitHourNV = document.getElementById('habitHour')
let habitMinNV = document.getElementById('habitMin')

document.querySelector('.cancel-btn').addEventListener('click', function cancel(){

    document.querySelector('.habitInput').style.display ='';
    document.getElementById('habitHour').style.outline = null;
    document.getElementById('habitMin').style.outline = null;
    document.getElementById('habitName').style.outline = null;
    habitHourNV.style.backgroundColor = '#505453';
    habitMinNV.style.backgroundColor = '#505453';
    habitNameNV.style.backgroundColor = '#505453';
})

// 
function countStrings(array) {
    var valueCounts = {};
  
    // Iterate over the array and count each string.
    for (var i = 0; i < array.length; i++) {
      var value = array[i];
  
      // If the string is already defined in valueCounts, increment its count.
      if (valueCounts[value]) {
        valueCounts[value]++;
      } else {
        // If the string is not defined in valueCounts, set its count to 1.
        valueCounts[value] = 1;
      }
    }
  
    // Convert the valueCounts object to an array of objects
    var countedObjects = Object.keys(valueCounts).map(function (key) {
      return { doneHabitName: key, doneHabitCount: valueCounts[key] };
    });
  
    // Return the results.
    return countedObjects;
}

// Input area move
function handleInput(inputField, nextInputId, prevInputId) {

    inputField.addEventListener('keydown', function(event) {
        if (event.keyCode === 8 && inputField.value.length === 0) {
            // User pressed the backspace key when the input is empty, focus on the previous input field
            const prevInput = document.getElementById(prevInputId);
            if (prevInput) {
                prevInput.focus();
            }
        }
    });
    if (inputField.value.length === inputField.maxLength) {
        // Input field reached max length, focus on the next input field
        const nextInput = document.getElementById(nextInputId);
        if (nextInput) {
            nextInput.focus();
        }
    } else if (inputField.value.length === 0) {
        // Input field is empty
        const prevInput = document.getElementById(prevInputId);
        if (prevInput) {
            prevInput.focus();
        }
    }
};

let habitData = document.getElementById('habitData');


// Submit the habit
habitData.addEventListener('submit', function add(e) {
    e.preventDefault();

    let habitHour = document.getElementById('habitHour').value; // Get the value
    let habitMin = document.getElementById('habitMin').value; // Get the value
    let habitName = document.getElementById('habitName').value; // Get the value


    habitNames = [],
    habitProgram.forEach(habit => {
        habitNames.push(habit.habitName)
    })

    if(document.querySelector('.daysSheet').innerHTML === ''){
        // Create an array for 30 days boxes
        let newElement = document.createElement("div");
        newElement.setAttribute( 'data-30days', `30daysSheet`)
        newElement.classList.add('30daysSheet',"sheet")
        document.querySelector('.daysSheet').appendChild(newElement);

        newElement.innerHTML = 
        `
        <div class ="30daysSheet HabitTitle"> 30 Days Progress </div>
        `;

        
        let habitDays = [];
        for (var i = 0; i < 30; i++) {

            habitDays.push({
                name: "30daysSheet",
                date: currentDate + i*(24 * 60 * 60 * 1000),
                statu: "NotDone"
            })
        }
        
        habitDays.forEach(function addBoxes(habitDay) {


            newElement.innerHTML = newElement.innerHTML +
            `
            <div class="sheetBox" data-name = "30daysSheet" data-date="${habitDay.date}" data-statu="${habitDay.statu}"></div>
            `
        })

        localStorage.setItem("SavedHabitSheets", JSON.stringify(habitSheets))

        historyHTML = document.querySelector('.history-page').innerHTML;
        localStorage.setItem("SavedHistoryHTML", JSON.stringify(historyHTML));
    }

    let habitID = habitName;
    let nameCount = 1;

    habitNames.forEach(function (name) {
        if (name === habitName) {
    
            function countOccurrences(arr, item) {
                let count = 0;
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i] === item) {
                        count++;
                    }
                }
                return count;
            }
    
            nameCount = Number(countOccurrences(habitNames, name)) + 1;
            habitID = nameCount + habitName;
    
            habitProgram.forEach(function (habit) {
                if (habit.habitName === name) {
                    habit.neededHabit = nameCount;
                }
            });
        }
    });

    let hasMatchingSheet = habitSheets.some(obj => obj.sheetName === habitName);


    if(!hasMatchingSheet) {
        
        habitSheets.push({
            sheetName: habitName,
            startDate: currentDate
        })
    


        // Create an array for 30 days boxes
        let divName = habitName + '-sheet'
        let newElement = document.createElement("div");
        newElement.setAttribute( 'data-divName', `${divName}`)
        newElement.setAttribute( 'data-habitName', `${habitName}`)
        newElement.classList.add('sheet')
        document.querySelector('.habitSheets').appendChild(newElement);

        newElement.innerHTML = 
        `
        <div class ="HabitTitle"> ${habitName} </div>
        `;

        
        let habitDays = [];
        for (var i = 0; i < 30; i++) {

            habitDays.push({
                name: habitName,
                date: currentDate + i*(24 * 60 * 60 * 1000),
                statu: "NotDone"
            })
        }
        
        habitDays.forEach(function addBoxes(habitDay) {


            newElement.innerHTML = newElement.innerHTML +
            `
            <div class="sheetBox" data-name = "${habitDay.name}" data-date="${habitDay.date}" data-statu="${habitDay.statu}"></div>
            `
        })

        localStorage.setItem("SavedHabitSheets", JSON.stringify(habitSheets))

        historyHTML = document.querySelector('.history-page').innerHTML;
        localStorage.setItem("SavedHistoryHTML", JSON.stringify(historyHTML));

    }else{
        let sheets = document.querySelectorAll('.sheet');

        sheets.forEach( (sheet) => {
            if(habitName === (sheet.dataset.habitname)) {

                sheet.style.display = "flex"
            }
            
        })

    }





    if( habitName === ''){
        habitNameNV.focus()
        habitNameNV.style.outline = '#EE3131 3px solid';
        habitNameNV.style.backgroundColor = '#F78383'

    }
    if( habitMin === '' || habitMin > 59 || habitMin < 0){
 
        habitMinNV.focus()
        habitMinNV.style.outline = '#EE3131 3px solid';
        habitMinNV.style.backgroundColor = '#F78383'

    }
    if( habitHour === '' || habitHour < 0 || habitHour > 24){        
        habitHourNV.focus()
        habitHourNV.style.outline = '#EE3131 3px solid';
        habitHourNV.style.backgroundColor = '#F78383'
        
    }
    const BreakError = {};

    if(!(habitHour != '' && habitMin != '' && habitName != '' && habitHour <= 24 && habitHour >= 0 && habitMin < 60 && habitMin >= 0)){
        throw BreakError
    };

    if(habitHour.length < 2){
        habitHour = 0 + habitHour
    }
    if(habitMin.length < 2){
        habitMin = 0 + habitMin
    }

    // Date Created

    console.log(habitName)

    if(habitHour != '' && habitMin != '' && habitName != ''){
        habitProgram.push({
            habitHour: habitHour,
            habitMin: habitMin,
            habitName: habitName,
            neededHabit: nameCount,
            habitID: habitID,
        });
    };

    habitProgramHTML = document.querySelector('.habitProgram-HTML').innerHTML
    function addHTML(){
        let item = habitProgram[habitProgram.length - 1]

        habitProgramHTML = habitProgramHTML +
        `
        <div class="habit" data-habitTime ="${item.habitHour}:${item.habitMin}" data-habitName ="${item.habitName}">
            <div class="habitTime">
                ${item.habitHour}:${item.habitMin}
            </div>
            <div class="habitName">
                ${item.habitName} 
            </div>
            <button onclick="checkBtn(this)" data-btnID="${item.habitName}" class="checkBox">&#10004</button>

        </div>
        `;

        document.querySelector('.habitProgram-HTML').innerHTML = habitProgramHTML 
    }

    console.log(habitProgram)
    addHTML()

    // neededHabits
    neededHabits = [];
    const uniqueHabits = new Map();

    habitProgram.forEach((habit) => {
        const key = habit.habitName + habit.neededHabit;
        if (!uniqueHabits.has(key)) {
            uniqueHabits.set(key, {
                habitName: habit.habitName,
                neededHabit: habit.neededHabit
            });
        }
    });

    neededHabits = Array.from(uniqueHabits.values());

    // Save the updated habitProgram to localStorage
    localStorage.setItem("SavedHabitProgram", JSON.stringify(habitProgram));
    localStorage.setItem("SavedNeededHabits", JSON.stringify(neededHabits));

    habitHourNV.style.outline = null;
    habitMinNV.style.outline = null;
    habitNameNV.style.outline = null;

    habitHourNV.style.backgroundColor = '#505453';
    habitMinNV.style.backgroundColor = '#505453';
    habitNameNV.style.backgroundColor = '#505453';

    habitHourNV.value = '';
    habitMinNV.value = '';
    habitNameNV.value = '';
    document.querySelector('.habitInput').style.display =''

    changeHTML = document.body.innerHTML
    localStorage.setItem("SavedHTML", JSON.stringify(changeHTML));

    const doneHabitsMap = countStrings(habitsDone).reduce((map, habit) => {
        map[habit.doneHabitName] = habit.doneHabitCount;
        return map;
    }, {});
      
    // Iterate through the neededHabits array and compare the counts
    neededHabits.forEach((neededHabit) => {
        const doneCount = doneHabitsMap[neededHabit.habitName];
        if (doneCount === neededHabit.neededHabit) {
          console.log(`${neededHabit.habitName} has the same count: ${doneCount}`);

          let date = habitsDone[0];

          var divElements = document.querySelectorAll('.sheetBox');

          divElements.forEach(function(div) {
                let dataName = div.getAttribute('data-name');
                let dataDate = parseInt(div.getAttribute('data-date'));

                if (dataName === neededHabit.habitName && dataDate === date) {
                    div.setAttribute('data-statu','Done');  
                }
                if(div.getAttribute('data-statu') === 'Done') {
                    div.style.backgroundColor = 'rgb(110, 187, 62)';
                    div.style.boxShadow = 'inset 0 0 0 3px rgb(71, 163, 14)';
                }else {
                    div.style.backgroundColor = 'rgb(80, 85, 84)'
                    div.style.boxShadow= 'none';

                }
            }
          )
        } else {
          console.log(`${neededHabit.habitName} count does not match.`);

          let date = habitsDone[0];

          var divElements = document.querySelectorAll('.sheetBox');

          divElements.forEach(function(div) {
                let dataName = div.getAttribute('data-name');
                let dataDate = parseInt(div.getAttribute('data-date'));

                if (dataName === neededHabit.habitName && dataDate === date) {
                    div.setAttribute('data-statu','NotDone');  
                }
                if(div.getAttribute('data-statu') === 'Done') {
                    div.style.backgroundColor = 'rgb(110, 187, 62)';
                    div.style.boxShadow = 'inset 0 0 0 3px rgb(71, 163, 14)';

                }else {
                    div.style.backgroundColor = 'rgb(80, 85, 84)'
                    div.style.boxShadow= 'none';
                }

                
            }
          )

        }
    });

    daysChecker()
    
    localStorage.setItem("SavedHabitProgram", JSON.stringify(habitProgram));
    historyHTML = document.querySelector('.history-page').innerHTML;
    localStorage.setItem("SavedHistoryHTML", JSON.stringify(historyHTML));

    
    swipeChange()
});

// Check button

function checkBtn(button) {

    if (button.classList.contains('clicked')) {
        // Button is in the "clicked" state
        button.style.backgroundColor = 'rgb(80, 85, 84)';
        button.style.color = '#6f6f6f';
        button.style.border = 'none';
        button.classList.remove('clicked');

        let elementToRemove = button.dataset.btnid;
        let indexToRemove = habitsDone.indexOf(elementToRemove);

        if (indexToRemove !== -1) {
            habitsDone.splice(indexToRemove, 1);
        }

        localStorage.setItem("SavedHabitsDone", JSON.stringify(habitsDone));


        const uniqueHabits = new Map();
        habitProgram.forEach((habit) => {
            const key = habit.habitName + habit.neededHabit;
            if (!uniqueHabits.has(key)) {
                uniqueHabits.set(key, {
                    habitName: habit.habitName,
                    neededHabit: habit.neededHabit
                });
            }
        });

        const doneHabitsMap = countStrings(habitsDone).reduce((map, habit) => {
            map[habit.doneHabitName] = habit.doneHabitCount;
            return map;
        }, {});
        neededHabits = Array.from(uniqueHabits.values());
          
        // Iterate through the neededHabits array and compare the counts
        neededHabits.forEach((neededHabit) => {
            const doneCount = doneHabitsMap[neededHabit.habitName];
            if (doneCount === neededHabit.neededHabit) {
              console.log(`${neededHabit.habitName} has the same count: ${doneCount}`);
    
              let date = habitsDone[0];
    
              var divElements = document.querySelectorAll('.sheetBox');
    
              divElements.forEach(function(div) {
                    let dataName = div.getAttribute('data-name');
                    let dataDate = parseInt(div.getAttribute('data-date'));
    
                    if (dataName === neededHabit.habitName && dataDate === date) {
                        div.setAttribute('data-statu','Done');  
                    }
                    if(div.getAttribute('data-statu') === 'Done') {
                        div.style.backgroundColor = 'rgb(110, 187, 62)';
                        div.style.boxShadow = 'inset 0 0 0 3px rgb(71, 163, 14)';

                    }else {
                        div.style.backgroundColor = 'rgb(80, 85, 84)'
                        div.style.boxShadow= 'none';
    
                    }
                }
              )
            } else {
              console.log(`${neededHabit.habitName} count does not match.`);
    
              let date = habitsDone[0];
    
              var divElements = document.querySelectorAll('.sheetBox');
    
              divElements.forEach(function(div) {
                    let dataName = div.getAttribute('data-name');
                    let dataDate = parseInt(div.getAttribute('data-date'));
    
                    if (dataName === neededHabit.habitName && dataDate === date) {
                        div.setAttribute('data-statu','NotDone');  
                    }
                    if(div.getAttribute('data-statu') === 'Done') {
                        div.style.backgroundColor = 'rgb(110, 187, 62)';
                        div.style.boxShadow = 'inset 0 0 0 3px rgb(71, 163, 14)';

                    }else {
                        div.style.backgroundColor = 'rgb(80, 85, 84)'
                        div.style.boxShadow= 'none';
                    }
    
                    
                }
              )
    
            }
        });
        
        
        historyHTML = document.querySelector('.history-page').innerHTML;
        localStorage.setItem("SavedHistoryHTML", JSON.stringify(historyHTML));

        changeHTML = document.body.innerHTML

        localStorage.setItem("SavedHTML", JSON.stringify(changeHTML));

        daysChecker()

    } else {
        
        // Button is in the "unclicked" state
        button.style.backgroundColor = '#6ebb3e';
        button.style.color = 'white';
        button.style.border = '#47a30e 3px solid';
        button.classList.add('clicked');
 
        let btnID = button.dataset.btnid
        habitsDone.push(btnID)

        localStorage.setItem("SavedHabitsDone", JSON.stringify(habitsDone));

        const uniqueHabits = new Map();
        habitProgram.forEach((habit) => {
            const key = habit.habitName + habit.neededHabit;
            if (!uniqueHabits.has(key)) {
                uniqueHabits.set(key, {
                    habitName: habit.habitName,
                    neededHabit: habit.neededHabit
                });
            }
        });

        const doneHabitsMap = countStrings(habitsDone).reduce((map, habit) => {
            map[habit.doneHabitName] = habit.doneHabitCount;
            return map;
        }, {});
        neededHabits = Array.from(uniqueHabits.values());
          
        // Iterate through the neededHabits array and compare the counts
        neededHabits.forEach((neededHabit) => {
            const doneCount = doneHabitsMap[neededHabit.habitName];
            if (doneCount === neededHabit.neededHabit) {
              console.log(`${neededHabit.habitName} has the same count: ${doneCount}`);
    
              let date = habitsDone[0];
    
              var divElements = document.querySelectorAll('.sheetBox');
    
              divElements.forEach(function(div) {
                    let dataName = div.getAttribute('data-name');
                    let dataDate = parseInt(div.getAttribute('data-date'));
    
                    if (dataName === neededHabit.habitName && dataDate === date) {
                        div.setAttribute('data-statu','Done');  
                    }
                    if(div.getAttribute('data-statu') === 'Done') {
                        div.style.backgroundColor = 'rgb(110, 187, 62)';
                        div.style.boxShadow = 'inset 0 0 0 3px rgb(71, 163, 14)';

                    }else {
                        div.style.backgroundColor = 'rgb(80, 85, 84)'
                        div.style.boxShadow= 'none';
    
                    }
                }
              )
            } else {
              console.log(`${neededHabit.habitName} count does not match.`);
    
              let date = habitsDone[0];
    
              var divElements = document.querySelectorAll('.sheetBox');
    
              divElements.forEach(function(div) {
                    let dataName = div.getAttribute('data-name');
                    let dataDate = parseInt(div.getAttribute('data-date'));
    
                    if (dataName === neededHabit.habitName && dataDate === date) {
                        div.setAttribute('data-statu','NotDone');  
                    }
                    if(div.getAttribute('data-statu') === 'Done') {
                        div.style.backgroundColor = 'rgb(110, 187, 62)';
                        div.style.boxShadow = 'inset 0 0 0 3px rgb(71, 163, 14)';

                    }else {
                        div.style.backgroundColor = 'rgb(80, 85, 84)'
                        div.style.boxShadow= 'none';
                    }
    
                    
                }
              )
    
            }
        });

        daysChecker()
        
        historyHTML = document.querySelector('.history-page').innerHTML;
        localStorage.setItem("SavedHistoryHTML", JSON.stringify(historyHTML));

        changeHTML = document.body.innerHTML

        localStorage.setItem("SavedHTML", JSON.stringify(changeHTML));
    };
}

// Note
const addBox = document.querySelector(".add-box"),
popupBox = document.querySelector(".popup-box"),
popupTitle = popupBox.querySelector("header p"),
closeIcon = popupBox.querySelector("header i"),
titleTag = popupBox.querySelector("input"),
descTag = popupBox.querySelector("textarea"),
addBtn = popupBox.querySelector("button");
const months = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];
const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false, updateId;
addBox.addEventListener("click", () => {
    popupTitle.innerText = "Add a new Note";
    addBtn.innerText = "Add Note";
    popupBox.classList.add("show");
    document.querySelector("body").style.overflow = "hidden";
    if(window.innerWidth > 660) titleTag.focus();
});
closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value = descTag.value = "";
    popupBox.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
});
function showNotes() {
    if(!notes) return;
    document.querySelectorAll(".note").forEach(li => li.remove());
    notes.forEach((note, id) => {
        let filterDesc = note.description.replaceAll("\n", '<br/>');
        let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
        addBox.insertAdjacentHTML("afterend", liTag);
    });
}
showNotes();
function showMenu(elem) {
    elem.parentElement.classList.add("show");
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}
function deleteNote(noteId) {
    let confirmDel = confirm("Are you sure you want to delete this note?");
    if(!confirmDel) return;
    notes.splice(noteId, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
}
function updateNote(noteId, title, filterDesc) {
    let description = filterDesc.replaceAll('<br/>', '\r\n');
    updateId = noteId;
    isUpdate = true;
    addBox.click();
    titleTag.value = title;
    descTag.value = description;
    popupTitle.innerText = "Update a Note";
    addBtn.innerText = "Update Note";
}
addBtn.addEventListener("click", e => {
    e.preventDefault();
    let title = titleTag.value.trim(),
    description = descTag.value.trim();
    if(title || description) {
        let currentDate2 = new Date(),
        month = months[currentDate2.getMonth()],
        day = currentDate2.getDate(),
        year = currentDate2.getFullYear();
        let noteInfo = {title, description, date: `${month} ${day}, ${year}`}
        if(!isUpdate) {
            notes.push(noteInfo);
        } else {
            isUpdate = false;
            notes[updateId] = noteInfo;
        }
        localStorage.setItem("notes", JSON.stringify(notes));
        showNotes();
        closeIcon.click();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    // Define the URL of your JSON file
    var jsonUrl = "https://derhaken.github.io/habit.github.io/habitJSON.json";

    // Use the fetch API to get the JSON data
    fetch(jsonUrl)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(function (data) {
            // Access the "start_url" property from the JSON data
            var startUrl = data.start_url;

            // Use the start_url as needed
            console.log("start_url: " + startUrl);

            // You can insert it into your webpage, e.g., as text content of an element
            var startUrlElement = document.getElementById("start-url-element");
            if (startUrlElement) {
                startUrlElement.textContent = startUrl;
            }
        })
        .catch(function (error) {
            console.error("Error fetching or processing JSON: " + error);
        });
});
