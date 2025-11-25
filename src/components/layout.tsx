import { Outlet } from 'react-router'

export default function Layout() {
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      <nav className='w-full bg-white shadow-md px-6 py-4 flex items-center justify-between'>
        <div className='text-xl font-semibold text-gray-800'>
          Click Metronome
        </div>
      </nav>
      <main className='flex-1 w-full px-6 py-8'>
        <Outlet />
      </main>
    </div>
  )
}
