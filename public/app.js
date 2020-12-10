var budgetController =(function(){
    var Expense = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage =-1;
    } ;
    Expense.prototype.calcPercentage =function(totalIncome){
        if(totalIncome>0){
        this.percentage =parseInt((this.value/totalIncome)*100);    
        }else{
            this.percentage =-1;
        }
        
    };
        Expense.prototype.getPercentages =function(){
      return this.percentage;  
    };
    var Income = function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    };
    
    var calculateTotal=function(type){  
        var sum=0;
        data.allItem[type].forEach(function(cur){
            sum += cur.value;
        });
        data.totals[type] = sum;
    };
    
    var data={
        allItem:{
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        },budget:0
        ,percentage :-1
        
    };
    return{
        additem : function(type,des,val){
        var Id,newItem;
        if(data.allItem[type].length >0){
        Id =data.allItem[type][data.allItem[type].length - 1].id +1;    
        }else{
            Id=0;
        }
        
        if(type ==='exp'){
         newItem= new Expense(Id,des,val);
    }else{
         newItem= new Income(Id,des,val);
    }
    data.allItem[type].push(newItem);
      
            
    // Return the new element
        return newItem;
            
        },calculateBudget: function(){
          //1.calculate total expenses and incomes
            calculateTotal('exp');
            calculateTotal('inc');
            //2.Calculate Total Budget
            data.budget = data.totals.inc-data.totals.exp;
            //3.Calculate the Percentage of the income 
            data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);
        },getBudget:function(){
            return{
                budget : data.budget,
                percentage : data.percentage,
                totalInc : data.totals.inc,
                totalExp : data.totals.exp
            }
            
        },
        deleteItem:function(type,ID){
          var ids,index;
            ids =data.allItem[type].map(function(current){
               return current.id; 
            });
            index =ids.indexOf(ID);
             
            if(index !== -1){
                data.allItem[type].splice(index,1);
            }
        },
        calculatePercentages:function(){
          //
            data.allItem.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });
        },
            getPercentages:function(){
                var allPerc = data.allItem.exp.map(function(cur){
                    return cur.getPercentages();
                });
                return allPerc;
        
        },
        
        
        testing: function(){
            console.log(data);
        
        }
        
                       };
    
    
})(); 
//

 


//UI Controller
var UIController =(function(){
    
    var DOMstrings ={
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn : '.add__btn',
        incomeContainer :'.income__list',
        expenseContainer :'.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expensesLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        container:'.container',
        expensePercLabel:'.item__percentage',
        dateLabel:'.budget__title--month'
    };
    var formatNumber = function(num,type){
       var numSplit,type,int,dec;
        //1.Decimal.
        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');
        //2.23,000 adding commas
        int = numSplit[0];
        if(int.length >3){
            int = int.substr(0,int.length-3)+ ',' +int.substr(int.length-3,3);
        }
        dec = numSplit[1];
        //3.Adding + or -
        return(type === 'exp'? '-':'+')+ ' ' + int +'.'+ dec; 
    }
    
    
      return{
        getInput:function(){
           return{
            type : document.querySelector(DOMstrings.inputType).value,
            description :document.querySelector(DOMstrings.inputDescription).value,
            value :parseFloat(document.querySelector(DOMstrings.inputValue).value),
           };
            
        },
          addListItem : function(obj,type){
          var html,newHtml,element;
          //Create HTML string with placeholder text 
          if (type ==='inc'){
           element = DOMstrings.incomeContainer;
           html ='<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div</div>'
      }else if(type === 'exp'){
          element = DOMstrings.expenseContainer;
           html ='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>'
      }
          //Replace the placeholder text with actual data
         newHtml = html.replace('%id%',obj.id);
         newHtml =newHtml.replace('%description%',obj.description);
         newHtml = newHtml.replace('%value%',formatNumber(obj.value,type));
        //Insert the HTML into DOM
        document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        
          
      },clearFields: function(){
         var fields,fieldArr;
          fields = document.querySelectorAll(DOMstrings.inputDescription +','+DOMstrings.inputValue);
          fieldArr = Array.prototype.slice.call(fields);
          fieldArr.forEach(function(current,index,array){
                        current.value="";
                            });
          fieldArr[0].focus();
          
      },displayBudget:function(obj){
          var type;
          obj.budget >0 ? type ='inc' : type ='exp';
          document.querySelector(DOMstrings.budgetLabel).textContent=formatNumber(obj.budget,type);
          document.querySelector(DOMstrings.incomeLabel).textContent=formatNumber(obj.totalInc,'inc');
          document.querySelector(DOMstrings.expensesLabel).textContent=formatNumber(obj.totalExp,'exp');
          
          
          if(obj.percentage>0){
              document.querySelector(DOMstrings.percentageLabel).textContent=obj.percentage+'%';
          }else{
              document.querySelector(DOMstrings.percentageLabel).textContent='---';
              
          }
          
      },deleteListItem:function(selectorID){
          var el=document.getElementById(selectorID);
         el.parentNode.removeChild(el); 
      },
        displayPercentages:function(percentages){
            var fields = document.querySelectorAll(DOMstrings.expensePercLabel);
              
              var nodeListForEach=function(list,callback){
                  for(var i=0;i<list.length;i++){
                     callback(list[i],i);
                  }
              };
              
              nodeListForEach(fields,function(current,index){
                  if(percentages[index]>0){
                  current.textContent = percentages[index]+'%';
              }else{
                  current.textContent ='---';
              }
              });
              
          },
          displayMonth:function(){
            var now,year,month,months;
              now = new Date();
              months=['January','February','March','May','June','July','August','September','August','October','November','December'];
              month =now.getMonth();
              year=now.getFullYear();
              document.querySelector(DOMstrings.dateLabel).textContent = months[month]+' '+year;
          },
         
         
          
          
          getDOMstrings: function(){
            return DOMstrings;
        }
      
          
        };
        

    
})();
///




