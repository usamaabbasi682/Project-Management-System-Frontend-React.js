import React, { useRef, useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';

import Card from '../../components/Card/MainCard';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Link, useParams } from 'react-router-dom';
import useUserNotLogin from 'hooks/useUserNotLogin';
import { useClientOptionsQuery,useUserOptionsQuery, useEditProjectMutation, useFindProjectQuery } from 'features/pmsApi';;
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Edit = () => {
    useUserNotLogin();
    const { id } = useParams();
    const [editProject, updateObj] = useEditProjectMutation();
    const { data, refetch,isFetching } = useFindProjectQuery(id);
    const clients = useClientOptionsQuery();
    const users = useUserOptionsQuery();
    const projectRef = useRef();
    const animatedComponents = makeAnimated();

    const modifyObject = (users) => {
        const usersOptions = users?.map?.((user) => {
            return {
                value: user.id,
                label: user.name,
            };
        });
        return usersOptions;
    };
    
    const formatNumber = (value) => {
        // Remove non-numeric characters and add commas
        return value
            .replace(/\D/g, '')
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
  
    const initialValues = {
        name: data?.data?.name,
        prefix: data?.data?.prefix,
        client: data?.data?.client_id,
        color: data?.data?.color,
        users: modifyObject(data?.data?.users),
        budget: data?.data?.budget,
        budget_type: data?.data?.budget_type,
        currency: data?.data?.currency,
        status: data?.data?.status,
        description: data?.data?.description,
    };

    const budgetTypeOptions = [
        { value: 'fixed', label: 'Fixed' },
        { value: 'hourly', label: 'Hourly' }
    ];

    const currencyOptions = [
        { value: 'USD', label: 'USD' },
        { value: 'EUR', label: 'EUR' },
        { value: 'GBP', label: 'GBP' },
        { value: 'INR', label: 'INR' },
        { value: 'AUD', label: 'AUD' },
        { value: 'CAD', label: 'CAD' }
    ];

    const statusOptions = [
        { value: 'archived', label: 'Archived' },
        { value: 'finished', label: 'Finished' },
        { value: 'ongoing', label: 'Ongoing' },
        { value: 'onhold', label: 'On Hold' }
    ];

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required').max(150, 'Name must be less than 150 characters'),
        prefix: Yup.string().required('Prefix is required').matches(/^[a-zA-Z0-9]+$/, 'Prefix must be alphanumeric').max(8, 'Prefix must be less than 8 characters'),
        client: Yup.string().required('Client is required'),
        color: Yup.string().required('Color is required'),
        users: Yup.array().min(1, 'Please select at least one user').required('Users is required'),
        budget: Yup.string().required('Budget is required'),
        budget_type: Yup.string().required('Budget Type is required').oneOf(['fixed', 'hourly']),
        currency: Yup.string().required('Currency is required'),
        status: Yup.string().required('Status is required').oneOf(['archived', 'finished', 'ongoing', 'onhold']),
        description: Yup.string().nullable(),
    });

  
    const handleSubmit = (values, formik) => {
        const users = values.users;
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('prefix', values.prefix);
        formData.append('client_id', values.client);
        formData.append('color', values.color);
        formData.append('budget', values.budget);
        formData.append('budget_type', values.budget_type);
        formData.append('currency', values.currency);
        formData.append('status', values.status);
        formData.append('description', values.description);

        if (users.length != 0) {
            users.forEach((user) => {
                formData.append('users[]', user.value);
            });
        }
        
        editProject({ id: id, data: formData });
        projectRef.current = formik;
    };

    useEffect(() => {
        if (updateObj?.data?.success) {
        refetch();
        projectRef?.current?.setSubmitting(false);
        toast.success("Department Updated Successfully", {position: "top-right",});
        } else {
            projectRef?.current?.setSubmitting(false);
        }
    }, [updateObj?.data]);
    
    return (
        <>
            <ToastContainer />
            <Row>
                <Col xl={3} md={3}></Col>
                <Col xl={6} md={6}>
                    <Card title="Add New Project">
                        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize={true}>
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
                                                                value={formik.values.users}
                                                                name="users"
                                                            />
                                                            <ErrorMessage name="users" component="small" className="text-danger" />
                                                        </div>
                                                    </Col>
                                                      <Col md={6}>
                                                        <div className="form-group mt-3">
                                                            <label htmlFor="budget">
                                                                Budget<span className="text-danger"><b>*</b></span>
                                                            </label>
                                                            <Field type="text" name="budget" value={formik.values.budget} onChange={(e) => {
                                                                const rawValue = e.target.value.replace(/,/g, '');
                                                                const formattedValue = formatNumber(rawValue);
                                                                formik.setFieldValue('budget', formattedValue);
                                                            }} className="form-control" placeholder="Enter Budget(Price)" /> <br/>
                                                            <ErrorMessage name="budget" component="small" className="text-danger" />
                                                        </div>
                                                    </Col>
                                                      <Col md={6}>
                                                        <div className="form-group mt-3">
                                                            <label htmlFor="budget_type">
                                                                Budget Type<span className="text-danger"><b>*</b></span>
                                                            </label>
                                                            <Field as="select" className="form-select"  style={{ fontSize:'14px',height:'42px' }} name="budget_type">
                                                                <option value="">Select...</option>
                                                                {
                                                                    budgetTypeOptions?.map((option, index) => (
                                                                        <option key={index} value={option.value}>
                                                                            {option.label}
                                                                        </option>
                                                                    ))
                                                                }
                                                            </Field>
                                                            <ErrorMessage name="budget_type" component="small" className="text-danger" />
                                                        </div>
                                                    </Col>
                                                      <Col md={6}>
                                                        <div className="form-group">
                                                            <label htmlFor="currency">
                                                                Currency<span className="text-danger"><b>*</b></span>
                                                            </label>
                                                            <Field as="select" className="form-select"  style={{ fontSize:'14px',height:'42px' }} name="currency">
                                                                <option value="">Select...</option>
                                                                {
                                                                    currencyOptions?.map((option, index) => (
                                                                        <option key={index} value={option.value}>
                                                                            {option.label}
                                                                        </option>
                                                                    ))
                                                                }
                                                            </Field>
                                                            <ErrorMessage name="currency" component="small" className="text-danger" />
                                                        </div>
                                                    </Col>
                                                      <Col md={6}>
                                                        <div className="form-group">
                                                            <label htmlFor="currency">
                                                                Status<span className="text-danger"><b>*</b></span>
                                                            </label>
                                                            <Field as="select" className="form-select"  style={{ fontSize:'14px',height:'42px' }} name="status">
                                                                <option value="">Select...</option>
                                                                {
                                                                    statusOptions?.map((option, index) => (
                                                                        <option key={index} value={option.value}>
                                                                            {option.label}
                                                                        </option>
                                                                    ))
                                                                }
                                                            </Field>
                                                            <ErrorMessage name="status" component="small" className="text-danger" />
                                                        </div>
                                                    </Col>
                                                      <Col md={12}>
                                                        <div className="form-group mt-3">
                                                            <label htmlFor="description">Description</label>
                                                            <ReactQuill theme="snow" className="form-control" name="description" value={formik.values.description} onChange={value => formik.setFieldValue('description', value)} />
                                                            <ErrorMessage name="description" component="small" className="text-danger" />
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <div className="form-group mt-3">
                                                    <button type="submit" disabled={isFetching || formik.isSubmitting} className="btn btn-sm btn-primary">
                                                        {updateObj.isLoading ? 'Loading...' : 'Save'}
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

export default Edit;