import React, { useEffect, useState } from "react";
import { AccountNav } from "./AccountNav";
import axios from "axios";
import PlaceImg from "../PlaceImg";
import { differenceInCalendarDays, format } from "date-fns";
import { Link } from "react-router-dom";
import { DateWidget } from "../DateWidget";

export const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    axios.get("/bookings").then((response) => {
      setBookings(response.data);
    });
  }, []);
  return (
    <div>
      <AccountNav />
      <div className="flex flex-col gap-4">
        {bookings?.length > 0 &&
          bookings.map((booking) => (
            <Link to = {`/account/bookings/${booking._id}`} className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden ">
              <div className="w-48">
                <PlaceImg place={booking.place} />
              </div>
              <div className="py-3 pr-3 grow ">
                <h2 className="text-xl">{booking.place.title}</h2>
                <DateWidget booking={booking}  />
                <div className="flex gap-1 font-semibold">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg> Price Rs {booking.price} /-
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};
