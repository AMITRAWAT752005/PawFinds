import React, { useEffect, useState } from "react";
import PetsViewer from "./PetsViewer";
import { useAuthContext } from "../../hooks/UseAuthContext";

const Pets = () => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [petsData, setPetsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user || !user.token) {
        setError('User is not authenticated');
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/approvedPets`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch pets data');
        }
        const data = await response.json();
        setPetsData(data);
        setError(null);
      } catch (error) {
        console.error(error);
        setError('Failed to load pets');
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();
  }, [user])

  const filteredPets = petsData.filter((pet) => {
    const matchesType = filter === "all" || pet.type === filter;
    const matchesSearch = searchTerm.trim() === "" ||
      pet.name.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
      pet.type.toLowerCase().includes(searchTerm.trim().toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <>
      <div className="filter-selection">
        <input
          type="text"
          placeholder="Search by name, breed or type"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="pet-search-input"
          style={{ marginBottom: '12px', padding: '10px', width: '100%', maxWidth: '360px' }}
        />
        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="all">All Pets</option>
          <option value="Dog">Dogs</option>
          <option value="Cat">Cats</option>
          <option value="Rabbit">Rabbits</option>
          <option value="Bird">Birds</option>
          <option value="Fish">Fishs</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="pet-container">
        {loading ? (
          <p>Loading</p>
        ) : error ? (
          <p className="error-msg">{error}</p>
        ) : (filteredPets.length > 0) ? (
          filteredPets.map((petDetail, index) => (
            <PetsViewer pet={petDetail} key={index} />
          ))
        ) : (
          <p className="oops-msg">Oops!... No pets available</p>
        )
        }
      </div>
    </>
  );
};

export default Pets;
