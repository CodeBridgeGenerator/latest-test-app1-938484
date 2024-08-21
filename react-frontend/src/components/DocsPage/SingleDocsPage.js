import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import client from "../../services/restClient";
import { Tag } from 'primereact/tag';
import moment from "moment";
import { InputText } from 'primereact/inputtext';
import ProjectLayout from "../Layouts/ProjectLayout";


const SingleDocsPage = (props) => {
    const navigate = useNavigate();
    const urlParams = useParams();
    const [_entity, set_entity] = useState();

    const [applicationID, setApplicationID] = useState([]);

    useEffect(() => {
        //on mount
        client
            .service("docs")
            .get(urlParams.singleDocsId, { query: { $populate: [            {
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
                props.alert({ title: "Docs", type: "error", message: error.message || "Failed get docs" });
            });
    }, [props,urlParams.singleDocsId]);


    const goBack = () => {
        navigate("/docs");
    };

    return (
        <ProjectLayout>
        <div className="col-12 flex flex-column align-items-center">
            <div className="col-10">
                <div className="flex align-items-center justify-content-start">
                    <Button className="p-button-text" icon="pi pi-chevron-left" onClick={() => goBack()} />
                    <h3 className="m-0">Docs</h3>
                </div>
                <p>docs/{urlParams.singleDocsId}</p>
                {/* ~cb-project-dashboard~ */}
            </div>
            <div className="card w-full">
                <div className="grid ">

            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">DocName</label><p className="m-0 ml-3" >{_entity?.docName}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">DocFileName</label><p className="m-0 ml-3" >{_entity?.docFileName}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">DocURL</label><p className="m-0 ml-3" >{_entity?.docURL}</p></div>
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

export default connect(mapState, mapDispatch)(SingleDocsPage);
