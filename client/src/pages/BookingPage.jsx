import React, { useEffect, useState } from "react";
import { AccountNav } from "./AccountNav";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AddressLink } from "../AddressLink";
import { PlaceGallery } from "../PlaceGallery";
import { DateWidget } from "../DateWidget";

export const BookingPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState("");

  useEffect(() => {
    if (id) {
      axios.get("/bookings").then((response) => {
        const foundBooking = response.data.find(({ _id }) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);

  if (!booking) return "";
  return (
    <div className="my-8">
      <h1 className="text-3xl"> {booking.place.title}</h1>
      <AddressLink className="my-2 block"> {booking.place.address}</AddressLink>
      <div className="flex bg-gray-200 my-6 p-6 rounded-2xl items-center justify-between">
        <div>
          <h2 className="text-xl mb-2">Your Booking Information</h2>
          <DateWidget booking={booking} />
        </div>
        <div className="bg-primary p-6 text-white rounded-2xl">
          <div>Total Price</div>
          <div className="text-3xl">Rs {booking.price}</div>
        </div>
      </div>
      <PlaceGallery place={booking.place} />
    </div>
  );
};
