(function () {
    let changeThemeButtons = document.querySelectorAll('.changeTheme');
    
    changeThemeButtons.forEach(button => {
        button.addEventListener('click', function () {
            let theme = this.dataset.theme;
            applyTheme(theme);
        });
    });
    
    function applyTheme(themeName) {
        document.querySelector('[title="theme"]').setAttribute('href', `css/theme-${themeName}.css`);
        changeThemeButtons.forEach(button => {
            button.style.display = 'block';
        });
        document.querySelector(`[data-theme="${themeName}"]`).style.display = 'none';
        localStorage.setItem('theme', themeName);
    }
    
    let activeTheme = localStorage.getItem('theme'); // Проверяем есть ли в LocalStorage записано значение для 'theme' и присваиваем его переменной.
    
    if(activeTheme === null || activeTheme === 'light') { // Если значение не записано, или оно равно 'light' - применяем светлую тему
        applyTheme('light');
    } else if (activeTheme === 'dark') { // Если значение равно 'dark' - применяем темную
        applyTheme('dark');
    }
})();

(function () {

    let listArray = [];
    listName = '';

    // создаём и возвращаем заголовок приложения
    function createAppTitle(title){
        let appTitle = document.createElement('h2')
        appTitle.innerHTML = title
        return appTitle 
    }
  
    // создаём и возвращаем форму для создания дела
    function createTodoItemForm(){
        let form = document.createElement('form')
        let input = document.createElement('input')
        let buttonWrapper = document.createElement('div')
        let button = document.createElement('button')

        form.classList.add('input-group', 'mb-3')
        input.classList.add('form-control')
        input.placeholder = 'Введите название дела'
        buttonWrapper.classList.add('input-group-append')
        button.classList.add('btn', 'btn-primary')
        button.textContent = 'Добавить дело'
        button.disabled = true

        buttonWrapper.append(button)
        form.append(input)
        form.append(buttonWrapper)
        
        input.addEventListener('input', function(e) {
            e.preventDefault();
            if(input.value.length > 0){
                button.disabled = false
            }
            if (input.value.length == 0) {
                button.disabled = true
            }
             });
             

        return{
            form,
            input,
            button,
        }
    }

    // создаём и возвращаем список элементов
    function createTodoList(){
        let list = document.createElement('ul')
        list.classList.add('list-group')
        return list;
    }

    function createTodoItem(obj) {
        let item = document.createElement('li');
        // кнопки помещаем в элемент, который красиво покажет их в одной группе
        let buttonGroup = document.createElement('div')
        let doneButton = document.createElement('button')
        let deleteButton = document.createElement('button')
        
        //устанавливаем стили, а также для размещения кнопок
        // в его правой части с помощью flex
      item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center', 'mb-1')
        item.textContent = obj.name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm')
        doneButton.classList.add('btn', 'btn-success')
        doneButton.textContent = 'Готово'
        deleteButton.classList.add('btn', 'btn-danger')
        deleteButton.textContent = 'Удалить'

        if (obj.done == true) item.classList.add('list-group-item-success');

           // добавляем обработчики на кнопки 
        doneButton.addEventListener('click', function(){
            item.classList.toggle('list-group-item-success')
            for (const listItem of listArray) {
                if (listItem.id == obj.id) listItem.done = !listItem.done
            }
             saveList(listArray,listName)
        })
        deleteButton.addEventListener('click', function(){
            if (confirm('Вы уверены?')) {
                item.remove()

            for (let i = 0; i < listArray.length; i += 1) {
                if (listArray[i].id == obj.id) listArray.splice(i, 1)
            }
             saveList(listArray,listName)
           }
        })

        // вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
        buttonGroup.append(doneButton)
        buttonGroup.append(deleteButton)
        item.append(buttonGroup)

        //приложению нужен доступ к самому элементу и кнопкам, чтобы они объединились в один блок
        return {
            item,
            doneButton,
            deleteButton,
        }
    }

    function saveList(arr, keyName) {
        localStorage.setItem(keyName, JSON.stringify(arr));
    }

    function TastDelete() {
        let taskButton = document.createElement('button')
            taskButton.classList.add('btn', 'btn-success', 'test')
            taskButton.textContent = 'Завершить все'
            // taskButton.disabled = true

        return taskButton
    }

   

    function createTodoApp(container, title, keyName, defArray = []) {
        let todoAppTitle = createAppTitle(title)
        let todoItemForm = createTodoItemForm()
        let todoList = createTodoList()
        let taskDelete = TastDelete()
        listName = keyName;
        listArray = defArray;

        container.append(todoAppTitle)
        container.append(todoItemForm.form)
        container.append(todoList)
        container.append(taskDelete)

        let localData = localStorage.getItem(listName);
        if (localData !== null && localData !== '') listArray = JSON.parse(localData);

        for (const itemList of listArray) {
            let todoItem = createTodoItem(itemList)
            todoList.append(todoItem.item);
        }

        taskDelete.addEventListener('click', function () {
            if (confirm('Вы уверены?')) {
                window.localStorage.removeItem(listName)
                location.reload()
            }  
        })

        function counter(arr) {
            console.log("arr-->>", arr);
            let divCounter = document.createElement('div');

        }

      
        todoItemForm.form.addEventListener('submit', function(e){
            // чтобы страница не перезагружалась
            e.preventDefault();
            if(!todoItemForm.input.value){
                 return 
            }
            let newtItem = {
                id: Date.now(),
                name: todoItemForm.input.value,
                done: false
            }
            let todoItem = createTodoItem(newtItem)
            listArray.push(newtItem);
            
            saveList(listArray, listName)
            counter(listArray)
            for (let i = 0; i < listArray.length; i++) {                
                if (listArray.length > 3) {
                    console.log('больше');
                    // let taskButton = document.createElement('button')
                    taskDelete.classList.add('test2');
                } 
            }
            
            // создаем и добавляем новое дело с названием из поля для ввода
            todoList.append(todoItem.item)
            // выставляем кнопке disabled
            todoItemForm.button.disabled = true
            // обнуляем значение в поле, чтобы не пришлось стирать его из поля для ввода
            todoItemForm.input.value = ''            
        }) 
    }

    function notifyMe() {
        var notification = new Notification('Всё сдедал сегодня ?', {
            tag: 'ache-mail',
            body: 'загляни в меня',
            icon: '/img/icons.png'
        });
    }

    function notiSet() {
        if (!("Notification" in window))
            alert('Ваш браузер не поддерживает уведомления.');
        else if (Notification.permission === 'granted')
            setTimeout(notifyMe, 2000);
        else if (Notification.permission !== "denied") {
            Notification.requestPermission(function (permission) {
                if (!('permission' in Notification))
                    Notification.permission == permission;
                if (permission === 'granted')
                    setTimeout(notifyMe, 2000);
            })
        }
    }
    notiSet()
    // notifyMe()
    // window.localStorage.removeItem('my-list')
    window.createTodoApp = createTodoApp
})();

console.log('version: 1.4');