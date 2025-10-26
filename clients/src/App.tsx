// import { BrowserRouter as Router } from 'react-router-dom';
import { Suspense } from 'react';
import './App.css'
import RootRoutes from './routes/root.tsx';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx'; 
import { UserProvider } from './UserProvider.tsx';
import Drawer from './components/Drawer.tsx';
import HeaderScrollEffect from './components/HeaderScrollEffect.tsx';


function App() {

  const contactDetails = <><div className="container-address">Address and extra content</div></>
  return (
 
    <UserProvider>
    <HeaderScrollEffect />
    <Header />
    <Suspense fallback={<h1>Loading...</h1>}>
    <RootRoutes />
    <Footer />
    </Suspense>
    
    <Drawer contactDetails={contactDetails}  />
    </UserProvider>

  )
}

export default App
