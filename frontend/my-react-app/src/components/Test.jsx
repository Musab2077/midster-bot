import React, { useEffect, useState } from 'react';

const Test = () => {
    const [testing, setTesting] = useState(2);
    const [response, setResponse] = useState(false);

    const handleResponse = () => {
        setResponse(response)
    }
    
    useEffect(()=>{
        handleResponse();
    },[])
    
    return (
        <div>
            <button className='bg-red-600 p-1' onClick={handleResponse}>
                hello
            </button>
            {response && (
                <p>
                    secret
                </p>
            )}
        </div>
    );
}

export default Test;
