import React, { useRef,useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';

import Card from '../../components/Card/MainCard';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import ReactQuill from 'react-quill';
import { Link } from 'react-router-dom';
import useUserNotLogin from 'hooks/useUserNotLogin';
import { useCreateDepartmentMutation } from 'features/pmsApi';;
import 'react-quill/dist/quill.snow.css';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Create = () => {
  useUserNotLogin();
  const [createDepartment, { data, isLoading }] = useCreateDepartmentMutation();
  const departmentRef = useRef();
  
  const initialValues = {
    name: '',
    description: '',
    color: ''
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Please enter department name').max(100),
    description: Yup.string().nullable(),
    color: Yup.string().required('Please choose a color')
  });

  const handleSubmit = (values,formik) => {
    createDepartment(values);
    departmentRef.current = formik;
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
          <Card title="Add New Department">
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
              {
                formik => {
                  return (
                    <>
                      <Form>
                        <div className="form-group">
                          <label htmlFor="name">Department Name</label>
                          <Field type="text" className="form-control" name="name" placeholder="Enter department name" />
                          <ErrorMessage name="name" component="small" className="text-danger" />
                        </div>
                        <div className="form-group">
                          <label htmlFor="description">Description</label>
                          <ReactQuill theme="snow" className="form-control" name="description" value={formik.values.description} onChange={value => formik.setFieldValue('description', value)} />
                          <ErrorMessage name="description" component="small" className="text-danger" />
                        </div>
                        <div className="form-group mt-3">
                          <Field type="color" name="color" /> <br/>
                          <ErrorMessage name="color" component="small" className="text-danger" />
                        </div>
                        <div className="form-group mt-3">
                          <button type="submit" disabled={!formik.isValid || formik.isSubmitting} className="btn btn-sm btn-primary">
                            {isLoading ? 'Loading...' : 'Submit'}
                          </button>
                          <Link to="/departments" className="btn btn-sm btn-danger ml-2">
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