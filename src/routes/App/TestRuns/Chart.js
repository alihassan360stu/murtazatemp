import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Axios from 'axios';
import { useSelector } from 'react-redux';

const SiteTrafficGraph = ({ testId, type, browser, result_status }) => {
  const [dataSet, setDataSet] = useState([]);
  const org = useSelector(({ org }) => org);

  const loadData = () => {
    try {
      Axios.post('test/all-history-graph', { org_id: org._id, type, browser, result_status })
        .then(ans => {
          ans = ans.data;
          console.log(ans)
          if (ans.status) {
            setDataSet(ans.data);
          }
        })
        .catch(e => { });
    } catch (e) { }
  };

  useEffect(() => {
    loadData();
  }, [org, type, browser, result_status]);


  let countsTotal = [];
  let labels = [];

  dataSet.map((item, index) => {
    countsTotal.push(item.count);
    if (type == 1)
      labels.push('Today');
    else if (type == 2)
      labels.push('Yesterday');
    else
      labels.push('Week ' + (index + 1));
  })

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Runs",
        data: countsTotal,
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)"
      },
    ]
  };

  const options = {
    legend: {
      display: false,
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

  return <Line data={data} height={80} options={options} />;
};

export default SiteTrafficGraph;
