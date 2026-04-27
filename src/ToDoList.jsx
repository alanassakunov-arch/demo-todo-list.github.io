import { useState } from "react"
import logo from './images/logo.png'
const ToDo = ({ tasks = [], setTasks , dateText}) => {
    const [newTask, setNewTask] = useState("") 

    function handleInputChange(event){
        setNewTask(event.target.value)
    }
    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    }
    function addTask() {
        if (newTask.trim() !== "") {
            const taskObject = { text: newTask, isDone: false };
            setTasks([...tasks, taskObject]);
            setNewTask("");
        }
    }

    function deleteTask(index){
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
    }

    function toggleTask(index) {
    const updated = tasks.map((task, i) => 
        i === index ? { ...task, isDone: !task.isDone } : task
    );
    setTasks(updated);
}
    function clearAllTasks() {
        const onlyActive = tasks.filter(task => !task.isDone);
        setTasks(onlyActive);
    }

    return(
        <>
        <img src={logo} alt="" />
            <p style={{marginBottom: '0', fontSize: '16px'}}>Список задач на: {dateText}</p>
             <ol style={{paddingLeft: '0'}}>
                {tasks.map((task, index) => 
                <li key={index} style={{ 
            backgroundColor: task.isDone ? '#D9C59B' : 'white', 
            color: task.isDone ? 'white' : 'black', border: task.isDone ? '1px solid white' : '1px solid #D9C59B' 
        }}>
        <span className="text">
    <span className="task-text">{task.text}</span>
    {task.isDone && <span className="status">(Выполнено)</span>}
</span>
        
        <button 
            className="suggest" 
            onClick={() => toggleTask(index)} 
            style={{ border: task.isDone ? '1px solid white' : 'none', width: task.isDone ? '85px' : '30px'}}
        >
            {task.isDone ? 'Отменить' : 'V'}
</button><button className="negative" onClick={() => deleteTask(index)}>X</button>
            </li>
            )}
            </ol>
            <div className="task"> 
                <p>Добавить задачу</p>
            </div>

            <div className="functext">
                <input type="text" placeholder="Текст задачи" value={newTask} onChange={handleInputChange} className="textbar" onKeyDown={handleKeyDown }/>
                <br />
                <button onClick={addTask} className="add">Добавить</button>
            </div>
            <button onClick={clearAllTasks} className="del">Удалить выполненые задачи</button>
        </>
    )
}
export default ToDo