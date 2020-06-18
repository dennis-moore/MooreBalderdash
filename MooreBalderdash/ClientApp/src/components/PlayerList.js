import React, { Component } from 'react';
import { IconButton, Typography } from '@material-ui/core';
import MUIDataTable from "mui-datatables";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import StarsIcon from '@material-ui/icons/Stars';
import { CustomButton } from './Home';

export class PlayerList extends Component {

    //componentDidUpdate(prevProps, prevState) {
    //    object.entries(this.props).foreach(([key, val]) =>
    //        prevprops[key] !== val && console.log(`prop '${key}' changed`)
    //    );
    //    if (this.state) {
    //        object.entries(this.state).foreach(([key, val]) =>
    //            prevstate[key] !== val && console.log(`state '${key}' changed`)
    //        );
    //    }
    //}

    render() {
        const updateScore = this.props.updateScore;
        const isDasher = this.props.isDasher;
        const columns = [
            {
                name: "name",
                label: "Name",
                options: {
                    filter: false,
                    sort: false,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                {isDasher && < StarsIcon style={{ paddingRight: 10 }} />}
                                <Typography variant="body1"> {value} </Typography>
                            </div>
                        );
                    }
                }
            },
            {
                name: "score",
                label: "Score",
                options: {
                    filter: false,
                    sort: false,
                }
            },
            {
                name: "",
                label: "",
                options: {
                    filter: false,
                    sort: false,
                    empty: true,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                <IconButton color="primary" onClick={() => {
                                    this.props.updateScore(tableMeta.rowData[0], tableMeta.rowData[1] + 1)
                                }}>
                                    <AddCircleIcon/>
                                </IconButton>
                                <IconButton color="primary" onClick={() => {
                                    this.props.updateScore(tableMeta.rowData[0], tableMeta.rowData[1] - 1)
                                }}>
                                    <RemoveCircleIcon />
                                </IconButton>
                            </div>
                        );
                    }
                }
            }]

        const options = {
            filterType: 'checkbox',
            selectableRows: 'none',
            filter: false,
            search: false,
            sort: false,
            print: false,
            download: false,
            viewColumns: false,
            pagination: false,
            customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage, textLabels) => {
                return (
                    <div>
                        {isDasher &&
                            <CustomButton color="primary"
                                onClick={() => {
                                    updateScore();
                                }}>
                                Submit
                            </CustomButton>
                        }
                    </div>
                );
            }
        };

        return (
            <MUIDataTable
                title={"Players"}
                data={this.props.players}
                columns={columns}
                options={options}
            />
        );
    }
}