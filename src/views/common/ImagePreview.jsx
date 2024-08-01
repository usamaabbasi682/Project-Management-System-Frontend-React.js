import { useEffect, useState } from "react";
import { Row, Col } from 'react-bootstrap';

const ImagePreview = ({ data, file , loadingText}) => {
    const [preview, setPreview] = useState(null);
    
    useEffect(() => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    },[file]);

    return ( 
        <>
            <Row className='mt-3'>
                <Col md={2}>
                    {
                        preview != null ?
                        <img src={preview} className='img-fluid  rounded' alt="Preview"/> :
                        data?.data?.profile_image
                        ? <><img src={data?.data?.profile_image} className="img-fluid  rounded" alt="profile" /></>
                        : loadingText
                    }
                </Col>
            </Row>
        </>
    );
}

export default ImagePreview;