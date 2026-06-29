import { PlusIcon } from "lucide-react"
import { buttonVariants } from "./ui/button"

const Navbar = () => {
  return (
    <header className='border-b'>
      <div className='mx-auto max-w-6xl p-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold text-primary font-mono tracking-tight'>Notepad++</h1>
          <div className='flex items-center gap-4'>
            <a href='/create' className={buttonVariants()}>
              <PlusIcon className='h-3 w-3' />
              Create Note
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar