import '../assets/css/App.css';
import React, { useState, useEffect } from 'react';
import query from '../db/db.js';

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
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelSummary';  
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { TablePagination } from '@material-ui/core';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StorageIcon from '@material-ui/icons/Storage';
import Checkbox from '@material-ui/core/Checkbox';


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
    root: {
        width: '100%',
        maxWidth: '560'        
    },
    nested: {
        paddingLeft: '4',
    },
    error :{
        color: 'red'
    }
  }

function InnerLevelList(props) {
    const {columns, checkedColumns, onCheckboxColumnToggle} = props;
   
    const handleToggleColumn = id => () => {
        const currentIndex = checkedColumns.indexOf(id);
        const newCheckedColumns = [...checkedColumns];

        if (currentIndex === -1) {
            newCheckedColumns.push(id);
        } else {
            newCheckedColumns.splice(currentIndex, 1);
        }
        
        onCheckboxColumnToggle(newCheckedColumns);
    };
    
    return (
        <div>
            <List component="div" disablePadding>
            {
                columns.columns.map((column, i) => {
                    const labelId = `checkbox-column-list-label-${i}`;

                    return  (
                        <ListItem key={labelId} button style={classes.nested} dense onClick={handleToggleColumn(i)}>
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={checkedColumns.indexOf(i) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={column} />
                        </ListItem>                       
                    );
                })
            }
            </List>
        </div>
    )    
}  

function CollapsibleList(props) {
    const {dbTable, onTableSelected, onShowTableColumns} = props;
    
    const [open, setOpen] = useState(false);
    const [selectedTable, setSelectedTable] =useState('');
    const [tableColumns, setTableColumns] = useState({columns: []})
    const [checkedColumns, setCheckedColumns] = useState([]);
        
    useEffect(() => {
        console.log("columns here");
        if(open) {
            console.log(`open ${open}`);
            
            const columnsQuery = `SELECT *
                FROM information_schema.columns
                WHERE table_schema = 'public'
                AND table_name = '${selectedTable}'`;
            
            query(columnsQuery).then(res => {
                setTableColumns({columns: res.rows.map(row => row.column_name)});
                setCheckedColumns(checkedColumns.length === 0 ? res.rows.map((row, i) => i) : checkedColumns);     //initialise
                onShowTableColumns(selectedTable, tableColumns.columns.filter((column, i) => checkedColumns.indexOf(i) !== -1));
            });
        }
    }, [open]);

    useEffect(() => {
        onShowTableColumns(selectedTable, tableColumns.columns.filter((column, i) => checkedColumns.indexOf(i) !== -1));
    }, [checkedColumns])

    const handleTableSelected = event => {
        onTableSelected(event.target.textContent); 
        setSelectedTable(event.target.textContent); 
    }
    
    const handleCollapse = event => {
        console.log(event.target.parentElement.textContent);    
        onTableSelected(event.target.parentElement.textContent);    
        setSelectedTable(event.target.parentElement.textContent);
        console.log(selectedTable);      
        setOpen(!open);  
    } 

    const checboxColumnToggledCallback = newCheckedColumns => {
        setCheckedColumns(newCheckedColumns);
    }

    return (
        <div>
            <ListItem button>            
                {/* <ListItemIcon>
                    <StorageIcon />
                </ListItemIcon> */}
                <ListItemText primary={dbTable["table_name"]} onClick={handleTableSelected}/>
                {open ? <ExpandLess onClick={handleCollapse} /> : <ExpandMore onClick={handleCollapse} />}                                                
            </ListItem>                     
            <Collapse in={open} timeout="auto" unmountOnExit>                
                <InnerLevelList columns={tableColumns} checkedColumns={checkedColumns} onCheckboxColumnToggle={checboxColumnToggledCallback}/>
            </Collapse>
        </div>
    )
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
        console.log("table here");
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
        console.log("result set");
        query(executeQuery).then(res => {
            setError('');
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

    const handleQueryChange= ({target: {value}}) => {
        setQueryStmt(value);
    }

    const handleExecuteQuery = () => {        
        setExecuteQuery(queryStmt);  
    }

    const handleQuery = event => {
        setQueryStmt(event.target.value); 
    }

    const copyCodeToClipboard = event => {
        event.target.select();
        document.execCommand("copy");
    }
    
    const tableSelectedCallback = (selectedTable) => {
        console.log(`selected table ${selectedTable}`);        
        setQueryStmt(`select * from ${selectedTable};`);              
    }
    
    const showTableColumnsCallback = (selectedTable, columns) => {
        console.log(`selected table columns ${columns}`);    
        selectedTable !== '' ? 
            setQueryStmt(`select ${columns} from ${selectedTable};`) 
            :
            setQueryStmt('');
    }

    return ( 
        <div style={classes.mainContainer}>
            <div>
                <List
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                        <ListSubheader component="div" id="nested-list-subheader">
                            Tables
                        </ListSubheader>
                    }
                    style={classes.root}
                >
                    {
                        tables.map((table, i) => {
                            return <CollapsibleList key={i} dbTable={table} onTableSelected={tableSelectedCallback} onShowTableColumns={showTableColumnsCallback} />                                 
                        })
                    }
                </List>
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
                        onChange={handleQueryChange}
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
                        <p style={classes.error}>{error}</p>
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
