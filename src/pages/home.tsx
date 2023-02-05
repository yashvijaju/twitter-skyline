"use client"
import * as React from 'react';
import Link from 'next/link'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { FormControl, TextField } from '@mui/material';
import axios from 'axios';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { createTheme } from '@mui/material/styles';
import Script from 'next/script';
import GLOBE from "../app/vanta.globe.min.js";
import { useRef, useState, useEffect } from "react";
import * as THREE from 'three';
import { arrayBuffer } from 'stream/consumers';
import { count } from 'console';


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

  var countries_map = new Map();
  res.data.forEach(function (curr_country: { [x: string]: any; }) {
    if (curr_country["parentid"] != 1 && curr_country["country"] != '') countries_map.set(curr_country["country"],curr_country["parentid"])
  })

  countries_map = new Map([...countries_map.entries()].sort());

  // Pass data to the page via props
  return {
    props: {
      countries: Array.from(countries_map)
    }
  };
}


export default function Home({ countries }) {

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountryId, setSelectedCountryId] = useState(0);
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
      <div ref={vantaRef} style={{margin: 0, zIndex: -1, position: "fixed", height: "100vh", width: "100vw", top: 0, left: 0, borderWidth: "2px", borderColor:"red"}}/>
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
            Your Country's Trending Tweets in 3D
          </Typography>
          <Container sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'left',
            marginLeft: '-20px',
          }}>
            <FormControl fullWidth sx={{color: 'white', width: '500px', marginRight: '20px', position: 'relative'}}>
              <InputLabel id="demo-simple-select-label" sx={{color: 'white', fontWeight: 'bold'}}>{selectedCountry == "" ? "Select a Country: " : ""}</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                sx={{border: '5px solid #3FA4FF', color: 'white', fontWeight: 'bold' }}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  countries.map((country) => {
                    if (country[0] == e.target.value) setSelectedCountryId(country[1])
                  })
                }}
                value={selectedCountry}
              >
                {countries.map((country) => (
                    <MenuItem value={country[0]}>{country[0]}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {
              selectedCountry != "" && <Link href={"/skyline?country="+selectedCountry.replace(/ /g,"_")+"&id="+selectedCountryId} passHref style={{textDecoration: 'none'}}>
                <Button variant="contained" sx={{height: '100%', backgroundColor: "#3fa4ff", fontSize: "20px"}}>↳</Button>
              </Link>
            }
          </Container>
        </Container>
      </div>
      <Typography variant="body1" component="h1" gutterBottom sx={{color: 'white', position: "fixed", bottom: 20, left: 20}}>
      Made with ♥ by Fayez, Sumi, & Yashvi
      </Typography>
    </>
  );
}