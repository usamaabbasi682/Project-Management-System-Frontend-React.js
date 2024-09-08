

const Model = ({children,id,title}) => {
    return (
        <>
        <div className="modal fade text-start" id={id} tabIndex={-1}  aria-hidden="true">
            <div className="modal-dialog">
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