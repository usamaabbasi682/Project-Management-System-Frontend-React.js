import React, { useEffect, useState } from "react";
import { Row, Col, Card, Dropdown, DropdownButton,ButtonToolbar } from "react-bootstrap";
import {
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
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isFetching } = useProjectsQuery({ search: search, page: page });
    const [deleteProject, { isLoading }] = useDeleteProjectMutation();
    
  const deleteRow = (id) => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteProject(id);
    }
  };

  useEffect(() => {
    if (isLoading) {
      toast.info("Deleting Department", { position: "top-right" });
    }
  }, [isLoading]);
  return (
    <>
          <ToastContainer />
      <Row className="mb-4">
        <Col xl={6} xxl={3}>
          <Search search={search} setSearch={setSearch} />
        </Col>
        <Col xl={6} xxl={9} className="text-end">
          <Link to="/projects/create" className="btn btn-primary btn-sm">
            New Project <i className="feather icon-plus-circle" />
          </Link>
        </Col>
      </Row>
      <Row>
        {!isFetching ? (
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
