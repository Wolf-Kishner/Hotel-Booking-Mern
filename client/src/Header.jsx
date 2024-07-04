import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { SearchBar } from "./pages/SearchBar";
import { Link } from "react-router-dom";
import axios from "axios";
import { Filters } from "./Filters";

export const Header = () => {
  const [popUp, setPopUp] = useState(false);
  const [search, setSearch] = useState("");
  const [display, setDisplay] = useState("");
  const [places, setPlaces] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  function openPopUp() {
    setPopUp(!popUp);
    console.log(popUp);
  }
  useEffect(() => {
    axios.get("/places").then((response) => {
      setPlaces(response.data);
    });
  }, []);

  async function searchByText(ev) {
    ev.preventDefault();
    console.log(search);
    const response = await axios.post("/search", { search });
    console.log(response);
    const { data } = response;
    if (data && data.length > 0) {
      console.log("This is before ", places);
      setDisplay(data[0].address);
      setPlaces(data); // Update places directly with the search results
      console.log("This is after ", places);
      console.log(data);
    } else {
      console.log("Fuck You");
    }
  }

  function handleMouseEnter() {
    setIsHovered(true);
  }

  function handleMouseLeave() {
    setIsHovered(false);
  }

  const { user } = useContext(UserContext);

  return (
    <div>
      {!popUp && <SearchBar openPopUp={openPopUp} />}
      {popUp && (
        <header className="flex py-4 justify-between border-b border-gray-200 ">
          <Link to={"/"} className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 -rotate-90 text-primary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
            <span className="text-primary font-bold text-xl">airbnb</span>
          </Link>
          <div className="flex cursor-pointer mb-2 justify-center gap-10 border  border-gray-300 rounded-full py-3  px-10 shadow-md shadow-gray-300 ">
            <div className="">
              Where
              <div className="text-gray-500 text-sm">Destinations</div>
            </div>

            <div className="border-l border-gray-300"></div>
            <div className="">Any Week</div>
            <div className="border-l border-gray-300"></div>
            <div>
              Who
              <div className="text-gray-500 "> Guests</div>
            </div>

            <button
              onClick={openPopUp}
              className="bg-primary text-white p-2 px-4 rounded-full "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
            <form
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onSubmit={searchByText}
              className="flex gap-2"
            >
              <div className="">
                <input
                  value={search}
                  onChange={(ev) => setSearch(ev.target.value)}
                  type="text"
                  placeholder="Search ..."
                />
                <div className=" fixed w-50 bg-gray-100 border border-gray-200 rounded-2xl   ">
                  {isHovered &&
                    places.length > 0 &&
                    places.map((place) => (
                      <div className="py-1 px-2">
                        <Link
                          to={"/place/" + place._id}
                          className="border-b border-gray-500"
                        >
                          {place.address}
                        </Link>
                      </div>
                    ))}
                </div>
              </div>

              <button
                className="bg-primary px-5  text-white rounded-2xl"
                type="submit"
              >
                Search
              </button>
            </form>
          </div>

          <Link
            to={user ? "/account" : "/login"}
            className="flex gap-2  rounded-full py-8 px-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
            <div>
              <div className=" flex items-center bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 relative top-1"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            {!!user && <div>{user.name}</div>}
          </Link>
        </header>
      )}
    </div>
  );
};
