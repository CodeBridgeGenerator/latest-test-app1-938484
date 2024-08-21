import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../services/restClient";
import _ from "lodash";
import initilization from "../../utils/init";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
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
          errMsg[key] = element.message;
        }
      }
    }
    return errMsg.length ? errMsg : errorObj.message ? { error : errorObj.message} : {};
};

const ApplicationStatusCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [applicationID, setApplicationID] = useState([])

    useEffect(() => {
        let init  = {applicationSentDate:new Date(),institutionRespondedDate:new Date(),applicationNotiSentDate:new Date()};
        if (!_.isEmpty(props?.entity)) {
            init = initilization({ ...props?.entity, ...init }, [applicationID], setError);
        }
        set_entity({...init});
    }, [props.show]);

    const validate = () => {
        let ret = true;
        const error = {};
        
        if (!ret) setError(error);
        return ret;
    }

    const onSave = async () => {
        if(!validate()) return;
        let _data = {
            applicationID: _entity?.applicationID?._id,applicationStatus: _entity?.applicationStatus,applicationSentDate: _entity?.applicationSentDate,institutionStatus: _entity?.institutionStatus,institutionRespondedDate: _entity?.institutionRespondedDate,applicationNotiStatus: _entity?.applicationNotiStatus,applicationNotiSentDate: _entity?.applicationNotiSentDate,
            createdBy: props.user._id,
            updatedBy: props.user._id
        };

        setLoading(true);

        try {
            
        const result = await client.service("applicationStatus").create(_data);
        const eagerResult = await client
            .service("applicationStatus")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[result._id]}, $populate : [
                {
                    path : "applicationID",
                    service : "applications",
                    select:["name"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Create info", message: "Info Application Status updated successfully" });
        props.onCreateResult(eagerResult.data[0]);
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
            props.alert({ type: "error", title: "Create", message: "Failed to create in Application Status" });
        }
        setLoading(false);
    };

    useEffect(() => {
                    // on mount applications
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
        <Dialog header="Create Application Status" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="applicationStatus-create-dialog-component">
            <div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="applicationID">ApplicationID:</label>
                <Dropdown id="applicationID" value={_entity?.applicationID?._id} optionLabel="name" optionValue="value" options={applicationIDOptions} onChange={(e) => setValByKey("applicationID", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["applicationID"]) ? (
              <p className="m-0" key="error-applicationID">
                {error["applicationID"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="applicationStatus">Status:</label>
                <Dropdown id="applicationStatus" value={_entity?.applicationStatus} options={applicationStatusOptions} optionLabel="name" optionValue="value" onChange={(e) => setValByKey("applicationStatus", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["applicationStatus"]) ? (
              <p className="m-0" key="error-applicationStatus">
                {error["applicationStatus"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="applicationSentDate">Sent Date:</label>
                <Calendar id="applicationSentDate" value={_entity?.applicationSentDate ? new Date(_entity?.applicationSentDate) : new Date()} dateFormat="dd/mm/yy" onChange={ (e) => setValByKey("applicationSentDate", new Date(e.target.value))} showIcon showButtonBar  inline showWeek  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["applicationSentDate"]) ? (
              <p className="m-0" key="error-applicationSentDate">
                {error["applicationSentDate"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="institutionStatus">Institution Response Status:</label>
                <Dropdown id="institutionStatus" value={_entity?.institutionStatus} options={institutionStatusOptions} optionLabel="name" optionValue="value" onChange={(e) => setValByKey("institutionStatus", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["institutionStatus"]) ? (
              <p className="m-0" key="error-institutionStatus">
                {error["institutionStatus"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="institutionRespondedDate">Institution Responded Date:</label>
                <Calendar id="institutionRespondedDate" value={_entity?.institutionRespondedDate ? new Date(_entity?.institutionRespondedDate) : new Date()} dateFormat="dd/mm/yy" onChange={ (e) => setValByKey("institutionRespondedDate", new Date(e.target.value))} showIcon showButtonBar  inline showWeek  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["institutionRespondedDate"]) ? (
              <p className="m-0" key="error-institutionRespondedDate">
                {error["institutionRespondedDate"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="applicationNotiStatus">Notification Status:</label>
                <Dropdown id="applicationNotiStatus" value={_entity?.applicationNotiStatus} options={applicationNotiStatusOptions} optionLabel="name" optionValue="value" onChange={(e) => setValByKey("applicationNotiStatus", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["applicationNotiStatus"]) ? (
              <p className="m-0" key="error-applicationNotiStatus">
                {error["applicationNotiStatus"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="applicationNotiSentDate">Notification Sent Date:</label>
                <Calendar id="applicationNotiSentDate" value={_entity?.applicationNotiSentDate ? new Date(_entity?.applicationNotiSentDate) : new Date()} dateFormat="dd/mm/yy" onChange={ (e) => setValByKey("applicationNotiSentDate", new Date(e.target.value))} showIcon showButtonBar  inline showWeek  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["applicationNotiSentDate"]) ? (
              <p className="m-0" key="error-applicationNotiSentDate">
                {error["applicationNotiSentDate"]}
              </p>
            ) : null}
          </small>
            </div>
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
