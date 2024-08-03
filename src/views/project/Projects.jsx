import React, { useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
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

const Projects = () => {
  useUserNotLogin();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isFetching } = useProjectsQuery({ search: search, page: page });
    const [deleteProject, { isLoading }] = useDeleteProjectMutation();
    
  const deleteRow = (id) => {
    if (confirm("Are you sure you want to delete this department?")) {
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
                      let projectBadgeColor = {backgroundColor: project.status_color};
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
                  <Card.Body className="border-top">
                        <div className="row">
                        <span>SR#: {project.id} | { project.created_at }</span>        
                      <div className="col-12 mt-2">
                                    {/* <i className="fab fa-facebook-f text-primary f-36" /> */}
                                    <h5 style={{ fontWeight:'bolder' }} className="f-w-300 d-flex align-items-center m-b-0"> <span style={{ fontSize:'12px' }}>({project.prefix})</span>&nbsp;{project.name}</h5>
                                </div>
                                <div className="col-4 text-start mt-3">
                                    <span className="project-badge" style={projectBadgeColor}>{project.status_modified}</span>
                                 </div>
                      <div className="col-8 text-end mt-3">
                            <h6><span style={{ fontWeight:'bolder' }}>0</span> Pending Task(s)</h6>
                                    <h6 className="text-c-blue mb-0"><span className="text-muted">Client: { project.client }</span>
                        </h6>
                                </div>
                                    <div className="avatar-group">
                                {project?.users != '' ? project?.users?.map?.((user, index) => (
                                    <div
                                    key={user.id}
                                    className="avatar"
                                    style={{ zIndex: project.users.length - index }} // ensures the last avatar is on top
                                    >
                                    <img src={user.avatar} alt={user.name} />
                                    </div>
                                )) : ''}
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
