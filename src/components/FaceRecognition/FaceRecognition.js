import React from 'react';
import './FaceRecognition.css';
import BoundingBoxes from '../BoundingBoxes/BoundingBoxes'

const FaceRecognition = ({ imageUrl, boxArray }) => {
    return (
        <div className='center ma'>
            <div className='absolute mt2'>
                <img id='inputimage' src={imageUrl} alt="" width='500px' height='auto' />
                <BoundingBoxes boxes={boxArray} />
            </div>
        </div>
    );
}

export default FaceRecognition;