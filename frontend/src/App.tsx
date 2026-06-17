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
import { ProtectedRoute } from './components/ProtectedRoute';
import { Security } from './pages/Security';

function App() {

const [activeUser, setActiveUser] = useState<activeUser | null>(null);
const [campaigns, setCampaigns] = useState<campaigns[]>([]);
const [loadingAuth, setLoadingAuth] = useState(false);

const signupUser = async (newUser: newUser) => {
  try {
    
    const response = await fetch(`https://api.metricflows.xyz/api/auth/add`, {
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
    
    const response = await fetch(`https://api.metricflows.xyz/api/auth/login`, {
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
    setLoadingAuth(true);
    const response = await fetch(`https://api.metricflows.xyz/api/auth/check`, {
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
  } finally {
    setLoadingAuth(false);
  }
  
}

const getCampaigns = async () => {
  try {
;

    const response = await fetch(`https://api.metricflows.xyz/api/campaigns/get`, {
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
    const response = await fetch(`https://api.metricflows.xyz/api/campaigns/create`, {
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
    const response = await fetch(`https://api.metricflows.xyz/api/campaigns/update/${id}`, {
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
    const response = await fetch(`https://api.metricflows.xyz/api/campaigns/delete/${id}`, {
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
            <PublicRoute activeUser={activeUser!} loadingAuth={loadingAuth}>
            <Signup signupUser={signupUser}/>
            </PublicRoute>
            }/>
          <Route path='/login' element={
            <PublicRoute activeUser={activeUser!} loadingAuth={loadingAuth}>
            <Login loginUser={loginUser}/>
            </PublicRoute>
            } />

          <Route path='/dashboard' element={
            <ProtectedRoute activeUser={activeUser} loadingAuth={loadingAuth}>
              <Homepage getCampaigns={getCampaigns} activeUser={activeUser} campaigns={campaigns} addCampaign={addCampaign} updateCampaign={updateCampaign} deleteCampaign={deleteCampaign}/>
            </ProtectedRoute>
            }/>

          <Route path='/campaign/:id' element={
            <ProtectedRoute activeUser={activeUser} loadingAuth={loadingAuth}>
              <DetailedCampaign campaigns={campaigns}/>
            </ProtectedRoute>
            }/>

          <Route path='/security' element={
            <PublicRoute activeUser={activeUser!} loadingAuth={loadingAuth}>
              <Security />
            </PublicRoute>
          }/>
      
      </Routes>
    </>
  )
}

export default App
