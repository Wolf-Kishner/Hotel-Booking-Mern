import React, { useEffect, useState } from "react";
import { PhotosUploader } from "../PhotosUploader";
import { Perks } from "../Perks";
import { AccountNav } from "./AccountNav";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";

export const PlacesFormPage = () => {
  const {id} = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [redirect ,setRedirect] = useState(false);
  const [price ,setPrice] = useState(100);

  useEffect( ()=> {
    if(!id) return ;
    axios.get('/places/'+id).then(response => {
      const {data} = response;
      setTitle(data.title);
      setAddress(data.address);
      setDescription(data.description);
      setAddedPhotos(data.photos);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
    })

  },[id]);

  async function savePlace(ev) {
    ev.preventDefault();
    const placeData = {
      title,
      address,
      description,
      photos: addedPhotos,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      perks,
      price,
    }
    //If User is already there We want to update
    if(id) {
      await axios.put("/places", {
        id , ...placeData
      }); 
      setRedirect(true); 
    }else {
      await axios.post("/places",placeData);
      setRedirect(true); 
    }
  }

  if(redirect) {
    return <Navigate to = {'/account/places'} />
  }
  function InputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  }
  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }
  function preInput(header, description) {
    return (
      <>
        {InputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  return (
    <>
    <AccountNav />
      <div className="mt-2 -mb-1">
        <form onSubmit={savePlace}>
          {preInput("Title", " Smoll Description of your Villa")}
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
          />
          {preInput("Address", "Address of your Villa !")}
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(ev) => setAddress(ev.target.value)}
          />
          {preInput("Photos", "Show us what this place has to offer!")}
          <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
          {preInput("Description", "Description of villa")}
          <textarea
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
          />
          {preInput("Perks", "Choose Perks your Location offers")}
          <Perks selected={perks} onChange={setPerks} />
          {preInput("Extra info", "House rules and regulations")}
          <textarea
            value={extraInfo}
            onChange={(ev) => setExtraInfo(ev.target.value)}
          />
          {preInput("Check in Check out", "Add Check in and Check out Dates")}
          <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
            <div className="mt-2 -mb-1">
              <h3>Check in Time</h3>
              <input
                type="text"
                placeholder="14:100"
                value={checkIn}
                onChange={(ev) => setCheckIn(ev.target.value)}
              />
            </div>
            <div className="mt-2 -mb-1">
              <h3>Check out Time</h3>
              <input
                type="text"
                placeholder="12:00"
                value={checkOut}
                onChange={(ev) => setCheckOut(ev.target.value)}
              />
            </div>
            <div className="mt-2 -mb-1">
              <h3> Guests</h3>
              <input
                type="number"
                placeholder="4"
                value={maxGuests}
                onChange={(ev) => setMaxGuests(ev.target.value)}
              />
            </div>
            <div className="mt-2 -mb-1">
              <h3> Price per night</h3>
              <input
                type="number"
                placeholder="4"
                value={price}
                onChange={(ev) => setPrice(ev.target.value)}
              />
            </div>
            <button className="primary my-4">Save</button>
          </div>
        </form>
      </div>
    </>
  );
};
