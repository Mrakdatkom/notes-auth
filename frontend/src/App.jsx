import React from 'react'
import { Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import CreateNotePage from './pages/CreateNotePage'
import NoteDetailPage from './pages/NoteDetailPage'
import toast from 'react-hot-toast'
import { Button } from './components/ui/button'

const App = () => {
  return (
    <div>
      <Button onClick={() => toast.success("Successfully created!")}>Click here</Button>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateNotePage />} />
        <Route path="/:id" element={<NoteDetailPage />} />
      </Routes>
    </div>
  )
}

export default App
