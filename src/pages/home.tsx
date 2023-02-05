"use client"
import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Link from '@mui/material/Link';
import { createTheme } from '@mui/material/styles';
import Script from 'next/script';
import GLOBE from "../app/vanta.globe.min.js";
import { useRef, useState, useEffect } from "react";
import * as THREE from 'three';
import axios from 'axios';


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


export async function getServerSideProps() {
  // Fetch data from external API
  const url = `https://api.twitter.com/1.1/trends/available.json`
  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${process.env.AUTH_BEARER}`
    }
  });

  // Pass data to the page via props
  return {
    props: {
      countries: res.data
    }
  };
}


export default function Home({ countries }) {

  console.log(countries);

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
        <Container maxWidth="lg">
          <Box
            sx={{
              my: 20,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom sx={{color: 'white'}}>
              Your Country's Tweets in 3D
            </Typography>
            <FormControl fullWidth sx={{color: 'white'}}>
              <InputLabel id="demo-simple-select-label" sx={{color: 'white'}}>Country</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Country"
                placeholder='Country'
                sx={{border: '5px solid #3FA4FF', color: 'white' }}
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Container>
      </div>
    </>
  );
}