//Global App controller
var controller =(function(){
    var DOM =UIController.getDOMstrings();
    
    var setupEventListeners = function(){
    //Press KEy Button
      document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    ///Enter key button 
      document.addEventListener('keypress',function(event){
        if( event.keypress ===13||event.which ===13){
            ctrlAddItem();
        }
          
    });
        //Delete Item Listener
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
        
        document.querySelector(DOM.inputType).addEventListener('change',UIController.changedType);
    };
    var updateBudget = function(){
        //1.Calculate the budget.
        budgetController.calculateBudget();
        //2.Return the Budget.
        var budget = budgetController.getBudget();
        //3.Display the budget the UI. 
        UIController.displayBudget(budget);
    };
    var updatePercentage = function(){
      //1.Calculate the Percentage in controller
        budgetController.calculatePercentages();
        //2.Read Percentage from the budget Controller
        var percentages =budgetController.getPercentages();
        //3.Update the UI.
        UIController.displayPercentages(percentages);   
    };
    var ctrlAddItem = function(){
        var input,newItem;
        //1.Get the field input data
        input = UIController.getInput();
        
        if(input.description !== "" && !isNaN(input.value) && input.value>0 ){
            //2. Add the item to budget controller.
        newItem = budgetController.additem(input.type,input.description,input.value);
        //3.Add the item to UI.
        UIController.addListItem(newItem,input.type);
        //4.Empty the input fields
        UIController.clearFields();
        //5.Budget update
         updateBudget();
        //6.Percentage and update UI.
        updatePercentage();
       
           }
       
    };
    var ctrlDeleteItem = function(event){
        var itemID,splitID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
      
        if (itemID){
           //inc-1
           splitID = itemID.split('-');
            type =splitID[0];
            ID =parseInt(splitID[1]);
            //1.Delete the item from the data structure.
            budgetController.deleteItem(type,ID);
            //2.Delete the item from the UI.
            UIController.deleteListItem(itemID);
            //3.Update and show the new budget.
            updateBudget();
            //4.Percentage update
            updatePercentage();
           }

    }
    return{
        init:function(){
        console.log("App is Working");
        UIController.displayMonth();
        UIController.displayBudget({
            budget :0,
            percentage : -1,
            totalInc : 0,
            totalExp : 0
            
        });
        setupEventListeners();
    }
    };
        
})(budgetController, UIController);
controller.init();