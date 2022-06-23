import React from 'react';

const BoundingBoxes = ({ boxes }) => {
    // returns a jsx which has the html of all the bounding boxes.
    const boxArray = boxes.map((box, i) => {
        // console.log(box, i);
        return (
            <div
                key={i} 
                className='bounding-box'
                style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}>
            </div>
        );
    });
    
    // takes the jsx value obtained above.
    return (
        <div>
            {boxArray}
        </div>
    );
}

export default BoundingBoxes;