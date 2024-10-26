import { useDeleteUserMutation, useUsersQuery } from "features/pmsApi";
import { useEffect, useState } from "react";
import { Row,Col,Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Paginate from "views/common/Paginate";
import Search from "views/common/Search";
import Spinner from "views/common/Spinner";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const User = () => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState('');
    const { data, isLoading, isFetching } = useUsersQuery({ search: search, page: page, status: status });
    const [deleteUser, deleteResponse] = useDeleteUserMutation();

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this user?')) {
            deleteUser(id);    
        }
    }

    useEffect(() => {
        if (deleteResponse.isSuccess) {
            toast.success('User deleted successfully');
        }
    }, [data]);

    return (
        <>
            <ToastContainer />
            <Row className='mb-4'>
                <Col md={12} className="text-center mb-3">
                    <span style={{ marginLeft: '6px', fontSize: '10px' }} className="mt-2">
                        {isFetching && (search != '') ? <><div className="spinner-border text-info" style={{ width:'19px',height:'19px' }} role="status"></div></> : ''}
                    </span>
                </Col>
                <Col md="3" className="de">
                    <Search search={search} setSearch={setSearch} />
                </Col>
                <Col md="3" className="de">
                    <select name="status" id="status" onChange={(e)=>{setStatus(e.target.value)}} className="form-select form-select-sm">
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                    </select>
                </Col>
                <Col md="6" className='text-end'>
                    <Link to='/users/create' className='btn btn-primary btn-sm'>
                        New User <i className='feather icon-users' />
                    </Link>
                </Col>
            </Row>
            <Row>
                {
                    !isLoading ? 
                        data?.data.map((user, index) => (
                            <Col key={index} md={3} className="rounded">
                                <Card className="rounded">
                                    <Card.Body className="p-3">
                                        <div className="row">
                                            <div className="col-12 d-flex align-items-center gap-2"> 
                                                <img src={user?.avatar} alt="user" className="img-fluid img-thumbnail " style={{ width: '50px' }} />
                                                <Link to={`/users/${user?.id}`} className="text-dark">
                                                <h5 style={{ fontSize: '15px' }} className="f-w-300 d-flex align-items-center m-b-0 text-primary"><b> {user?.name} </b></h5>
                                                </Link>
                                            </div>
                                            <div className="col-12"> 
                                                    <p className="text-muted mb-0 pt-1">Role: {user?.role}</p>
                                                    <p className="text-muted pt-0 mb-0">
                                                        { user?.email} &nbsp;
                                                        {user?.email_verified_at ?
                                                            <i className="feather icon-check-circle fw-bold" style={{ color: '#6be295' }} title="Verified" />
                                                        : <i className="feather icon-x-circle fw-bold" style={{ color: '#ff4d4d' }} title="Not Verified" />}
                                                    </p>
                                            </div>
                                            <div className="col-12 d-flex justify-content-between"> 
                                                <div>
                                                    <span className="badge text-muted p-0">{user?.total_projects} Projects</span> &nbsp;
                                                    <span className="badge text-muted p-0">{user?.total_active_tasks} Task Active</span>
                                                </div>
                                                <div>
                                                    <Link to={'/users/'+user?.id+'/edit'} className="border-0 bg-transparent">
                                                        <i className="feather icon-edit-2 text-success" />
                                                    </Link>
                                                    <button onClick={()=>{handleDelete(user?.id)}} className="border-0 bg-transparent">
                                                        <i className="feather icon-trash-2 text-danger" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    : <Spinner />
                }
            </Row>
            <Paginate data={data} setPage={setPage} />
        </>
    );
}

export default User;