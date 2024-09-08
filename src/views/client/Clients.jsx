import React, { useEffect, useState } from "react";
import { useClientDepartmentsQuery, useClientsQuery, useDeleteClientMutation } from "features/pmsApi";
import { Row, Col, Card, Button } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import useUserNotLogin from "hooks/useUserNotLogin";
import Search from "views/common/Search";
import { Link } from "react-router-dom";
import Spinner from "views/common/Spinner";
import Paginate from "views/common/Paginate";

const Clients = () => {
    useUserNotLogin();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [department, setDepartment] = useState(null);
    const { data, isFetching, isLoading } = useClientsQuery({ search: search, page: page,department:department });
    const [deleteClient, deleteClientResponse] = useDeleteClientMutation();
    const departments = useClientDepartmentsQuery();

    const deleteRow = (id) => {
        if (confirm('Are you sure you want to delete this client?')) {
            deleteClient(id);
        }
    }

    useEffect(() => {
        if (deleteClientResponse.isLoading) {
            toast.info("Deleting Client", { position: "top-right" });
        }
    }, [deleteClientResponse.isLoading]);

    return (
        <>
            <ToastContainer />
            <Row className='mb-4 '>
                <Col md={12} className="text-center mb-3">
                    <span style={{ marginLeft: '6px', fontSize: '10px' }} className="mt-2">
                        {isFetching && (search != '' || department != null) ? <><div className="spinner-border text-info" style={{ width:'19px',height:'19px' }} role="status"></div></> : ''}
                    </span>
                </Col>
                <Col xl={6} xxl={3}>
                    <Search search={search} setSearch={setSearch} />
                </Col>
                <Col xl={6} xxl={3}>
                    <select className='form-select form-select-sm' onChange={(e) => setDepartment(e.target.value)} style={{ fontWeight: 'bold' }}>
                        <option value="">Department</option>
                        {
                            departments?.data?.data?.map?.((department, i) => {
                                return (
                                    <option key={i} value={department.id}>{department.name}</option>
                                )
                            })
                        }
                    </select>
                </Col>
                <Col xl={6} xxl={4} className='text-end'>
                </Col>
                <Col xl={6} xxl={2} className='text-end'>
                    <Link to='/clients/create' className='btn btn-primary btn-sm mt-3'>
                        New Client <i className='feather icon-plus-circle' />
                    </Link>
                </Col>
            </Row>
            <Row>
            {
            !isLoading ? data?.data?.map?.((client, i) => {
                const style = { width: `100%`, 'background': client.color };
                const avatar = {
                    width: 55,
                    height: 55,
                    borderRadius: "50%",
                    border: `5px solid ${client.color}`
                };
                return (
                <Col key={i} xl={6} xxl={4}>
                    <Card>
                        <div className="progress" style={{ height: '7px' }}>
                            <div className={`progress-bar`} role="progressbar" style={style} aria-valuenow={100} aria-valuemin="0" aria-valuemax="100"/>
                        </div>
                        <Card.Body>
                        <h6 className="mb-4">SR#: {client.id} | {client.created_at}</h6>
                        <div className="row d-flex align-items-center">
                            <div className="col-12">
                                <h3 className="f-w-300 d-flex align-items-center m-b-0">
                                    <img
                                        src={client.profile_image}
                                        alt={client.name}
                                        style={avatar}
                                        className="profile-img" /> &nbsp;
                                    {client.name}
                                </h3>
                                <p className="f-w-300 d-flex align-items-center m-b-0" style={{ paddingLeft: '67px' }}> {client.email}</p>
                            </div>
                            <div className="col-12 text-end mt-3">
                            <Link to={`/clients/${client.id}/edit`} className='btn btn-sm btn-info text-capitalize'>Edit</Link>
                            <Button type='button' onClick={()=>{deleteRow(client.id)}} className="btn btn-sm btn-danger text-capitalize">Delete</Button>
                            </div>
                        </div>
                        </Card.Body>
                    </Card>
                </Col>
                );
            }) : <Spinner />
            }
            </Row>
            <Paginate data={data} setPage={setPage} />
        </>
    )
}

export default Clients;