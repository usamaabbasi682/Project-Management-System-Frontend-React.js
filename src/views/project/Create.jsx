import React, { useRef, useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';

import Card from '../../components/Card/MainCard';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Link } from 'react-router-dom';
import useUserNotLogin from 'hooks/useUserNotLogin';
import { useCreateDepartmentMutation, useClientOptionsQuery,useUserOptionsQuery } from 'features/pmsApi';;
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const Create = () => {
    useUserNotLogin();
    const [createDepartment, { data, isLoading }] = useCreateDepartmentMutation();
    const clients = useClientOptionsQuery();
    const users = useUserOptionsQuery();
    const departmentRef = useRef();
    const animatedComponents = makeAnimated();

    const initialValues = {
        name: '',
        prefix: '',
        client: '',
        color: '#183422',
        users:[]
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required').max(150, 'Name must be less than 150 characters'),
        // Allow only number and alphabets
        prefix: Yup.string().required('Prefix is required').matches(/^[a-zA-Z0-9]+$/, 'Prefix must be alphanumeric').max(8, 'Prefix must be less than 8 characters'),
        client: Yup.string().required('Client is required'),
        color: Yup.string().required('Color is required'),
        users: Yup.array().min(1, 'Please select at least one user').required('Users is required'),
    });

    const handleSubmit = (values, formik) => {
        console.log(values);
        
        // createDepartment(values);
        // departmentRef.current = formik;
    };

    useEffect(() => {
        if (data?.success) {
            departmentRef?.current?.setSubmitting(false);
            departmentRef?.current?.resetForm();
            toast.success("Department Created Successfully", {position: "top-right"});
        } else {
            departmentRef?.current?.setSubmitting(false);
        }
    }, [data]);
    
    return (
        <>
            <ToastContainer />
            <Row>
                <Col xl={3} md={3}></Col>
                <Col xl={6} md={6}>
                    <Card title="Add New Project">
                        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                            {
                                formik => {
                                    return (
                                        <>
                                            <Form>
                                                <Row>
                                                    <Col md={6}>
                                                        <div className="form-group">
                                                            <label htmlFor="name">
                                                                Name<span className="text-danger"><b>*</b></span>
                                                            </label>
                                                            <Field type="text" name="name" value={formik.values.name} onChange={(e) => {
                                                                const name = e.target.value;
                                                                const prefixValue = name.toUpperCase().slice(0, 8).replace(/\s+/g, ''); 

                                                                formik.setFieldValue('name', name);
                                                                formik.setFieldValue('prefix', prefixValue);
                                                            }} className="form-control" placeholder="Enter project name" />
                                                            <ErrorMessage name="name" component="small" className="text-danger" />
                                                        </div>    
                                                    </Col>    
                                                    <Col md={6}>
                                                        <div className="form-group">
                                                            <label htmlFor="prefix">
                                                                Prefix<span className="text-danger"><b>*</b></span>
                                                            </label>
                                                            <Field type="text" className="form-control"
                                                                onChange={(e) => {
                                                                    let value = e.target.value.toUpperCase().replace(/\s+/g, '');

                                                                    // Limit the value to 8 characters
                                                                    if (value.length > 8) {
                                                                        value = value.slice(0, 8);
                                                                    }
                                                                    formik.setFieldValue('prefix', value);
                                                                } } value={formik.values.prefix} name="prefix" placeholder="Prefix..." />
                                                            <ErrorMessage name="prefix" component="small" className="text-danger" />
                                                        </div>
                                                    </Col>
                                                    <Col md={6}>
                                                        <div className="form-group mt-3">
                                                            <label htmlFor="client">
                                                                Client<span className="text-danger"><b>*</b></span>
                                                            </label>
                                                            <Field as="select" className="form-select"  style={{ fontSize:'14px',height:'42px' }} name="client">
                                                                <option value="">Select...</option>
                                                                {
                                                                    clients?.data?.data?.map?.(client => {
                                                                        return (
                                                                            <option key={client.value} value={client.value}>{client.label}</option>
                                                                        )
                                                                    })
                                                                }
                                                            </Field>
                                                            <ErrorMessage name="client" component="small" className="text-danger" />
                                                        </div>
                                                    </Col>
                                                    <Col md={6}>
                                                        <div className="form-group mt-5">
                                                            <Field type="color" name="color" /> <br/>
                                                            <ErrorMessage name="color" component="small" className="text-danger" />
                                                        </div>
                                                    </Col>
                                                    <Col md={12} className='mt-3'>
                                                        <div className="form-group">
                                                             <label htmlFor="client">
                                                                Users<span className="text-danger"><b>*</b></span>
                                                            </label>
                                                            <Select
                                                                closeMenuOnSelect={false}
                                                                components={animatedComponents}
                                                                // defaultValue={[options[0]]}
                                                                isMulti
                                                                options={users?.data?.data}
                                                                onChange={(selectedOptions) => {
                                                                    formik.setFieldValue('users', selectedOptions);
                                                                }}
                                                                // value={formik.values.users}
                                                                name="users"
                                                            />
                                                            <ErrorMessage name="users" component="small" className="text-danger" />
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <div className="form-group mt-3">
                                                    <button type="submit" disabled={formik.isSubmitting} className="btn btn-sm btn-primary">
                                                        {isLoading ? 'Loading...' : 'Save'}
                                                    </button>
                                                    <Link to="/projects" className="btn btn-sm btn-danger ml-2">
                                                        Go Back 
                                                    </Link>
                                                </div>
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
    )
}

export default Create;