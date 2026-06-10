import {Routes, Route} from 'react-router-dom';
import { Signup } from './pages/Signup';
import { newUser } from './types/newUser';
import { Login } from './pages/Login';
import { useEffect, useState } from 'react';
import { activeUser } from './types/activeUser';
import { PublicRoute } from './components/PublicRoute';
import { Homepage } from './pages/Homepage';
import { campaigns } from './types/campaigns';
import { newCampaign } from './types/newCampaign';
import { editedCampaign } from './types/editedCampaign';
import { DetailedCampaign } from './pages/DetailedCampaign';

function App() {

const [activeUser, setActiveUser] = useState<activeUser | null>(null);
const [campaigns, setCampaigns] = useState<campaigns[]>([]);

const signupUser = async (newUser: newUser) => {
  try {
    
    const response = await fetch(`http://localhost:5000/api/auth/add`, {
      method: "POST",
      credentials: "include",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(newUser)
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(`Failed, unsuccessful fetch`)
    };

    console.log(data);
    

  } catch (error) {
    return console.error(error);
  }
};

const loginUser = async (newUser: newUser) => {
  try {
    
    const response = await fetch(`http://localhost:5000/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(newUser)
    })

    const data = await response.json();

    if (!data.success) {
      throw new Error(`Failed to login user!`)
    };

    console.log(data);

   
    await checkAuth();

  } catch (error) {
    return console.error(error)
  }
};

const checkAuth = async () => {


  try {
    
    const response = await fetch(`http://localhost:5000/api/auth/check`, {
      method: "GET",
      credentials: "include",
     
    })

    const data = await response.json();
    if (!data.success) {
      throw new Error(`Failed to check auth!`)
  }


  setActiveUser(data.user);

  } catch (error) {
    return console.error(error);
  }
  
}

const getCampaigns = async () => {
  try {
;

    const response = await fetch(`http://localhost:5000/api/campaigns/get`, {
      credentials: "include",
      
    });
    const data = await response.json();

    if (!data.success) {
      throw new Error("Failed to get campaigns!");
    };

    console.log(data)

    setCampaigns(data.data);

  } catch (error) {
    return console.error(error);
  }
};

const addCampaign = async (newCampaign:newCampaign) => {
  
  
  try {
    const response = await fetch(`http://localhost:5000/api/campaigns/create`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(newCampaign)
    });
    const data = await response.json();

    if (!data.success) {
      throw new Error(`Failed`);
    }
    setCampaigns(prev => [...prev, data.newCampaign]);

  } catch (error) {
    return console.error(error);
  }
  
  
}

const updateCampaign = async (editedCampaign: editedCampaign, id: number) => {
 

  try {
    const response = await fetch(`http://localhost:5000/api/campaigns/update/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(editedCampaign)
    })

    const data = await response.json();
    console.log(data)
    if (!data.success) {
      throw new Error(`Failed`)
    }

    console.log(data)

    setCampaigns(prev => prev.map(item => {
      if (item.id === data.data.id) {
        return data.data
      } else {
        return item
      }
    }));

    getCampaigns();

  } catch (error) {
    return console.error(error)
  }
}

const deleteCampaign = async (id: number) => {


  try {
    const response = await fetch(`http://localhost:5000/api/campaigns/delete/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {"Content-Type": "application/json"},
    });

    const data = await response.json();

    console.log(data);

    if (!data.success) {
      throw new Error(`Failed`);
    };

    setCampaigns(prev => prev.filter(item => item.id !== data.data.id));

  } catch (error) {
    return console.error(error)
  }

  
}


console.log(campaigns)
useEffect(() => {
  checkAuth();
  getCampaigns();
},[]);

console.log(activeUser)

  return (
    <>
      <Routes>
          <Route path='/' element={
            <PublicRoute activeUser={activeUser!}>
            <Signup signupUser={signupUser}/>
            </PublicRoute>
            }/>
          <Route path='/login' element={
            <PublicRoute activeUser={activeUser!}>
            <Login loginUser={loginUser}/>
            </PublicRoute>
            } />
          <Route path='/dashboard' element={<Homepage campaigns={campaigns} addCampaign={addCampaign} updateCampaign={updateCampaign} deleteCampaign={deleteCampaign}/>}/>
          <Route path='/campaign/:id' element={<DetailedCampaign campaigns={campaigns}/>}/>
      </Routes>
    </>
  )
}

export default App
