"use client"
import React, { useEffect } from 'react';
import {useState} from 'react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { UserDetailContext } from '@/context/UserDetailContext';
export type UserDetails = {
  name: string,
  email: string,
  credits: number
}



function Provider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      CreateNewUser();
    }
  }, [user, isLoaded]);

  const CreateNewUser = async () => {
    try {
      const result = await axios.post("/api/users");
      setUserDetails(result.data);
    } catch (err: any) {
      console.error("Error creating user:", err.response?.data || err.message);
    }
  };

  return <>
  <UserDetailContext.Provider value={{userDetails, setUserDetails}}>
  {children}
  </UserDetailContext.Provider>
  </>;
}

export default Provider;