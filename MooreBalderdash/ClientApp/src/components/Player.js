import React, { Component } from 'react';
import { Typography } from '@material-ui/core';

export class Player extends Component {

    // props are: name, score, updateScore

    render() {
        const name = this.props.name
        cont score = this.props.score
        const updateScore = this.props.score

        return (
            <div style={{ display: 'flex' }}>
                <Typography variant="body1"> name </Typography>
                <Typography variant="body1"> name </Typography>
            </div>
        );
    }
}