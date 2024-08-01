import React, { useRef,useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';

import Card from '../../components/Card/MainCard';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Link, useParams } from 'react-router-dom';
import useUserNotLogin from 'hooks/useUserNotLogin';
import { useClientDepartmentsQuery, useEditClientMutation, useFindClientQuery } from 'features/pmsApi';
import { toast, ToastContainer } from 'react-toastify';
import ImagePreview from 'views/common/ImagePreview';
import 'react-quill/dist/quill.snow.css';
import "react-toastify/dist/ReactToastify.css";
import * as Yup from 'yup';

const Edit = () => {
  useUserNotLogin();
    const { id } = useParams();
    const [editClient,updateObj] = useEditClientMutation();
    const { data, refetch } = useFindClientQuery(id);
    const departments = useClientDepartmentsQuery();
    const clientRef = useRef();
    const [passwordCount, setPasswordCount] = useState(0);

    const initialValues = {
        name: data?.data?.name,
        department: data?.data?.department_id,
        email: data?.data?.email,
        website: data?.data?.website,
        profile: '',
        password: '',
        confirm_password: '',
    };

    const validationSchema = (data) => {
        const validate = Yup.object({
          name: Yup.string().required('Please enter name').max(100),
          department: Yup.string().required('Please choose a department'),
          email: Yup.string().email('Invalid Email').required('Please enter email'),
          client_panel: Yup.boolean(),
          website: Yup.string().url('Invalid URL').nullable(),
          profile: Yup.string().nullable(),
        });

        if (data > 0) {
            return validate.shape({
              password: Yup.string().required('Please enter password'),
              confirm_password: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Please confirm your password'),
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
            formData.append('client_panel','1');
            formData.append('password', values.password);
        } else {
            formData.append('client_panel','0');
        }

        if (values.profile) {
            formData.append('profile', values.profile);
        }

        editClient({id: id, data:formData});
        clientRef.current = formik;
  };

  useEffect(() => {
    if (updateObj.data?.success) {
      refetch();
      clientRef?.current?.setSubmitting(false);
      toast.success("Department Updated Successfully", {position: "top-right"});
    } else {
      clientRef?.current?.setSubmitting(false);
    }
  }, [updateObj.data]);

  return (
    <>
      <ToastContainer />
      <Row>
        <Col xl={3} md={3}></Col>
        <Col xl={6} md={6}>
          <Card title="Edit Client">
            <Formik initialValues={initialValues} validationSchema={validationSchema(passwordCount)} onSubmit={handleSubmit} enableReinitialize={true}>
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
                                                            <Row>
                                  <Col md={6}>
                                    <div className="form-group">
                                        <label htmlFor="password">Password</label>
                                          <Field type="password" className="form-control" name="password" onChange={(e) => { formik.setFieldValue('password', e.target.value); setPasswordCount(e.target.value.length); }} placeholder="Enter password" />
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
                                                          <div className="form-group">
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
                        <ImagePreview data={data} file={formik.values.profile} loadingText={'Loading...'} />
                        <div className="form-group mt-3">
                          <button type="submit" disabled={formik.isSubmitting} className="btn btn-sm btn-primary">
                            {updateObj.isLoading ? 'Loading...' : 'Update'}
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

export default Edit;