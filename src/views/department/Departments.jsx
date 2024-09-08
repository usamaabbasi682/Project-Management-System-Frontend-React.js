import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { useDeleteDepartmentMutation, useDepartmentsQuery } from 'features/pmsApi';
import { Link } from 'react-router-dom';
import Search from 'views/common/Search';
import Paginate from 'views/common/Paginate';
import useUserNotLogin from 'hooks/useUserNotLogin';
import Spinner from 'views/common/Spinner';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Departments = () => {
  useUserNotLogin();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data ,isFetching, isLoading } = useDepartmentsQuery({ search: search, page: page });
  const [deleteDepartment,deleteDepartmentResponse] = useDeleteDepartmentMutation();

  const deleteRow = (id) => {
    if (confirm('Are you sure you want to delete this department?')) {
      deleteDepartment(id);
    }
  }

  useEffect(() => {
    if (deleteDepartmentResponse.isLoading) {
      toast.info("Deleting Department", { position: "top-right" });
    }
  }, [deleteDepartmentResponse.isLoading]);
  return (
    <>
      <ToastContainer />
      <Row className='mb-4'>
        <Col md={12} className="text-center mb-3">
            <span style={{ marginLeft: '6px', fontSize: '10px' }} className="mt-2">
                {isFetching && search != '' ? <><div className="spinner-border text-info" style={{ width:'19px',height:'19px' }} role="status"></div></> : ''}
            </span>
        </Col>
        <Col xl={6} xxl={3}>
          <Search search={search} setSearch={setSearch} />
        </Col>
        <Col xl={6} xxl={9} className='text-end'>
          <Link to='/departments/create' className='btn btn-primary btn-sm'>
            New Department <i className='feather icon-plus-circle' />
          </Link>
        </Col>
      </Row>
      <Row>
        {
          !isLoading ? data?.data?.map?.((department, i) => {
            const style = { width: `100%`, 'background': department.color };
            return (
              <Col key={i} xl={6} xxl={4}>
                  <Card>
                    <div className="progress" style={{ height: '7px' }}>
                        <div className={`progress-bar`} role="progressbar" style={style} aria-valuenow={100} aria-valuemin="0" aria-valuemax="100"/>
                    </div>
                    <Card.Body>
                    <h6 className="mb-4">SR#: {department.id} | {department.created_at}</h6>
                      <div className="row d-flex align-items-center">
                        <div className="col-12">
                            <h3 className="f-w-300 d-flex align-items-center m-b-0"> {department.name}</h3>
                        </div>
                        <div className="col-12 text-end mt-3">
                          <Link to={`/departments/${department.id}/edit`} className='btn btn-sm btn-info text-capitalize'>Edit</Link>
                          <Button type='button' onClick={()=>{deleteRow(department.id)}} className="btn btn-sm btn-danger text-capitalize">Delete</Button>
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
  );
};


export default Departments;