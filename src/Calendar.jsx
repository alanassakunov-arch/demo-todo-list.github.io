import { useState, useEffect } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import ToDo from "./ToDoList"

const Calendar = () => {
  
  const daysOfWeek = ['пн','вт','ср','чт','пт','сб','вс']
  const monthOfYear = ['ЯНВАРЬ','ФЕВРАЛЬ','МАРТ','АПРЕЛЬ','МАЙ','ИЮНЬ','ИЮЛЬ','АВГУСТ','СЕНТЯБРЬ','ОКТЯБРЬ','НОЯБРЬ','ДЕКАБРЬ']
  const currentDate = new Date()
  
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth())
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear())
  const [selectedDay, setSelectedDay] = useState(currentDate.getDate());

   const [allTasks, setAllTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("calendar_tasks");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error("Ошибка загрузки:", e);
      return {};
    }
  });
  useEffect(() => {
    localStorage.setItem("calendar_tasks", JSON.stringify(allTasks));
  }, [allTasks]);
  const dateKey = `${selectedDay}-${currentMonth}-${currentYear}`;
  const tasksForToday = Array.isArray(allTasks[dateKey]) ? allTasks[dateKey] : [];

   const handleSetTasks = (newTasks) => {
    setAllTasks(prev => ({ 
      ...prev, 
      [dateKey]: typeof newTasks === 'function' ? newTasks(prev[dateKey] || []) : newTasks 
    }));
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayInMonth = new Date(currentYear, currentMonth, 1).getDay()
  const shift = firstDayInMonth === 0 ? 6 : firstDayInMonth - 1;
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const allDays = [
    ...Array.from({ length: shift }, (_, i) => ({ day: daysInPrevMonth - shift + i + 1, type: 'prev' })),
    ...Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1, type: 'current' })),
    ...Array.from({ length: 42 }, (_, i) => ({ day: i + 1, type: 'next' }))
  ].slice(0, 42);
  
  return (
    <>
      <ToDo tasks={tasksForToday} setTasks={handleSetTasks} dateText={`${selectedDay} ${monthOfYear[currentMonth].toLowerCase()}`}/>
      <div className="calendar">
        <div className="choice">
          <FontAwesomeIcon icon={faAngleLeft} className="prev" onClick={() => {
            if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
            else { setCurrentMonth(currentMonth - 1); }
          }} />
          <div className="month">{monthOfYear[currentMonth]} {currentYear}</div>
          <FontAwesomeIcon icon={faAngleRight} className="next" onClick={() => {
            if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
            else { setCurrentMonth(currentMonth + 1); }
          }} />
        </div>
        
        <div className="weekdays">
          {daysOfWeek.map((day) => <div key={day} className="dayweek">{day}</div>)}
        </div>

        <div className="days">
          {allDays.map((item, index) => {
            const isSelected = item.day === selectedDay && item.type === 'current';
            const dayKey = `${item.day}-${currentMonth}-${currentYear}`;
            const hasTasks = allTasks[dayKey] && allTasks[dayKey].length > 0;

            return (
              <div 
                key={index} 
                className={`day ${item.type !== 'current' ? item.type : ''}`}
                style={{
                  backgroundColor: isSelected ? '#000033' : (hasTasks && item.type === 'current' ? '#add8e6' : ''),
                  color: isSelected ? 'white' : ''
                }}
                onClick={() => item.type === 'current' && setSelectedDay(item.day)}
              >
                {item.day}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
export default Calendar;