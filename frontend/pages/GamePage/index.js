import React, { useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import Koji from 'koji-tools';

import Controller from './utils/Controller';

import Background from './Components/Background';
import Player from './Components/Player';
import Enemy from './Components/Enemy';

const Container = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    height: 100vh;
    background-image: url('${Koji.config.images.backgroundImage}');
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

const Canvas = styled.canvas`
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

function GamePage(props) {

  const ref = useRef(null);

  useEffect(() => {
    // getting canvas and 2d xontext
    const canvas = ref.current;
    const context = canvas.getContext('2d');

    // calculating canvas width height
    const height = window.innerHeight;
    const width = height/Koji.config.general.windowWidth;

    const offset = Koji.config.general.offset;

    // default speed of cars
    const speed = Koji.config.general.speed;
    const speedAddTime = Koji.config.general.speedAddTime;
    const speedStep = Koji.config.general.speedStep;

    // styling canvas
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // create all needed objects for starting game
    const controller = new Controller({
      width,
      height,
      speed,
      speedAddTime,
      speedStep,
      offset
    });
    const background = new Background({ width, height, context, controller });
    const player = new Player({ width, height, controller, context });
    const enemy = new Enemy({ width, height, controller, context });

    // returning value from requestAnimationFrame
    // need this value for removing animationFrame listener
    // after game end
    let requestId = null;

    // method for rendering every frame
    const render = () => {
      // check if game paused or no
      // if yes stop rendering
      if (controller.getGameStatus()) {
        requestId = requestAnimationFrame(render);
        return;
      }

      // clear canvas
      context.clearRect(0, 0, width, height);

      // check if game over stop all processes and redirect
      // else render all objects
      if(controller.getIntersect()) {
        cancelAnimationFrame(requestId);
        controller.setIntersect(false);
        props.history.push('/game-over', {score: controller.getScore()});
      } else {
        background.render();
        player.render();
        enemy.render();

        requestId = requestAnimationFrame(render);
      }
    };

    // waiting for background load,
    // after start game
    background.onInit().then(() => {
      render();
    });

    // cancel animation frame on component unmount
    return () => cancelAnimationFrame(requestId);
  }, [ref.current]);

    return (
        <Container color={'red'}>
            <Canvas ref={ref} id="main-canvas">

            </Canvas>
        </Container>
    );
}

export default withRouter(GamePage);
