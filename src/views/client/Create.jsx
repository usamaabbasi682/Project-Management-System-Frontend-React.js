import React, { useRef,useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';

import Card from '../../components/Card/MainCard';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Link } from 'react-router-dom';
import useUserNotLogin from 'hooks/useUserNotLogin';
import { useClientDepartmentsQuery, useCreateClientMutation } from 'features/pmsApi';;
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import 'react-quill/dist/quill.snow.css';
import ImagePreview from 'views/common/ImagePreview';
import * as Yup from 'yup';

const Create = () => {
    useUserNotLogin();
    const [createClient, { data, isLoading }] = useCreateClientMutation();
    const departments = useClientDepartmentsQuery();
    const departmentRef = useRef();  
    const [client_panel, setClientPanel] = useState(false);
    
    const initialValues = {
      name: '',
      department: '',
      email: '',
      website: '',
      profile: '',
      password: '',
      confirm_password: '',
      client_panel:'',
    };

  const validationSchema = (clientPanel) => {
    const validate = Yup.object({
        name: Yup.string().required('Please enter name').max(100),
        department: Yup.string().required('Please choose a department'),
        email: Yup.string().email('Invalid Email').required('Please enter email'),
        client_panel: Yup.boolean(),
        website: Yup.string().url('Invalid URL').nullable(),
        profile: Yup.string().nullable(),
    });

    if (clientPanel) {
        return validate.shape({
          password: Yup.string().required('Please enter password'),
          confirm_password: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Please confirm your password'),
        });
    } else {
        return validate.shape({
          password: Yup.string().nullable(),
          confirm_password: Yup.string().nullable(),
        });
    }

    return validate;
  }

  const handleSubmit = (values, formik) => {
    const formData = new FormData();
    
    formData.append('name', values.name);
    formData.append('department', values.department);
    formData.append('email', values.email);
    formData.append('website', values.website);

    if (values.password) {
      formData.append('password', values.password);
    }

    if (client_panel) {
      formData.append('client_panel','1');
    } else {
      formData.append('client_panel','0');
    }

    if (values.profile) {
      formData.append('profile', values.profile);
    }
    createClient(formData);
    departmentRef.current = formik;
    };

    useEffect(() => {
        if (data?.success) {
          departmentRef?.current?.setSubmitting(false);
          departmentRef?.current?.setFieldValue('profile', []);
          departmentRef?.current?.resetForm();
          setClientPanel(false);
          toast.success("Department Created Successfully", {position: "top-right"});
        } else {
          departmentRef?.current?.setSubmitting(false);
        }
    }, [data]);
  console.log(data?.message);
    return (
        <>
      <ToastContainer />
      <Row>
        <Col xl={3} md={3}></Col>
        <Col xl={6} md={6}>
            <Card title="Add New Client">
            <Formik initialValues={initialValues} validationSchema={validationSchema(client_panel)} onSubmit={handleSubmit}>
              {
                formik => {
                  return (
                    <>
                          <Form>
                            <Row>
                                  <Col md={6}>
                                    <div className="form-group">
                                        <label htmlFor="name">Client Name</label>
                                        <Field type="text" className="form-control" name="name" placeholder="Enter client name" />
                                        <ErrorMessage name="name" component="small" className="text-danger" />
                                    </div>
                                  </Col>
                                  <Col md={6}>
                                    <div className="form-group">
                                        <label htmlFor="department">Department</label>
                                        <Field as="select" name="department" className='form-control'>
                                            <option value="">Select Department</option>
                                            {
                                                departments?.data?.data?.map?.((department, i) => {
                                                    return (
                                                        <option key={i} value={department.id}>{department.name}</option>
                                                    )
                                                })
                                            }
                                        </Field>
                                        <ErrorMessage name="department" component="small" className="text-danger" />
                                    </div>
                                  </Col>
                            </Row>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <Field type="text" className="form-control" name="email" placeholder="Enter email-address" />
                                <ErrorMessage name="email" component="small" className="text-danger" />
                            </div>
                            <div className="form-check mt-3">
                                <input type="checkbox" checked={client_panel} value={client_panel} onChange={()=>{ setClientPanel(!client_panel);}} className="form-check-input" />
                                <label htmlFor="client_panel" className="form-check-label">
                                    Want to create client panel ?
                                </label>
                              </div>
                              <Row className={!client_panel ? `d-none` : ''}>
                                  <Col md={6}>
                                    <div className="form-group">
                                        <label htmlFor="password">Password</label>
                                        <Field type="password" className="form-control" name="password" placeholder="Enter password" />
                                        <ErrorMessage name='password' component={'small'} className='text-danger' />
                                    </div>
                                  </Col>
                                  <Col md={6}>
                                    <div className="form-group">
                                          <label htmlFor="confirm_password">Confirm Password</label>
                                          <Field type="password" className="form-control" name="confirm_password" placeholder="Enter confirm password" />
                                          <ErrorMessage name='confirm_password' component={'small'} className='text-danger' />
                                    </div>
                                  </Col>
                              </Row>
                              
                            <div className={client_panel ? `form-group mt-3` : 'form-group'}>
                                <label htmlFor="website">Website</label>
                                <Field type="text" className="form-control" name="website" placeholder="Enter website address" />
                                <ErrorMessage name="website" component="small" className="text-danger" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="profile">Profile</label>
                                  <Field type="file" value={undefined} onChange={(event) => {
                                      formik.setFieldValue('profile', event.currentTarget.files[0]);
                                  }} className="form-control" name="profile" />
                                <ErrorMessage name="profile" component="small" className="text-danger" />
                        </div>
                        <ImagePreview data={{  }} loadingText={''} file={formik.values.profile} />
                        <div className="form-group mt-3">
                          <button type="submit" disabled={formik.isSubmitting} className="btn btn-sm btn-primary">
                            {isLoading ? 'Loading...' : 'Submit'}
                          </button>
                          <Link to="/clients" className="btn btn-sm btn-danger ml-2">
                            Go-Back 
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