import { BrowserRouter as Router } from 'react-router-dom';
import './App.css'
import RootRoutes from './routes/root.tsx';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx'; 
import { UserProvider } from './UserProvider.tsx';


interface ContactProp {
  contactDetails: React.ReactNode;
}

function App({contactDetails}: ContactProp) {


  return (
    <UserProvider>
    <Router future={{ v7_relativeSplatPath: true }}>
    <Header contactDetails={contactDetails} />
    <RootRoutes />
    <Footer />
    </Router>
    </UserProvider>
  )
}

export default App
