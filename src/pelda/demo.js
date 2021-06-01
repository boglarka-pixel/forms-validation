import DeleteModal from './DeleteModal';
import {Modal} from 'bootstrap';
import {useState, useEffect, useRef} from 'react';
import db from './firebase/db';
import {Link} from 'react-router-dom';

export default function List() {
    const [restaurants, setRestaurants] = useState([]);

    const itemsPerPage = 10;

    const [orderIconClass, setOrderIconClass] = useState('d-none');
    const [orderColumn, setOrderColumn] = useState('');
    const [orderDirection, setOrderDirection] = useState('asc');
    const [restaurantToBeDeleted, setRestaurantToBeDeleted] = useState(null);
    const deleteModalRef = useRef();
    const [boroughs, setBoroughs] = useState([]);

    const processRestaurantSnapshot = querySnapshot => {
        const tableDataCache = [];
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            const row = {
                ...doc.data(),
                id: doc.id
            };
            tableDataCache.push(row);
        })
        setRestaurants(tableDataCache);
    };

    useEffect(() => {
        db.collection('restaurant').limit(itemsPerPage).get()
            .then(processRestaurantSnapshot);
        db.collection('restaurant').get()
            .then((querySnapshot) => {
                const uniqueBoroughs = [];
                querySnapshot.forEach((doc) => {
                    const restaurantData = doc.data();
                    if(!uniqueBoroughs.includes(restaurantData.borough)) {
                        uniqueBoroughs.push(restaurantData.borough);
                    }
                });
                setBoroughs(uniqueBoroughs);
            });
    }, []);

    function handleColumnOnClick(e) {
        const orderBy = e.target.dataset.name;
        setOrderColumn(orderBy);
        if (orderIconClass === 'bi-arrow-up') {
            setOrderIconClass('bi-arrow-down');
            setOrderDirection('desc');
        } else {
            setOrderIconClass('bi-arrow-up');
            setOrderDirection('asc');
        }
        db.collection('restaurant').orderBy(orderBy, orderDirection).limit(itemsPerPage)
            .get()
            .then(processRestaurantSnapshot);
    }

    function onSearchChange(e) {
        const searchTerm = e.target.value;
        const ref = db.collection('restaurant').where('name', '>=', searchTerm)
            .where('name', '<=', searchTerm + '\uf8ff');
        if (orderColumn !== '') {
            ref.orderBy(orderColumn, orderDirection);
        }
        ref.limit(itemsPerPage)
            .get()
            .then(processRestaurantSnapshot);
    }

    function handleDeleteConfirm() {
        db.collection('restaurant').doc(restaurantToBeDeleted).delete();
        const remainingRestaurants = restaurants.filter(
            restaurant => parseInt(restaurant.id) !== parseInt(restaurantToBeDeleted)
        );

        setRestaurants(remainingRestaurants);

        const myModal = new Modal(deleteModalRef.current);
        myModal.show();
        myModal.hide();
    }

    function handleDeleteOnClick(e) {
        setRestaurantToBeDeleted(e.target.dataset.id);
    }

    function handleBoroughChange(e) {
        const value = e.target.value;
        const ref = db.collection('restaurant');
        if(value !== '') {
            ref.where('borough', '==', value)
                .get()
                .then(processRestaurantSnapshot);
        } else {
            ref.get()
                .then(processRestaurantSnapshot);
        }

    }

    return (
        <main className="container">
            <h1>TableSome</h1>
            <Link to={"/restaurant/new"} className={"btn btn-primary"}>Új felvitele</Link>
            <div className="mb-3">
                <label htmlFor="search" className="form-label">Keresés</label>
                <input
                    type="text"
                    className="form-control"
                    id="search"
                    onChange={onSearchChange}/>
            </div>
            <div className="mb-3">
                <label htmlFor="boroughSelector" className="form-label">Kerület</label>
                <select id="boroughSelector" className={"form-select"} onChange={handleBoroughChange}>
                    <option value={""}>Válassz!</option>
                    {boroughs.map(borough => (
                        <option key={borough} value={borough}>{borough}</option>
                    ))}
                </select>
            </div>
            <table className="table table-bordered">
                <thead>
                <tr>
                    <th>Nr.</th>
                    <th onClick={handleColumnOnClick} data-name="name" className="clickable">
                        Elnevezés {orderColumn === 'name' && <i className={`bi ${orderIconClass}`}/>}
                    </th>
                    <th onClick={handleColumnOnClick} data-name="cuisine" className="clickable">
                        Profil {orderColumn === 'cuisine' && <i className={`bi ${orderIconClass}`}/>}
                    </th>
                    <th onClick={handleColumnOnClick} data-name="borough" className="clickable">
                        Kerület {orderColumn === 'borough' && <i className={`bi ${orderIconClass}`}/>}
                    </th>
                    <th>
                        Műveletek
                    </th>
                </tr>
                </thead>
                <tbody>
                {restaurants.map((restaurant, index) => (
                    <tr key={restaurant.id}>
                        <td>{index + 1}</td>
                        <td>
                            {restaurant.name}
                        </td>
                        <td>
                            {restaurant.cuisine}
                        </td>
                        <td>
                            {restaurant.borough}
                        </td>
                        <td>
                            <button
                                data-id={restaurant.id}
                                className={"btn btn-danger"}
                                data-bs-target="#myModal"
                                data-bs-toggle="modal"
                                onClick={handleDeleteOnClick}
                            >
                                Törlés
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="modal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Modal title</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Modal body text goes here.</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
            <DeleteModal handleDeleteConfirm={handleDeleteConfirm} deleteModalRef={deleteModalRef}/>
        </main>
    );
}