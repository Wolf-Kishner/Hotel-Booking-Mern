import { useEffect, useState } from "react";
import { Header } from "../Header";
import axios from "axios";
import { Link } from "react-router-dom";
import { Filters } from "../Filters";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("/places").then((response) => {
      setPlaces(response.data);
    });
  }, []);
  return (
    <>
      <Filters />
      <div className="mt-8 grid 0 gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {places.length > 0 &&
          places.map((place) => (
            <Link to={"/place/" + place._id} key={place.id}>
              <div className="relative bg-gray-500 rounded-2xl flex">
                {place.photos?.[0] && (
                  <div>
                    <div className="absolute top-2 right-2  -p-4 text-black-300 bg-gray-200 rounded-2xl  ">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6"
                      >
                        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                      </svg>
                    </div>
                    <img
                      className="rounded-2xl shadow shadow-gray-100 hover:shadow-gray-900 object-cover aspect-square"
                      src={"http://localhost:4000/uploads/" + place.photos[0]}
                      alt=""
                    />
                  </div>
                )}
              </div>
              <h2 className="font-semi-bold">{place.address}</h2>
              <h3 className="text-sm leading-3 text-gray-500">{place.title}</h3>
              <div className="mt-1">
                <span className="font-semi-bold">
                  {" "}
                  Rs {place.price}/- per night
                </span>
              </div>
            </Link>
          ))}
      </div>
    </>
  );
}
