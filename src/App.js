import './App.css';
import { Component } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';

const app = new Clarifai.App({
  apiKey: '19c9234fd2f54ca6b0c9d047d683d9a8'
});

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

class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      boxArray: []
    }
  }
  
  extractFaceLocations = (data) => {
    console.log("Response:", data);

    // data.outputs[0].data.regions is an array object of faces
    // clarifaiFaces is an array of bounding boxes of faces
    const clarifaiFaces = data
      .outputs[0]
      .data.regions
      .map(face => face.region_info.bounding_box);

    return clarifaiFaces;
  }

  calculateFaceLocations = (faces) => {
    // To get relative width and height of input image in browser
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

    // Iterates over an array of objects of bounding boxes.
    // Then calculates the bounding boxes relative to the width and height.
    const faceLocations = faces.map(face => {
      return {
        leftCol: face.left_col * width,
        topRow: face.top_row * height,
        rightCol: width - (face.right_col * width),
        bottomRow: height - (face.bottom_row * height)
      }
    });

    // setState is asynchronous and by default renders the respective component that state is in.
    this.setState({boxArray: faceLocations});
  }

  onInputChange = (event) => {
    // event.target.value = the text inside input box
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});

    // Sends url via clarifai api to detect faces.
    // extractFaceLocations extracts and returns the bounding boxes array nested in response
    // calculateFaceLocations sets state of boxArray to be passed into FaceRecognition component.
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => this.calculateFaceLocations(this.extractFaceLocations(response)))
      .catch(err => console.log(err));
  }

  render() {
    const particlesInit = async (main) => {
      console.log(main);
  
      // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      await loadFull(main);
    };
  
    const particlesLoaded = (container) => {
      console.log("ParticlesContainer:", container);
    };

    return (
      <div className="App">
        <Particles id='tsparticles' init={particlesInit} loaded={particlesLoaded} options={particlesOptions} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
        <FaceRecognition boxArray={this.state.boxArray} imageUrl={this.state.imageUrl}/>
      </div>
    );
  }
}

export default App;
