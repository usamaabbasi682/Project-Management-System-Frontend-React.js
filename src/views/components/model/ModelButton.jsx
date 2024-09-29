const ModelButton = ({title = "", className="btn-primary", id, icon, handleClick}) => {
    return (
        <>
            <button type="button" onClick={handleClick} className={className} data-bs-toggle="modal" data-bs-target={`#${id}`} >
                {title} <i className={icon} />
            </button>
        </>
    );
};

export default ModelButton;