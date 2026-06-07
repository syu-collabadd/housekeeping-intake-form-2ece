import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import IntakeForm from './pages/IntakeForm'
import ThankYou from './pages/ThankYou'

const router = createBrowserRouter(
  [
    { path: '/', element: <IntakeForm /> },
    { path: '/thank-you', element: <ThankYou /> },
  ],
  { basename: import.meta.env.BASE_URL },
)

export default function App() {
  return <RouterProvider router={router} />
}
