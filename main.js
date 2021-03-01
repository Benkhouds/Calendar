
const months= new Map([[0,"JANUARY"],[1,"FEBRUARY"],[2,"MARCH"],[3,"APRIL"],[4,"MAY"],[5,"JUNE"],[6,"JULY"],[7,"AUGUST"],
[8,"SEPTEMBER"],[9,"OCTOBER"],[10,"NOVEMBER"],[11,"DECEMBER"]]);
const monthDays = new Map([[0,31],[1,28],[2,31],[3,30],[4,31],[5,30],[6,31],[7,31],[8,30],[9,31],[10,30],[11,31]]);
const weekDays= new Map([[0,6],[1,0],[2,1],[3,2],[4,3],[5,4],[6,5]]);
let storageArray= JSON.parse(localStorage.getItem('storage'))!=undefined ? JSON.parse(localStorage.getItem('storage')) : [];

const currentDate=new Date(); 
const selectedDate= new Date();

//colors 

const blue = "rgba(76,195,255,0.8)";
const red= "rgba(247,120,120,0.8)";
const green = "rgb(179, 218, 83)";
const purple = "rgb(212, 161, 233)";
var pickedColor= red ;
//Select html elements
 
 const calendar = document.getElementById("calendar");
 const plusButton = document.getElementById('plus-btn');
 const closeBarButton= document.getElementById('toggle-events');
 const eventsContainer=document.querySelector('.events-container');
 const monthNav= document.querySelector('#nav-container .months');
 const yearSelector= document.querySelector('#nav-container .year');
 const yearDisplay = document.querySelector('.year h3');
 const monthDisplay= document.querySelector('.month-display');
 const modalBackground=document.querySelector(".modal-background");
 const modal=document.querySelector(".my-modal");
 const closeButton=document.querySelector(".my-modal i");
 const datePicker= document.querySelector(".datepicker");
 const timePicker= document.querySelector(".timepicker");
 const titleInput= document.querySelector(".title-input");
 const submitButton= document.querySelector('.submit-btn');
 const cancelButton=document.querySelector('.cancel-btn');
 const plansList= document.getElementById('plans-list');
 const colorContainer=document.querySelector('.color-container');
 const alertWarning=document.querySelector(".alert-warning");

 colorContainer.addEventListener("click",(e)=>{
     Array.from(colorContainer.children).forEach((color)=>{
         color.classList.remove("active");
     })
     if(e.target.classList.contains("red")){
         e.target.classList.add("active");
         pickedColor=red ;
     }
     else if(e.target.classList.contains("blue")){
         e.target.classList.add("active");
         pickedColor=blue ;
     }
     else if(e.target.classList.contains("green")){
         e.target.classList.add("active");
         pickedColor=green ;
     }
     else if(e.target.classList.contains("purple")){
         e.target.classList.add("active");
         pickedColor=purple ;
     }
     
 })
 
 //variables from html elements(arrays)
 const monthArray= Array.from(document.querySelectorAll('.months div>p'));
//display
document.addEventListener("DOMContentLoaded",()=>{
    var elems = document.querySelectorAll('.datepicker');
    var instances = M.Datepicker.init(elems,{
        editable: true,
        selectMonths: true,
        selectYears: 15,
        format: 'dd/mm/yyyy',
      });
    var elements = document.querySelectorAll('.timepicker');
    var instances = M.Timepicker.init(elements);
    display(selectedDate);
    monthEvents();
    
    storageArray.forEach((element)=>{

        const day=element.date.substring(0,2);
        const month=capitalize(months.get(parseInt(element.date.substring(3,5))-1).toLowerCase()) ;
        const year= element.date.substring(element.date.length,element.date.length-4) ; 
        const date= `${month} ${day}, ${year} ${element.time}` ;
        const event=`${element.event}`;
        displayEvent(date,event,element.color);
    
    })
   
})

closeBarButton.addEventListener("click",()=>{
    
    eventsContainer.classList.toggle('toggled');
    closeBarButton.classList.toggle("closed");
    closeBarButton.firstElementChild.classList.toggle("rotate");
   
});

