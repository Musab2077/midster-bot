import React from 'react';
import { useParams } from 'react-router-dom';

const Test = () => {
    const { id } = useParams();

    return (
        <div className='text-center'>
            User Id : {4}
        </div>
    );
}

export default Test;
