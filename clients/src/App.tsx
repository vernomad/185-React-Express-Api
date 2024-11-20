import { BrowserRouter as Router } from 'react-router-dom';
import { Suspense } from 'react';
import './App.css'
import RootRoutes from './routes/root.tsx';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx'; 
import { UserProvider } from './UserProvider.tsx';


// interface ContactProp {
//   contactDetails: React.ReactNode;
// }

function App() {


  return (
    <UserProvider>
    <Router future={{ v7_relativeSplatPath: true }}>
    <Header />
    <Suspense fallback={<h1>Loading...</h1>}>
    <RootRoutes />
    </Suspense>
    <Footer />
    </Router>
    </UserProvider>
  )
}

export default App
