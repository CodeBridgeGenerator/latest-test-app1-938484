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
import { Calendar } from 'primereact/calendar';
const applicationStatusArray = ["Accepted","Rejected","Pending"];
const applicationStatusOptions = applicationStatusArray.map((x) => ({ name: x, value: x }));
const institutionStatusArray = ["Accepted","Rejected","Pending"];
const institutionStatusOptions = institutionStatusArray.map((x) => ({ name: x, value: x }));
const applicationNotiStatusArray = ["Accepted","Rejected","Pending"];
const applicationNotiStatusOptions = applicationNotiStatusArray.map((x) => ({ name: x, value: x }));
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

const ApplicationStatusCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [applicationID, setApplicationID] = useState([])

    useEffect(() => {
        set_entity(props.entity);
    }, [props.entity, props.show]);

     useEffect(() => {
                    //on mount applications
                    client
                        .service("applications")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleApplicationsId } })
                        .then((res) => {
                            setApplicationID(res.data.map((e) => { return { name: e['name'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Applications", type: "error", message: error.message || "Failed get applications" });
                        });
                }, []);

    const onSave = async () => {
        let _data = {
            applicationID: _entity?.applicationID?._id,
applicationStatus: _entity?.applicationStatus,
applicationSentDate: _entity?.applicationSentDate,
institutionStatus: _entity?.institutionStatus,
institutionRespondedDate: _entity?.institutionRespondedDate,
applicationNotiStatus: _entity?.applicationNotiStatus,
applicationNotiSentDate: _entity?.applicationNotiSentDate,
        };

        setLoading(true);
        try {
            
        await client.service("applicationStatus").patch(_entity._id, _data);
        const eagerResult = await client
            .service("applicationStatus")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[_entity._id]}, $populate : [
                {
                    path : "applicationID",
                    service : "applications",
                    select:["name"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Edit info", message: "Info applicationStatus updated successfully" });
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

    const applicationIDOptions = applicationID.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Edit Application Status" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="applicationStatus-edit-dialog-component">
                <div className="col-12 md:col-6 field mt-5">
        <span className="align-items-center">
            <label htmlFor="applicationID">ApplicationID:</label>
            <Dropdown id="applicationID" value={_entity?.applicationID?._id} optionLabel="name" optionValue="value" options={applicationIDOptions} onChange={(e) => setValByKey("applicationID", {_id : e.value})}  />
        </span>
        </div>
<div className="col-12 md:col-6 field mt-5">
        <span className="align-items-center">
            <label htmlFor="applicationStatus">Status:</label>
            <Dropdown id="applicationStatus" value={_entity?.applicationStatus} options={applicationStatusOptions} optionLabel="name" optionValue="value" onChange={(e) => setValByKey("applicationStatus", e.value)}  />
        </span>
        </div>
<div className="col-12 md:col-6 field mt-5">
        <span className="align-items-center">
            <label htmlFor="applicationSentDate">Sent Date:</label>
            <Calendar id="applicationSentDate" value={_entity?.applicationSentDate ? new Date(_entity?.applicationSentDate) : new Date()} onChange={ (e) => setValByKey("applicationSentDate", new Date(e.target.value))} showIcon showButtonBar  inline showWeek  />
        </span>
        </div>
<div className="col-12 md:col-6 field mt-5">
        <span className="align-items-center">
            <label htmlFor="institutionStatus">Institution Response Status:</label>
            <Dropdown id="institutionStatus" value={_entity?.institutionStatus} options={institutionStatusOptions} optionLabel="name" optionValue="value" onChange={(e) => setValByKey("institutionStatus", e.value)}  />
        </span>
        </div>
<div className="col-12 md:col-6 field mt-5">
        <span className="align-items-center">
            <label htmlFor="institutionRespondedDate">Institution Responded Date:</label>
            <Calendar id="institutionRespondedDate" value={_entity?.institutionRespondedDate ? new Date(_entity?.institutionRespondedDate) : new Date()} onChange={ (e) => setValByKey("institutionRespondedDate", new Date(e.target.value))} showIcon showButtonBar  inline showWeek  />
        </span>
        </div>
<div className="col-12 md:col-6 field mt-5">
        <span className="align-items-center">
            <label htmlFor="applicationNotiStatus">Notification Status:</label>
            <Dropdown id="applicationNotiStatus" value={_entity?.applicationNotiStatus} options={applicationNotiStatusOptions} optionLabel="name" optionValue="value" onChange={(e) => setValByKey("applicationNotiStatus", e.value)}  />
        </span>
        </div>
<div className="col-12 md:col-6 field mt-5">
        <span className="align-items-center">
            <label htmlFor="applicationNotiSentDate">Notification Sent Date:</label>
            <Calendar id="applicationNotiSentDate" value={_entity?.applicationNotiSentDate ? new Date(_entity?.applicationNotiSentDate) : new Date()} onChange={ (e) => setValByKey("applicationNotiSentDate", new Date(e.target.value))} showIcon showButtonBar  inline showWeek  />
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

export default connect(mapState, mapDispatch)(ApplicationStatusCreateDialogComponent);
