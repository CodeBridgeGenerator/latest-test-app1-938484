import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import client from "../../services/restClient";
import { Tag } from 'primereact/tag';
import moment from "moment";
import { InputText } from 'primereact/inputtext';
import ProjectLayout from "../Layouts/ProjectLayout";

import ApplicationStatusPage from "../ApplicationStatusPage/ApplicationStatusPage";
import DocsPage from "../DocsPage/DocsPage";

const SingleApplicationsPage = (props) => {
    const navigate = useNavigate();
    const urlParams = useParams();
    const [_entity, set_entity] = useState();

    const [members, setMembers] = useState([]);
const [applicationTypeID, setApplicationTypeID] = useState([]);
const [refInstitutionID, setRefInstitutionID] = useState([]);

    useEffect(() => {
        //on mount
        client
            .service("applications")
            .get(urlParams.singleApplicationsId, { query: { $populate: [            {
                path: "createdBy",
                service: "users",
                select: ["name"],
              },{
                path: "updatedBy",
                service: "users",
                select: ["name"],
              },"members","applicationTypeID","refInstitutionID"] }})
            .then((res) => {
                set_entity(res || {});
                const members = Array.isArray(res.members)
            ? res.members.map((elem) => ({ _id: elem._id, name: elem.name }))
            : res.members
                ? [{ _id: res.members._id, name: res.members.name }]
                : [];
        setMembers(members);
const applicationTypeID = Array.isArray(res.applicationTypeID)
            ? res.applicationTypeID.map((elem) => ({ _id: elem._id, name: elem.name }))
            : res.applicationTypeID
                ? [{ _id: res.applicationTypeID._id, name: res.applicationTypeID.name }]
                : [];
        setApplicationTypeID(applicationTypeID);
const refInstitutionID = Array.isArray(res.refInstitutionID)
            ? res.refInstitutionID.map((elem) => ({ _id: elem._id, name: elem.name }))
            : res.refInstitutionID
                ? [{ _id: res.refInstitutionID._id, name: res.refInstitutionID.name }]
                : [];
        setRefInstitutionID(refInstitutionID);
            })
            .catch((error) => {
                console.log({ error });
                props.alert({ title: "Applications", type: "error", message: error.message || "Failed get applications" });
            });
    }, [props,urlParams.singleApplicationsId]);


    const goBack = () => {
        navigate("/applications");
    };

    return (
        <ProjectLayout>
        <div className="col-12 flex flex-column align-items-center">
            <div className="col-10">
                <div className="flex align-items-center justify-content-start">
                    <Button className="p-button-text" icon="pi pi-chevron-left" onClick={() => goBack()} />
                    <h3 className="m-0">Applications</h3>
                </div>
                <p>applications/{urlParams.singleApplicationsId}</p>
                {/* ~cb-project-dashboard~ */}
            </div>
            <div className="card w-full">
                <div className="grid ">

            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">Name</label><p className="m-0 ml-3" >{_entity?.name}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">About Me</label><p className="m-0 ml-3" >{_entity?.bioData}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">Education History</label><p className="m-0 ml-3" >{_entity?.education}</p></div>
            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm">Members</label>
                    {members.map((elem) => (
                        <Link key={elem._id} to={`/users/${elem._id}`}>
                            <div className="card">
                                <p className="text-xl text-primary">{elem.name}</p>
                            </div>
                        </Link>
                    ))}</div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm">Application Type</label>
                    {applicationTypeID.map((elem) => (
                        <Link key={elem._id} to={`/applicationType/${elem._id}`}>
                            <div className="card">
                                <p className="text-xl text-primary">{elem.name}</p>
                            </div>
                        </Link>
                    ))}</div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm">Institutions</label>
                    {refInstitutionID.map((elem) => (
                        <Link key={elem._id} to={`/refInstitutions/${elem._id}`}>
                            <div className="card">
                                <p className="text-xl text-primary">{elem.name}</p>
                            </div>
                        </Link>
                    ))}</div>

                    <div className="col-12">&nbsp;</div>
                    <div className="col-12 md:col-6 lg:col-3">
                        <Tag value="created By:"></Tag>
                        <p className="m-0 ml-3">{_entity?.createdBy?.name}</p>
                    </div>
                    <div className="col-12 md:col-6 lg:col-3">
                        <Tag value="created At:"></Tag>
                        <p className="m-0 ml-3">{moment(_entity?.createdAt).fromNow()}</p>
                    </div>
                    <div className="col-12 md:col-6 lg:col-3">
                        <Tag value="last Updated By:"></Tag>
                        <p className="m-0 ml-3">{_entity?.updatedBy?.name}</p>
                    </div>
                    <div className="col-12 md:col-6 lg:col-3">
                        <Tag value="updated At:"></Tag>
                        <p className="m-0 ml-3">{moment(_entity?.updatedAt).fromNow()}</p>
                    </div>
                </div>
            </div>
        </div>
        <ApplicationStatusPage/>
<DocsPage/>
        </ProjectLayout>
    );
};

const mapState = (state) => {
    const { user, isLoggedIn } = state.auth;
    return { user, isLoggedIn };
};

const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(SingleApplicationsPage);
