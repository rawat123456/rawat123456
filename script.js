document.addEventListener("DOMContentloaded", ()=>{
    const expenseForm = document.getElementById("expense-form");
    const expenselist = document.getEelementById("expense-list");
     const totalAmount = document.getElementById("total-amount");
    const filterCategory = document.getElementById("filter-category");

    
    let expenses = [];

    expenseForm.addEventListener("submit",(e)=>{
        e.preventDefault();

        const name = document.getElementById("expense-name").value;
        const amount = parseFloat(document.getElementById("expense-aamount").value);
        const category = document.getElementById("expense-category").value;
        const date = document.getElementById("expense-date").value;
         
        const expense ={
            id : Date.now(),
            name,
            amount,
            category,
            date
        };

        expenses.push(expense);
         displayExpenses(expenses);
         updateTotalAmount();

        expenseForm.requestFullscreen();
});

expenselist.addEventListener("click",(e)=>{
    if (e.target.classList.contains(delete-btn)){
        const id = parseInt(e.target.dataset.id);
        expenses = expenses.filter(expense => expense.id !== id);
        displayExpenses(expenses);
        updateTotalAmount();
    }

    if(e.target.classList.contains("edit-btn")){
        const id = parseInt(e.target.dataset.id);
        const expense = expenses.find(expense => expense.id === id);


        document.getElementById("expense-name").value = expense.name;
        document.getElementById("expense-amount").value = expense.amount;
        document.getElementById("expense-category").value = expense.category;
        document.getElementById("expense-date").value = expense.date;

       expenses = expenses.filter(expense => expense.id !== id);
       displayExpenses(expenses);
       updateTotalAmount();
    }


    //In JavaScript, the change event is used to detect when the value of an <input>, <select>, or <textarea> element has changed.
    filterCategory.addEventListener("change",(e)=>{
        const category = e.target.value;
        if(category === "All"){
              dispalyExpenses(expenses);
        }  else {
            const filteredExpenses = expenses.filter(expense => expense.category);
            displayExpenses(filteredExpenses);
        }
    });

     function displayExpenses(expenses){
          expenselist.innerHTML = "";
          expenses.forEach(expense =>{
          const row = document.createElement("tr");
          
          row.innerHTML =`
          
            <td>${expense.name}</td>
              <td>$${expense.amount.toFixed(2)}</td>
              <td>${expense.category}</td>
              <td>${expense.date}</td>
              <td>
                  <button class="edit-btn" data-id="${expense.id}">Edit</button>
                  <button class="delete-btn" data-id="${expense.id}">Delete</button>
              </td>
          
          
          `;

          expenseList.appendChild(row);
        
        
        });
               
        
     }

     function updateTotalAmount() {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        totalAmount.textContent = total.toFixed(2);
    }
});






});