import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart } from 'chart.js/auto'
import axios from "axios";
import { getDate } from "../Funtions/getDate";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';
import './LineChart.css'

const LineChart = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: "",
        data: [],
      },
    ],
  });
  const [loader, setLoader] = useState(true)
  const [date, setDate] = useState([])
  const [price, setPrice] = useState([])
  const [coin, setCoin] = useState('bitcoin');

  useEffect(() => {
    getData()
  }, [coin])
  useEffect(() => {
    setData({
      labels: date.map(d => d),
      datasets: [
        {
          label: `${coin}`,
          data: price.map(price => price),
          borderWidth: 1,
          fill: false,
          tension: 0.25,
          backgroundColor: "transparent",
          borderColor: "#3e76d2",
          pointRadius: 0,
        },
      ],
    })
  }, [price, date])

  const getData = () => {
    axios(`https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=7&interval=daily`)
      .then(res => {
        // to store dates
        let arrDate = []
        res.data.prices.forEach(i => arrDate.push(getDate(i[0])))
        setDate(arrDate)

        // to store prices
        let arrPrice = []
        res.data.prices.forEach(i => arrPrice.push(i[1].toFixed(2)))
        setPrice(arrPrice)

        // to stop the loader
        setLoader(false)
      });
  }

  return (
    <div className="content-wrapper">
      <h2>Representation of Crypto Data in Graphical Format.</h2>
      <FormControl sx={{ width: '8.5rem' }}>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={coin}
          label="Coin"
          onChange={(e) => setCoin(e.target.value)}
          style={{ color: '#000', backgroundColor: '#3e76d2' }}
        >
          <MenuItem value={'ethereum'}>Ethereum</MenuItem>
          <MenuItem value={'binancecoin'}>Binancecoin</MenuItem>
          <MenuItem value={'cardano'}>Cardano</MenuItem>
          <MenuItem value={'ripple'}>Ripple</MenuItem>
          <MenuItem value={'bitcoin'}>Bitcoin</MenuItem>
        </Select>
      </FormControl>
      {
        loader ?
          <div className="loader">
            <CircularProgress />
          </div>
          :
          <div className="chart">
            <Line data={data} />
          </div>
      }
    </div>
  );
};

export default LineChart;
