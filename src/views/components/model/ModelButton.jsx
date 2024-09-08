const ModelButton = ({title = "",className="btn-primary",id,icon}) => {
    return (
        <>
            <button type="button" className={className} data-bs-toggle="modal" data-bs-target={`#${id}`} >
                {title} <i className={icon} />
            </button>
        </>
    );
};

export default ModelButton;