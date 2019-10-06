import React from 'react';
import styled, { keyframes } from 'styled-components';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import Koji from 'koji-tools';

const Container = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    height: 100vh;
    background: url(${() => Koji.config.images.backgroundImage});
    background-size: cover;
    background-position: center;
    flex-direction: column;
    text-align:center;
`;

function getFontFamily(ff) {
    const start = ff.indexOf('family=');
    if(start === -1) return 'sans-serif';
    let end = ff.indexOf('&', start);
    if(end === -1) end = undefined;
    return ff.slice(start + 7, end);
}

const Content = styled.div`
    width: 100%;
    height: 100vh;
    opacity: 1;
    z-index: 1;
    color: ${() => Koji.config.colors.textColor};
    text-shadow: 0 1px 6px rgba(0,0,0,0.7);
    font-family: '${() => getFontFamily(Koji.config.general.fontFamily)}', sans-serif;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Title = styled.h1`
    font-size: 32px;
    margin: 0;
`;

const Start = styled.button`
    max-width: 320px;
    font-size: 24px;
    background: rgba(0,0,0,0.7);
    border: 4px solid ${() => Koji.config.colors.buttonBorderColor};
    color: ${() => Koji.config.colors.buttonTextColor};
    box-shadow: 0 2px 12px rgba(0,0,0,0.24);
    text-shadow: 0 1px 6px rgba(0,0,0,0.4);
    cursor: pointer;
    padding: 10px 64px;
    border-radius: 1000px;
    margin-bottom: 10vh;
   
    &:hover {
        background-color: rgba(0,0,0,0.3);
    }
`;

class GameOverPage extends React.Component {
   componentDidMount() {
        Koji.on('change', () => {
            this.forceUpdate();
        })
    }

  render() {
    return (
        <Container>
            <Helmet defaultTitle={Koji.config.general.name}>
                <link href={Koji.config.general.fontFamily} rel="stylesheet" />
            </Helmet>

            <Content>
                <Title>{Koji.config.general.score} {this.props.location.state.score}</Title>
                <Start
                  onClick={() => {
                    this.props.history.goBack()
                  }}
                  onTouchEnd={() => {
                    this.props.history.goBack()
                  }}
                >
                  {Koji.config.general.tryAgain}
                </Start>
            </Content>
        </Container>
    );
  }
}

export default withRouter(GameOverPage);
