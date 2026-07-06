import { PlusIcon, LogOutIcon } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <Link to="/">
        <h1 className="text-2xl font-bold">Notepad++</h1>
      </Link>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link to="/create" as="button" className="text-primary">Add Note</Link>
            <span className="text-sm">{user.email}</span>
            <Button onClick={logout} variant='ghost'>
              <LogOutIcon className="w-4 h-4 mr-1" /> Logout
            </Button>
          </>
        ) : (
          <>
            <Link to="/login" className={buttonVariants({ variant: "outline", size: "sm" })}>
              Login
            </Link>
            <Link to="/register" className={buttonVariants({ variant: "default", size: "sm" })}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;