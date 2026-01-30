import React from 'react';
import { FaUser } from 'react-icons/fa';
import { HiSun } from 'react-icons/hi';
import { RiSettings3Line } from 'react-icons/ri';

const Navbar = () => {
  return (
    <nav className="nav flex items-center justify-between h-[90px] px-[100px] border-b-[1px] border-zinc-900">
      <div className='logo'>
        <h3 className="text-[25px] font-[700] sp-text">
        GenUI
      </h3>
      </div>
      <div className='icons flex items-center gap-[15px] h-[70px]'>
          <div className='icon'><HiSun /></div>
          <div className='icon'><FaUser /></div>
          <div className='icon'><RiSettings3Line /></div>
      </div>
    </nav>
  );
};

export default Navbar;
