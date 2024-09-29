import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useLoginMutation } from 'features/pmsApi';
import ReCAPTCHA from 'react-google-recaptcha';
import { GOOGLE_RECAPTCHA_SITE_KEY } from 'config/constant';
import { useNavigate } from 'react-router-dom';

const LoginInput = () => {
  const [login, { data, isLoading,error }] = useLoginMutation();
  const [loginError, setLoginError] = useState('');
  const formikRef = useRef();
  const recaptchaRef = useRef();
  const navigate = useNavigate();

  const initialValues = {
    email: '',
    password: '',
    remember: false,
    submit: null
  };

  const validate = Yup.object().shape({
    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
    password: Yup.string().max(255).required('Password is required'),
    recaptcha: Yup.string().required('Please verify that you are not a robot'),
  });

  const handleLogin = (values, formik) => {    
    login(values);
    formikRef.current = formik;
  };

  useEffect(() => {
    if (data?.success) {
        formikRef?.current?.setSubmitting(false);
        formikRef?.current?.resetForm();
        recaptchaRef.current.reset();
        sessionStorage.setItem('token', data?.token);
        sessionStorage.setItem('user', JSON.stringify(data?.data));
        navigate('/dashboard');
    } else {
      formikRef?.current?.setSubmitting(false);
      recaptchaRef.current.reset();
      setLoginError(data?.message);
    }
  }, [data]);  

  console.log(error);
  
  return (
    <Formik initialValues={initialValues} validationSchema={validate} onSubmit={handleLogin}>
      {
        (formik) => {
          return (
            <>
              <Form>
                <div className="form-group mb-3">
                  <Field type="text" name="email" className="form-control" placeholder="Email Address / Username" />
                  <ErrorMessage name="email" component={'small'} className="text-danger form-text" />
                </div>
                <div className="form-group mb-3">
                  <Field type="password" name="password" autoComplete="" className="form-control" placeholder="Password" />
                  <ErrorMessage name="password" component={'small'} className="text-danger form-text" />
                  {loginError && <small className="text-danger">{loginError}</small>}
                </div>
                <div className="custom-control custom-checkbox  text-start mb-4 mt-2">
                  <Field type="checkbox" name="remember" className="custom-control-input mx-2" id="remember" />
                  <label className="custom-control-label" htmlFor="remember">
                    Save credentials.
                  </label>
                </div>
                <div className='form-group mb-3'>
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={GOOGLE_RECAPTCHA_SITE_KEY}
                    onChange={(e) => formik.setFieldValue('recaptcha', recaptchaRef.current.getValue())} 
                  />
                  {formik.errors.recaptcha && <small className="text-danger">{formik.errors.recaptcha}</small>}
                </div>
                <Row>
                  <Col mt={2}>
                    <Button className="btn-block mb-4" color="primary" disabled={!formik.isValid || formik.isSubmitting} size="large" type="submit" variant="primary">
                      {isLoading ? 'Redirecting...' : <>Login <i className="feather icon-log-in" /></>}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </>
          );
        }
      }
    </Formik>
  );
};

export default LoginInput;
