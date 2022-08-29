import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Axios from 'axios';
import { useSelector } from 'react-redux';

const SiteTrafficGraph = () => {
  const [dataSet, setDataSet] = useState([]);
  const org = useSelector(({ org }) => org);

  const loadData = () => {
    try {
      Axios.post('dashboard/statistics', { org_id: org._id })
        .then(ans => {
          ans = ans.data;
          if (ans.status) {
            setDataSet(ans.data);
          }
        })
        .catch(e => { });
    } catch (e) { }
  };

  useEffect(() => {
    loadData();
  }, [org]);

  const data = canvas => {
    const ctx = canvas.getContext('2d');
    const _stroke = ctx.stroke;

    ctx.stroke = function () {
      ctx.save();
      ctx.shadowColor = '#4C4C4C';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      _stroke.apply(this, arguments);
      ctx.restore();
    };

    let countsTotal = [];
    let countsPass = [];
    let countsFailed = [];
    dataSet.map(item => {
      countsTotal.push(item.total ? item.total : 0);
      countsPass.push(item.pass ? item.pass : 0);
      countsFailed.push(item.fail ? item.fail : 0);
    })

    let datasets = []
    const temp_set = [
      {
        color: '#7d0379',
        title: 'Total',
        counts: countsTotal
      },
      {
        color: '#04ca49',
        title: 'Success',
        counts: countsPass
      },
      {
        color: '#a70505',
        title: 'Failed',
        counts: countsFailed
      },
    ]

    temp_set.map(item => {
      datasets.push({
        label: item.title,
        data: item.counts,
        borderColor: item.color,
        borderWidth: 2,
        pointBackgroundColor: item.color,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#7F39FB',
        pointHoverBorderColor: '#fff',
        pointRadius: 6,
        pointHoverRadius: 8,
        fill: false,
      })
    })

    return {
      labels: ['January', 'Faburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets
    };
  };

  const options = {
    legend: {
      display: true,
    },
    scales: {
      yAxes: [
        {
          display: true,
          ticks: {
            suggestedMax: 100,
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return <Line data={data} height={50} options={options} />;
};

export default SiteTrafficGraph;
