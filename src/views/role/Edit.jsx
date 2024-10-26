import { Formik, Form, ErrorMessage, Field } from "formik";
import { Row, Col } from "react-bootstrap";
import Card from "../../components/Card/MainCard";
import { Link, useParams } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import { useEffect, useRef } from "react";
import { useEditRoleMutation, useRoleQuery } from "features/pmsApi";

const Edit = () => {
    const { id } = useParams();
    const [editRole, editRoleResponse] = useEditRoleMutation();
    const {data} = useRoleQuery(id);
    const roleRef = useRef();

    const initialValues = {
        name: data?.data?.name,
    };

    const validate = Yup.object({
        name: Yup.string().required('Name is required'),
    });

    const handleSubmit = (values, formik) => {
        let formData = new FormData();
        formData.append('name', values.name);
        formData.append('role', id);

        editRole({id:id, role:formData});
        roleRef.current = formik;
    }

    useEffect(() => {        
        if (editRoleResponse?.data?.success) {
            toast.success('Role updated successfully');
            roleRef.current.resetForm();
        } else {
            roleRef?.current?.setSubmitting(false);
        }
    }, [editRoleResponse]);

    return (
        <>
            <Row>
                <ToastContainer />
                <Col xl={3} md={3}></Col>
                <Col xl={6} md={6}>
                    <Card title="Edit Role">
                        <Formik initialValues={initialValues} validationSchema={validate} onSubmit={handleSubmit} enableReinitialize={true}>
                            {
                                formik => {
                                    return (
                                        <>
                                            <Form>
                                                <Col md={12}>
                                                    <div className="form-group mt-3">
                                                        <label htmlFor="name">Name <span className="text-danger"><b>*</b></span></label>
                                                        <Field type="text" className="form-control" name="name" placeholder="Enter name" />
                                                        <ErrorMessage name="name" component="small" className="text-danger" />
                                                    </div>
                                                </Col>
                                                <Col md={12} className="mt-2">
                                                    <div className="form-group mt-3">
                                                        <button type="submit" disabled={formik.isSubmitting} className="btn btn-sm btn-primary">
                                                            {editRoleResponse?.isLoading ? 'Loading...' : 'Save'}
                                                        </button>
                                                        <Link to="/roles" className="btn btn-sm btn-danger ml-2" >
                                                            Go Back
                                                        </Link>
                                                    </div>
                                                </Col>
                                            </Form>
                                        </>
                                    );
                                }
                            }
                        </Formik>
                    </Card>
                </Col>
                <Col xl={3} md={3}></Col>
            </Row>

        </>
    );
}

export default Edit;