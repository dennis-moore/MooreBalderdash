import React, { Component } from 'react';
import { Button, TextField } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import { PlayerList } from './PlayerList';

const ApiServerPath = 'http://localhost:5000/api/';
//const ApiServerPath = 'http://10.0.0.224:1950/api/';
//const ApiServerPath = 'http://98.200.148.70:1950/api/';
//const ApiServerPath = 'http://98.198.169.251:1950/api/';

export const CustomButton = styled(Button)({
    background: '#0063cc',
    //background: 'linear-gradient(315deg, #63a4ff 0%, #83eaf1 74%)',
    border: 0,
    borderRadius: 5,
    color: 'white',
    padding: 10,
    margin: 10,
    '&:hover': {
        backgroundColor: '#0069d9',
        borderColor: '#0062cc',
        boxShadow: 'none',
    },
    "&:disabled": {
        backgroundColor: "grey"
    },
});

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = {
            loading: true, registered: false, dasher: false, admin: false, gameStarted: false,
            playerName: "", cardImages: [], dasherName: "", players: []
        };
    }

    componentDidMount() {
        this.checkGameStarted();
        this.GetPlayers();
        setInterval(() => {
            if (!this.state.dasher) {
                this.GetPlayers();
            }
            this.CheckDasher();
            this.GetCard();
        }, 3500);
    }

    nameChanged = (event) => {
        this.setState({ playerName: event.target.value });
    };

    updateScore = (name, score) => {
        const players = this.state.players.map(player => {
            if (player.name === name) {
                player.score = score
            }
            return player
        })
        this.setState({ players: players })
    }

    renderInterface = () => {
        const disableBtn = this.state.playerName === "";
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 600 }}>
                {this.state.gameStarted ?
                <div>
                    {!this.state.registered ?
                        <div>
                            <form noValidate autoComplete="off">
                                <TextField id="playerName" label="Enter A Name..." variant="outlined" required onChange={this.nameChanged} />
                            </form>
                            <CustomButton color="primary" disabled={disableBtn}
                                onClick={() => {
                                    this.NewPlayer()
                                }}>
                                Submit
                            </CustomButton>
                        </div>                        
                        :
                        <div align='center'>
                            <CustomButton color="primary" disabled={disableBtn}
                                onClick={() => {
                                    this.GetCard()
                                }}>
                                Get Card
                            </CustomButton>
                            {this.state.dasher &&
                                <CustomButton color="primary" disabled={disableBtn}
                                    onClick={() => {
                                        this.EndRound()
                                    }}>
                                    End Round
                                </CustomButton>
                                }
                                <ImageGallery items={this.state.cardImages} />
                        </div>
                    }
                </div>
                :
                <div align='center'>
                    <CustomButton color="primary"
                        onClick={() => {
                            this.CreateGame()
                        }}>
                        Create Game
                    </CustomButton>
                </div>
                }
            </div>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderInterface()

        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                {this.state.gameStarted &&
                    <PlayerList players={this.state.players} updateScore={this.updateScore} isDasher={this.state.dasher} />
                }
                {contents}
                {this.state.gameStarted &&
                    <h2 style={{ width: 300 }}> Chat </h2>
                }
            </div>
        );
    }

    async checkIfRegistered() {
        const response = await fetch(ApiServerPath + 'Games/IsRegistered');
        const player = await response.json();
        if (response.ok) {
            this.setState({ registered: true })
            this.setState({ playerName: player.name })
            console.log(player);
        }
    }

    async checkGameStarted() {
        try {
            const response = await fetch(ApiServerPath + 'Games/GameStarted');
            const game = await response.json();
            if (response.ok) {
                this.setState({ gameStarted: true })
                this.checkIfRegistered();
            }
        }
        catch(e) {

        }
        this.setState({ loading: false });
    }

    async CreateGame() {
        const response = await fetch(ApiServerPath + 'Games/CreateGame');
        if (response.ok) {
            this.setState({ gameStarted: true })
            this.checkIfRegistered();
        }
    }

    async NewPlayer() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({ "name": this.state.playerName })
        };
        const request = ApiServerPath + 'Games/NewPlayer';
        const response = await fetch(request, requestOptions);
        if (response.ok) {
            this.setState({ registered: true });
            console.log(await response.json())
        }
    }

    async GetCard() {
        const response = await fetch(ApiServerPath + 'Games/GetNextCard');
        const image = await response.json();
        //console.log(image)
        let images = []
        if (this.state.dasher) {
            images = [
                {
                    original: image.question,
                    thumbnail: image.question,
                },
                {
                    original: image.answer,
                    thumbnail: image.answer,
                }
            ]
        }
        else {
            images = [
                {
                    original: image.question,
                    thumbnail: image.question,
                },
            ]
        }
        if (response.ok) {
            this.setState({ cardImages: images })
            //this.setState((prevState) => ({
            //    cardImages: [...prevState.cardImages, image],
            //    dasher: true,
            //}));
        }
    }

    async CheckDasher() {
        const response = await fetch(ApiServerPath + 'Games/GetDasher');
        const dasher = await response.json();
        if (response.ok) {
            if (dasher.name === this.state.playerName) {
                this.setState({ dasher: true, dasherName: dasher.name })
            }
            else {
                this.setState({ dasher: false, dasherName: dasher.name })
            }
        }
    }

    async EndRound() {
        const response = await fetch(ApiServerPath + 'Games/EndRound');
        const dasher = await response.json();
        //console.log(dasher)
        if (response.ok) {
            this.setState({ dasherName: dasher.name, dasher: false });
            this.GetCard()
        }
        await this.UpdateScore();
    }

    async UpdateScore() {
        if (!this.state.dasher) return;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(this.state.players)
        };
        const request = ApiServerPath + 'Games/UpdateScore';
        const response = await fetch(request, requestOptions);
        if (!response.ok) {
            console.log("error updating score")
        }
    }

    async GetPlayers() {
        const response = await fetch(ApiServerPath + 'Games/GetPlayers');
        const players = await response.json();
        if (response.ok) {
            const _players = players.map(player => {
                return { name: player.name, score: player.score }
            })
            this.setState({ players: _players })
        }
    }
}
