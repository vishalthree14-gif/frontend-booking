import React, {useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";

const SelectOptions = () => {

    const { id }  = useParams();//movieid
    const navigate = useNavigate();

    const [malls, setMalls] = useState([]);
    const [selectedMall, setSelectedMall] = useState("");
    const [date, setDate] = useState("");
    const [showTimes, setShowTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState("");
    
    
    useEffect(() => {
        fetch("http://localhost:5002/api/malls")
        .then((res) => res.json())
        .then((data)=>{
            if(data.success) setMalls(data.malls);
        })
    }, []);

    useEffect(() => {

        if(selectedMall && date){
            fetch(`http://localhost:5002/api/shows?movieId=${id}&mallId=${selectedMall}&date=${date}`)
            .then((res)=> res.json())
            .then((data) => {
                if(data.success) setShowTimes(data.shows);
            });
        }

    }, [selectedMall, date]);

    const goToSeatPage = () =>{
        navigate(`/booking/${id}/seats?mall=${selectedMall}&date=${date}&time=${selectedTime}`);
    };


  return (
    <div className="select-options-page">
      <h1>Select Date, Mall & Show Time</h1>

      <div className="step-box">
        <label>Mall:</label>
        <select
          value={selectedMall}
          onChange={(e) => setSelectedMall(e.target.value)}
        >
          <option value="">Select Mall</option>
          {malls.map((mall) => (
            <option key={mall._id} value={mall._id}>
              {mall.name}
            </option>
          ))}
        </select>
      </div>

      <div className="step-box">
        <label>Select Date:</label>
        <input
          type="date"
          min={new Date().toISOString().split("T")[0]}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="step-box">
        <label>Select Show Time:</label>
        {showTimes.length === 0 ? (
          <p>No show available</p>
        ) : (
          <div className="time-grid">
            {showTimes.map((t) => (
              <button
                key={t._id}
                className={selectedTime === t.time ? "active" : ""}
                onClick={() => setSelectedTime(t.time)}
              >
                {t.time}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        disabled={!selectedMall || !date || !selectedTime}
        onClick={goToSeatPage}
      >
        Continue to Seat Selection
      </button>
    </div>
  );
};

export default SelectOptions;