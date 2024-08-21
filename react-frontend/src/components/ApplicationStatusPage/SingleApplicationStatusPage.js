import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import client from "../../services/restClient";
import { Tag } from 'primereact/tag';
import moment from "moment";
import { InputText } from 'primereact/inputtext';
import ProjectLayout from "../Layouts/ProjectLayout";

import { Calendar } from 'primereact/calendar';

const SingleApplicationStatusPage = (props) => {
    const navigate = useNavigate();
    const urlParams = useParams();
    const [_entity, set_entity] = useState();

    const [applicationID, setApplicationID] = useState([]);

    useEffect(() => {
        //on mount
        client
            .service("applicationStatus")
            .get(urlParams.singleApplicationStatusId, { query: { $populate: [            {
                path: "createdBy",
                service: "users",
                select: ["name"],
              },{
                path: "updatedBy",
                service: "users",
                select: ["name"],
              },"applicationID"] }})
            .then((res) => {
                set_entity(res || {});
                const applicationID = Array.isArray(res.applicationID)
            ? res.applicationID.map((elem) => ({ _id: elem._id, name: elem.name }))
            : res.applicationID
                ? [{ _id: res.applicationID._id, name: res.applicationID.name }]
                : [];
        setApplicationID(applicationID);
            })
            .catch((error) => {
                console.log({ error });
                props.alert({ title: "ApplicationStatus", type: "error", message: error.message || "Failed get applicationStatus" });
            });
    }, [props,urlParams.singleApplicationStatusId]);


    const goBack = () => {
        navigate("/applicationStatus");
    };

    return (
        <ProjectLayout>
        <div className="col-12 flex flex-column align-items-center">
            <div className="col-10">
                <div className="flex align-items-center justify-content-start">
                    <Button className="p-button-text" icon="pi pi-chevron-left" onClick={() => goBack()} />
                    <h3 className="m-0">Application Status</h3>
                </div>
                <p>applicationStatus/{urlParams.singleApplicationStatusId}</p>
                {/* ~cb-project-dashboard~ */}
            </div>
            <div className="card w-full">
                <div className="grid ">

            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">Sent Date</label><p id="applicationSentDate" className="m-0 ml-3" >{_entity?.applicationSentDate}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">Institution Responded Date</label><p id="institutionRespondedDate" className="m-0 ml-3" >{_entity?.institutionRespondedDate}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">Notification Sent Date</label><p id="applicationNotiSentDate" className="m-0 ml-3" >{_entity?.applicationNotiSentDate}</p></div>
            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm">ApplicationID</label>
                    {applicationID.map((elem) => (
                        <Link key={elem._id} to={`/applications/${elem._id}`}>
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

export default connect(mapState, mapDispatch)(SingleApplicationStatusPage);
