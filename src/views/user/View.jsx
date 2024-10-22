import { Row, Col } from "react-bootstrap";
import Card from "../../components/Card/MainCard";
import { useUserQuery } from "features/pmsApi";
import { useParams } from "react-router-dom";
import Spinner from "views/common/Spinner";

const View = () => {
    const {id} =  useParams();
    const { data,isLoading} = useUserQuery(id);
    
    return (
        <Row>
            <Col xl={3} md={3}></Col>
            <Col xl={12} md={12}>
                <Card title="User Details">
                    {!isLoading ?
                    <div className="row">
                        <div className="col-md-3">
                            <strong style={{ fontWeight:'bold' }}>Name:</strong>
                            <p>{data?.data?.name}</p>
                            <strong style={{ fontWeight:'bold' }}>Role:</strong>
                            <p>{data?.data?.role}</p>
                            <strong style={{ fontWeight:'bold' }}>Updated At:</strong>
                            <p>{data?.data?.updated_at}</p>
                        </div>
                        <div className="col-md-3">
                            <strong style={{ fontWeight:'bold' }}>Phone:</strong>
                            <p>{data?.data?.phone}</p>
                            <strong style={{ fontWeight:'bold' }}>Pending Tasks:</strong>
                            <p>{data?.data?.pending_tasks}</p>
                            <strong style={{ fontWeight: 'bold' }}>Profile:</strong> <br/>
                            <img src={data?.data?.avatar} alt="" className="img-thumbnail mt-2" style={{ width: '100px' }} />
                        </div>
                        <div className="col-md-3">
                            <strong style={{ fontWeight:'bold' }}>Email:</strong>
                            <p>{data?.data?.email}</p>
                            <strong style={{ fontWeight:'bold' }}>Status:</strong>
                            <p>{data?.data?.status}</p>
                            <strong style={{ fontWeight: 'bold' }}>Project:</strong>
                            <p>{data?.data?.projects?.map((project, index) => (
                                <span key={index}>{project.label} {index < data?.data?.projects.length - 1 ? ', ' : ''}</span>
                            ))}</p>
                        </div>
                        <div className="col-md-3">
                            <strong style={{ fontWeight:'bold' }}>Salary:</strong>
                            <p>{data?.data?.salary_format}</p>
                            <strong style={{ fontWeight:'bold' }}>Created At:</strong>
                            <p>{data?.data?.created_at}</p>
                        </div>
                        </div>
                    : <Spinner />}
                </Card>
            </Col>
            <Col xl={3} md={3}></Col>
        </Row>
    );
};

export default View;