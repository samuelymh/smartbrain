import './App.css';
import { Component } from 'react';
import Clarifai from 'clarifai';
import ParticlesWrapper from './components/ParticlesWrapper/ParticlesWrapper';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';

const app = new Clarifai.App({
  apiKey: '19c9234fd2f54ca6b0c9d047d683d9a8'
});

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
    return (
      <div className="App">
        <ParticlesWrapper />
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
