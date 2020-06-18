import React, { Component } from 'react';
import { IconButton } from '@material-ui/core';
import MUIDataTable from "mui-datatables";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

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
                
            </div>
            <CustomFooter
                count={count}
                page={page}
                rowsPerPage={rowsPerPage}
                changeRowsPerPage={changeRowsPerPage}
                changePage={changePage}
                textLabels={textLabels} />
        );
    }
};

export class PlayerList extends Component {

    componentDidUpdate(prevProps, prevState) {
        Object.entries(this.props).forEach(([key, val]) =>
            prevProps[key] !== val && console.log(`Prop '${key}' changed`)
        );
        if (this.state) {
            Object.entries(this.state).forEach(([key, val]) =>
                prevState[key] !== val && console.log(`State '${key}' changed`)
            );
        }
    }

    render() {
        const columns = [
            {
                name: "name",
                label: "Name",
                options: {
                    filter: false,
                    sort: false,
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