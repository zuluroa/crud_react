import './App.css';
import React, { createContext, useReducer, useContext, useRef, useState } from 'react';

const HOST_API = "http://localhost:8080/api"
const initialState = {
  list: []
};
const Store = createContext(initialState);

const Form = () => {

  const formRef = useRef(null);
  const { dispatch, state: { item } } = useContext(Store);
  const [state, setState] = useState(item);

  const onAdd = (event) => {
    event.preventDefault();

    //Aca le mandamos los valores que guardaremos en la base de datos
    const request = {
      name: state.name,
      id: null,
      isCompleted: false
    };
    //Este traera toda la informacion (Por medio de fectch a diferencia del listar le mandamos un body)
    fetch(HOST_API + "/save", {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then((todo) => {
        dispatch({ type: "add-item", item: todo });
        setState({ name: "" });
        formRef.current.reset();
      });
  }



  return <form ref={formRef}>
    <input type="text" name="name" onChange={(event) => {
      setState({ ...state, name: event.target.value })
    }}></input>
    {!item.id && <button onClick={onAdd}>Agregar</button>}
  </form>

}




function reducer(state, action) {
  switch (action.type) {
    case 'add-item':
      const newList = state.list;
      newList.push(action.item);
      return { ...state, list: newList }
    default:
      return state;
  }
}

const StoreProvider = ({ children }) => {

  const [state, dispatch] = useReducer(reducer, initialState);

  return <Store.Provider value={{ state, dispatch }}>
    {children}
  </Store.Provider>

}

function App() {
  return <StoreProvider>
    <Form />
  </StoreProvider>
}

export default App;