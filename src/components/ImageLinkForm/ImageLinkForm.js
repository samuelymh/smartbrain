import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
    return (
        <div className='ml3 mr3'>
            <p className="f3">
                SmartBrain will detect faces in your image links.
            </p>    
            <div className='center'>
                <div className='form center pa4 br3 shadow-5'>
                    {/* onChange event attribute for input tag*/}
                    {/* onClick event attribute for button tag */}
                    <input className='f4 pa2 w-70 center' type="text" onChange={onInputChange} />
                    <button 
                    className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple'
                    onClick={onButtonSubmit}
                    >Detect</button>
                </div>
            </div>
        </div>
        
    );
}

export default ImageLinkForm;