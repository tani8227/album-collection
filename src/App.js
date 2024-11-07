import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AddAlbum from './components/AddAlbum';
import AlbumsList from './components/AlbumsList';
import UpdateAlbum from './components/UpdateAlbum';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const [albums, setAlbums] = useState([]);
  const [updateAlbum, setUpdateAlbum] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/albums');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setAlbums(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const deleteAlbumFromList = async (id) => {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/albums/${id}`, {
        method: 'DELETE',
      });
      const newAlbums = albums.filter((album) => album.id !== id);
      setAlbums(newAlbums);
      toast.success("Album Deleted successfully");
     
    } catch (error) {
      toast.error("Error deleting album !");
     
    }
  };

  const updateAlbumInList = async (id, updateTitle, updateUserid, oldAlbum) => {
    try {
      const updatedAlbum =
        id < 100
          ? await fetch(`https://jsonplaceholder.typicode.com/albums/${id}`, {
              method: 'PUT',
              body: JSON.stringify({
                userId: updateUserid,
                id: id,
                title: updateTitle,
              }),
              headers: {
                'Content-type': 'application/json; charset=UTF-8',
              },
            }).then((response) => response.json())
          : {
              userId: updateUserid,
              id: id,
              title: updateTitle,
            };

      const updatedAlbums = [...albums];
      const index = updatedAlbums.indexOf(oldAlbum);
      updatedAlbums[index] = updatedAlbum;
      setAlbums(updatedAlbums);
      toast.success("Update Successfully done!");
     
    } catch (error) {
      
      toast.error("Error updating album !");
    }
  };

  const addAlbumToList = async (userId, title) => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/albums', {
        method: 'POST',
        body: JSON.stringify({
          userId: userId,
          title: title,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to add album');
      }

      const data = await response.json();
      const album = {
        userId: userId,
        id: data.id,
        title: title,
      };
      setAlbums([...albums, album]);
      toast.success("Album added successfully!");
    } catch (error) {
      toast.error("Error adding album !");
      
    }
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<AlbumsList albums={albums} setUpdateAlbum={setUpdateAlbum} deleteAlbumFromList={deleteAlbumFromList} />}
        ></Route>
        <Route path="/add-album" element={<AddAlbum addAlbumToList={addAlbumToList} />} />
        <Route path="/update-album" element={<UpdateAlbum album={updateAlbum} updateAlbumInList={updateAlbumInList} />} />
      </Routes>
      <ToastContainer/>
    </>
  );
}
