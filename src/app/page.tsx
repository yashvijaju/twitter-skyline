"use client"
import * as React from 'react';
import Link from 'next/link'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { FormControl, TextField } from '@mui/material';

import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { createTheme } from '@mui/material/styles';
import Script from 'next/script';
import GLOBE from "./vanta.globe.min.js";
import { useRef, useState, useEffect } from "react";
import * as THREE from 'three';


let theme = createTheme({
  palette: {
    primary: {
      main: '#0x3fa4ff',
    },
    secondary: {
      main: '#0xffffff',
    },
  },
});


export default function Home() {

  const [selectedCountry, setSelectedCountry] = useState(0);
  const [vantaEffect, setVantaEffect] = useState(0);
  const vantaRef = useRef(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        GLOBE({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          backgroundColor: 0xf0a2d,
          color: 0x3fa4ff
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <>
      <div ref={vantaRef} style={{zIndex: -1, position: "fixed", height: "100vh", width: "100vw", top: 0, bottom: 0, borderWidth: "2px", borderColor:"red"}}/>
      <div style={{zIndex: 2}}>
        <Container  sx={{
          my: 25,
          mx: 25,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}>
         
          <Typography variant="h4" component="h1" gutterBottom sx={{color: 'white'}}>
            Your Country's Tweets in 3D
          </Typography>
          <Container sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'left',
            marginLeft: '-20px',
          }}>
            <FormControl fullWidth sx={{color: 'white', width: '500px', marginRight: '20px'}}>
              <InputLabel id="demo-simple-select-label" shrink={false} sx={{color: 'white'}}>{selectedCountry == 0 ? "Country" : ""}</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                sx={{border: '5px solid #3FA4FF', color: 'white' }}
              >
                <MenuItem value={10} onClick={()=>{setSelectedCountry(2211096)}}>India</MenuItem>
              </Select>
            </FormControl>
            <Link href={"/skyline?country="+selectedCountry} passHref>
              <Button variant="contained" sx={{height: '100%', backgroundColor: "#3fa4ff"}}>↳</Button>
            </Link>
          </Container>
        </Container>
      </div>
    </>
  );
}
