
import Image from "next/image";
import Link from 'next/link'
import React, { useState } from "react";
import LoginButton from "../components/login_button";
import { useSession } from "next-auth/react";

export default function Navbar () {
  const { data: session } = useSession();
  return ( 
    <div>
       {!session && (
  <nav className="nav">
    <ul> 
      <li className="active">
        <></>
      </li>
      <li className="active">
        <></>
        </li>
    </ul>
    <LoginButton />
  </nav> )}
  {session && (
  <nav className="nav">
    <ul> 
      <li className="active">
        <Link href="/">
          <button style={{fontWeight:'bold'}}>
            Startseite
          </button>
        </Link>
      </li>
      <li className="active">
        <Link href="/editor">
        <button style={{fontWeight:'bold'}}>
          Editor 
          </button>
          </Link>
        </li>
    </ul>
    <LoginButton />
  </nav> )}
  </div>)
}
