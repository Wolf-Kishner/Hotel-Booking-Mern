import React, { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";


export const BookingWidget = ({ place }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [fullname, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [redirect, setRedirect] = useState("");
  const  {user} = useContext(UserContext);
  
  //Prefills the Users name
  useEffect(() => {
     if(user) {
      setFullName(user.fullname);
     }

  },[user])
  let numberOfDays = 0;
  if (checkIn && checkOut) {
    numberOfDays = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  async function bookThisPlace() {
    const response = await axios.post("/bookings", {
      checkIn,
      checkOut,
      mobile,
      guests,
      price: numberOfDays * place.price,
      fullname,
      place: place._id,
    });
    const bookingId = response.data._id;
    setRedirect(`/account/bookings/${bookingId}`);
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <>
      <div className="bg-white shadow p-4 rounded-2xl">
        <div className="text-2xl text-center">
          Price: Rs {place.price}/ per night
        </div>
        <div className="border rounded-2xl mt-4">
          <div className="flex">
            <div className="py-3 px-4">
              <label>Check In:</label>
              <input
                onChange={(ev) => setCheckIn(ev.target.value)}
                value={checkIn}
                type="date"
              />
            </div>
            <div className="py-3 px-4 border-l">
              <label>Check Out:</label>
              <input
                onChange={(ev) => setCheckOut(ev.target.value)}
                value={checkOut}
                type="date"
              />
            </div>
          </div>
          <div className="py-3 px-4 border-t">
            <label>Number of Guests</label>
            <input
              onChange={(ev) => setGuests(ev.target.value)}
              value={guests}
              type="number"
            />
          </div>
          {numberOfDays > 0 && (
            <div className="py-3 px-4 border-t">
              <label>Your Full Name</label>
              <input
                onChange={(ev) => setFullName(ev.target.value)}
                value={fullname}
                type="text"
              />
              <label>Your Contact Number</label>
              <input
                onChange={(ev) => setMobile(ev.target.value)}
                value={mobile}
                type="text"
              />
            </div>
          )}
        </div>

        <button onClick={bookThisPlace} className="mt-4 primary">
          Reserve
        </button>
        {numberOfDays > 0 && <span>Rs {numberOfDays * place.price}</span>}
      </div>
    </>
  );
};
