import React from 'react';

import {
  ListAlt,
  Edit,
  ArrowForward,
  Schedule,
  Speed,
  GroupWorkSharp,
  Group,
  Apartment,
  BarChart,
  Settings,
  Policy

} from '@material-ui/icons';
import { GrSchedulePlay,SiPostman } from 'react-icons/all'
import PersonIcon from '@material-ui/icons/Person';

const defaultRoute = '/app/';

export const menusFull = [
  {
    name: '',
    type: 'section',
    children: [
      {
        name: 'Insight',
        type: 'item',
        icon: <BarChart />,
        link: `${defaultRoute}dashboard`,
      },
      {
        name: 'Organizations',
        type: 'item',
        icon: <Apartment />,
        link: `${defaultRoute}orgs`,
      },
      {
        name: 'Groups',
        icon: <GroupWorkSharp />,
        type: 'item',
        link: `${defaultRoute}groups`,
      },
      // {
      //   name: 'Editor',
      //   type: 'collapse',
      //   children: [{}],
      //   icon: <Edit />,
      //   // link: `${defaultRoute}editor`,
      // },
      {
        name: 'Tests',
        icon: <ListAlt />,
        type: 'item',
        link: `${defaultRoute}tests`
      },
      {
        name: 'Schedules',
        icon: <Schedule />,
        type: 'item',
        link: `${defaultRoute}schedules`
      },
      {
        name: 'Runs',
        icon: <Speed />,
        type: 'item',
        link: `${defaultRoute}runs`,
      },
      {
        name: 'Members',
        type: 'item',
        icon: <PersonIcon/>,
        link: `${defaultRoute}members`,
      },
      {
        name: 'Policies',
        type: 'item',
        icon: <Policy/>,
        link: `${defaultRoute}policies`,
      },
      {
        name: 'Api Testing',
        type: 'item',
        icon: <SiPostman />,
        link: `${defaultRoute}apitesting`,
      },
      {
        name: 'Settings',
        type: 'item',
        icon: <Settings />,
        link: `${defaultRoute}settings`,
      },
    ],
  },
];


export const menusLess = [
  {
    name: 'Organizations',
    type: 'item',
    icon: <Apartment />,
    link: `${defaultRoute}orgs`,
  },
];