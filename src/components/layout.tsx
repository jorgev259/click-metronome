import { Outlet } from 'react-router'

export default function Layout() {
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      <main className='flex-1 w-full px-6 pb-8 pt-0 md:pt-8'>
        <Outlet />
      </main>
    </div>
  )
}
