import React, {useState, useEffect} from 'react';
import axios from "axios";
import {findAllByDisplayValue} from "@testing-library/react";

const App = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [edit, setEdit] = useState('Add user');
  const [idUser, setIdUser] = useState(0)

  useEffect(() => {
      axios('https://64e2ee93bac46e480e77eb43.mockapi.io/users')
          .then(({data}) => setUsers(data))
  }, []);

  const handleChange = (e, user) => {
      const newDate = {...user, hired : e.target.checked}
      axios.put(`https://64e2ee93bac46e480e77eb43.mockapi.io/users/${user.id}`, newDate)
          .then(({data}) => {
              setUsers(users.map(user => user.id === data.id ? data : user))
          })
  };

  const handleDelete = (user) => {
      axios.delete(`https://64e2ee93bac46e480e77eb43.mockapi.io/users/${user.id}`)
          .then(({data}) => {
              setUsers(users.filter(user => user.id !== data.id))
          })
  }

  const handleAddUser = (e) => {
      e.preventDefault()
      if (name !== '' && edit === 'Add user') {
          axios.post('https://64e2ee93bac46e480e77eb43.mockapi.io/users', {name})
              .then(({data}) => {
                  setUsers([...users, data])
                  setName('')
              })
      }
      else if (name !== '' && edit === 'rename'){
          axios.put(`https://64e2ee93bac46e480e77eb43.mockapi.io/users/${idUser}`, {name})
              .then(({data}) => {
                  setUsers(users.map(user => user.id === data.id ? data : user))
                  setName('')
                  setEdit('Add user')
              })
      }
  }

  const handleEdit = (e) => {
      console.log(e)
      setEdit('rename')
      setName(e.name)
      setIdUser(e.id)
  }

    return (
        <div className={'container'}>
            <form onSubmit={handleAddUser}>
                <input className={'inputName'} value={name} onChange={(e) => setName(e.target.value)} type="text"/>
                <button type={'submit'}>{edit}</button>
            </form>
            {
                users.map((user) => {
                    return (
                        <div key={user.id} className={'userWrapper'}>
                            <h2>{user.name}</h2>
                            {/*<input className={'inputName'} disabled={true} type="text" value={user.name} onChange={(e) => handleEdit(e)}/>*/}
                            <p>{user.email}</p>
                            <input type="checkbox" onChange={(e) => handleChange(e, user)} checked={user.hired}/>
                            <button onClick={() => handleDelete(user)}>Delete</button>
                            <button onClick={(e) => handleEdit(user)}>✎</button>
                        </div>
                    )
                })
            }
        </div>
    );
};

export default App;