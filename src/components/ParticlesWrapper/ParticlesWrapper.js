import { Component } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

// Configurable particle settings
const particlesOptions = {
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "repulse",
      },
      resize: true,
    },
    modes: {
      repulse: {
        distance: 150,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: "#ffffff",
    },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "bounce",
      },
      random: false,
      speed: 1.5, // Controls speed of circles.
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 600, // The higher, the more lines.
      },
      value: 80,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 1, max: 5 },
    },
  },
}

// ParticlesWrapper component acts as a wrapper to render Particles component.
class ParticlesWrapper extends Component {

  // To prevent component from updating since this is simply a background.
  shouldComponentUpdate(){
      return false;
  }

  render(){
    const particlesInit = async (main) => {
      console.log("here:", main);
  
      // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      await loadFull(main);
    };
      
    const particlesLoaded = (container) => {
      console.log("ParticlesContainer2:", container);
    };
      
    return (
      <Particles id='tsparticles' init={particlesInit} loaded={particlesLoaded} options={particlesOptions} />
    );
  }
}

export default ParticlesWrapper;
