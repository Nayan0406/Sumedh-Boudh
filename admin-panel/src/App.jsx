import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AddBlog from './pages/AddBlog'
import ContactForm from './pages/ContactForm'

function App() {
  

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<AddBlog />} />
        <Route path="/contact-form" element={<ContactForm />} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
