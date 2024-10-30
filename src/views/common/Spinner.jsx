const Spinner = ({variant = 'success'}) => {
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <div className="text-center">
                    <div className={`spinner-border text-${variant}`} role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Spinner;