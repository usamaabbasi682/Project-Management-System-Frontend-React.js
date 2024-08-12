import { useFindProjectQuery, useProjectFileUploadMutation } from 'features/pmsApi';
import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Tabs, Tab, Card,Table,Button} from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import '../../assets/css/style.css';
import Unit from 'views/common/Unit';
import '../../assets/css/fileStyle.css';
import { ErrorMessage, Form, Formik } from 'formik';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import * as Yup from 'yup';
import useUserNotLogin from 'hooks/useUserNotLogin';
import Files from './Files';

const View = () => {
    useUserNotLogin();
    const {id} = useParams();
    const { data,refetch } = useFindProjectQuery(id);
    const [fileUpload, response] = useProjectFileUploadMutation();
    const style = { width: `100%`, 'background': data?.data?.color};
    const projectBadgeColor = { backgroundColor: data?.data?.status_color };
    const [error, setError] = useState(null);
    const projectRef = useRef();

    const handleFileValidation =  Yup.object({
        files: Yup.array()
            .of(
                Yup.mixed().required('File is required')
            )
            .required('At least one file is required')
            .min(1, 'At least one file is required')
    });

    const handleFileSubmit = async (values, formik) => {
        
        const files = values.files;
        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            formData.append('documents[]', files[i]);
        }
    
        fileUpload({ id: id, files: formData });
        projectRef.current = formik;
    };

    const generateColorFromName = (name) => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        // Convert hash to a color (e.g., hex format)
        const color = `#${(hash & 0x00FFFFFF).toString(16).padStart(6, '0')}`;
        return color;
    };

    useEffect(() => {
        if (response?.data?.success) {
            projectRef?.current?.setSubmitting(false);
            projectRef?.current?.resetForm();
            setError(null);
            refetch();
            toast.success("Files Uploaded Successfully", {position: "top-right",});
        } else {
            projectRef?.current?.setSubmitting(false);
            if (response?.data) {
                setError(response?.data);   
            }
        }
    }, [response.data]);

    
    return (
        <>
            <Row>
                <ToastContainer />
                <Col>
                    <h5>{`${data?.data?.name}'s`} Project Details</h5>
                    <hr />
                    <Tabs defaultActiveKey="summary">
                        <Tab eventKey="summary" title="Summary">
                            <Row>
                                <Col key={1} md={8}>
                                    <div className="progress" style={{ height: '7px' }}>
                                        <div className={`progress-bar`} role="progressbar" style={style} aria-valuenow={100} aria-valuemin="0" aria-valuemax="100"/>
                                    </div>
                                    <Card>
                                        <Card.Body>
                                            <h4 className="mb-4 f-w-700">{data?.data?.name.toUpperCase()}&nbsp;<span className='f-w-300 text-muted'>({data?.data?.prefix})</span> <span className="project-badge" style={projectBadgeColor}>{data?.data?.status_modified}</span></h4>
                                            <hr />
                                            <div className="row d-flex align-items-center mb-2">
                                                <div className="col-12">
                                                    <h5 className="f-w-700 d-flex align-items-center m-b-0 text-muted">
                                                        Project Overview:
                                                    </h5>
                                                    <p className="m-b-0 mt-2" dangerouslySetInnerHTML={{ __html: data?.data?.description ? data?.data?.description : 'N/A' }}></p>
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="row mb-2">
                                                <div className="col-md-4">
                                                    <h6 className="f-w-700 m-b-0 text-muted">
                                                        Project Progress:
                                                    </h6>
                                                    <h6 className="text-center m-b-10">
                                                        <span className="text-muted" style={{ fontSize:'10px' }}>Percent: 25%</span>
                                                    </h6>
                                                    <div className="progress"  style={{ height: '7px' }}>
                                                        <div
                                                            className="progress-bar progress-c-theme"
                                                            role="progressbar" style={{ width: '50%', height: '6px' }}
                                                            aria-valuenow="20" aria-valuemin="0"
                                                            aria-valuemax="100" 
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <h6 className="f-w-700 m-b-0 text-muted">
                                                        Created On:
                                                    </h6>
                                                    <p className="m-b-0 mt-3">{data?.data?.creation}</p>
                                                </div>
                                                <div className="col-md-4">
                                                    <h6 className="f-w-700 m-b-0 text-muted">
                                                        Last Updated:
                                                    </h6>
                                                    <p className="m-b-0 mt-3">{data?.data?.last_modified}</p>
                                                </div>
                                            </div>
                                        </Card.Body>
                                        
                                    </Card>
                                    <Row>
                                        <Col key={2} md={6}>
                                            <Unit
                                                progressBarStyle={style}
                                                isObject={true}
                                                users={data?.data?.users}
                                                align='text-starts'/>
                                        </Col>
                                        <Col key={3} md={6}>
                                            <Unit
                                                progressBarStyle={style}
                                                iconClass={'fas fa-user-tie'}
                                                iconColor={data?.data?.client ? generateColorFromName(data?.data?.client) : ''}
                                                title={`Client , ID: ${data?.data?.client_id}`}
                                                subTitle={''}
                                                defaultSubTitle={''}
                                                subTitleValue={`Name: ${data?.data?.client}`} 
                                                defaultSubTitleValue ='0' />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col key={4} md={4}>
                                    <Unit
                                        progressBarStyle={{  }}
                                        iconClass={'fas fa-money-bill-alt'}
                                        iconColor={'#36b38c'}
                                        title={'Budget'}
                                        subTitle={data?.data?.currency}
                                        defaultSubTitle='Empty: '
                                        subTitleValue={data?.data?.budget} 
                                        defaultSubTitleValue ='0' />
                                    
                                    <Unit
                                        progressBarStyle={{  }}
                                        iconClass={'fas fa-money-check'}
                                        iconColor={'#0081d9'}
                                        title={'Budget Type'}
                                        // subTitle='' defaultSubTitle=''
                                        subTitleValue={data?.data?.budget_type}
                                        defaultSubTitleValue ={'N/A'} />
                                    
                                    <Unit
                                        progressBarStyle={{  }}
                                        iconClass={'fas fa-money-check'}
                                        iconColor={'#ffb856'}
                                        title={'Tasks'}
                                        // subTitle='' defaultSubTitle=''
                                        subTitleValue={'0/1 Pending Tasks'}
                                        defaultSubTitleValue ={'0'} />
                                </Col>
                            </Row>
                        </Tab>
                        <Tab eventKey="activity" title="Activity">
                            <Card className="Recent-Users widget-focus-lg">
                                <Card.Header>
                                    <Card.Title as="h5">Recent Activities</Card.Title>
                                </Card.Header>
                                <Card.Body className="px-0 py-2">
                                    <Table responsive hover className="recent-users">
                                        <tbody>
                                            <tr className="unread">
                                                <td>
                                                    <i className="fa fa-list-ul text-c-blue m-r-15" style={{ fontSize:'20px' }} />
                                                </td>
                                                <td>
                                                    <h6 className="mb-1 text-muted">Isabella Christensen</h6>
                                                    <p className="m-0">Lorem Ipsum is simply dummy text of…</p>
                                                </td>
                                                <td>1 day ago</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Tab>
                        <Tab eventKey="tasks" title="Tasks">
                            <div className='text-end'>
                                <Button className='btn btn-sm btn-primary'>
                                    <i className="fa fa-plus" />
                                    <span className="ml-2"><b>New Task</b></span>
                                </Button>
                            </div>
                        </Tab>
                        <Tab eventKey="attachments" title="Attachments">
                            <Card className="Recent-Users widget-focus-lg">
                                <Card.Header>
                                    <Card.Title as="h5">Project Files</Card.Title>
                                </Card.Header>
                                <Card.Body className="px-0 py-2">
                                    <Formik initialValues={{ files:[] }} validationSchema={handleFileValidation} onSubmit={handleFileSubmit}>
                                        {
                                            formik => {
                                                return (
                                                    <>
                                                        <Form>
                                                            <div className="file-upload p-3">
                                                                <label htmlFor="fileInput"><b>Attachments:</b></label>
                                                                <input type="file" value={undefined} name="files" onChange={(e) => {
                                                                    const files = Array.from(e.target.files);
                                                                    setError(null);
                                                                    formik.setFieldValue('files', files);
                                                                }} multiple id="fileInput" />
                                                                <label htmlFor="fileInput" className="file-label">Choose Files</label>
                                                                <ErrorMessage name="files" component={'span'} className='text-danger' />
                                                                {error != null ? <span className='text-danger'>The file must be a file of type: pdf, doc, docx, jpg, jpeg, png, txt.</span> : ''}
                                                            </div>
                                                            <div className="text-end">
                                                                <Button disabled={formik.isSubmitting || response.isLoading} type="submit" className="btn btn-sm btn-primary">
                                                                    <i className="fa fa-upload" /> <span className="ml-2"><b>
                                                                        {response.isLoading? 'Uploading...' : 'Upload'}
                                                                    </b></span>
                                                                </Button>
                                                            </div>
                                                        </Form>
                                                    </>
                                                );
                                            }
                                        }
                                    </Formik>
                                </Card.Body>
                            </Card>
                            {
                                data?.data?.total_files > 0
                                    ? 
                                        <Card className="Recent-Users widget-focus-lg">
                                            <Card.Header>
                                                <Card.Title as="h5">Uploaded Files</Card.Title>
                                            </Card.Header>
                                        <Card.Body className="px-0 py-2">
                                        </Card.Body>
                                        <Files files={data?.data?.files} refetch={refetch} />
                                        </Card>
                                    : ''       
                            }
                        </Tab>
                    </Tabs>
                </Col>
            </Row>
        </>
    );
};

export default View;
