import React, { useEffect, useState } from "react";
import { Row, Col, Card, Dropdown, DropdownButton,ButtonToolbar } from "react-bootstrap";
import {
  useClientOptionsQuery,
  useDeleteProjectMutation,
  useProjectsQuery,
} from "features/pmsApi";
import { Link } from "react-router-dom";
import Search from "views/common/Search";
import Paginate from "views/common/Paginate";
import useUserNotLogin from "hooks/useUserNotLogin";
import Spinner from "views/common/Spinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../../assets/css/style.css';
import Avatar from "views/common/Avatar";
// import AvatarGroup from "views/common/AvatarGroup";

const Projects = () => {
  useUserNotLogin();
  const [status, setStatus] = useState('all');
  const [client, setClient] = useState('all');
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [myProjects, setMyProjects] = useState(false);
  const clients = useClientOptionsQuery();
  const { data, isFetching, isLoading } = useProjectsQuery({ search: search, myProjects: myProjects, client:client, status: status, page: page });
  const [deleteProject, deleteProjectResponse] = useDeleteProjectMutation();
    
  const statusOptions = [
      { value: 'all', label: 'All' },
      { value: 'archived', label: 'Archived' },
      { value: 'finished', label: 'Finished' },
      { value: 'ongoing', label: 'Ongoing' },
      { value: 'onhold', label: 'On Hold' }
  ];

  const deleteRow = (id) => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteProject(id);
    }
  };

  useEffect(() => {
    if (deleteProjectResponse.isLoading) {
      toast.info("Deleting Department", { position: "top-right" });
    }
  }, [deleteProjectResponse.isLoading]);

  return (
    <>
      <ToastContainer />
      <Row className="mb-4 mt-2">
        <Col md={12} className="text-center mb-3">
          <span style={{ marginLeft: '6px', fontSize: '10px' }} className="mt-2">
              {isFetching && (search != '' || client != '' || status != '' || myProjects == true) ? <><div className="spinner-border text-info" style={{ width:'19px',height:'19px' }} role="status"></div></> : ''}
          </span>
        </Col>
        <Col md={10} className="text-start mb-4">
          <label>Client</label>
            <select className='form-select' onChange={(e)=> setClient(e.target.value) } style={{ height: '35px',paddingTop:'6px',fontSize:'13px',width:'160px' }}>
                <option value="all">All</option>
                {
                    clients?.data?.data?.map?.((client, i) => {
                        return (
                            <option key={i} value={client.value}>{client.label}</option>
                        )
                    })
                }
            </select>
        </Col>
        <Col md={2} className="text-end mb-4 mt-2">
          <Link to="/projects/create" className="btn btn-primary btn-sm">
            New Project <i className="feather icon-plus-circle" />
          </Link>
        </Col>
        <Col md={9}>
          <div className="form-check form-check-primary mt-2">
            <input
              name="my_projects"
              className="form-check-input"
              type="checkbox"
              onChange={(e) => setMyProjects(!myProjects)}
              value={myProjects}
            />  
            <label className="form-check-label" htmlFor="my_projects">
              <span className="form-check-title">My Projects</span>
            </label>
          </div>
        </Col>
        <Col md={3} className="text-end d-flex justify-content-end">
            <select className='form-select' onChange={(e)=>{setStatus(e.target.value)}} style={{ height: '33px',paddingTop:'6px',fontSize:'13px',width:'160px' }}>
              {
                  statusOptions?.map((option, index) => (
                      <option key={index} value={option.value}>
                          {option.label}
                      </option>
                  ))
              }
            </select>&nbsp;
          <Search search={search} setSearch={setSearch} />
        </Col>
      </Row>
      <Row>
        {!isLoading ? (
          data?.data?.map?.((project, i) => {
            let style = { width: "60%", height: "6px", backgroundColor: project.color };
            let projectBadgeColor = { backgroundColor: project.status_color };
            return (
              <Col key={i} xl={6} xxl={4}>
                <Card className="card-social">
                  <Card.Body>
                    <div className="row align-items-start justify-content-start card-active">
                      <div className="col-12">
                        <h6 className="text-center m-b-10"><span className="text-muted m-r-5">Completed:</span>20%</h6>
                        <div className="progress">
                          <div className="progress-bar" role="progressbar" style={style} aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"/>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                  <Card.Body className="border-top border-bottom pb-2">
                    <div className="row">
                      <span>SR#: {project.id} | {project.created_at}</span>
                      <div className="col-12 mt-2 mb-1">
                        <h5 style={{ fontWeight: 'bolder' }} className="f-w-300 d-flex align-items-center m-b-0">
                          <Link to={`/projects/${project.id}`} className="text-dark">
                            <span style={{ fontSize: '12px' }}>({project.prefix})</span>&nbsp;{project.name}
                          </Link>
                        </h5>
                      </div>
                      <div className="col-4 text-start mt-3">
                        <span className="project-badge" style={projectBadgeColor}>{project.status_modified}</span>
                      </div>
                      <div className="col-8 text-end mt-3">
                        <h6><span style={{ fontWeight: 'bolder' }}>0</span> Pending Task(s)</h6>
                        <h6 className="text-c-blue mb-0"><span className="text-muted">Client: {project.client}</span></h6>
                      </div>
                      <div className="avatar-group mt-3">
                        {/* <AvatarGroup key={index} avatar={user.avatar} name={user.name} total={project.users.length} index={index} /> */}
                        {project?.users != '' ? project?.users?.map?.((user, index) => (
                          <Avatar key={user.id} name={user.name} />
                         )) : ''}
                      </div>
                    </div>
                  </Card.Body>
                  <Card.Body style={{ padding: "9px" }}>
                    <div className="row d-flex justify-content-center">
                      <div className="col-12">
                        {/* <Link to={`/projects/${project.id}/edit`} className="btn btn-info btn-sm">Edit</Link>
                        <button className="btn btn-danger btn-sm" style={{ marginRight: "5px" }}>Delete</button> */}
                        <ButtonToolbar>
                          <DropdownButton
                            className="text-capitalize"
                            title={'Actions'}
                            variant={'light'}
                            id={`dropdown-variants-${i}`}
                            key={project.id}
                          >
                            <Dropdown style={{ paddingLeft: "10px",paddingBottom:'0px' }}><Link className="btn btn-info btn-sm" to={`/projects/${project.id}/edit`}>
                              Edit Project
                            </Link></Dropdown>
                            <Dropdown style={{ paddingLeft: "10px", paddingTop: '0px' }}>
                              <button onClick={()=>deleteRow(project.id)} className="btn btn-danger btn-sm" style={{ marginRight: "5px" }}>Delete</button>
                            </Dropdown>
                          </DropdownButton>
                        </ButtonToolbar>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })
        ) : (
          <Spinner />
        )}
      </Row>
      <Paginate data={data} setPage={setPage} />
    </>
  );
};

export default Projects;
