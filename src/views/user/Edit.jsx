import { Link, useParams } from "react-router-dom";
import * as Yup from 'yup';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useEditUserMutation, useProjectsOptionsQuery, useUserQuery } from "features/pmsApi";
import { useEffect, useRef } from "react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { Row, Col } from "react-bootstrap";
import Card from "../../components/Card/MainCard";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Edit = () => {
    const { id } = useParams();
    const {data} = useUserQuery(id);
    const animatedComponents = makeAnimated();
    const projectOptions = useProjectsOptionsQuery();
    const [eitUser, editResponse] = useEditUserMutation();
    const userRef = useRef();    
    
    const initialValues = {
        name: data?.data.name,
        phone: data?.data.phone,
        email: data?.data.email,
        password: '',
        password_confirmation: '',
        projects: data?.data?.projects,
        role: { value: data?.data?.role.toLowerCase(), label: data?.data?.role },
        salary: data?.data.salary,
        profile: '',
        status: data?.data.status == '1' ? { value: 1, label: 'Active' } : { value: 0, label: 'InActive' },
    };

    const validate = Yup.object({
        name: Yup.string().required('Please enter name').max(100),
        phone: Yup.string().nullable().matches(/^\d*$/, 'Phone number must be numeric'),
        email: Yup.string().email('Invalid email').required('Please enter email').max(100),
        password: Yup.string().nullable().min(8).max(100),
        password_confirmation: Yup.string().nullable().oneOf([Yup.ref('password'), null], 'Confirm password must match with password'),
        projects: Yup.array().nullable(),
        role: Yup.object().required('Please select role'),
        salary: Yup.string().nullable().matches(/^\d*$/, 'Salary must be numeric'), 
        profile: Yup.string().nullable(),
        status: Yup.object().nullable(),
    });

    const roleOptions = [
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'User' },
        { value: 'client', label: 'Client' }
    ];
    const statuses = [
        { value: 1, label: 'Active' },
        { value: 0, label: 'InActive' },
    ];

    const handleSubmit = (values, formik) => {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('phone', values.phone);
        if (values.password) {
            formData.append('password', values.password);
        }
        formData.append('salary', values.salary);
        formData.append('status', values.status.value);
        formData.append('role', values.role.value);

        if (values.profile) {
            formData.append('profile', values.profile);
        } 

        if (values.projects.length > 0) {
            values.projects.forEach((project) => {
                formData.append('projects[]', project.value);
            });
        }

        eitUser({ id: id, user: formData });
        userRef.current = formik;
    }

    useEffect(() => {
        if (editResponse?.data?.success) {
            userRef?.current?.setSubmitting(false);
            toast.success("User Updated Successfully", {position: "top-right"});
        } else {
            userRef?.current?.setSubmitting(false);
        }
    }, [editResponse?.data]);

    return (
        <Row>
            <ToastContainer />
            <Col xl={3} md={3}></Col>
            <Col xl={6} md={6}>
                <Card title="Edit User">
                    <Formik initialValues={initialValues} validationSchema={validate} onSubmit={handleSubmit} enableReinitialize>
                        {
                            (formik) => {
                                return (
                                    <>
                                        <Form>
                                            <Row>
                                                <Col md={6}>
                                                    <div className="form-group mt-3">
                                                        <label htmlFor="name">Name <span className="text-danger"><b>*</b></span></label>
                                                        <Field type="text" className="form-control" name="name" placeholder="Enter name" />
                                                        <ErrorMessage name="name" component="small" className="text-danger" />
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className="form-group mt-3">
                                                        <label htmlFor="phone">Phone</label>
                                                        <Field type="text" className="form-control" name="phone" placeholder="Enter phone" />
                                                        <ErrorMessage name="phone" component="small" className="text-danger" />
                                                    </div>
                                                </Col>
                                                <Col md={12}>
                                                    <div className="form-group mt-3">
                                                        <label htmlFor="email">Email <span className="text-danger"><b>*</b></span></label>
                                                        <Field type="text" className="form-control" name="email" placeholder="Enter Email" />
                                                        <ErrorMessage name="email" component="small" className="text-danger" />
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className="form-group mt-3">
                                                        <label htmlFor="password">Password</label>
                                                        <Field type="password" className="form-control" name="password" placeholder="Enter password" />
                                                        <ErrorMessage name="password" component="small" className="text-danger" />
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className="form-group mt-3">
                                                        <label htmlFor="password_confirmation">Confirm Password</label>
                                                        <Field type="password" className="form-control" name="password_confirmation" placeholder="Enter Confirm Password" />
                                                        <ErrorMessage name="password_confirmation" component="small" className="text-danger" />
                                                    </div>
                                                </Col>
                                                <Col md={12}>
                                                    <div className="form-group mt-3">
                                                        <label htmlFor="projects">Projects</label>
                                                        <Select
                                                            closeMenuOnSelect={false}
                                                            components={animatedComponents}
                                                            isMulti
                                                            options={projectOptions?.data?.data}
                                                            onChange={(selectedOptions) => {
                                                                formik.setFieldValue('projects', selectedOptions); 
                                                            }}
                                                            name="projects"
                                                            value={formik.values.projects}
                                                        />
                                                        <ErrorMessage name="projects" component="small" className="text-danger" />
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className="form-group mt-3">
                                                            <label htmlFor="role">Role <span className="text-danger"><b>*</b></span></label>
                                                        <Select
                                                            closeMenuOnSelect={false}
                                                            components={animatedComponents}
                                                            options={roleOptions}
                                                            onChange={(selectedOptions) => {
                                                                formik.setFieldValue('role', selectedOptions);
                                                            }}
                                                            name="role"
                                                            value={formik.values.role}
                                                        />
                                                        <ErrorMessage name="role" component="small" className="text-danger" />
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className="form-group mt-3">
                                                        <label htmlFor="salary">Salary</label>
                                                        <Field type="text" className="form-control" name="salary" />
                                                        <ErrorMessage name="salary" component="small" className="text-danger" />
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className="form-group mt-3">
                                                        <label htmlFor="profile">
                                                            Profile
                                                        </label>
                                                        <Field type="file" className="form-control" name="profile" value={undefined} onChange={(e) => {
                                                            formik.setFieldValue('profile', e.target.files[0]);
                                                        }} />
                                                    </div>
                                                    <img src={data?.data?.avatar} alt="" className="img-thumbnail mt-2" style={{ width: '100px' }} />
                                                </Col>
                                                <Col md={6}>
                                                    <div className="form-group mt-3">
                                                        <label htmlFor="status">
                                                            Status
                                                        </label>
                                                        <Select
                                                            closeMenuOnSelect={false}
                                                            components={animatedComponents}
                                                            options={statuses}
                                                            onChange={(selectedOptions) => {
                                                                formik.setFieldValue('status', selectedOptions);
                                                            }}
                                                            name="status"
                                                            value={formik.values.status}
                                                        />
                                                        <ErrorMessage name="status" component="small" className="text-danger" />
                                                    </div>
                                                </Col>
                                                <Col md={12} className="mt-2">
                                                    <div className="form-group mt-3">
                                                        <button type="submit" disabled={formik.isSubmitting} className="btn btn-sm btn-primary">
                                                            {editResponse?.loading ? 'Loading...' : 'Update'}
                                                        </button>
                                                        <Link to="/users" className="btn btn-sm btn-danger ml-2" >
                                                            Go Back
                                                        </Link>
                                                    </div>
                                                </Col>
                                            </Row>
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
    )
}

export default Edit;