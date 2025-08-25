import React from 'react'
import Link from 'next/link'
import { FaUser } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

const Navbar = () => {
  const router=useRouter()
  return (
    <>
      <nav>
        <ul className="flex justify-center items-center gap-4 my-6 ">
          <Link href={'/'}><li className="hover:scale-110 transition-all ease-in cursor-pointer">Home</li></Link>
          <Link href={'/About'}><li className="hover:scale-110 transition-all ease-in cursor-pointer">About</li></Link>
          <Link href={'/'}><li className="hover:scale-110 transition-all ease-in cursor-pointer">Contact</li></Link>
          <Link href={'/Course'}><li className="hover:scale-110 transition-all ease-in cursor-pointer">Courses</li></Link>
          <Link href={'/MyCourses'}><li className="hover:scale-110 transition-all ease-in cursor-pointer">My Courses</li></Link>
        <div onClick={()=>router.push('/Profile')} className='text-xl cursor-pointer'> <FaUser /></div>
        </ul>
      </nav>
    </>
  )
}

export default Navbar
