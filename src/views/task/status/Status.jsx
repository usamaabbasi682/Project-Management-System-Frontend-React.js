import { useCreateStatusMutation, useDeleteStatusMutation, useEditStatusMutation, useStatusesQuery } from "features/pmsApi";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { Card, Table } from "react-bootstrap";
import Spinner from "views/common/Spinner";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import Paginate from "views/common/Paginate";
import Search from "views/common/Search";
import Model from "views/components/model/Model";
import ModelButton from "views/components/model/ModelButton";

const Status = () => {
    const [search, setSearch] = useState('');
    const [page,setPage] = useState(1);
    const { data, isFetching, isLoading } = useStatusesQuery({page:page,search:search});
    const [createStatus, createStatusResponse] = useCreateStatusMutation();
    const [deleteStatus, deleteStatusResponse] = useDeleteStatusMutation();
    const [editStatus, editStatusResponse] = useEditStatusMutation();
    const statusRef = useRef();
    const statusEditRef = useRef();
    const [model, setModel] = useState(false);
    const initialValues = {
        name: '',
        order: '',
    };

    const validate = Yup.object({
        name: Yup.string().required('Name is required'),
        order: Yup.string().required('Order is required').matches(/^[0-9]+$/, 'Order must be a number'),
    });

    const editValidate = Yup.object({
        order: Yup.string().required('Order is required').matches(/^[0-9]+$/, 'Order must be a number'),
    });

    const handleSubmit = (values,formik) => {
        createStatus(values);
        statusRef.current = formik;
    }

    const editHandleSubmit = (values, formik) => {
        const formData = new FormData();
        formData.append('order', values.order);
        editStatus({id:values.id,order:formData});
        statusEditRef.current = formik;
    }

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this status?")) {
            deleteStatus(id);
        }
    }

    useEffect(() => {
        if (createStatusResponse?.data?.success) {
            statusRef?.current?.setSubmitting(false);
            statusRef?.current?.resetForm();
            toast.success("Status Created Successfully", {position: "top-right",});
        } else {
            statusRef?.current?.setSubmitting(false);
        }
    }, [createStatusResponse?.data]);

    useEffect(() => {
        if (editStatusResponse?.data?.success) {
            statusEditRef?.current?.setSubmitting(false);
            toast.success("Status Updated Successfully", {position: "top-right",});
        } else {
            statusEditRef?.current?.setSubmitting(false);
        }
    }, [editStatusResponse?.data]);

    useEffect(() => {
        if (deleteStatusResponse?.data?.success) {
            toast.success("Status Deleted Successfully", {position: "top-right",});
        }
    }, [deleteStatusResponse?.data]);
   console.log(editStatusResponse?.data);
   
    return (
        <Card className="Recent-Users widget-focus-lg">
            <ToastContainer />
            <Card.Header className="d-flex justify-content-between">
                <Card.Title as="h5">Status</Card.Title>
                <div className="d-flex">
                    <span style={{ marginRight: '6px', fontSize: '10px' }} className="mt-2">
                        {isFetching && search != '' ? <><div className="spinner-border text-info" style={{ width:'19px',height:'19px' }} role="status"></div></> : ''}
                    </span>
                    <Search search={search} setSearch={setSearch} />&nbsp;  
                    <ModelButton title="New Status" icon="fa fa-plus" id="createStatus" className="btn btn-sm btn-primary pt-1 pb-1" />
                    <Model id="createStatus" title="New Status">
                        <Formik initialValues={initialValues} validationSchema={validate} onSubmit={handleSubmit}>
                            {
                                (formik) => {
                                    return (
                                        <>
                                            <Form>
                                                <div className="form-group">
                                                    <label htmlFor="name">Name <span className="text-danger">*</span> </label>
                                                    <Field name="name" type="text" className="form-control" placeholder="Name" />
                                                    <ErrorMessage name="name" component="small" className="text-danger" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="order">Order <span className="text-danger">*</span> </label>
                                                    <Field name="order" type="number" className="form-control" placeholder="Order" />
                                                    <ErrorMessage name="order" component="small" className="text-danger" />
                                                </div>
                                                <div className="form-group mt-3">
                                                    <button type="submit" disabled={createStatusResponse.isLoading} className="btn btn-sm btn-primary">
                                                        {createStatusResponse.isLoading ? 'Loading...' : 'Save'}
                                                    </button>
                                                    <button type="reset" className="btn btn-sm btn-secondary">Reset</button>
                                                </div>
                                            </Form>
                                        </>
                                    );
                                }
                            }
                        </Formik>
                    </Model>
                </div>
            </Card.Header>
            <Card.Body className="px-0 py-2 pt-0">
                <Table responsive hover className="recent-users">
                    <tbody>
                        {
                            !isLoading ? 
                                data?.data?.map?.((status, index) => {
                                    return (
                                        <tr key={index} className="unread">
                                            <td className="text-muted">
                                                {status.id}
                                            </td>
                                            <td>
                                                <h6 className="mb-1 text-muted">{status.name}</h6>
                                                <p className="m-0">{status.created_at}</p>
                                            </td>
                                            <td className="text-end" style={{ width: '0px' }}>
                                                <ModelButton id={`editStatus-${status.id}`} icon={'fa fa-edit'} className="border-0 btn p-0 text-warning" />
                                                <Model id={`editStatus-${status.id}`} title="Edit Status">
                                                    <Formik initialValues={{ id:status?.id , order: status?.order || '' }} validationSchema={editValidate} onSubmit={editHandleSubmit} enableReinitialize={true}>
                                                        {
                                                            (formik) => {
                                                                return (
                                                                    <>
                                                                        <Form>
                                                                            <div className="form-group">
                                                                                <label htmlFor="order">Order <span className="text-danger">*</span> </label>
                                                                                <Field name="order" type="number" className="form-control" placeholder="Order" />
                                                                                <ErrorMessage name="order" component="small" className="text-danger" />
                                                                            </div>
                                                                            <div className="form-group mt-3">
                                                                                <button type="submit" disabled={editStatusResponse.isLoading} className="btn btn-sm btn-primary">
                                                                                    {editStatusResponse.isLoading ? 'Loading...' : 'Update'}
                                                                                </button>
                                                                            </div>
                                                                        </Form>
                                                                    </>
                                                                );
                                                            }
                                                        }
                                                    </Formik>
                                                </Model>
                                                <button type="button" onClick={() => { handleDelete(status.id) }} className="border-0 btn p-0 text-danger">
                                                    <i className="fa fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>);
                                })
                                : <Spinner />
                        }
                    </tbody>
                </Table>
                <div className="d-flex justify-content-end" style={{ paddingRight:'26px' }}>
                    <Paginate data={data} setPage={setPage} />
                </div>
            </Card.Body>
        </Card>
    )
}

export default Status;