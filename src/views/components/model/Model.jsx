

const Model = ({children,id,title,modelSize='model-md',marginRight=""}) => {
    return (
        <>
        <div className="modal fade text-start w-100" id={id} tabIndex={-1}  aria-hidden="true">
            <div className={`modal-dialog ${modelSize}`} style={{ marginRight:marginRight }}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">{ title }</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        {children}    
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal"> Close </button>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default Model;