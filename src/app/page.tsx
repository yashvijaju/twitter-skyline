"use client"
import * as React from 'react';
import { useEffect } from "react";


export default function Home() {


  useEffect(() => {
    window.location.replace("/home")
  }, []);

  return (
    <> 
    </>
  );
}