submitButton.addEventListener("click",()=>{
    saveEvent();

}); 
function saveEvent(){
    let x=1;
   storageArray.forEach((element)=>{
       
       if(datePicker.value==element.date && timePicker.value==element.time){
           console.log("You already have an event at the selected date !!");
           document.querySelector('.my-modal form').reset();
           
           x=0;
       }
   })
   if(x==1 && datePicker.value!="" && timePicker.value!=""){
   storageArray.push({event:`${titleInput.value}`,date:`${datePicker.value}`,time:`${timePicker.value}`,color:`${pickedColor}`}) ;

   const date=`${capitalize(months.get(parseInt(datePicker.value.substr(3,2))-1).toLowerCase())} ${parseInt(datePicker.value.substr(0,2))}, ${parseInt(datePicker.value.substr(6,4))} ${timePicker.value}`;
   const event=`${titleInput.value}`;
   const color= pickedColor ;
   displayEvent(date,event,color);
   console.log(storageArray);
   localStorage.setItem("storage",JSON.stringify(storageArray));
   monthEvents();
   calendar.innerHTML="";
   display(selectedDate);
   closeModal();
   }
   else{
       modalBackground.classList.add('warning');
       showAlert();
   }
} 

function showAlert(){
    const alert= alertWarning.cloneNode(true);
    alert.style.display='flex';
    setTimeout(()=>{
        alert.remove();
        modalBackground.classList.remove('warning');
    },4000);
    alert.addEventListener("click",(e)=>{
        if(e.target.classList.contains("fa-times")){
            alert.remove();
            modalBackground.classList.remove('warning');
        }
    })
    modalBackground.appendChild(alert);
   

}
const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }


function displayEvent(day,plan,color){
     const li= document.createElement('li');
     li.classList.add('event');
     //paragraphs
     const p1=document.createElement('p');
     p1.classList.add('date');
     p1.textContent=day; 
     const p2=document.createElement('p');
     p2.classList.add('description');
     const span=document.createElement('span');
     span.textContent=plan;
     //button
     const button= document.createElement('button');
     const i= document.createElement('i');
     button.classList.add('trash-btn');
     
     i.className='fas fa-trash-alt' ;
     button.appendChild(i); 
     button.addEventListener("click",(e)=>{
        removeElement(e);
     });
     p2.appendChild(span);
     p2.appendChild(button);
     li.appendChild(p1);
     li.appendChild(p2);
     const circle= document.createElement("span");
     circle.style.backgroundColor= color ;
     li.appendChild(circle);
     plansList.appendChild(li); 
}
 
 function removeElement(e){

     const str=e.target.parentElement.parentElement.firstElementChild.textContent;
     const firstString=str.substr(0,str.length-9)
     const year= firstString.substring(firstString.length-4,firstString.length);
     let day= firstString.substring(firstString.length-8, firstString.length-6);
    
     let month= firstString.substring(0, firstString.length-8).toUpperCase();
     const time = str.substring(str.length-8,str.length);
     console.log(month);
     let key = [...months.entries()]
          .filter(({ 1: v }) => v == month.trim())
          .map(([k]) => k);
     console.log(key);
     month=parseInt(key[0])+1;
     console.log(month);
     
     if(parseInt(month)<10){ month="0"+`${month}`;}
     const thisDate=day+"/"+month+"/"+year; 
     console.log(thisDate);
     console.log(time);
      storageArray.forEach((element,index)=>{
         if(element.date==thisDate && element.time==time && e.target.parentElement.firstElementChild.textContent==element.event){
             storageArray.splice(index,1);
             console.log(storageArray);
             console.log('king');
         }
      })    
     localStorage.setItem("storage",JSON.stringify(storageArray));
     plansList.removeChild(e.target.parentElement.parentElement);
     calendar.innerHTML="";
     display(selectedDate);
     monthEvents();
   

 }

