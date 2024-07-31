const ImagePreview = ({handleImageChange}) => {

    const handleImageChange = (file) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }
    return (
        <>
            {
                preview != null ?
                    <img src={preview} className='img-fluid  rounded' alt="Preview"/> :
                data?.data?.profile_image ?
                    <img src={data?.data?.profile_image} className="img-fluid  rounded" alt="profile" />
                : 'Loading...'
            }
        </>
    );
}

export default ImagePreview;