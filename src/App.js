import './App.css';
import { Component } from 'react';
import Clarifai from 'clarifai';
import ParticlesWrapper from './components/ParticlesWrapper/ParticlesWrapper';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
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
      boxArray: [],
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({
      user : {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    });
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
      .then(response => {
        if(response){
          fetch('http://localhost:3001/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              // Cant do setState({user:{entries: count}}) otherwise it just
              // rewrites the whole thing and user wont have the other props anymore.
              this.setState(Object.assign(this.state.user, {entries: count}))
            })
        }
        this.calculateFaceLocations(this.extractFaceLocations(response))
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState({isSignedIn: false});
    } else if(route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route});
  }

  render() {
    const { isSignedIn, imageUrl, route, boxArray } = this.state;
    const { name, entries } = this.state.user;
    return (
      <div className="App">
        <ParticlesWrapper />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {route === 'home'
          ? <div>
              <Logo />
              <Rank username={name} userentries={entries} />
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
              <FaceRecognition boxArray={boxArray} imageUrl={imageUrl} />
            </div>
          : (
            route === "signin" 
            ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    );
  }
}

export default App;
