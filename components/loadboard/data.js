import React from "react";
const columns = [
  {name: "ID", uid: "id", sortable: true},
  {name: "BROKER NAME", uid: "bname", sortable: true},
  {name: "RATING", uid: "rating", sortable: true},
  {name: "PROGRESS", uid: "progress", sortable: true},
  {name: "ORIGIN", uid: "origin",sortable: true},
  {name: "DESTINATION", uid: "destination",sortable: true},

  {name: "SIZE/WEIGHT", uid: "size_weight", sortable: true},
  {name: "PICKUP DATE", uid: "date", sortable: true},
  {name: "EQUIPMENT TYPE", uid: "equip_type", sortable: true},
  {name: "PRICE", uid: "price", sortable: true},


];

const statusOptions = [
  {name: "Active", uid: "active"},
  {name: "Paused", uid: "paused"},
  {name: "Vacation", uid: "vacation"},
];

const users = [
  {
    id: 1,
    bname: "texmex",
    rating: 5,
    progress:80,
    origin: 'Toronto,ON',
    destination: 'Montreal,QC',
    size_weight: ' 990lbs',
    date: ' May,5,2024',
    equip_type:'Van',
    price:'$9,6770'

   
  },
{
    id: 1,
    bname: "TCM Logistics",
    rating: 4,
    progress:20,
    origin: 'New York City,NY',
    destination: 'Miami,FL',
    size_weight: ' 590lbs',
    date: ' May,19,2024',
    equip_type:'Van',
    price:'$19,6770'

   
  },
  
  //{
//     id: 1,
//     name: "Tony Reichert",
//     role: "CEO",
//     team: "Management",
//     status: "active",
//     age: "29",
//     avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
//     email: "tony.reichert@example.com",
//   }
  ];

export {columns, users, statusOptions};
