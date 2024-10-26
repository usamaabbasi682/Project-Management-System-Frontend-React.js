import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Row,Col,Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Search from "views/common/Search";
import { useEffect, useState } from 'react';
import { useDeleteRoleMutation, useRolesQuery } from 'features/pmsApi';
import Spinner from 'views/common/Spinner';
import Paginate from 'views/common/Paginate';

const Role = () => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const { data, isLoading, isFetching } = useRolesQuery({ search: search, page: page });
    const [deleteRole, deleteRoleResponse] = useDeleteRoleMutation();
    
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this role?')) {
            deleteRole(id);
        }
    }

    useEffect(() => {
        if (deleteRoleResponse?.data?.success) {
            toast.success('Role deleted successfully');
        }
    }, [deleteRoleResponse]);

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
                <Col md="9" className='text-end'>
                    <Link to='/roles/create' className='btn btn-primary btn-sm'>
                        New Role <i className='feather icon-user' />
                    </Link>
                </Col>
            </Row>
            <Row>
                {
                    !isLoading ? data?.data?.map?.((role, i) => {
                        const style = { width: `100%`, 'background': 'gray' };
                        return (
                        <Col key={i} md="3">
                            <Card>
                                <div className="progress" style={{ height: '7px' }}>
                                    <div className={`progress-bar`} role="progressbar" style={style} aria-valuenow={100} aria-valuemin="0" aria-valuemax="100"/>
                                </div>
                                <Card.Body>
                                <h6 className="mb-4">SR#: {role.id} | {role.created_at}</h6>
                                <div className="row d-flex align-items-center">
                                    <div className="col-12">
                                        <h3 className="f-w-300 d-flex align-items-center m-b-0"> {role.name}</h3>
                                    </div>
                                    <div className="col-12 text-end mt-3">
                                        <Link to={`/roles/${role.id}/edit`} className='border-0 bg-transparent'><i className="feather icon-edit-2 text-success" /></Link>
                                        <button type='button' onClick={()=>{handleDelete(role?.id)}} className="border-0 bg-transparent text-danger"><i className="feather icon-trash-2 text-danger" /></button>
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

export default Role;