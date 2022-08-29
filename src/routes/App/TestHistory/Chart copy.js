import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Axios from 'axios';
import { useSelector } from 'react-redux';


const SiteTrafficGraph = ({ testId, type, browser, result_status }) => {
  const [dataSet, setDataSet] = useState([]);

  const loadData = () => {
    try {
      Axios.post('test/detail-graph', { test_id: testId })
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
  }, [testId, type, browser, result_status]);

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
    let labels = [];

    dataSet.map(item => {
      countsTotal.push(item.count ? item.count : 0);
      labels.push(item.date);
    })

    let datasets = []
    const temp_set = [
      {
        color: '#7d0379',
        title: 'Total',
        counts: countsTotal
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
      // labels: ['January', 'Faburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      labels,
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
