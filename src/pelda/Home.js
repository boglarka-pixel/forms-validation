import { useState, useEffect } from "react";
import "./App.scss";
import db from "./firebase/db";
import {Link} from 'react-router-dom';

export default function Home() {
  const [persons, setPersons] = useState([]);
  const [cities, setCities] = useState([]);
 

  const processPersons = (querySnapshot) => {
    const tableDataCache = [];
    querySnapshot.forEach((doc) => {
     
      const row = {
        ...doc.data(),
        id: doc.id,
      };
    
      tableDataCache.push(row);
    });
    setPersons(tableDataCache);
  };


  useEffect(() => {
    db.collection("persons").onSnapshot(processPersons);
  }, []);


  useEffect(() => {
    db.collection('persons').get()
        .then(processPersons);
    db.collection('persons').get()
        .then((querySnapshot) => {
            const uniqueCities = [];
            querySnapshot.forEach((doc) => {
                const cityData = doc.data();
                if(!uniqueCities.includes(cityData.city)) {
                    uniqueCities.push(cityData.city);
                }
            });
            setCities(uniqueCities);
        });
}, []);


/*
useEffect(() => {
    db.collection('persons')
    
      .onSnapshot((queryRef) => {
        const list = [];
        queryRef.forEach((doc) => {
         
          const row = {
            ...doc.data(),
            id: doc.id,
          };
          
          list.push(row);
        });
        setPersons(list);
      });
  }, [ persons.length ]);

*/

  function handleDeletePerson(e) {
    db.collection("persons")
      .doc(e.target.dataset.id)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  }

  function handleCityChange(e) {
    const value = e.target.value;
    const ref = db.collection('persons');
    if(value !== '') {
        ref.where('city', '==', value)
            .get()
            .then(processPersons);
    } else {
        ref.get()
            .then(processPersons);
    }

}

  return (
    <main className="container">
        <h1 className='mb-3 mt-3'>Emberk??k</h1>
    <div>
    <button 
                type="button" 
                className={"btn btn-primary mb-3"}
                //onClick={handleModify}
                >
                <Link to={"/add"}>??j szem??ly hozz??ad??sa</Link>
                </button>
    </div>
    <div className="mb-3">
                <label htmlFor="citySelector" className="form-label">V??ros</label>
                <select id="citySelector" className={"form-select"} onChange={handleCityChange}>
                    <option value={""}>V??lassz!</option>
                    {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>
            </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nr.</th>
            <th>Vezet??kn??v</th>
            <th>Keresztn??v</th>
            <th>Nem</th>
            <th>V??ros</th>
          
          </tr>
        </thead>
        <tbody>
          {persons.map((person, index) => (
            <tr key={person.id}>
              <td>{index + 1}</td>
              <td>{person.last_name}</td>
              <td>{person.first_name}</td>
              <td>{person.gender}</td>
              <td>{person.city}</td>
              <td>
                <button
                  type="button"
                  data-id={person.id}
                  className={"btn btn-danger"}
                  onClick={handleDeletePerson}
                  //onClick={handleDeleteOnClick}
                >
                  T??rl??s
                </button>
              </td>
              <td>
                <button 
                type="button" 
                className={"btn btn-info"}
                //onClick={handleModify}
                >
                <Link to={"/edit/" + person.id}>Szerkeszt??s</Link>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
