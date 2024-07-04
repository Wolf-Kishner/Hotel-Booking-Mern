import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import { AccountNav } from "./AccountNav";
import PlaceImg from "../PlaceImg";

export const PlacesPage = () => {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("/user-places").then(({ data }) => {
      setPlaces(data);
    });
  }, []);
  function linkClasses(type = null) {
    let classes = "inline flex gap-2 py-2 px-6 rounded-full";
    if (type === false) {
      classes += " bg-primary text-white";
    } else {
      classes += " bg-gray-200";
    }
    return classes;
  }
  return (
    <div className="mt-2 -mb-1">
      <AccountNav />
      <div className="text-center">
        <Link
          className="inline-flex gap-1 bg-primary text-white py-2 px-4 rounded-full"
          to={"/account/places/new"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add new Places
        </Link>
      </div>
      <div className="mt-4 ">
        {places.length > 0 &&
          places.map((place) => (
            <Link to = {'/account/places/'+place._id} className=" flex cursor-pointer gap-4 bg-gray-200 p-4 rounded-2xl ">
              <div className=" flex w-32 h-32 bg-gray-300 grow shrink-0 ">
                <PlaceImg place={place}/>
              </div>
              <div className="grow-0 shrink">
              <h2 className="text-xl">{place.title}</h2>
              <p className="text-sm mt-2">{place.description}</p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};
