import { Row, Col, Pagination } from 'react-bootstrap';

const Paginate = ({data, setPage}) => {

    
  const getPaginationPage = (page) => {
        if (page != null) {
            const pageValue = page.match(/page=(\d+)/)[1];
            setPage(pageValue);   
        }
    };
    
    return (
        <>
        <Row className='mt-4'>
            <Col xl={12} xxl={12}>
                <div className="table-responsive">
                <Pagination style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {
                    data?.meta?.links?.map?.((link, i) => {
                    if (link.label === '&laquo; Previous') {
                        return (
                        <Pagination.Prev disabled={link.url != null ? false : true} onClick={()=>{getPaginationPage(link.url)}} key={i} />
                        );
                    } else if (link.label === 'Next &raquo;') {
                        return (
                        <Pagination.Next disabled={link.url != null ? false : true} onClick={()=>{getPaginationPage(link.url)}} key={i} />
                        );
                    } else {
                        return (
                        <Pagination.Item key={i} active={link.active} onClick={()=>{getPaginationPage(link.url)}}>{link.label}</Pagination.Item>
                        );
                    }
                    })
                }
                </Pagination>
                </div>
            </Col>
        </Row>
        </>
    );
}

export default Paginate;