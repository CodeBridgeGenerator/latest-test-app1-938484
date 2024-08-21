import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../services/restClient";
import _ from "lodash";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Tag } from 'primereact/tag';
import moment from "moment";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';

const getSchemaValidationErrorsStrings = (errorObj) => {
    let errMsg = {};
    for (const key in errorObj.errors) {
        if (Object.hasOwnProperty.call(errorObj.errors, key)) {
            const element = errorObj.errors[key];
            if (element?.message) {
                errMsg.push(element.message);
            }
        }
    }
    return errMsg.length ? errMsg : errorObj.message ? errorObj.message : null;
};

const ApplicationsCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [members, setMembers] = useState([])
const [applicationTypeID, setApplicationTypeID] = useState([])
const [refInstitutionID, setRefInstitutionID] = useState([])

    useEffect(() => {
        set_entity(props.entity);
    }, [props.entity, props.show]);

     useEffect(() => {
                    //on mount users
                    client
                        .service("users")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleUsersId } })
                        .then((res) => {
                            setMembers(res.data.map((e) => { return { name: e['name'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Users", type: "error", message: error.message || "Failed get users" });
                        });
                }, []);
 useEffect(() => {
                    //on mount applicationType
                    client
                        .service("applicationType")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleApplicationTypeId } })
                        .then((res) => {
                            setApplicationTypeID(res.data.map((e) => { return { name: e['name'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "ApplicationType", type: "error", message: error.message || "Failed get applicationType" });
                        });
                }, []);
 useEffect(() => {
                    //on mount refInstitutions
                    client
                        .service("refInstitutions")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleRefInstitutionsId } })
                        .then((res) => {
                            setRefInstitutionID(res.data.map((e) => { return { name: e['name'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "RefInstitutions", type: "error", message: error.message || "Failed get refInstitutions" });
                        });
                }, []);

    const onSave = async () => {
        let _data = {
            name: _entity?.name,
members: _entity?.members?._id,
applicationTypeID: _entity?.applicationTypeID?._id,
refInstitutionID: _entity?.refInstitutionID?._id,
bioData: _entity?.bioData,
education: _entity?.education,
        };

        setLoading(true);
        try {
            
        await client.service("applications").patch(_entity._id, _data);
        const eagerResult = await client
            .service("applications")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[_entity._id]}, $populate : [
                {
                    path : "members",
                    service : "users",
                    select:["name"]},{
                    path : "applicationTypeID",
                    service : "applicationType",
                    select:["name"]},{
                    path : "refInstitutionID",
                    service : "refInstitutions",
                    select:["name"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Edit info", message: "Info applications updated successfully" });
        props.onEditResult(eagerResult.data[0]);
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to update info");
            props.alert({ type: "error", title: "Edit info", message: "Failed to update info" });
        }
        setLoading(false);
    };

    const renderFooter = () => (
        <div className="flex justify-content-end">
            <Button label="save" className="p-button-text no-focus-effect" onClick={onSave} loading={loading} />
            <Button label="close" className="p-button-text no-focus-effect p-button-secondary" onClick={props.onHide} />
        </div>
    );

    const setValByKey = (key, val) => {
        let new_entity = { ..._entity, [key]: val };
        set_entity(new_entity);
        setError({});
    };

    const membersOptions = members.map((elem) => ({ name: elem.name, value: elem.value }));
const applicationTypeIDOptions = applicationTypeID.map((elem) => ({ name: elem.name, value: elem.value }));
const refInstitutionIDOptions = refInstitutionID.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Edit Applications" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="applications-edit-dialog-component">
                <div className="col-12 md:col-6 field mt-5">
        <span className="align-items-center">
            <label htmlFor="name">Name:</label>
            <InputText id="name" className="w-full mb-3 p-inputtext-sm" value={_entity?.name} onChange={(e) => setValByKey("name", e.target.value)}  required  />
        </span>
        </div>
<div className="col-12 md:col-6 field mt-5">
        <span className="align-items-center">
            <label htmlFor="members">Members:</label>
            <Dropdown id="members" value={_entity?.members?._id} optionLabel="name" optionValue="value" options={membersOptions} onChange={(e) => setValByKey("members", {_id : e.value})}  />
        </span>
        </div>
<div className="col-12 md:col-6 field mt-5">
        <span className="align-items-center">
            <label htmlFor="applicationTypeID">Application Type:</label>
            <Dropdown id="applicationTypeID" value={_entity?.applicationTypeID?._id} optionLabel="name" optionValue="value" options={applicationTypeIDOptions} onChange={(e) => setValByKey("applicationTypeID", {_id : e.value})}  />
        </span>
        </div>
<div className="col-12 md:col-6 field mt-5">
        <span className="align-items-center">
            <label htmlFor="refInstitutionID">Institutions:</label>
            <Dropdown id="refInstitutionID" value={_entity?.refInstitutionID?._id} optionLabel="name" optionValue="value" options={refInstitutionIDOptions} onChange={(e) => setValByKey("refInstitutionID", {_id : e.value})}  />
        </span>
        </div>
<div className="col-12 md:col-6 field mt-5">
        <span className="align-items-center">
            <label htmlFor="bioData">About Me:</label>
            <InputTextarea id="bioData" rows={5} cols={30} value={_entity?.bioData} onChange={ (e) => setValByKey("bioData", e.target.value)} autoResize  required  />
        </span>
        </div>
<div className="col-12 md:col-6 field mt-5">
        <span className="align-items-center">
            <label htmlFor="education">Education History:</label>
            <InputTextarea id="education" rows={5} cols={30} value={_entity?.education} onChange={ (e) => setValByKey("education", e.target.value)} autoResize  required  />
        </span>
        </div>
                <div className="col-12">&nbsp;</div>
                <div className="col-12 md:col-6 field mt-5"><p className="m-0"><Tag value="created At:"></Tag>{" " + moment(_entity?.createdAt).fromNow()}</p></div>
                <div className="col-12 md:col-6 field mt-5"><p className="m-0"><Tag value="created By:"></Tag>{" " +_entity?.createdBy?.name}</p></div>
                <div className="col-12 md:col-6 field mt-5"><p className="m-0"><Tag value="last Updated At:"></Tag>{" " + moment(_entity?.updatedAt).fromNow()}</p></div>
                <div className="col-12 md:col-6 field mt-5"><p className="m-0"><Tag value="last Updated By:"></Tag>{" " +_entity?.updatedBy?.name}</p></div>
                <small className="p-error">
                {Array.isArray(Object.keys(error))
                ? Object.keys(error).map((e, i) => (
                    <p className="m-0" key={i}>
                        {e}: {error[e]}
                    </p>
                    ))
                : error}
            </small>
            </div>
        </Dialog>
    );
};

const mapState = (state) => {
    const { user } = state.auth;
    return { user };
};
const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(ApplicationsCreateDialogComponent);
