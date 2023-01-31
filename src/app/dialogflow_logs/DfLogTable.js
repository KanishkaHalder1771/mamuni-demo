import React, {useEffect, useState} from "react";

import Collapsible from 'react-collapsible';
import ReactScrollTable from 'react-scroll-table';
import { db } from '../firebase';

function DfLogTable(props) {

    const [df_logs, setLogs] = useState([]);
    const [formatted_logs, setFormattedLogs] = useState([]);
    const [tableProps, setProps] =  useState();
    useEffect(() =>{
            fetchLogs();
    },[]);

    const fetchLogs = async () => {
        const docRef = db.collection('df_logs');
        const data = await docRef.get();
        
        let formatted_data = []
        let conv_logs_data = []
        data.docs.forEach( item => {
            console.log(item.data());
            conv_logs_data.push(item.data());
            setLogs([...df_logs,item.data()]);

            item.data().messages.forEach( mssg => {
                formatted_data.push({ 
                name: item.data().name.split('/')[item.data().name.split('/').length - 1],
                createTimestamp: mssg.createTime.seconds,
                message: mssg.content,
             });
            })

            
        });
        
        setFormattedLogs(conv_logs_data);
        setProps(getTableProps(formatted_data));
    }

    const getTableProps = (data) => {
        return {
            backgroundColor: '#ffffff',
            borderColor: '#dfdfdf',
            columns: [
              {
                header: 'Message',
                accessor: 'message',
                width: '50%',
              },
              {
                header: 'Timestamp',
                accessor: 'createTimestamp',
                width: '20%',
                sortable: true,
              },
              {
                header: 'Conversation Id',
                accessor: 'name',
                width: '30%',
              }

            ],
            data: data,
            downIcon: <i className="fa fa-down"/>,
            maxHeight: 450,
            noDataText: '--',
            shaded: true,
            shadedColor: '#fdefff',
            textColor: '#000000',
            upIcon: <i className="fa fa-up"/>
          }
    };



    const getTable = () => {

      const getMessageRows = (conv_index) => {

        if(conv_index >= formatted_logs.length){
          console.log("TEST ERROR (#ERR0002): getMessageRow() : DialogFlow formated_log list index out of bound.")
          return null;
        }

        

        let rows = [];

        for(let mssg_index=0; mssg_index< formatted_logs[conv_index].messages.length;mssg_index++){
          let mssg_data = formatted_logs[conv_index].messages[mssg_index];

          const rowStyle = {
            marginTop: '10px',
            marginLeft: '10px',
            marginRight: '10px',
            borderRadius: '20px',
            radius: '10px',
            padding: "10px",
            fontFamily: "Arial",
            backgroundColor:  mssg_data.participantRole == "END_USER" ? '#00000010' : '#fff5e6',
            whiteSpace: 'pre-wrap',
            overflowWrap: 'break-word'
          };

          rows.push(
            <div style={rowStyle}>
              {mssg_data.content}
            </div>
          );
        }
        return rows;
      }

      const getConversationRow = () => {
        let conversation_rows = [];
        for(let conv_index = 0; conv_index< formatted_logs.length; conv_index++){ 
          let conversation_data = formatted_logs[conv_index]
          if(conversation_data.messages.length==0)
            continue;
          let trigger = conversation_data.name.split('/')[conversation_data.name.split('/').length - 1] + '  |  ' +  conversation_data.messages[0].content.slice(0,10) + '... (' + conversation_data.messages.length +')';
          let date = new Date(conversation_data.startTime.seconds*1000);
          let dateString = date.toDateString();
          conversation_rows.push(
            <tr>
              <td>
                <div>
                <Collapsible trigger={trigger} triggerStyle={{fontWeight: 'bold'}}>
                  { getMessageRows(conv_index) }
                </Collapsible>
                </div>
              </td>
              <td>{dateString}</td>
            </tr>
          );
        }

        return conversation_rows;
      }

      return (
        <div styles={{ height: '500px', overflowY: 'scroll' }} >
          <div className="row">
            <div className="col-12 grid-margin">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Conversations Table</h4>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th> Conversation </th>
                          <th> Timestamp </th>
                        </tr>
                      </thead>
                      <tbody>
                        {getConversationRow()}
                        
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
          {getTable()}
      </div>
      );
}

export default DfLogTable;