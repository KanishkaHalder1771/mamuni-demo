import React, {useEffect, useState} from "react";

import ReactScrollTable from 'react-scroll-table';
import { db } from '../firebase';

function CallLogTable(props) {

    const [call_logs, setLogs] = useState([]);
    const [formatted_logs, setFormattedLogs] = useState([]);
    const [tableProps, setProps] =  useState();
    useEffect(() =>{
            fetchLogs();
    },[]);

    const fetchLogs = async () => {
        const docRef = db.collection('twilio_call_logs').doc('+14243532424').collection('logs');
        const data = await docRef.get();
        
        let formatted_data = []

        data.docs.forEach( item => {
            //console.log(item.data());
            setLogs([...call_logs,item.data()]);

            formatted_data.push({ 
                sid: item.data().sid ,
                startTime: item.data().startTime.replace('T',' '),
                endTime: item.data().endTime.replace('T',' '),
                from: item.data().from,
                price: (item.data().price+' USD').slice(1)
             });
        });
        console.log(formatted_data);
        setFormattedLogs(formatted_data);
        setProps(getTableProps(formatted_data));
    }

    const noteFormatter = (data) => {
        return <pre style={{
          margin: 0,
          whiteSpace: 'pre-line',
          fontFamily: 'Lato, sans-serif',
        }}>{data.text}</pre>;
      };
      
      const importantCellFormatter = (data) => {
        return data.favorite ? '*' : '';
      };

    const getTableProps = (data) => {
        return {
            backgroundColor: '#ffffff',
            borderColor: '#dfdfdf',
            columns: [
              {
                header: 'SID',
                sortable: true,
                accessor: 'sid',
                width: '40%',
              },
              {
                header: 'Start Time',
                accessor: 'startTime',
                width: '20%',
                sortable: true,
              },
              {
                header: 'End Time',
                sortable: true,
                accessor: 'endTime',
                width: '20%',
              },
              {
                header: 'From',
                sortable: true,
                accessor: 'from',
                width: '20%',
              },
              {
                header: 'Price',
                sortable: true,
                accessor: 'price',
                width: '10%',
              }

            ],
            data: data,
            downIcon: <i className="fa fa-down"/>,
            maxHeight: 450,
            noDataText: 'no data here',
            shaded: true,
            shadedColor: '#fdefff',
            textColor: '#000000',
            upIcon: <i className="fa fa-up"/>
          }
    };

    return (
        <div style={{padding: 20}}>
            { tableProps ? <ReactScrollTable {...tableProps}/> : null}
        </div>);
}

export default CallLogTable;