function display(date){

    date.setDate(1);
    const startingDay=weekDays.get(date.getDay());
    const currentYear= date.getFullYear();
    const currentMonth= date.getMonth();
    let num=0;
    
    //leap years 
    if(currentYear%4==0 || currentYear%100==0 || currentYear%400==0){
        monthDays.set(1,29);
        console.log("leap year");
    }
    else{
        monthDays.set(1,28);
     }
    //month and year display
     yearDisplay.innerHTML=`${currentYear}`; 
     monthDisplay.innerHTML= `${months.get(currentMonth)}`; 
    
    //days from previous month
     let previousnums=0;
     if(currentMonth===0){
         previousnums = monthDays.get(11)-startingDay;
     }
     else{
         previousnums = monthDays.get(currentMonth-1)-startingDay;
     }
    
    //display of all days *
    for(let i=0; i<37;i++){
        //display days from previous month
        if(i<startingDay){
           const previousMonthDay= document.createElement('div');
           previousMonthDay.classList.add('otherday');
           previousMonthDay.innerHTML=`${++previousnums}`;
           calendar.appendChild(previousMonthDay);
           //event listener to change month display
        }
        //display days of current month
        else if(i<monthDays.get(currentMonth)+startingDay){
               
                const day= document.createElement('div');   
                day.textContent=++num; 
    
                if(i-startingDay==currentDate.getDate()-1 && currentMonth==currentDate.getMonth() && currentYear==currentDate.getFullYear()){
                    day.style.border="solid 3px #88a4bd";
                    day.style.backgroundImage="linear-gradient(45deg, #cabce0 14.29%, #ffffff 14.29%, #ffffff 50%, #cabce0 50%, #cabce0 64.29%, #ffffff 64.29%, #ffffff 100%)";
                    day.style.backgroundSize="9.90px 9.90px";
                    day.style.color="black";
                    day.style.fontWeight="bold";
                }
                
                
                calendar.appendChild(day); 
                if(storageArray.length>0){
                   highlightDay(currentMonth,currentYear,num);
                }

                
        }
        
    }
    
}
function highlightDay(currentMonth,currentYear,num){
    
       
        const number=num-1;
        const array= [...document.querySelector('#calendar').children];
        
        for(let node of storageArray){
            if(parseInt(node.date.substring(3,5))-1==currentMonth
               && parseInt(node.date.substring(6,10))==currentYear
               && parseInt(node.date.substring(0,2))==parseInt(array[number].textContent))
             {   
                  if(parseInt(array[number].textContent)!=currentDate.getDate()){
                     array[number].style.backgroundColor=node.color;
                     array[number].style.color="white";
                  }
                  else{
                      array[number].style.boxShadow=`0 0 6px 4px ${node.color}`;
                  }
             }
             
             
        }
    }

function monthEvents(){
    Array.from(monthNav.children).forEach((month)=>{
        let i=0 ;
          storageArray.forEach((element)=>{
              if(month.firstElementChild.textContent.toUpperCase()==months.get(parseInt(element.date.substring(3,5))-1) 
              && selectedDate.getFullYear()==parseInt(element.date.substring(6,10))){
                  month.lastElementChild.textContent=++i; 
              }
              
          });
          if(i==0){
            month.lastElementChild.textContent="";
          }
    })
}
 


monthArray.forEach((div)=>{
    
    if(div.innerHTML.toUpperCase()==months.get(currentDate.getMonth())){
        div.parentElement.classList.add('active');
    }
});

yearSelector.addEventListener("click",(e)=>{
    e.preventDefault();
    if(e.target.classList.contains("fa-chevron-right")){
           calendar.innerHTML="";
           selectedDate.setFullYear(selectedDate.getFullYear()+1);
           display(selectedDate);
           monthEvents();
    }
    else if(e.target.classList.contains('fa-chevron-left')){
        calendar.innerHTML=""
        selectedDate.setFullYear(selectedDate.getFullYear()-1);
        display(selectedDate);
        monthEvents();
    }
})

monthNav.addEventListener("click",(e)=>{
    e.preventDefault();
    highlightMonth(e.target);
 });

function highlightMonth(selectedMonth){
     //the selected month should be the div containing the paragraph(month) and num of events 
     monthArray.forEach((p)=>{
           p.parentElement.classList.remove('active');
         
     })
     selectedMonth.classList.add('active');
          //get the value of the selected month 
          let key = [...months.entries()]
          .filter(({ 1: v }) => v === selectedMonth.firstElementChild.textContent.toUpperCase())
          .map(([k]) => k);
          key=parseInt(key[0]);
          //reset calendar
          calendar.innerHTML="";
          //set new date and display it 
          selectedDate.setMonth(key);
          display(selectedDate);
}



 plusButton.addEventListener("click",(e)=>{
    e.preventDefault();
    openModal();
 });
 closeButton.addEventListener("click",closeModal);
 cancelButton.addEventListener("click",closeModal);
 function openModal(){

    modalBackground.style.visibility="visible";
    modal.style.visibility="visible";
    modalBackground.style.opacity="1";
    modal.style.opacity="1";
 
 } 
 function closeModal(){
    modalBackground.style.visibility="hidden";
    modal.style.visibility="hidden";
    modalBackground.style.opacity="0";
    modal.style.opacity="0";
    document.querySelector('.my-modal form').reset();
 
   
 }




