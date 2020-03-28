import '../assets/css/App.css';
import React, { useState, useEffect } from 'react';
import query from '../db/db.js';
//import Query from './Query';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { TablePagination } from '@material-ui/core';


const classes = {
    mainContainer: {
      display: 'grid',
      gridGap: '15px',
      gridTemplateColumns: '0.2fr 1fr'
    },
    queryContainer: {
      display: 'grid',
    },  
    queryControllers: {
      display: 'flex',
    },
    table: {
      minWidth: '650',
    },
  }

export default function App() {
    const [queryStmt, setQueryStmt] = useState('');
    const [error, setError] = useState('');
    const [headersObj, setHeaders] = useState({headers: []});
    const [rowsObj, setRows] = useState({rows: []});
    const [tables, setTables] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);
    const [executeQuery, setExecuteQuery] = useState('');

    useEffect(() => {
        console.log("here");
        const tableQuery = `SELECT tables.table_name
        FROM information_schema.tables
        WHERE tables.table_schema = 'public' 
        AND tables.table_name != 'schema_version' 
        AND tables.table_type = 'BASE TABLE';`;
        query(tableQuery).then(res => {
          setTableHeaders(res.fields.map(field => field.name));
          setTables(res.rows);            
        });
    }, []);

    useEffect(() => {
        query(executeQuery).then(res => {
            console.log(res.rows);
            console.log(res.fields);   
            const newHeadersObj = {headers: res.fields.map(field => field.name)};
            setHeaders(newHeadersObj);
            const newRowsObj = {rows: res.rows};
            setRows(newRowsObj);            
        }).catch(e => {
            setError(e.message);
        });
    }, [executeQuery]);

    const handleExecuteQuery = () => {
        setError('');
        setExecuteQuery(queryStmt);  
    }

    const handleQuery = event => {
        setQueryStmt(event.target.value); 
    }

    const copyCodeToClipboard = event => {
        event.target.select();
        document.execCommand("copy");
    }

    const handleTableSelected = event => {
        setQueryStmt(`select * from ${event.target.textContent};`);        
    }

    return ( 
        <div style={classes.mainContainer}>
            <div>
                <TableContainer component={Paper}>
                    <Table style={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                            {
                                tableHeaders.map((tableHeader, i) => {
                                    return <TableCell key={i}>{tableHeader}</TableCell>

                                })
                            }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                tables.map((table, i) => (
                                    <TableRow selectable="true" key={i}>
                                    {
                                        tableHeaders.map((tableHeader,i) => {
                                            return <TableCell onClick={handleTableSelected} key={i} align="left">{table[tableHeader]}</TableCell>
                                        })
                                    }
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div>
                <div style={classes.queryContainer}>
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Query"
                        multiline
                        rowsMax="4"
                        fullWidth
                        value={queryStmt}
                        onChange={({target: {value}}) => setQueryStmt(value)}
                        variant="outlined"
                    />
                    <div style={classes.queryControllers}>
                        <button onClick={handleExecuteQuery}>Execute</button>
                        <CopyToClipboard text={queryStmt}>
                            <button>Copy to Clipboard</button>
                        </CopyToClipboard>
                    </div>
                </div>
                {
                    rowsObj.rows.length === 0 ?
                    <div>
                        <p>No records found</p>
                    </div>
                    :
                    (error ?
                    <div>
                        <p>{error}</p>
                    </div>
                    :
                    <div>
                        <TableContainer component={Paper}>
                            <Table style={classes.table} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                    {
                                        headersObj.headers.map((header, i) => {
                                            return <TableCell key={i}>{header}</TableCell>
                                        })
                                    }
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {
                                    rowsObj.rows.map((row, i) => (
                                        <TableRow key={i}>
                                        {
                                            headersObj.headers.map((header,i) => {                                        
                                                return <TableCell key={i} align="left"><div>{!row[header] ? "" : row[header].toString()}</div></TableCell>
                                            })
                                        }
                                        </TableRow>
                                    ))
                                }
                                </TableBody>
                            </Table>
                        </TableContainer>                       
                    </div>
                    )
                }
            </div> 
        </div>
    )
}


//  {/* <Query query={ queryStmt } onExecute={ handleExecuteQuery } onChange={ handleQuery }/>  */}
        
