import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <>
        <nav className="flex p-4 items-center justify-between bg-white shadow-md">
            <h1 className="font-bold ">Chat App</h1>
            <ul className="flex  gap-4  ">
                <li><Link to={'/Chat'} className="hover:text-blue-600">Chats</Link></li>
                <li><Link to={'/home'} className="hover:text-blue-600">Profile</Link></li>
            </ul>
        </nav>
    </>
  )
}

export default Navbar